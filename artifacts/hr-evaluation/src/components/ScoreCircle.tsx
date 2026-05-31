interface ScoreCircleProps {
  score: number;
}

function getGrade(score: number) {
  if (score >= 90) return { label: "ممتاز",    color: "#15803d" };
  if (score >= 75) return { label: "جيد جداً", color: "hsl(142,62%,26%)" };
  if (score >= 60) return { label: "جيد",      color: "#2563eb" };
  if (score >= 50) return { label: "مقبول",    color: "#d97706" };
  return           { label: "ضعيف",            color: "#dc2626" };
}

export default function ScoreCircle({ score }: ScoreCircleProps) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = Math.min(score / 100, 1) * circ;
  const grade = getGrade(score);
  const hasScore = score > 0;

  return (
    <div
      className="flex flex-col items-center gap-2 py-5 rounded-2xl bg-card border border-border/60 shadow-sm"
      style={{ fontFamily: "'Cairo','Tajawal',sans-serif" }}
    >
      <p className="text-sm font-bold text-muted-foreground">النتيجة الإجمالية</p>

      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* track */}
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke="hsl(142 18% 90%)"
          strokeWidth="11"
        />
        {/* arc */}
        {hasScore && (
          <circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke={grade.color}
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circ}`}
            transform="rotate(-90 70 70)"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        )}
        {/* score number */}
        <text
          x="70" y="64"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: "28px",
            fontWeight: 900,
            fill: hasScore ? grade.color : "hsl(142 10% 70%)",
            fontFamily: "'Cairo',sans-serif",
          }}
        >
          {hasScore ? score.toFixed(1) : "—"}
        </text>
        {/* grade label */}
        <text
          x="70" y="91"
          textAnchor="middle"
          style={{
            fontSize: "13px",
            fontWeight: 700,
            fill: hasScore ? grade.color : "hsl(142 10% 70%)",
            fontFamily: "'Cairo',sans-serif",
          }}
        >
          {hasScore ? grade.label : "لم تبدأ بعد"}
        </text>
      </svg>
    </div>
  );
}
