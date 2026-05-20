import type { ScoreBreakdown } from "../types";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown[];
  totalScore: number;
}

function getScoreColor(score: number) {
  if (score >= 85) return { text: "text-green-500", bg: "bg-green-500", label: "ممتاز" };
  if (score >= 70) return { text: "text-emerald-500", bg: "bg-emerald-500", label: "جيد جداً" };
  if (score >= 50) return { text: "text-yellow-500", bg: "bg-yellow-500", label: "جيد" };
  if (score > 0) return { text: "text-orange-500", bg: "bg-orange-500", label: "مقبول" };
  return { text: "text-muted-foreground", bg: "bg-muted", label: "—" };
}

export default function ScoreBreakdown({ breakdown, totalScore }: ScoreBreakdownProps) {
  const { text: totalText, bg: totalBg, label: totalLabel } = getScoreColor(totalScore);

  return (
    <div className="bg-card border border-border rounded-2xl card-shadow overflow-hidden fade-in-up sticky top-20">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border"
        style={{ background: "linear-gradient(135deg, hsl(45,85%,45%), hsl(45,80%,55%))" }}>
        <h3 className="text-base font-bold text-white">ملخص النتائج</h3>
        <p className="text-white/70 text-xs">توزيع الدرجات حسب المحور</p>
      </div>

      {/* Total Score Ring */}
      <div className="px-5 py-5 flex flex-col items-center border-b border-border">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke={totalScore >= 85 ? "hsl(142,60%,40%)" : totalScore >= 70 ? "hsl(142,55%,45%)" : totalScore >= 50 ? "hsl(45,85%,50%)" : "hsl(0,65%,55%)"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - totalScore / 100)}`}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black ${totalText}`}>{totalScore.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        </div>
        <p className={`mt-2 text-sm font-bold ${totalText}`}>{totalLabel}</p>
      </div>

      {/* Breakdown per category */}
      <div className="p-4 flex flex-col gap-3">
        {breakdown.map((item) => {
          const pct = (item.weightedScore / item.weight) * 100;
          const { text, bg } = getScoreColor(pct);
          return (
            <div key={item.categoryId} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground truncate">{item.title}</span>
                <span className={`text-xs font-bold ${text} shrink-0`}>
                  {item.rawAvg > 0 ? `${((item.weightedScore / item.weight) * 100).toFixed(0)}%` : "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${bg}`}
                    style={{ width: `${item.rawAvg > 0 ? pct : 0}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-left shrink-0">
                  {item.weight}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Score legend */}
      <div className="px-4 pb-4">
        <div className="rounded-xl bg-muted/50 p-3 space-y-1.5">
          <p className="text-xs font-bold text-muted-foreground mb-2">مقياس التقدير</p>
          {[
            { range: "85% – 100%", label: "ممتاز", color: "bg-green-500" },
            { range: "70% – 84%", label: "جيد جداً", color: "bg-emerald-500" },
            { range: "50% – 69%", label: "جيد", color: "bg-yellow-500" },
            { range: "أقل من 50%", label: "يحتاج تحسين", color: "bg-orange-500" },
          ].map((s) => (
            <div key={s.range} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.color}`} />
              <span className="text-xs text-foreground">{s.label}</span>
              <span className="text-xs text-muted-foreground mr-auto">{s.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
