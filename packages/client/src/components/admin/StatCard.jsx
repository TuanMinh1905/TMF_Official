export default function StatCard({ icon, value, label, trend }) {
  return (
    <div className="bg-paper border border-[#d8cfc6] p-5 flex flex-col justify-between gap-3 transition-colors hover:border-accent/60">
      <div className="flex items-center justify-between gap-2">
        <span className="w-10 h-10 bg-muted flex items-center justify-center text-lg rounded-sm" aria-hidden="true">
          {icon}
        </span>
        {trend && (
          <span className="text-[11px] font-bold tracking-wide px-2 py-0.5 bg-hero/60 text-ink">
            {trend}
          </span>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-[28px] font-bold tracking-tight text-ink leading-tight break-words">
          {value}
        </div>
        <div className="text-xs uppercase tracking-[1.5px] text-accent font-bold mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}
