import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import PrintHeader from "./components/PrintHeader";
import EmployeeInfoSection from "./components/EmployeeInfo";
import EvaluationSection from "./components/EvaluationSection";
import CommentsSection from "./components/CommentsSection";
import SignaturesSection from "./components/SignaturesSection";
import SendExportPanel from "./components/SendExportPanel";
import ScoreBreakdownPanel from "./components/ScoreBreakdown";
import ProgressBar from "./components/ProgressBar";
import ScoreCircle from "./components/ScoreCircle";
import FormMetaFooter from "./components/FormMetaFooter";
import { EVALUATION_CATEGORIES, INITIAL_EMPLOYEE_INFO, INITIAL_COMMENTS } from "./data/evaluationData";
import type { EmployeeInfo, Scores, Comments, ScoreBreakdown } from "./types";
import { exportToPdf } from "./utils/exportPdf";

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
    const sumScores = cat.criteria.reduce((acc, c) => acc + (scores[c.id] || 0), 0);
    const maxSum = cat.criteria.length * 10;
    const weightedScore = maxSum > 0 ? (cat.weight * sumScores) / maxSum : 0;
    const answeredVals = cat.criteria.map((c) => scores[c.id] || 0).filter((v) => v > 0);
    const rawAvg = answeredVals.length > 0 ? answeredVals.reduce((a, b) => a + b, 0) / answeredVals.length : 0;
    return { categoryId: cat.id, title: cat.title, weight: cat.weight, rawAvg, weightedScore };
  });

  const totalScore = breakdown.reduce((acc, b) => acc + b.weightedScore, 0);

  return { breakdown, totalScore };
}

export default function App() {
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

  // Auto-save every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      saveDraft({ employeeInfo, scores, comments });
    }, 30000);
    return () => clearInterval(timer);
  }, [employeeInfo, scores, comments]);

  const handleSave = useCallback(async () => {
    saveDraft({ employeeInfo, scores, comments });
    setSaved(true);
    const name = employeeInfo.name ? `_${employeeInfo.name}` : "";
    const year = employeeInfo.year ? `_${employeeInfo.year}` : "";
    await exportToPdf(`تقييم_الأداء${name}${year}.pdf`);
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
    <div id="pdf-content" className={`min-h-screen bg-background`}>
      <Navbar
        score={totalScore}
        onPrint={handlePrint}
        onReset={handleReset}
        onSave={handleSave}
        saved={saved}
      />

      <FormMetaFooter employeeInfo={employeeInfo} printFixed />

      <main className="pt-[5.5rem] pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <PrintHeader employeeInfo={employeeInfo} totalScore={totalScore} />

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <EmployeeInfoSection info={employeeInfo} onChange={setEmployeeInfo} />
            <div className="print-only">
              <ScoreCircle score={totalScore} />
            </div>
            <ProgressBar completed={answeredCriteria} total={totalCriteria} />

            {/* Section divider */}
            <div className="flex items-center gap-4 py-1 mt-6" style={{ breakBefore: "page" }}>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/70 bg-card shadow-sm text-sm font-extrabold text-foreground shrink-0 whitespace-nowrap">
                <span>محاور التقييم</span>
                <span className="eval-count-badge text-xs px-2.5 py-0.5 rounded-full text-white font-bold shadow-sm"
                  style={{ background: "linear-gradient(135deg, hsl(142,65%,24%), hsl(142,55%,36%))" }}>
                  {EVALUATION_CATEGORIES.length} محاور
                </span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            <div className="px-4 py-3 rounded-2xl border border-border/70 bg-muted/40 text-sm text-foreground text-center">
              يُرجى العلم أن مقياس التقييم من{" "}
              <span className="font-extrabold text-rose-600">1 : ضعيف</span>
              {" "}و{" "}
              <span className="font-extrabold text-green-700">10 : ممتاز</span>
            </div>

            <div className="eval-sections-container flex flex-col gap-5">
              {EVALUATION_CATEGORIES.map((category, index) => (
                <EvaluationSection
                  key={category.id}
                  category={category}
                  scores={scores}
                  onScore={handleScore}
                  index={index}
                  pageBreakBefore={
                    category.id === "competence" ||
                    category.id === "communication" ||
                    category.id === "quality"
                  }
                  keepTogether={category.id === "competence"}
                />
              ))}
            </div>

            <div className="print-page-6 flex flex-col gap-5" style={{ breakBefore: "page", marginTop: "24px" }}>
              <CommentsSection comments={comments} onChange={setComments} />

              <SendExportPanel
                employeeInfo={employeeInfo}
                scores={scores}
                comments={comments}
                breakdown={breakdown}
                totalScore={totalScore}
              />

              <SignaturesSection />

              <FormMetaFooter employeeInfo={employeeInfo} className="print-hidden" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0 print-hidden">
            <ScoreBreakdownPanel breakdown={breakdown} totalScore={totalScore} />
          </div>
        </div>
      </main>
    </div>
  );
}
