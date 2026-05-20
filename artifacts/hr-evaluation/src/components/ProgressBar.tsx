interface ProgressBarProps {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-2xl card-shadow p-5 fade-in-up print-hidden">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <p className="text-sm font-bold text-foreground">مدى اكتمال التقييم</p>
          <p className="text-xs text-muted-foreground mt-0.5">{completed} من {total} معيار تم تقييمه</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black"
            style={{ color: pct === 100 ? "hsl(142,60%,35%)" : pct >= 50 ? "hsl(45,85%,45%)" : "hsl(var(--muted-foreground))" }}>
            {pct}
          </span>
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: pct === 100
              ? "linear-gradient(90deg, hsl(142,60%,30%), hsl(142,55%,45%))"
              : pct >= 50
              ? "linear-gradient(90deg, hsl(45,85%,45%), hsl(45,80%,58%))"
              : "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary)))",
          }}
        />
      </div>

      {/* Milestones */}
      <div className="flex justify-between mt-2">
        {[0, 25, 50, 75, 100].map((milestone) => (
          <span
            key={milestone}
            className={`text-xs font-medium ${pct >= milestone ? "text-primary" : "text-muted-foreground"}`}
          >
            {milestone}%
          </span>
        ))}
      </div>

      {pct === 100 && (
        <div className="mt-3 p-3 rounded-xl text-center text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, hsl(142,60%,30%), hsl(142,55%,42%))" }}>
          🎉 تم اكتمال جميع معايير التقييم!
        </div>
      )}
    </div>
  );
}
