import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { EvaluationCategory } from "../types";
import { SCORE_LABELS } from "../data/evaluationData";

interface EvaluationSectionProps {
  category: EvaluationCategory;
  scores: Record<string, number>;
  onScore: (criterionId: string, score: number) => void;
  index: number;
}

function getScoreStyle(score: number, selected: boolean) {
  if (!selected) return "border-2 border-border bg-white text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:scale-105";
  if (score >= 9) return "border-2 border-green-500 bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/35 scale-110";
  if (score >= 7) return "border-2 border-emerald-400 bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-400/35 scale-110";
  if (score >= 5) return "border-2 border-amber-400 bg-gradient-to-br from-amber-400 to-yellow-400 text-white shadow-lg shadow-amber-400/35 scale-110";
  if (score >= 3) return "border-2 border-orange-400 bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-400/35 scale-110";
  return "border-2 border-rose-500 bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/35 scale-110";
}

function getScoreDotColor(score: number) {
  if (score >= 9) return "bg-green-500";
  if (score >= 7) return "bg-emerald-400";
  if (score >= 5) return "bg-amber-400";
  if (score >= 3) return "bg-orange-400";
  return "bg-rose-500";
}

function getCategoryAvg(scores: Record<string, number>, criteria: { id: string }[]): number {
  const vals = criteria.map((c) => scores[c.id] || 0).filter((v) => v > 0);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function getAvgBadgeStyle(avg: number) {
  if (avg >= 9) return "bg-green-100 text-green-700 border border-green-300";
  if (avg >= 7) return "bg-emerald-100 text-emerald-700 border border-emerald-300";
  if (avg >= 5) return "bg-amber-100 text-amber-700 border border-amber-300";
  if (avg >= 3) return "bg-orange-100 text-orange-700 border border-orange-300";
  if (avg > 0) return "bg-rose-100 text-rose-700 border border-rose-300";
  return "bg-muted text-muted-foreground";
}

export default function EvaluationSection({ category, scores, onScore, index }: EvaluationSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const avg = getCategoryAvg(scores, category.criteria);
  const answered = category.criteria.filter((c) => scores[c.id]).length;
  const total = category.criteria.length;
  const pct = total > 0 ? (answered / total) * 100 : 0;
  const isComplete = pct === 100;

  return (
    <div
      className="bg-card border border-border/60 rounded-3xl card-shadow overflow-hidden fade-in-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-right section-header-gradient px-6 py-5 flex items-center gap-4 group transition-opacity duration-200 hover:opacity-95"
      >
        {/* Number badge */}
        <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white font-extrabold text-xl shrink-0 shadow-inner backdrop-blur-sm">
          {index + 1}
        </div>

        {/* Title & meta */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-extrabold text-white leading-snug mb-1">{category.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-white/20 text-white/90">
              الوزن: {category.weight}%
            </span>
            <span className="text-xs text-white/70 font-medium">
              {answered} / {total} معايير
            </span>
            {avg > 0 && (
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${getAvgBadgeStyle(avg)}`}>
                متوسط: {avg.toFixed(1)} / 10
              </span>
            )}
            {isComplete && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/25 text-white">
                ✓ مكتمل
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <div
          className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 transition-transform duration-300"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <ChevronDown size={18} className="text-white" />
        </div>
      </button>

      {/* Progress bar */}
      <div className="h-2 bg-muted">
        <div
          className="h-full transition-all duration-700 relative overflow-hidden"
          style={{
            width: `${pct}%`,
            background: isComplete
              ? "linear-gradient(90deg, hsl(142,65%,30%), hsl(142,55%,44%))"
              : "linear-gradient(90deg, hsl(45,88%,46%), hsl(45,82%,58%))",
          }}
        >
          {isComplete && <span className="absolute inset-0 shimmer" />}
        </div>
      </div>

      {/* Criteria list */}
      {expanded && (
        <div>
          {category.criteria.map((criterion, ci) => {
            const selected = scores[criterion.id] || 0;
            const isEven = ci % 2 === 0;
            return (
              <div
                key={criterion.id}
                className={`px-6 py-5 ${ci < category.criteria.length - 1 ? "border-b border-border/40" : ""} ${isEven ? "bg-transparent" : "bg-muted/20"} hover:bg-primary/5 transition-colors duration-150`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  {/* Criterion label */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-primary/10 text-primary text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                      {ci + 1}
                    </span>
                    <p className="text-sm font-semibold text-foreground leading-relaxed">{criterion.label}</p>
                  </div>

                  {/* Score buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 mr-auto sm:mr-0 flex-wrap justify-end">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
                      const isSelected = selected === score;
                      return (
                        <button
                          key={score}
                          onClick={() => onScore(criterion.id, score)}
                          title={SCORE_LABELS[score]}
                          className={`w-9 h-9 rounded-xl font-extrabold text-sm transition-all duration-200 ${getScoreStyle(score, isSelected)}`}
                        >
                          {score}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Score label chip */}
                {selected > 0 && (
                  <div className="mt-3 flex justify-end">
                    <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-muted/70">
                      <span className={`w-2 h-2 rounded-full ${getScoreDotColor(selected)}`} />
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
