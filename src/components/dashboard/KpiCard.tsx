type KpiCardProps = {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
};

export function KpiCard({
  title,
  value,
  change,
  positive = true,
  icon,
}: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-white">{value}</h3>

          {change && (
            <p
              className={`mt-2 text-sm ${
                positive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {change}
            </p>
          )}
        </div>

        {icon ? (
          <div className="rounded-xl bg-white/5 p-2 text-slate-300">{icon}</div>
        ) : null}
      </div>
    </div>
  );
}
