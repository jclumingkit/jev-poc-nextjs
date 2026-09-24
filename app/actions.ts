"use server";

import { OpenRouter } from "@openrouter/sdk";
import {
  DecisionsChoiceAnswer,
  DecisionsChoiceQuestion,
} from "@openrouter/sdk/models";
import { Lead, RepProfile } from "./types";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

type RouteAnswer = { route: DecisionsChoiceAnswer };

type RunJevLeadRoutingParams = {
  lead: Lead;
  reps: RepProfile[];
};

export type RunJevLeadRoutingResponse = {
  leadId: string;
  evalResult: string;
  routeChoice: string;
  expectedRoute: string;
  difficulty: string;
};

export const runJevLeadRouting = async (
  params: RunJevLeadRoutingParams,
): Promise<RunJevLeadRoutingResponse> => {
  const { lead, reps } = params;
  const { evaluation, ...leadState } = lead;

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

  const decision = await openrouter.alpha.decisions.create({
    decisionsRequest: {
      model: "~typesafe/jev-latest",
      state: leadState,
      questions: questions,
    },
  });

  const { route } = decision.answers as RouteAnswer;
  const routeChoice = route.choice;
  const evalResult =
    routeChoice === evaluation.expected_route ? "pass" : "fai;";

  return {
    leadId: leadState.id,
    evalResult,
    routeChoice,
    expectedRoute: evaluation.expected_route,
    difficulty: evaluation.difficulty,
  };
};

// shuffle reps to avoid order bias
const repsShuffler = (reps: RepProfile[]) => {
  for (let i = reps.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [reps[i], reps[j]] = [reps[j], reps[i]];
  }
  return reps;
};
