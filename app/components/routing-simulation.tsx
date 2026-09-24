"use client";

import { useState, useTransition } from "react";
import { runLeadRoutingComparison } from "../actions";
import type { Lead, RepProfile, RoutingResult, Scenario } from "../types";
import { DecisionStage } from "./decision-stage";
import { LeadQueue } from "./lead-queue";
import { RepRoster } from "./rep-roster";
import { SimulationSummary } from "./simulation-summary";

type Phase = "idle" | "running" | "complete" | "error";

type RoutingSimulationProps = {
  leads: Lead[];
  reps: RepProfile[];
  scenario: Scenario;
};

const wait = (duration: number) =>
  new Promise((resolve) => window.setTimeout(resolve, duration));

export const RoutingSimulation = ({
  leads,
  reps,
  scenario,
}: RoutingSimulationProps) => {
  const [results, setResults] = useState<RoutingResult[]>([]);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeLead = leads.find((lead) => lead.id === activeLeadId) ?? null;
  const activeResult =
    results.find((result) => result.leadId === activeLeadId) ?? null;

  const runSimulation = () => {
    if (phase === "running") return;

    startTransition(async () => {
      setResults([]);
      setError(null);
      setPhase("running");

      try {
        for (const lead of leads) {
          setActiveLeadId(lead.id);
          const [result] = await Promise.all([
            runLeadRoutingComparison(lead.id),
            wait(650),
          ]);
          setResults((current) => [...current, result]);
          await wait(750);
        }

        setActiveLeadId(null);
        setPhase("complete");
      } catch (caughtError) {
        setActiveLeadId(null);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The simulation could not be completed.",
        );
        setPhase("error");
      }
    });
  };

  const resetSimulation = () => {
    setResults([]);
    setActiveLeadId(null);
    setError(null);
    setPhase("idle");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f5f1] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_42%)]" />
      <div className="relative mx-auto w-full max-w-[1380px] px-4 py-5 sm:px-6 lg:px-7 lg:py-6">
        <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end lg:mb-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-600" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
                {scenario.company} routing lab
              </p>
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 lg:text-4xl">
              Static rules versus Jev reasoning.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-5 text-slate-500 lg:text-[15px]">
              {leads.length} inbound leads. Six overlapping rep profiles. Two
              routing engines, scored against the same expected owners.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {(phase === "complete" || phase === "error") && (
              <button
                className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                onClick={resetSimulation}
                type="button"
              >
                Reset
              </button>
            )}
            <button
              className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              disabled={phase === "running" || isPending}
              onClick={runSimulation}
              type="button"
            >
              {phase === "running" ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Running {Math.min(results.length + 1, leads.length)} of{" "}
                  {leads.length}
                </>
              ) : (
                <>
                  <svg
                    aria-hidden="true"
                    className="size-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.5 3.8a1 1 0 0 1 1.5-.87l10.3 6.2a1 1 0 0 1 0 1.72L7 17.05a1 1 0 0 1-1.5-.86V3.8Z" />
                  </svg>
                  {phase === "complete" ? "Run again" : "Run simulation"}
                </>
              )}
            </button>
          </div>
        </header>

        {error && (
          <div
            className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
            role="alert"
          >
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-rose-200 font-bold">
              !
            </span>
            <div>
              <strong>Simulation stopped.</strong> {error}
            </div>
          </div>
        )}

        <div className="grid gap-3.5 lg:h-[clamp(500px,calc(100svh-210px),680px)] lg:grid-cols-[minmax(210px,0.7fr)_minmax(420px,1.5fr)_minmax(245px,0.8fr)] lg:items-stretch xl:gap-4">
          <LeadQueue
            activeLeadId={activeLeadId}
            leads={leads}
            results={results}
          />
          <DecisionStage
            activeLead={activeLead}
            activeResult={activeResult}
            phase={phase}
            reps={reps}
            results={results}
          />
          <RepRoster leads={leads} reps={reps} results={results} />
        </div>

        <SimulationSummary leads={leads} reps={reps} results={results} />
      </div>
    </main>
  );
};
