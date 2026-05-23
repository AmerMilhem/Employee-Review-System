interface ProgressBarProps {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = pct === 100;
  const isHalfway = pct >= 50;

  const barColor = isComplete
    ? "linear-gradient(90deg, hsl(142,65%,26%), hsl(142,58%,40%), hsl(142,55%,48%))"
    : isHalfway
    ? "linear-gradient(90deg, hsl(45,88%,42%), hsl(45,85%,55%))"
    : "linear-gradient(90deg, hsl(var(--primary)), hsl(142,55%,40%))";

  const textColor = isComplete
    ? "hsl(142,62%,30%)"
    : isHalfway
    ? "hsl(45,88%,38%)"
    : "hsl(var(--muted-foreground))";

  return (
    <div className="bg-card border border-border/60 rounded-3xl card-shadow p-5 fade-in-up print-hidden">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-sm font-extrabold text-foreground">مدى اكتمال التقييم</p>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {completed} من {total} معيار تم تقييمه
          </p>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-4xl font-black tabular-nums" style={{ color: textColor }}>
            {pct}
          </span>
          <span className="text-sm font-bold text-muted-foreground">%</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full h-3 bg-muted/70 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style={{ width: `${pct}%`, background: barColor }}
        >
          {pct > 5 && (
            <span
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2.5s infinite",
              }}
            />
          )}
        </div>
      </div>

      {/* Milestones */}
      <div className="flex justify-between mt-2.5 px-0.5">
        {[0, 25, 50, 75, 100].map((m) => (
          <div key={m} className="flex flex-col items-center gap-0.5">
            <div className={`w-1 h-1 rounded-full transition-colors duration-500 ${pct >= m ? "bg-primary" : "bg-border"}`} />
            <span className={`text-[10px] font-semibold transition-colors duration-500 ${pct >= m ? "text-primary" : "text-muted-foreground/50"}`}>
              {m}%
            </span>
          </div>
        ))}
      </div>

      {isComplete && (
        <div
          className="mt-4 px-4 py-3 rounded-2xl text-center text-sm font-bold text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(142,65%,26%), hsl(142,55%,40%))" }}
        >
          <span className="absolute inset-0 shimmer" />
          <span className="relative">تم اكتمال جميع معايير التقييم بنجاح</span>
        </div>
      )}
    </div>
  );
}
