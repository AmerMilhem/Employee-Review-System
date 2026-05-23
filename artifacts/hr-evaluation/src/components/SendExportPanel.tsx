import { useState } from "react";
import { Mail, Send, ExternalLink, Loader2 } from "lucide-react";
import type { EmployeeInfo, Scores, Comments, ScoreBreakdown } from "../types";
import { exportToPdf } from "../utils/exportPdf";

interface SendExportPanelProps {
  employeeInfo: EmployeeInfo;
  scores: Scores;
  comments: Comments;
  breakdown: ScoreBreakdown[];
  totalScore: number;
}

export default function SendExportPanel({
  employeeInfo,
  scores: _scores,
  comments: _comments,
  breakdown: _breakdown,
  totalScore,
}: SendExportPanelProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!email.trim() || !email.includes("@")) {
      setEmailError("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    setEmailError("");
    setLoading(true);

    try {
      // Generate and download the PDF first
      const name = employeeInfo.name ? `_${employeeInfo.name}` : "";
      const year = employeeInfo.year ? `_${employeeInfo.year}` : "";
      const filename = `تقييم_الأداء${name}${year}.pdf`;
      await exportToPdf(filename);

      // Open the email client with subject and instruction to attach the PDF
      const subject = encodeURIComponent(
        `تقرير تقييم الأداء السنوي — ${employeeInfo.name || "موظف"} — 2026`
      );
      const body = encodeURIComponent(
        [
          `تقرير تقييم الأداء السنوي لعام 2026`,
          ``,
          `الموظف: ${employeeInfo.name || "—"}`,
          `الدائرة: ${employeeInfo.department || "—"}`,
          `المسمى الوظيفي: ${employeeInfo.jobTitle || "—"}`,
          `المدير المباشر: ${employeeInfo.evaluatorName || "—"}`,
          `النتيجة الإجمالية: ${totalScore > 0 ? totalScore.toFixed(1) + "% — " + (totalScore >= 90 ? "ممتاز" : totalScore >= 80 ? "جيد جداً" : totalScore >= 70 ? "جيد" : totalScore >= 60 ? "ضعيف" : "يحتاج تحسين") : "—"}`,
          ``,
          `ملاحظة: تم تحميل ملف PDF (${filename}) على جهازك — يرجى إرفاقه بهذا الإيميل.`,
        ].join("\n")
      );

      window.location.href = `mailto:${email.trim()}?subject=${subject}&body=${body}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border/60 rounded-3xl card-shadow overflow-hidden fade-in-up print-hidden">
      {/* Header */}
      <div className="section-header-gradient px-6 py-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
            <Send size={21} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-wide">إرسال التقييم بالبريد الإلكتروني</h2>
            <p className="text-white/60 text-xs mt-0.5 font-medium">يُحمَّل ملف PDF تلقائياً ثم يُفتح تطبيق الإيميل</p>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4">

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">بريد المستلم</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
            placeholder="example@company.com"
            dir="ltr"
            disabled={loading}
            className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-white/70 text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_hsl(142,62%,26%,0.1)] transition-all duration-200 text-sm disabled:opacity-60"
          />
          {emailError && (
            <p className="text-xs text-destructive font-semibold flex items-center gap-1">
              <span>⚠</span> {emailError}
            </p>
          )}
        </div>

        <button
          onClick={handleSendEmail}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold text-white shadow-md shadow-green-900/20 hover:shadow-lg hover:shadow-green-900/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{ background: "linear-gradient(135deg, hsl(142,65%,24%), hsl(142,55%,36%))" }}
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              جاري تجهيز الملف...
            </>
          ) : (
            <>
              <Mail size={15} />
              إرسال بالإيميل
              <ExternalLink size={12} className="opacity-70" />
            </>
          )}
        </button>

        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            سيتم تحميل ملف PDF على جهازك أولاً، ثم يُفتح تطبيق الإيميل — أرفق الملف المحمَّل قبل الإرسال.
          </p>
        </div>

      </div>
    </div>
  );
}
