type MetricProps = {
  label: string;
  value: string;
};

export const Metric = ({ label, value }: MetricProps) => (
  <div className="rounded-2xl bg-slate-50 p-3.5">
    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
      {label}
    </p>
    <p className="mt-1.5 font-mono text-xl font-semibold text-slate-900">
      {value}
    </p>
  </div>
);
