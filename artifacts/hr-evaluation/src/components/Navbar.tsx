import { Printer, Moon, Sun, RotateCcw, Save } from "lucide-react";
import logo from "@assets/image_1779310449719.png";

interface NavbarProps {
  score: number;
  darkMode: boolean;
  onToggleDark: () => void;
  onPrint: () => void;
  onReset: () => void;
  onSave: () => void;
  saved: boolean;
}

function getScoreColor(score: number) {
  if (score >= 85) return "text-green-500";
  if (score >= 70) return "text-yellow-500";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
}

function getScoreLabel(score: number) {
  if (score >= 85) return "ممتاز";
  if (score >= 70) return "جيد جداً";
  if (score >= 50) return "جيد";
  if (score > 0) return "يحتاج تحسين";
  return "لم يُقيَّم بعد";
}

export default function Navbar({ score, darkMode, onToggleDark, onPrint, onReset, onSave, saved }: NavbarProps) {
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 elevated-shadow print-hidden bg-transparent">

      {/* ── Company Header ── */}
      <div className="bg-white/85 dark:bg-card/85 backdrop-blur-md border-b border-border/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between gap-4">

          {/* System title & Icon */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, hsl(142,60%,28%), hsl(45,85%,50%))" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-black text-[#1c723b] hidden lg:inline">تقييم الأداء السنوي</span>
          </div>

          {/* Center: Company Name & Logo */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 flex-1">
            {/* Arabic company name */}
            <div className="text-right hidden md:block">
              <p className="text-[#1c723b] font-black text-xs sm:text-sm leading-tight"
                style={{ fontFamily: "'Cairo', sans-serif" }}>
                شركة مصانع الزيوت النباتية الأردنية م.ع.م.
              </p>
            </div>

            {/* Logo */}
            <div className="shrink-0 flex items-center justify-center">
              <img src={logo} alt="شعار الشركة" className="w-14 h-14 sm:w-14 sm:h-14 object-contain" />
            </div>

            {/* English company name */}
            <div className="text-left hidden md:block">
              <p className="text-[#1c723b] font-black text-xs sm:text-sm leading-tight"
                style={{ fontFamily: "'Cairo', sans-serif" }}>
                Jordan Vegetable Oil Industries Co. Ltd
              </p>
            </div>
          </div>

          {/* Actions (Moved to Header Left) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={onSave}
              title="حفظ المسودة"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                saved
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Save size={13} />
              <span className="hidden xl:inline">{saved ? "تم الحفظ" : "حفظ"}</span>
            </button>

            <button
              onClick={onReset}
              title="إعادة تعيين"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-muted/50 text-muted-foreground border border-border hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <RotateCcw size={13} />
              <span className="hidden xl:inline">إعادة</span>
            </button>

            <button
              onClick={onPrint}
              title="طباعة / تصدير PDF"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white border border-primary/20 transition-all"
              style={{ background: "linear-gradient(135deg, hsl(142,60%,28%), hsl(142,55%,38%))" }}
            >
              <Printer size={13} />
              <span className="hidden xl:inline">طباعة</span>
            </button>

            <button
              onClick={onToggleDark}
              title="تبديل الوضع"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted/50 text-muted-foreground border border-border hover:bg-accent transition-all"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Floating Score Badge ── */}
      <div className="fixed bottom-8 left-8 z-[60] print-hidden">
        <div className="bg-card/90 backdrop-blur-xl border border-border rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col items-center gap-1.5 transition-all duration-500 hover:scale-110 hover:-translate-y-2 group">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="currentColor"
                className={scoreColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="264"
                strokeDashoffset={264 * (1 - score / 100)}
                style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-xl font-black leading-none ${scoreColor}`}>{score.toFixed(0)}</span>
              <span className="text-[10px] font-bold text-muted-foreground">%</span>
            </div>
          </div>
          <div className="text-center">
            <span className={`text-xs font-black ${scoreColor} block`}>
              {scoreLabel}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
