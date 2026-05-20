import { useState } from "react";
import { Mail, FileSpreadsheet, Send } from "lucide-react";
import type { EmployeeInfo, Scores, Comments, ScoreBreakdown } from "../types";
import { exportToExcel } from "../utils/exportExcel";
import { EVALUATION_CATEGORIES, SCORE_LABELS } from "../data/evaluationData";

interface SendExportPanelProps {
  employeeInfo: EmployeeInfo;
  scores: Scores;
  comments: Comments;
  breakdown: ScoreBreakdown[];
  totalScore: number;
}

function getScoreLabel(score: number) {
  if (score >= 85) return "ممتاز";
  if (score >= 70) return "جيد جداً";
  if (score >= 50) return "جيد";
  if (score > 0) return "يحتاج تحسين";
  return "لم يُقيَّم بعد";
}

function buildEmailBody(
  employeeInfo: EmployeeInfo,
  breakdown: ScoreBreakdown[],
  comments: Comments,
  totalScore: number
): string {
  const lines: string[] = [];

  lines.push("تقرير تقييم الأداء السنوي");
  lines.push("شركة مصانع الزيوت النباتية الأردنية م.ع.م.");
  lines.push("=".repeat(45));
  lines.push("");
  lines.push("بيانات الموظف:");
  lines.push(`  الاسم: ${employeeInfo.name || "—"}`);
  lines.push(`  القسم: ${employeeInfo.department || "—"}`);
  lines.push(`  المسمى: ${employeeInfo.jobTitle || "—"}`);
  lines.push(`  المقيِّم: ${employeeInfo.evaluatorName || "—"}`);
  lines.push(`  السنة: ${employeeInfo.year || "—"}`);
  lines.push("");
  lines.push(`النتيجة الإجمالية: ${totalScore.toFixed(1)}% — ${getScoreLabel(totalScore)}`);
  lines.push("");
  lines.push("توزيع الدرجات:");

  breakdown.forEach((b) => {
    const pct = b.rawAvg > 0 ? ((b.weightedScore / b.weight) * 100).toFixed(0) + "%" : "—";
    lines.push(`  ${b.title} (${b.weight}%): ${pct}`);
  });

  lines.push("");
  lines.push("تفاصيل المعايير:");
  EVALUATION_CATEGORIES.forEach((cat) => {
    lines.push(`\n${cat.title}:`);
    cat.criteria.forEach((c) => {
      const s = scores_ref[c.id];
      lines.push(`  - ${c.label}: ${s ? `${s}/5 (${SCORE_LABELS[s]})` : "—"}`);
    });
  });

  if (comments.strengths || comments.weaknesses || comments.recommendations) {
    lines.push("");
    lines.push("التعليقات والتوصيات:");
    if (comments.strengths) lines.push(`  نقاط القوة: ${comments.strengths}`);
    if (comments.weaknesses) lines.push(`  نقاط الضعف: ${comments.weaknesses}`);
    if (comments.recommendations) lines.push(`  التوصيات: ${comments.recommendations}`);
  }

  return lines.join("\n");
}

// Module-level ref to pass scores into the builder (avoids closure issues)
let scores_ref: Record<string, number> = {};

export default function SendExportPanel({
  employeeInfo,
  scores,
  comments,
  breakdown,
  totalScore,
}: SendExportPanelProps) {
  scores_ref = scores;
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleOpenMailto = () => {
    if (!email.trim() || !email.includes("@")) {
      setEmailError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    setEmailError("");

    const subject = encodeURIComponent(
      `تقرير تقييم الأداء السنوي — ${employeeInfo.name || "موظف"} — ${employeeInfo.year || new Date().getFullYear()}`
    );
    const body = encodeURIComponent(buildEmailBody(employeeInfo, breakdown, comments, totalScore));
    window.location.href = `mailto:${email.trim()}?subject=${subject}&body=${body}`;
  };

  const handleExcelExport = () => {
    exportToExcel(employeeInfo, scores, comments, breakdown, totalScore);
  };

  return (
    <div className="bg-card border border-border rounded-2xl card-shadow overflow-hidden fade-in-up print-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 border-b border-border"
        style={{ background: "linear-gradient(135deg, hsl(142,60%,28%) 0%, hsl(142,55%,35%) 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Send size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">إرسال وتصدير التقييم</h2>
            <p className="text-white/70 text-xs">إرسال التقرير بالإيميل أو تصديره كملف Excel</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Email Section ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, hsl(142,60%,30%), hsl(142,55%,42%))" }}>
              <Mail size={15} />
            </div>
            <h3 className="text-sm font-bold text-foreground">إرسال بالبريد الإلكتروني</h3>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">بريد المستلم</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleOpenMailto()}
              placeholder="example@company.com"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
            />
            {emailError && <p className="text-xs text-destructive">{emailError}</p>}
          </div>

          <button
            onClick={handleOpenMailto}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg, hsl(142,60%,28%), hsl(142,55%,38%))" }}
          >
            <Mail size={15} />
            فتح تطبيق الإيميل
          </button>

          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              سيفتح تطبيق الإيميل على جهازك (Outlook أو Gmail أو غيره) بتقرير التقييم جاهزاً للإرسال.
            </p>
          </div>
        </div>

        {/* ── Excel Section ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, hsl(45,85%,40%), hsl(45,80%,52%))" }}>
              <FileSpreadsheet size={15} />
            </div>
            <h3 className="text-sm font-bold text-foreground">تصدير إلى Excel</h3>
          </div>

          <div className="p-4 rounded-xl bg-muted/50 border border-border flex flex-col gap-2">
            <p className="text-xs font-bold text-foreground mb-1">محتويات ملف Excel:</p>
            <p className="text-xs text-foreground">📋 ورقة ملخص التقييم (بيانات الموظف + النتائج + التوصيات)</p>
            <p className="text-xs text-foreground">📊 ورقة التفاصيل الكاملة (جميع المعايير ودرجاتها)</p>
          </div>

          <div className="flex-1" />

          <button
            onClick={handleExcelExport}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg, hsl(45,85%,44%), hsl(45,80%,56%))" }}
          >
            <FileSpreadsheet size={15} />
            تحميل ملف Excel
          </button>

          <div className="p-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              يُصدَّر الملف فوراً بدون أي إعداد — ورقتان: ملخص وتفاصيل كاملة.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
