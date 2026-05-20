import { useState } from "react";
import { Mail, FileSpreadsheet, Send, CheckCircle, AlertCircle, Loader } from "lucide-react";
import type { EmployeeInfo, Scores, Comments, ScoreBreakdown } from "../types";
import { exportToExcel } from "../utils/exportExcel";

interface SendExportPanelProps {
  employeeInfo: EmployeeInfo;
  scores: Scores;
  comments: Comments;
  breakdown: ScoreBreakdown[];
  totalScore: number;
}

type SendStatus = "idle" | "sending" | "success" | "error";

export default function SendExportPanel({
  employeeInfo,
  scores,
  comments,
  breakdown,
  totalScore,
}: SendExportPanelProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendEmail = async () => {
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const baseUrl = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
      const res = await fetch(`${baseUrl}/api/send-evaluation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: email.trim(),
          employeeInfo,
          scores,
          comments,
          totalScore,
          breakdown,
        }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok || data.error) {
        throw new Error(data.error || "فشل الإرسال");
      }
      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    }
  };

  const handleExcelExport = () => {
    exportToExcel(employeeInfo, scores, comments, breakdown, totalScore);
  };

  return (
    <div className="bg-card border border-border rounded-2xl card-shadow overflow-hidden fade-in-up print-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 border-b border-border"
        style={{
          background:
            "linear-gradient(135deg, hsl(142,60%,28%) 0%, hsl(142,55%,35%) 100%)",
        }}
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
            <label className="text-xs font-semibold text-muted-foreground">
              بريد المستلم
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); setStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
              placeholder="example@company.com"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
            />
          </div>

          {/* Status messages */}
          {status === "success" && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle size={16} className="text-green-600 dark:text-green-400 shrink-0" />
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                تم إرسال التقرير بنجاح!
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <AlertCircle size={16} className="text-red-600 dark:text-red-400 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
            </div>
          )}

          {errorMsg && status === "idle" && (
            <p className="text-xs text-destructive">{errorMsg}</p>
          )}

          <button
            onClick={handleSendEmail}
            disabled={status === "sending"}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, hsl(142,60%,28%), hsl(142,55%,38%))",
            }}
          >
            {status === "sending" ? (
              <><Loader size={16} className="animate-spin" /> جارٍ الإرسال...</>
            ) : (
              <><Send size={15} /> إرسال التقرير</>
            )}
          </button>

          <p className="text-xs text-muted-foreground">
            سيتم إرسال تقرير HTML احترافي يتضمن جميع التفاصيل والنتائج.
          </p>
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

          {/* Preview of what's in the Excel */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs font-bold text-foreground mb-1">محتويات ملف Excel:</p>
            {[
              "📋 ورقة ملخص التقييم (بيانات الموظف + النتائج + التوصيات)",
              "📊 ورقة التفاصيل الكاملة (جميع المعايير ودرجاتها)",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-xs text-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex-1" />

          <button
            onClick={handleExcelExport}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: "linear-gradient(135deg, hsl(45,85%,44%), hsl(45,80%,56%))",
              color: "white",
            }}
          >
            <FileSpreadsheet size={15} />
            تحميل ملف Excel
          </button>

          <p className="text-xs text-muted-foreground">
            يُصدَّر الملف فوراً بدون أي إعداد — ورقتان: ملخص وتفاصيل كاملة.
          </p>
        </div>
      </div>
    </div>
  );
}
