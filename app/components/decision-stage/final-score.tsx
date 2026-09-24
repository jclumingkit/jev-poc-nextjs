type FinalScoreProps = {
  evaluated: number;
  isWinner: boolean;
  label: string;
  passed: number;
  rate: number;
};

export const FinalScore = ({
  evaluated,
  isWinner,
  label,
  passed,
  rate,
}: FinalScoreProps) => (
  <div
    className={`relative rounded-2xl border px-3 py-5 ${isWinner ? "border-amber-300/60 bg-amber-300/10" : "border-white/10 bg-white/[0.06]"}`}
  >
    {isWinner && (
      <svg
        aria-label={`${label} wins`}
        className="absolute -top-5 left-1/2 size-9 -translate-x-1/2 text-amber-300 drop-shadow-[0_4px_12px_rgba(252,211,77,0.35)]"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="m3 6 4.5 4L12 3l4.5 7L21 6l-2 12H5L3 6Zm3.7 10h10.6l.8-5-2.2 2-3.9-6-3.9 6-2.2-2 .8 5Z" />
      </svg>
    )}
    <p
      className={`text-xs font-semibold uppercase tracking-[0.18em] ${isWinner ? "text-amber-200" : "text-blue-200"}`}
    >
      {label}
    </p>
    <p className="mt-2 font-mono text-5xl font-semibold tracking-[-0.08em] text-white">
      {rate}
      <span className="ml-1 text-xl tracking-normal text-slate-400">%</span>
    </p>
    <p className="mt-2 text-xs text-slate-400">
      {passed} of {evaluated} passed
    </p>
  </div>
);
