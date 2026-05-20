import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { EvaluationCategory } from "../types";
import { SCORE_LABELS } from "../data/evaluationData";

interface EvaluationSectionProps {
  category: EvaluationCategory;
  scores: Record<string, number>;
  onScore: (criterionId: string, score: number) => void;
  index: number;
}

function getScoreStyle(score: number, selected: boolean) {
  if (!selected) return "border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-primary/5";
  if (score === 5) return "border-green-500 bg-green-500 text-white shadow-lg shadow-green-500/30";
  if (score === 4) return "border-emerald-400 bg-emerald-400 text-white shadow-lg shadow-emerald-400/30";
  if (score === 3) return "border-yellow-400 bg-yellow-400 text-white shadow-lg shadow-yellow-400/30";
  if (score === 2) return "border-orange-400 bg-orange-400 text-white shadow-lg shadow-orange-400/30";
  return "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/30";
}

function getCategoryAvg(scores: Record<string, number>, criteria: { id: string }[]): number {
  const vals = criteria.map((c) => scores[c.id] || 0).filter((v) => v > 0);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function getAvgColor(avg: number) {
  if (avg >= 4.5) return "text-green-500";
  if (avg >= 3.5) return "text-emerald-500";
  if (avg >= 2.5) return "text-yellow-500";
  if (avg >= 1.5) return "text-orange-500";
  if (avg > 0) return "text-red-500";
  return "text-muted-foreground";
}

const ICON_COLORS = [
  "from-green-600 to-emerald-500",
  "from-teal-600 to-green-500",
  "from-emerald-600 to-teal-500",
  "from-yellow-500 to-amber-500",
  "from-lime-600 to-green-500",
  "from-amber-500 to-yellow-400",
];

export default function EvaluationSection({ category, scores, onScore, index }: EvaluationSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const avg = getCategoryAvg(scores, category.criteria);
  const answered = category.criteria.filter((c) => scores[c.id]).length;
  const total = category.criteria.length;
  const pct = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-2xl card-shadow overflow-hidden fade-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}>
      {/* Category Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-right px-6 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
      >
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ICON_COLORS[index % ICON_COLORS.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
          {index + 1}
        </div>

        {/* Title & Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <h3 className="text-base font-bold text-foreground">{category.title}</h3>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: "hsl(var(--gold-light))", color: "hsl(45,85%,30%)" }}>
                الوزن: {category.weight}%
              </span>
              {avg > 0 && (
                <span className={`text-sm font-bold ${getAvgColor(avg)}`}>
                  متوسط: {avg.toFixed(1)}
                </span>
              )}
            </div>
          </div>
          {/* Mini progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct === 100
                  ? "linear-gradient(90deg, hsl(142,60%,35%), hsl(142,55%,45%))"
                  : "linear-gradient(90deg, hsl(45,85%,50%), hsl(45,80%,55%))",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{answered} من {total} معايير مُقيَّمة</p>
        </div>

        {/* Expand icon */}
        <div className="text-muted-foreground shrink-0">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Criteria */}
      {expanded && (
        <div className="border-t border-border">
          {category.criteria.map((criterion, ci) => {
            const selected = scores[criterion.id] || 0;
            return (
              <div
                key={criterion.id}
                className={`px-6 py-4 ${ci < category.criteria.length - 1 ? "border-b border-border/60" : ""} ${ci % 2 === 0 ? "" : "bg-muted/20"}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  {/* Criterion label */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      <span className="text-muted-foreground text-xs ml-1">{ci + 1}.</span>
                      {criterion.label}
                    </p>
                  </div>

                  {/* Score buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {[1, 2, 3, 4, 5].map((score) => {
                      const isSelected = selected === score;
                      return (
                        <button
                          key={score}
                          onClick={() => onScore(criterion.id, score)}
                          title={SCORE_LABELS[score]}
                          className={`w-10 h-10 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${getScoreStyle(score, isSelected)} ${isSelected ? "scale-110" : "hover:scale-105"}`}
                        >
                          {score}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Score label */}
                {selected > 0 && (
                  <div className="mt-1 flex justify-end">
                    <span className="text-xs font-semibold"
                      style={{ color: selected >= 4 ? "hsl(142,60%,35%)" : selected === 3 ? "hsl(45,80%,40%)" : "hsl(0,70%,50%)" }}>
                      {SCORE_LABELS[selected]}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
