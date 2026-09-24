import type { Lead, RoutingResult } from "../types";
import { Avatar } from "./avatar";

type LeadQueueProps = {
  leads: Lead[];
  activeLeadId: string | null;
  results: RoutingResult[];
};

export const LeadQueue = ({ leads, activeLeadId, results }: LeadQueueProps) => {
  const completedLeadIds = new Set(results.map((result) => result.leadId));
  const orderedLeads = [...leads].sort((leadA, leadB) => {
    const getRank = (lead: Lead) => {
      if (lead.id === activeLeadId) return 0;
      if (completedLeadIds.has(lead.id)) return 2;
      return 1;
    };

    const rankDifference = getRank(leadA) - getRank(leadB);
    return rankDifference || leads.indexOf(leadA) - leads.indexOf(leadB);
  });

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Intake
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-slate-950">
            Lead queue
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">
          {leads.length - completedLeadIds.size} waiting
        </span>
      </div>

      <div className="compact-scroll grid max-h-72 grid-cols-2 gap-1.5 overflow-y-auto pr-1 lg:min-h-0 lg:max-h-none lg:flex-1 lg:grid-cols-1">
        {orderedLeads.map((lead, index) => {
          const isActive = lead.id === activeLeadId;
          const isComplete = completedLeadIds.has(lead.id);

          return (
            <article
              className={`lead-queue-item flex min-w-0 items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-all ${
                isActive
                  ? "is-active border-blue-300 bg-blue-50 shadow-sm"
                  : isComplete
                    ? "border-transparent bg-slate-50 opacity-45"
                    : "border-slate-100 bg-white"
              }`}
              key={lead.id}
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <Avatar label={lead.company} />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
                  {lead.company}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-slate-400 sm:text-xs">
                  {lead.region} · {lead.estimated_seats ?? "?"} seats
                </p>
              </div>
              <span
                className={`ml-auto size-2 shrink-0 rounded-full ${
                  isActive
                    ? "animate-pulse bg-blue-500"
                    : isComplete
                      ? "bg-emerald-400"
                      : "bg-slate-200"
                }`}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
};
