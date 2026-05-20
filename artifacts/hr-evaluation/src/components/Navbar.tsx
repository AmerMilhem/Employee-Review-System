import { Printer, Moon, Sun, RotateCcw, Save } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(142,60%,28%), hsl(45,85%,50%))" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground leading-none mb-0.5">نظام الموارد البشرية</p>
              <h1 className="text-sm font-bold text-foreground leading-none">تقييم الأداء السنوي</h1>
            </div>
          </div>

          {/* Score Display */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center bg-muted rounded-xl px-4 py-2 border border-border">
              <span className="text-xs text-muted-foreground">النتيجة الإجمالية</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black ${scoreColor} transition-all duration-500`}>
                  {score.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">%</span>
              </div>
              <span className={`text-xs font-semibold ${scoreColor}`}>{scoreLabel}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              title="حفظ المسودة"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                saved
                  ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Save size={14} />
              <span className="hidden sm:inline">{saved ? "تم الحفظ" : "حفظ"}</span>
            </button>

            <button
              onClick={onReset}
              title="إعادة تعيين"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-muted text-muted-foreground border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">إعادة</span>
            </button>

            <button
              onClick={onPrint}
              title="طباعة / تصدير PDF"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-primary-foreground border border-primary/20 transition-all"
              style={{ background: "linear-gradient(135deg, hsl(142,60%,28%), hsl(142,55%,38%))" }}
            >
              <Printer size={14} />
              <span className="hidden sm:inline">طباعة PDF</span>
            </button>

            <button
              onClick={onToggleDark}
              title="تبديل الوضع"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border hover:bg-accent hover:text-accent-foreground transition-all"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
