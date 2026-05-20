import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import EmployeeInfoSection from "./components/EmployeeInfo";
import EvaluationSection from "./components/EvaluationSection";
import CommentsSection from "./components/CommentsSection";
import SignaturesSection from "./components/SignaturesSection";
import ScoreBreakdownPanel from "./components/ScoreBreakdown";
import ProgressBar from "./components/ProgressBar";
import { EVALUATION_CATEGORIES, INITIAL_EMPLOYEE_INFO, INITIAL_COMMENTS } from "./data/evaluationData";
import type { EmployeeInfo, Scores, Comments, ScoreBreakdown } from "./types";

const STORAGE_KEY = "hr_evaluation_draft";

interface DraftData {
  employeeInfo: EmployeeInfo;
  scores: Scores;
  comments: Comments;
}

function loadDraft(): DraftData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveDraft(data: DraftData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function computeBreakdown(scores: Scores): { breakdown: ScoreBreakdown[]; totalScore: number } {
  const breakdown: ScoreBreakdown[] = EVALUATION_CATEGORIES.map((cat) => {
    const vals = cat.criteria.map((c) => scores[c.id] || 0).filter((v) => v > 0);
    const rawAvg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    const weightedScore = (rawAvg / 5) * cat.weight;
    return { categoryId: cat.id, title: cat.title, weight: cat.weight, rawAvg, weightedScore };
  });

  const total = breakdown.reduce((acc, b) => acc + b.weightedScore, 0);
  const answeredWeight = breakdown
    .filter((b) => b.rawAvg > 0)
    .reduce((acc, b) => acc + b.weight, 0);

  const totalScore = answeredWeight > 0 ? (total / answeredWeight) * 100 : 0;

  return { breakdown, totalScore };
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("dark_mode") === "true";
  });
  const [saved, setSaved] = useState(false);

  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>(() => {
    const draft = loadDraft();
    return draft?.employeeInfo ?? INITIAL_EMPLOYEE_INFO;
  });

  const [scores, setScores] = useState<Scores>(() => {
    const draft = loadDraft();
    return draft?.scores ?? {};
  });

  const [comments, setComments] = useState<Comments>(() => {
    const draft = loadDraft();
    return draft?.comments ?? INITIAL_COMMENTS;
  });

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("dark_mode", String(darkMode));
  }, [darkMode]);

  // Auto-save every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      saveDraft({ employeeInfo, scores, comments });
    }, 30000);
    return () => clearInterval(timer);
  }, [employeeInfo, scores, comments]);

  const handleSave = useCallback(() => {
    saveDraft({ employeeInfo, scores, comments });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [employeeInfo, scores, comments]);

  const handleReset = useCallback(() => {
    if (window.confirm("هل أنت متأكد من إعادة تعيين جميع بيانات التقييم؟")) {
      setEmployeeInfo(INITIAL_EMPLOYEE_INFO);
      setScores({});
      setComments(INITIAL_COMMENTS);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleScore = useCallback((criterionId: string, score: number) => {
    setScores((prev) => ({ ...prev, [criterionId]: score }));
  }, []);

  const { breakdown, totalScore } = computeBreakdown(scores);

  const totalCriteria = EVALUATION_CATEGORIES.reduce((acc, cat) => acc + cat.criteria.length, 0);
  const answeredCriteria = Object.keys(scores).length;

  return (
    <div className={`min-h-screen bg-background`}>
      <Navbar
        score={totalScore}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        onPrint={handlePrint}
        onReset={handleReset}
        onSave={handleSave}
        saved={saved}
      />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8 text-center print-only">
          <h1 className="text-3xl font-black text-foreground">نموذج تقييم الأداء السنوي</h1>
          <p className="text-muted-foreground mt-1">تقرير تقييم موظف - {employeeInfo.year}</p>
        </div>

        {/* Print header */}
        <div className="print-only mb-6 p-4 rounded-xl border border-border bg-muted/30">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="font-bold">الموظف:</span> {employeeInfo.name || "—"}</div>
            <div><span className="font-bold">القسم:</span> {employeeInfo.department || "—"}</div>
            <div><span className="font-bold">المسمى:</span> {employeeInfo.jobTitle || "—"}</div>
            <div><span className="font-bold">المقيِّم:</span> {employeeInfo.evaluatorName || "—"}</div>
            <div><span className="font-bold">السنة:</span> {employeeInfo.year || "—"}</div>
            <div><span className="font-bold">النتيجة:</span> <span className="font-black">{totalScore.toFixed(1)}%</span></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            {/* Employee Info */}
            <EmployeeInfoSection info={employeeInfo} onChange={setEmployeeInfo} />

            {/* Progress Bar */}
            <ProgressBar completed={answeredCriteria} total={totalCriteria} />

            {/* Divider with title */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-bold text-foreground shrink-0">
                <span>محاور التقييم</span>
                <span className="text-xs px-2 py-0.5 rounded-full text-white"
                  style={{ background: "hsl(142,60%,30%)" }}>
                  {EVALUATION_CATEGORIES.length} محاور
                </span>
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Evaluation Sections */}
            {EVALUATION_CATEGORIES.map((category, index) => (
              <EvaluationSection
                key={category.id}
                category={category}
                scores={scores}
                onScore={handleScore}
                index={index}
              />
            ))}

            {/* Comments */}
            <CommentsSection comments={comments} onChange={setComments} />

            {/* Signatures */}
            <SignaturesSection />

            {/* Footer */}
            <div className="text-center py-4 print-hidden">
              <p className="text-xs text-muted-foreground">
                نظام تقييم الأداء السنوي — جميع البيانات محفوظة محلياً على هذا الجهاز
              </p>
            </div>
          </div>

          {/* Right: Score breakdown sidebar */}
          <div className="w-full lg:w-72 shrink-0 print-hidden">
            <ScoreBreakdownPanel breakdown={breakdown} totalScore={totalScore} />
          </div>
        </div>
      </main>
    </div>
  );
}
