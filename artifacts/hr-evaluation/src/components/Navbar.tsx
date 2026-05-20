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
    <nav className="fixed top-0 inset-x-0 z-50 bg-card border-b border-border elevated-shadow print-hidden">

      {/* ── Company Header ── */}
      <div className="border-b border-border/60"
        style={{ background: "linear-gradient(135deg, hsl(142,60%,24%) 0%, hsl(142,58%,30%) 60%, hsl(45,70%,35%) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-4 sm:gap-8">

          {/* Arabic company name */}
          <div className="text-right hidden sm:block">
            <p className="text-white font-black text-sm sm:text-base leading-tight"
              style={{ fontFamily: "'Cairo', sans-serif" }}>
              شركة مصانع الزيوت النباتية الأردنية
            </p>
            <p className="text-white/80 font-semibold text-xs sm:text-sm leading-tight">
              م.ع.م.
            </p>
          </div>

          {/* Arabic name (mobile) */}
          <div className="text-center sm:hidden">
            <p className="text-white font-black text-xs leading-tight"
              style={{ fontFamily: "'Cairo', sans-serif" }}>
              مصانع الزيوت النباتية الأردنية
            </p>
          </div>

          {/* Logo */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white flex items-center justify-center p-1.5"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.35)" }}>
              <img
                src={logo}
                alt="شعار الشركة"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* English company name */}
          <div className="text-left hidden sm:block">
            <p className="text-white font-black text-sm sm:text-base leading-tight"
              style={{ fontFamily: "'Cairo', sans-serif" }}>
              Jordan Vegetable Oil
            </p>
            <p className="text-white/80 font-semibold text-xs sm:text-sm leading-tight">
              Industries Co. Ltd
            </p>
          </div>

        </div>
      </div>

      {/* ── Controls Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">

          {/* System title */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(142,60%,28%), hsl(45,85%,50%))" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-foreground hidden sm:inline">تقييم الأداء السنوي</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-1.5 border border-border">
            <span className="text-xs text-muted-foreground hidden sm:inline">النتيجة:</span>
            <span className={`text-xl font-black ${scoreColor} transition-all duration-500`}>
              {score.toFixed(1)}%
            </span>
            <span className={`text-xs font-semibold ${scoreColor} hidden sm:inline`}>{scoreLabel}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onSave}
              title="حفظ المسودة"
              className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all border ${
                saved
                  ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Save size={13} />
              <span className="hidden sm:inline">{saved ? "تم الحفظ" : "حفظ"}</span>
            </button>

            <button
              onClick={onReset}
              title="إعادة تعيين"
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold bg-muted text-muted-foreground border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">إعادة</span>
            </button>

            <button
              onClick={onPrint}
              title="طباعة / تصدير PDF"
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold text-white border border-primary/20 transition-all"
              style={{ background: "linear-gradient(135deg, hsl(142,60%,28%), hsl(142,55%,38%))" }}
            >
              <Printer size={13} />
              <span className="hidden sm:inline">طباعة</span>
            </button>

            <button
              onClick={onToggleDark}
              title="تبديل الوضع"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-all"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
