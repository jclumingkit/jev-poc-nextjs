type RouteResultProps = {
  label: string;
  passed: boolean;
  route: string;
  unavailable: boolean;
};

export const RouteResult = ({
  label,
  passed,
  route,
  unavailable,
}: RouteResultProps) => (
  <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-100 bg-white px-2.5 py-2">
    <span
      className={`grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-black ${unavailable ? "bg-amber-100 text-amber-700" : passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
    >
      {unavailable ? "!" : passed ? "✓" : "×"}
    </span>
    <div className="min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="truncate text-[11px] font-medium text-slate-700">{route}</p>
    </div>
  </div>
);
