"use client";

import { useEffect, useRef } from "react";
import type { Lead, RepProfile, RoutingResult } from "../types";
import { Avatar } from "./avatar";

type RepRosterProps = {
  leads: Lead[];
  reps: RepProfile[];
  results: RoutingResult[];
};

export const RepRoster = ({ leads, reps, results }: RepRosterProps) => {
  const leadById = new Map(leads.map((lead) => [lead.id, lead]));
  const listRef = useRef<HTMLDivElement>(null);
  const latestRoute = [...results]
    .reverse()
    .find((result) => result.jev.routeChoice !== null)?.jev.routeChoice;
  const latestAssignedRepId = reps.some((rep) => rep.id === latestRoute)
    ? latestRoute
    : null;
  const orderedReps = [...reps].sort((repA, repB) => {
    if (repA.id === latestAssignedRepId) return -1;
    if (repB.id === latestAssignedRepId) return 1;
    return reps.indexOf(repA) - reps.indexOf(repB);
  });

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [latestAssignedRepId]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Destinations
        </p>
        <h2 className="mt-0.5 text-base font-semibold text-slate-950">
          Jev assignments
        </h2>
      </div>

      <div
        className="compact-scroll max-h-[680px] space-y-2 overflow-y-auto pr-1 lg:min-h-0 lg:max-h-none lg:flex-1"
        ref={listRef}
      >
        {orderedReps.map((rep) => {
          const routedResults = results.filter(
            (result) => result.jev.routeChoice === rep.id,
          );
          const isSelected = latestAssignedRepId === rep.id;
          const capacityPercent = Math.round(
            (rep.current_open_opportunities / rep.soft_capacity) * 100,
          );

          return (
            <article
              className={`rep-card rounded-xl border px-2.5 py-2 transition-all ${isSelected ? "is-selected border-blue-400 bg-blue-50 shadow-md" : "border-slate-100 bg-white"}`}
              key={rep.id}
            >
              <div className="flex items-center gap-3">
                <Avatar label={rep.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {rep.name}
                  </p>
                  <p className="truncate text-[10px] text-slate-400">
                    {rep.role}
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-400">
                  {routedResults.length}
                </span>
              </div>
              <div
                className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100"
                title={`${rep.current_open_opportunities} of ${rep.soft_capacity} opportunities`}
              >
                <div
                  className="h-full rounded-full bg-slate-300"
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
              {routedResults.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {routedResults.map((result) => {
                    const lead = leadById.get(result.leadId);
                    return (
                      <span
                        className={`grid size-6 place-items-center rounded-full border-2 border-white text-[8px] font-bold ${result.jev.evalResult === "pass" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                        key={result.leadId}
                        title={lead?.company}
                      >
                        {lead?.company.slice(0, 2).toUpperCase()}
                      </span>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}

        <article
          className={`rep-card rounded-xl border border-dashed px-2.5 py-2 transition-all ${latestRoute === "manual_review" ? "is-selected border-amber-400 bg-amber-50" : "border-slate-200 bg-slate-50/70"}`}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-amber-100 text-amber-700">
              <svg
                aria-hidden="true"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 9v4m0 4h.01M10.3 4.3 3.4 16.2A2 2 0 0 0 5.1 19h13.8a2 2 0 0 0 1.7-2.8L13.7 4.3a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.7"
                />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">
                Manual review
              </p>
              <p className="text-[10px] text-slate-400">Needs human context</p>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-400">
              {
                results.filter(
                  (result) => result.jev.routeChoice === "manual_review",
                ).length
              }
            </span>
          </div>
        </article>
      </div>
    </section>
  );
};
