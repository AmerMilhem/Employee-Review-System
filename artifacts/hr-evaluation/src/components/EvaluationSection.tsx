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
  if (!selected) return "border-2 border-border bg-white/80 dark:bg-card/80 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:scale-105";
  if (score === 5) return "border-2 border-green-500 bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/35 scale-110";
  if (score === 4) return "border-2 border-emerald-400 bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-400/35 scale-110";
  if (score === 3) return "border-2 border-amber-400 bg-gradient-to-br from-amber-400 to-yellow-400 text-white shadow-lg shadow-amber-400/35 scale-110";
  if (score === 2) return "border-2 border-orange-400 bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-400/35 scale-110";
  return "border-2 border-rose-500 bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/35 scale-110";
}

function getScoreDotColor(score: number) {
  if (score === 5) return "bg-green-500";
  if (score === 4) return "bg-emerald-400";
  if (score === 3) return "bg-amber-400";
  if (score === 2) return "bg-orange-400";
  return "bg-rose-500";
}

function getCategoryAvg(scores: Record<string, number>, criteria: { id: string }[]): number {
  const vals = criteria.map((c) => scores[c.id] || 0).filter((v) => v > 0);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function getAvgColor(avg: number) {
  if (avg >= 4.5) return "text-green-500";
  if (avg >= 3.5) return "text-emerald-500";
  if (avg >= 2.5) return "text-amber-500";
  if (avg >= 1.5) return "text-orange-500";
  if (avg > 0) return "text-rose-500";
  return "text-muted-foreground";
}

const CATEGORY_GRADIENTS = [
  "from-green-600 to-emerald-500",
  "from-teal-600 to-green-500",
  "from-emerald-600 to-teal-500",
  "from-amber-500 to-yellow-500",
  "from-lime-600 to-green-500",
  "from-yellow-500 to-amber-400",
];

export default function EvaluationSection({ category, scores, onScore, index }: EvaluationSectionProps) {
  const [expanded, setExpanded] = useState(true);
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
      {/* Category Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-right px-5 py-4 flex items-center gap-4 hover:bg-muted/40 transition-colors duration-200 group"
      >
        {/* Number badge */}
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length]} flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md`}>
          {index + 1}
        </div>

        {/* Title & progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="text-sm font-extrabold text-foreground leading-tight">{category.title}</h3>
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                style={{ background: "hsl(var(--gold-light))", color: "hsl(45,85%,28%)" }}>
                {category.weight}%
              </span>
              {avg > 0 && (
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full bg-muted/60 ${getAvgColor(avg)}`}>
                  {avg.toFixed(1)} / 5
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
              style={{
                width: `${pct}%`,
                background: isComplete
                  ? "linear-gradient(90deg, hsl(142,65%,30%), hsl(142,55%,44%))"
                  : "linear-gradient(90deg, hsl(45,88%,46%), hsl(45,82%,58%))",
              }}
            >
              {isComplete && (
                <span className="absolute inset-0 shimmer" />
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 font-medium">
            {answered} من {total} معايير مُقيَّمة
            {isComplete && <span className="mr-1.5 text-green-600 font-bold">✓ مكتمل</span>}
          </p>
        </div>

        {/* Chevron */}
        <div className="text-muted-foreground/60 group-hover:text-muted-foreground shrink-0 transition-colors">
          {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        </div>
      </button>

      {/* Criteria list */}
      {expanded && (
        <div className="border-t border-border/50">
          {category.criteria.map((criterion, ci) => {
            const selected = scores[criterion.id] || 0;
            const isEven = ci % 2 === 0;
            return (
              <div
                key={criterion.id}
                className={`px-5 py-4 ${ci < category.criteria.length - 1 ? "border-b border-border/40" : ""} ${isEven ? "bg-transparent" : "bg-muted/25"} hover:bg-primary/5 transition-colors duration-150`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  {/* Criterion label */}
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="text-muted-foreground/50 text-xs font-bold mt-0.5 shrink-0 w-5 text-left">{ci + 1}.</span>
                    <p className="text-sm font-medium text-foreground leading-relaxed">{criterion.label}</p>
                  </div>

                  {/* Score buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 mr-auto sm:mr-0">
                    {[1, 2, 3, 4, 5].map((score) => {
                      const isSelected = selected === score;
                      return (
                        <button
                          key={score}
                          onClick={() => onScore(criterion.id, score)}
                          title={SCORE_LABELS[score]}
                          className={`w-10 h-10 rounded-2xl font-extrabold text-sm transition-all duration-200 ${getScoreStyle(score, isSelected)}`}
                        >
                          {score}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Score label chip */}
                {selected > 0 && (
                  <div className="mt-2 flex justify-end">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-muted/60">
                      <span className={`w-1.5 h-1.5 rounded-full ${getScoreDotColor(selected)}`} />
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
