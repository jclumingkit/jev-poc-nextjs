import type { EngineOutcome, JevOutcome, RepProfile } from "../../types";
import { routeLabel } from "./utils";
import { VerdictIcon } from "./verdict-icon";

type EngineVerdictProps = {
  label: string;
  outcome: EngineOutcome | JevOutcome | null;
  reps: RepProfile[];
};

export const EngineVerdict = ({
  label,
  outcome,
  reps,
}: EngineVerdictProps) => {
  const passed = outcome?.evalResult === "pass";
  const failed = outcome?.evalResult === "fail";

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${passed ? "border-emerald-400/35 bg-emerald-400/10" : failed ? "border-rose-400/35 bg-rose-400/10" : "border-white/10 bg-white/[0.04]"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
          {label}
        </p>
        {!outcome ? (
          <span className="size-3 animate-pulse rounded-full bg-blue-300" />
        ) : outcome.error ? (
          <span className="text-xs font-bold text-amber-300">!</span>
        ) : (
          <VerdictIcon passed={passed} />
        )}
      </div>
      <p className="mt-3 truncate text-sm font-semibold text-white">
        {outcome?.error ??
          (outcome ? routeLabel(outcome.routeChoice, reps) : "Evaluating…")}
      </p>
      <p className="mt-1 font-mono text-[10px] text-slate-500">
        {outcome
          ? `${outcome.durationMs.toFixed(label === "Static" ? 2 : 0)} ms`
          : "Awaiting route"}
      </p>
    </div>
  );
};
