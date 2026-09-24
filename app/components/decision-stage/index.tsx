import type { Lead, RepProfile, RoutingResult } from "../../types";
import { EngineVerdict } from "./engine-verdict";
import { FinalScore } from "./final-score";
import { asPercent, routeLabel } from "./utils";

type DecisionStageProps = {
  activeLead: Lead | null;
  activeResult: RoutingResult | null;
  results: RoutingResult[];
  reps: RepProfile[];
  phase: "idle" | "running" | "complete" | "error";
};

export const DecisionStage = ({
  activeLead,
  activeResult,
  results,
  reps,
  phase,
}: DecisionStageProps) => {
  const choices = activeResult?.jev.probabilities
    ? Object.entries(activeResult.jev.probabilities).sort(
        ([, a], [, b]) => b - a,
      )
    : [];
  const jevPassed = results.filter(
    (result) => result.jev.evalResult === "pass",
  ).length;
  const staticPassed = results.filter(
    (result) => result.static.evalResult === "pass",
  ).length;
  const jevEvaluated = results.filter(
    (result) => result.jev.evalResult !== null,
  ).length;
  const staticEvaluated = results.filter(
    (result) => result.static.evalResult !== null,
  ).length;
  const jevRate = jevEvaluated
    ? Math.round((jevPassed / jevEvaluated) * 100)
    : 0;
  const staticRate = staticEvaluated
    ? Math.round((staticPassed / staticEvaluated) * 100)
    : 0;
  const hasCompleteComparison = staticEvaluated === jevEvaluated;
  const winner =
    !hasCompleteComparison || jevRate === staticRate
      ? null
      : jevRate > staticRate
        ? "jev"
        : "static";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-200 bg-[#10213f] p-5 text-white shadow-[0_24px_70px_-30px_rgba(15,40,85,0.75)] lg:h-full lg:min-h-0 lg:p-6">
      <div className="jev-grid absolute inset-0 opacity-30" />
      <div className="compact-scroll relative h-full overflow-y-auto pr-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`jev-orb ${phase === "running" ? "is-thinking" : ""}`}
            >
              <span className="flex items-center gap-0.5 text-xs">CRM</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                Decision engine
              </p>
              <h2 className="mt-1 text-xl font-semibold">Static vs Jev</h2>
            </div>
          </div>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-blue-100">
            {phase === "running"
              ? "Live"
              : phase === "complete"
                ? "Complete"
                : "Ready"}
          </span>
        </div>

        {!activeLead ? (
          <div className="grid min-h-[380px] place-items-center py-10 text-center">
            {phase === "complete" ? (
              <div className="w-full max-w-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                  Final routing accuracy
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <FinalScore
                    evaluated={staticEvaluated}
                    isWinner={winner === "static"}
                    label="Static"
                    passed={staticPassed}
                    rate={staticRate}
                  />
                  <FinalScore
                    evaluated={jevEvaluated}
                    isWinner={winner === "jev"}
                    label="Jev"
                    passed={jevPassed}
                    rate={jevRate}
                  />
                </div>
                <p className="mt-5 text-sm text-slate-400">
                  {!hasCompleteComparison
                    ? "No winner declared because one or more engine results were unavailable."
                    : winner === null
                      ? `Tie: both engines matched ${jevPassed} expected routes.`
                      : `${winner === "jev" ? "Jev" : "Static"} wins by ${Math.abs(jevRate - staticRate)} percentage points.`}
                </p>
              </div>
            ) : (
              <div className="max-w-sm">
                <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl border border-white/10 bg-white/5">
                  <svg
                    aria-hidden="true"
                    className="size-7 text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 7h9m0 0-3-3m3 3-3 3m8 7h-9m0 0 3-3m-3 3 3 3"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                    />
                  </svg>
                </div>
                <p className="font-medium text-blue-50">
                  The routing match is standing by
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Run the simulation to score static rules and Jev against every
                  expected route.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-blue-300">
                    {activeLead.id} · {activeLead.evaluation.difficulty}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                    {activeLead.company}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {activeLead.country} · {activeLead.employee_count} employees
                    · {activeLead.estimated_seats ?? "Unknown"} seats
                  </p>
                </div>
                <span className="rounded-full bg-blue-400/15 px-3 py-1.5 text-xs font-medium text-blue-200">
                  Expected:{" "}
                  {routeLabel(activeLead.evaluation.expected_route, reps)}
                </span>
              </div>
              <p className="mt-4 border-l-2 border-blue-400/60 pl-4 text-sm leading-5 text-slate-300">
                “{activeLead.inbound_message}”
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <EngineVerdict
                label="Static"
                outcome={activeResult?.static ?? null}
                reps={reps}
              />
              <EngineVerdict
                label="Jev"
                outcome={activeResult?.jev ?? null}
                reps={reps}
              />
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Jev choice signals
                </p>
                {activeResult?.jev.confidence !== undefined && (
                  <span className="font-mono text-xs text-blue-200">
                    {asPercent(activeResult.jev.confidence)}% confidence
                  </span>
                )}
              </div>

              {!activeResult ? (
                <div
                  className="space-y-3"
                  aria-label="Routing engines are evaluating candidate routes"
                >
                  {[82, 64, 46].map((width) => (
                    <div
                      className="h-8 overflow-hidden rounded-lg bg-white/5"
                      key={width}
                    >
                      <div
                        className="probability-shimmer h-full rounded-lg bg-blue-400/15"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  ))}
                  <p className="pt-1 text-xs text-slate-400">
                    Comparing both routing approaches…
                  </p>
                </div>
              ) : choices.length > 0 ? (
                <div className="space-y-3">
                  {choices.slice(0, 4).map(([choice, probability]) => {
                    const percent = asPercent(probability);

                    return (
                      <div key={choice}>
                        <div className="mb-1.5 flex justify-between text-xs">
                          <span
                            className={
                              choice === activeResult.jev.routeChoice
                                ? "font-semibold text-white"
                                : "text-slate-400"
                            }
                          >
                            {routeLabel(choice, reps)}
                          </span>
                          <span className="font-mono text-slate-400">
                            {percent}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${choice === activeResult.jev.routeChoice ? "bg-blue-400" : "bg-slate-600"}`}
                            style={{ width: `${Math.max(2, percent)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  No probability distribution returned.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
