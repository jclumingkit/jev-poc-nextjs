type VerdictIconProps = {
  passed: boolean;
};

export const VerdictIcon = ({ passed }: VerdictIconProps) => (
  <span
    className={`grid size-7 shrink-0 place-items-center rounded-full ${passed ? "bg-emerald-400 text-emerald-950" : "bg-rose-400 text-rose-950"}`}
  >
    {passed ? (
      <svg
        aria-label="Route passed"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="m5 12.5 4.2 4.2L19 7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </svg>
    ) : (
      <svg
        aria-label="Route failed"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="m7 7 10 10M17 7 7 17"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    )}
  </span>
);
