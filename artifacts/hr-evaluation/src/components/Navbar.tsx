import { Printer, RotateCcw, FileDown, CheckCircle2 } from "lucide-react";
import logo from "@assets/image_1779310449719.png";

interface NavbarProps {
  score: number;
  onPrint: () => void;
  onReset: () => void;
  onSave: () => void;
  saved: boolean;
}

function getScoreColor(score: number) {
  if (score >= 90) return { text: "text-green-500", ring: "hsl(142,60%,42%)", bg: "from-green-500 to-emerald-400" };
  if (score >= 80) return { text: "text-emerald-500", ring: "hsl(152,55%,45%)", bg: "from-emerald-500 to-teal-400" };
  if (score >= 70) return { text: "text-amber-500", ring: "hsl(45,85%,50%)", bg: "from-amber-500 to-yellow-400" };
  if (score >= 60) return { text: "text-orange-500", ring: "hsl(25,85%,52%)", bg: "from-orange-500 to-amber-400" };
  return { text: "text-rose-500", ring: "hsl(0,65%,55%)", bg: "from-rose-500 to-red-400" };
}

function getScoreLabel(score: number) {
  if (score >= 90) return "ممتاز";
  if (score >= 80) return "جيد جداً";
  if (score >= 70) return "جيد";
  if (score >= 60) return "ضعيف";
  if (score > 0) return "يحتاج تحسين";
  return "لم يُقيَّم بعد";
}

export default function Navbar({ score, onPrint, onReset, onSave, saved }: NavbarProps) {
  const { text: scoreText, ring: ringColor } = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 print-hidden">

      {/* ── Company Header Bar ── */}
      <div className="glass border-b border-white/40 dark:border-white/10 shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 flex items-center justify-between gap-4">

          {/* System title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: "linear-gradient(135deg, hsl(142,65%,24%), hsl(142,55%,35%))" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="hidden lg:block">
              <span className="text-xs font-black" style={{ color: "hsl(142,62%,26%)" }}>تقييم الأداء السنوي</span>
            </div>
          </div>

          {/* Center: Company identity */}
          <div className="flex items-center justify-center gap-5 sm:gap-10 flex-1">
            <div className="text-right hidden md:block">
              <p className="font-black text-sm sm:text-base leading-snug tracking-tight" style={{ color: "hsl(142,62%,24%)", fontFamily: "'Cairo', sans-serif" }}>
                شركة مصانع الزيوت النباتية الأردنية م.ع.م.
              </p>
            </div>

            <div className="shrink-0 relative">
              <div className="absolute inset-0 rounded-full opacity-20 blur-md"
                style={{ background: "radial-gradient(circle, hsl(142,60%,40%), transparent)" }} />
              <img src={logo} alt="شعار الشركة" className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md" />
            </div>

            <div className="text-left hidden md:block">
              <p className="font-black text-sm sm:text-base leading-snug tracking-tight" style={{ color: "hsl(142,62%,24%)", fontFamily: "'Cairo', sans-serif" }}>
                Jordan Vegetable Oil Industries Co. Ltd
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={onSave}
              title="تحميل كـ PDF"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                saved
                  ? "bg-green-50 text-green-700 border-green-200 shadow-sm shadow-green-100"
                  : "bg-white/60 text-muted-foreground border-border/60 hover:bg-white hover:border-primary/30 hover:text-primary hover:shadow-sm"
              }`}
            >
              {saved ? <CheckCircle2 size={13} className="text-green-600" /> : <FileDown size={13} />}
              <span className="hidden xl:inline">{saved ? "تم التحميل" : "تحميل PDF"}</span>
            </button>

            <button
              onClick={onReset}
              title="إعادة تعيين"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/60 text-muted-foreground border border-border/60 hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:shadow-sm transition-all duration-200"
            >
              <RotateCcw size={13} />
              <span className="hidden xl:inline">إعادة تعيين</span>
            </button>

            <button
              onClick={onPrint}
              title="طباعة / تصدير PDF"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-md shadow-green-800/20 hover:shadow-lg hover:shadow-green-800/30 hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: "linear-gradient(135deg, hsl(142,65%,24%), hsl(142,55%,36%))" }}
            >
              <Printer size={13} />
              <span className="hidden xl:inline">طباعة</span>
            </button>

          </div>
        </div>
      </div>

      {/* ── Floating Score Badge ── */}
      <div className="fixed bottom-8 left-8 z-[60] print-hidden">
        <div
          className="relative bg-card/90 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-3xl px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.10)] flex flex-col items-center gap-2 transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-default"
          style={{ boxShadow: score > 0 ? `0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.3) inset, 0 8px 32px ${ringColor}22` : undefined }}
        >
          {/* Glow ring */}
          {score > 0 && (
            <div className="absolute inset-0 rounded-3xl opacity-20 blur-lg pointer-events-none"
              style={{ background: `radial-gradient(circle, ${ringColor}, transparent 70%)` }} />
          )}

          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-muted/25" strokeWidth="9" />
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke={ringColor}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - score / 100)}
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease" }}
                filter="drop-shadow(0 0 4px currentColor)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-xl font-black leading-none ${scoreText}`}>{score.toFixed(0)}</span>
              <span className="text-[9px] font-bold text-muted-foreground">%</span>
            </div>
          </div>

          <div className="text-center">
            <span className={`text-xs font-black ${scoreText} block leading-tight`}>
              {scoreLabel}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
