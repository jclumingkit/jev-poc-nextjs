"use server";

import { OpenRouter } from "@openrouter/sdk";
import {
  DecisionsChoiceAnswer,
  DecisionsChoiceQuestion,
} from "@openrouter/sdk/models";
import leadsFixture from "../test-data/mock_realistic_leads.json";
import repsFixture from "../test-data/mock_realistic_rep_profiles.json";
import { routeStatic } from "./static-routing";
import type {
  EngineOutcome,
  JevOutcome,
  Lead,
  RepProfile,
  RoutingResult,
} from "./types";

type RouteAnswer = { route: DecisionsChoiceAnswer };

export const runLeadRoutingComparison = async (
  leadId: string,
): Promise<RoutingResult> => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  const lead = leadsFixture.leads.find((item) => item.id === leadId) as
    | Lead
    | undefined;

  if (!lead) {
    throw new Error("Unknown lead.");
  }

  const reps = repsFixture.reps as RepProfile[];
  const { evaluation, ...leadState } = lead;
  const validRoutes = new Set(["manual_review", ...reps.map((rep) => rep.id)]);
  const staticStartedAt = performance.now();
  let staticOutcome: EngineOutcome;

  try {
    const routeChoice = routeStatic(leadState);

    if (!validRoutes.has(routeChoice)) {
      throw new Error("Static router returned an unknown route.");
    }

    staticOutcome = {
      routeChoice,
      evalResult: routeChoice === evaluation.expected_route ? "pass" : "fail",
      durationMs: performance.now() - staticStartedAt,
    };
  } catch {
    staticOutcome = {
      routeChoice: null,
      evalResult: null,
      durationMs: performance.now() - staticStartedAt,
      error: "Static router unavailable.",
    };
  }

  const jevStartedAt = performance.now();
  let jevOutcome: JevOutcome;

  try {
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured.");
    }

    const shuffledReps = repsShuffler(reps);
    const repsCriteria: { [k: string]: string } = {
      manual_review:
        "No representative is a clear fit, important routing information is missing, or the lead explicitly requires a language that no suitable representative supports.",
    };

    shuffledReps.forEach((rep) => {
      repsCriteria[rep.id] = rep.routing_criteria;
    });

    const questions = {
      route: {
        type: "choice" as DecisionsChoiceQuestion["type"],
        instructions:
          "Which available sales rep is the best fit to own this lead?",
        criteria: repsCriteria,
      },
    };

    const openrouter = new OpenRouter({ apiKey });
    const decision = await openrouter.alpha.decisions.create({
      decisionsRequest: {
        model: "~typesafe/jev-latest",
        state: leadState,
        questions: questions,
      },
    });

    const { route } = decision.answers as RouteAnswer;
    const routeChoice = route.choice;

    if (!validRoutes.has(routeChoice)) {
      throw new Error("Jev returned an unknown route.");
    }

    jevOutcome = {
      routeChoice,
      evalResult: routeChoice === evaluation.expected_route ? "pass" : "fail",
      confidence: route.confidence,
      probabilities: route.probabilities,
      durationMs: performance.now() - jevStartedAt,
    };
  } catch {
    jevOutcome = {
      routeChoice: null,
      evalResult: null,
      durationMs: performance.now() - jevStartedAt,
      error: apiKey
        ? "Jev routing unavailable."
        : "OpenRouter API key not configured.",
    };
  }

  return {
    leadId: leadState.id,
    expectedRoute: evaluation.expected_route,
    difficulty: evaluation.difficulty,
    evaluationReason: evaluation.reason,
    static: staticOutcome,
    jev: jevOutcome,
  };
};

// shuffle reps to avoid order bias
const repsShuffler = (reps: RepProfile[]) => {
  const shuffledReps = [...reps];

  for (let i = shuffledReps.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffledReps[i], shuffledReps[j]] = [shuffledReps[j], shuffledReps[i]];
  }

  return shuffledReps;
};
