import { Star, AlertTriangle, Lightbulb } from "lucide-react";
import type { Comments } from "../types";

interface CommentsSectionProps {
  comments: Comments;
  onChange: (comments: Comments) => void;
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  accentColor: string;
  onChange: (val: string) => void;
}

function TextAreaField({ label, value, placeholder, icon, accentColor, onChange }: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <span
          className="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-sm"
          style={{ background: accentColor }}
        >
          {icon}
        </span>
        {label}
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-white/70 dark:bg-card/70 text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-card focus:shadow-[0_0_0_4px_hsl(142,62%,26%,0.1)] transition-all duration-200 text-sm resize-none leading-relaxed"
        />
      </div>
      <p className="text-[10px] text-muted-foreground text-left font-medium tabular-nums">
        {value.length} حرف
      </p>
    </div>
  );
}

export default function CommentsSection({ comments, onChange }: CommentsSectionProps) {
  const update = (key: keyof Comments) => (val: string) => onChange({ ...comments, [key]: val });

  return (
    <div className="bg-card border border-border/60 rounded-3xl card-shadow overflow-hidden fade-in-up">
      {/* Header */}
      <div className="section-header-gradient px-6 py-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
            <Lightbulb size={21} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-wide">التعليقات والتوصيات</h2>
            <p className="text-white/60 text-xs mt-0.5 font-medium">ملاحظات تفصيلية وتوصيات المدير</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <TextAreaField
          label="نقاط القوة والإنجازات"
          value={comments.strengths}
          placeholder="اذكر أبرز نقاط قوة الموظف وإنجازاته خلال فترة التقييم..."
          icon={<Star size={13} />}
          accentColor="linear-gradient(135deg, hsl(142,65%,26%), hsl(142,55%,38%))"
          onChange={update("strengths")}
        />
        <TextAreaField
          label="مجالات التحسين"
          value={comments.weaknesses}
          placeholder="حدد المجالات التي تحتاج إلى تطوير وتحسين..."
          icon={<AlertTriangle size={13} />}
          accentColor="linear-gradient(135deg, hsl(25,80%,42%), hsl(25,75%,54%))"
          onChange={update("weaknesses")}
        />
        <TextAreaField
          label="توصيات المدير"
          value={comments.recommendations}
          placeholder="اكتب توصياتك للموظف للفترة القادمة والخطة التطويرية..."
          icon={<Lightbulb size={13} />}
          accentColor="linear-gradient(135deg, hsl(45,88%,40%), hsl(45,82%,54%))"
          onChange={update("recommendations")}
        />
      </div>
    </div>
  );
}
