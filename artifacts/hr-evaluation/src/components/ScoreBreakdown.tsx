import type { ScoreBreakdown } from "../types";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown[];
  totalScore: number;
}

function getScoreColor(score: number) {
  if (score >= 90) return { text: "text-green-500", bar: "from-green-500 to-emerald-400", ring: "hsl(142,60%,42%)", label: "ممتاز" };
  if (score >= 80) return { text: "text-emerald-500", bar: "from-emerald-500 to-teal-400", ring: "hsl(152,55%,46%)", label: "جيد جداً" };
  if (score >= 70) return { text: "text-amber-500", bar: "from-amber-500 to-yellow-400", ring: "hsl(45,85%,50%)", label: "جيد" };
  if (score >= 60) return { text: "text-orange-500", bar: "from-orange-500 to-amber-400", ring: "hsl(25,85%,52%)", label: "ضعيف" };
  if (score > 0) return { text: "text-rose-500", bar: "from-rose-500 to-red-400", ring: "hsl(0,65%,55%)", label: "يحتاج تحسين" };
  return { text: "text-muted-foreground", bar: "from-muted to-muted", ring: "hsl(var(--muted))", label: "—" };
}

const LEGEND = [
  { range: "90% – 100%", label: "ممتاز", color: "bg-green-500" },
  { range: "80% – 89%", label: "جيد جداً", color: "bg-emerald-500" },
  { range: "70% – 79%", label: "جيد", color: "bg-amber-500" },
  { range: "60% – 69%", label: "ضعيف", color: "bg-orange-500" },
  { range: "أقل من 60%", label: "يحتاج تحسين", color: "bg-rose-500" },
];

export default function ScoreBreakdown({ breakdown, totalScore }: ScoreBreakdownProps) {
  const { text: totalText, ring, label: totalLabel } = getScoreColor(totalScore);
  const circumference = 2 * Math.PI * 40;

  return (
    <div className="bg-card border border-border/60 rounded-3xl card-shadow overflow-hidden fade-in-up sticky top-20">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50"
        style={{ background: "linear-gradient(135deg, hsl(45,88%,40%), hsl(45,82%,52%))" }}>
        <h3 className="text-sm font-extrabold text-white tracking-wide">ملخص النتائج</h3>
        <p className="text-white/65 text-xs mt-0.5 font-medium">توزيع الدرجات حسب المحور</p>
      </div>

      {/* Score ring */}
      <div className="px-5 py-6 flex flex-col items-center border-b border-border/50">
        <div className="relative w-28 h-28">
          {/* Glow layer */}
          {totalScore > 0 && (
            <div className="absolute inset-0 rounded-full blur-lg opacity-25 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${ring}, transparent 70%)` }} />
          )}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="9" />
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke={ring}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - totalScore / 100)}
              style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black tabular-nums ${totalText}`}>{totalScore.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground font-semibold">%</span>
          </div>
        </div>
        <div className={`mt-3 text-sm font-extrabold px-3 py-1 rounded-full bg-muted/50 ${totalText}`}>
          {totalLabel}
        </div>
      </div>

      {/* Breakdown per category */}
      <div className="p-4 flex flex-col gap-3.5">
        {breakdown.map((item) => {
          const pct = item.rawAvg > 0 ? (item.weightedScore / item.weight) * 100 : 0;
          const { text, bar } = getScoreColor(pct);
          return (
            <div key={item.categoryId} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground truncate">{item.title}</span>
                <span className={`text-xs font-bold ${text} shrink-0`}>
                  {item.rawAvg > 0 ? `${pct.toFixed(0)}%` : "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${bar} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium w-8 text-left shrink-0">
                  {item.weight}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
