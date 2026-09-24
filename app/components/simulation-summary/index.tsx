import type { Lead, RepProfile, RoutingResult } from "../../types";
import { Metric } from "./metric";
import { RouteResult } from "./route-result";

type SimulationSummaryProps = {
  leads: Lead[];
  reps: RepProfile[];
  results: RoutingResult[];
};

export const SimulationSummary = ({
  leads,
  reps,
  results,
}: SimulationSummaryProps) => {
  const leadById = new Map(leads.map((lead) => [lead.id, lead]));
  const repById = new Map(reps.map((rep) => [rep.id, rep]));
  const labelFor = (route: string | null) =>
    route === "manual_review"
      ? "Manual review"
      : route
        ? (repById.get(route)?.name ?? route)
        : "Unavailable";
  const jevMatches = results.filter(
    (result) => result.jev.evalResult === "pass",
  ).length;
  const jevEvaluated = results.filter(
    (result) => result.jev.evalResult !== null,
  ).length;
  const staticMatches = results.filter(
    (result) => result.static.evalResult === "pass",
  ).length;
  const staticEvaluated = results.filter(
    (result) => result.static.evalResult !== null,
  ).length;
  const comparableResults = results.filter(
    (result) =>
      result.static.routeChoice !== null && result.jev.routeChoice !== null,
  );
  const agreements = comparableResults.filter(
    (result) => result.static.routeChoice === result.jev.routeChoice,
  ).length;
  const agreementRate = comparableResults.length
    ? Math.round((agreements / comparableResults.length) * 100)
    : 0;

  return (
    <section className="mt-5 grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[0.75fr_1.25fr] lg:p-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Comparison telemetry
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Metric
            label="Processed"
            value={`${results.length}/${leads.length}`}
          />
          <Metric
            label="Engine agreement"
            value={results.length ? `${agreementRate}%` : "—"}
          />
          <Metric
            label="Static match"
            value={results.length ? `${staticMatches}/${staticEvaluated}` : "—"}
          />
          <Metric
            label="Jev match"
            value={results.length ? `${jevMatches}/${jevEvaluated}` : "—"}
          />
        </div>
        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Manual reviews</span>
            <span className="font-mono text-slate-500">
              Static{" "}
              {
                results.filter(
                  (result) => result.static.routeChoice === "manual_review",
                ).length
              }
              <span className="px-2 text-slate-300">·</span>
              Jev{" "}
              {
                results.filter(
                  (result) => result.jev.routeChoice === "manual_review",
                ).length
              }
            </span>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Decision log
          </p>
          <span className="font-mono text-[10px] text-slate-400">
            Newest first
          </span>
        </div>
        <div className="mt-4 max-h-64 space-y-2 overflow-auto pr-1">
          {results.length === 0 ? (
            <div className="grid min-h-32 place-items-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400">
              Comparisons will appear here
            </div>
          ) : (
            [...results].reverse().map((result) => {
              const lead = leadById.get(result.leadId);

              return (
                <article
                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3"
                  key={result.leadId}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate text-sm font-semibold text-slate-800">
                      {lead?.company}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase text-slate-400">
                      {result.difficulty}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[11px] text-slate-400">
                    Expected:{" "}
                    <span className="font-medium text-slate-600">
                      {labelFor(result.expectedRoute)}
                    </span>
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <RouteResult
                      label="Static"
                      passed={result.static.evalResult === "pass"}
                      route={labelFor(result.static.routeChoice)}
                      unavailable={result.static.evalResult === null}
                    />
                    <RouteResult
                      label="Jev"
                      passed={result.jev.evalResult === "pass"}
                      route={labelFor(result.jev.routeChoice)}
                      unavailable={result.jev.evalResult === null}
                    />
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
