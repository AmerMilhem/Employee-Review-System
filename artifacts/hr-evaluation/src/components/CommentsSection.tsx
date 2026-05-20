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
  iconBg: string;
  onChange: (val: string) => void;
}

function TextAreaField({ label, value, placeholder, icon, iconBg, onChange }: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-sm font-bold text-foreground">
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-white`} style={{ background: iconBg }}>
          {icon}
        </span>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm resize-none leading-relaxed"
      />
      <p className="text-xs text-muted-foreground text-left ltr">{value.length} حرف</p>
    </div>
  );
}

export default function CommentsSection({ comments, onChange }: CommentsSectionProps) {
  const update = (key: keyof Comments) => (val: string) => onChange({ ...comments, [key]: val });

  return (
    <div className="bg-card border border-border rounded-2xl card-shadow overflow-hidden fade-in-up">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border"
        style={{ background: "linear-gradient(135deg, hsl(142,60%,28%) 0%, hsl(142,55%,35%) 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Lightbulb size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">التعليقات والتوصيات</h2>
            <p className="text-white/70 text-xs">ملاحظات تفصيلية وتوصيات المدير</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <TextAreaField
          label="نقاط القوة والإنجازات"
          value={comments.strengths}
          placeholder="اذكر أبرز نقاط قوة الموظف وإنجازاته خلال فترة التقييم..."
          icon={<Star size={14} />}
          iconBg="linear-gradient(135deg, hsl(142,60%,30%), hsl(142,55%,40%))"
          onChange={update("strengths")}
        />
        <TextAreaField
          label="نقاط الضعف ومجالات التحسين"
          value={comments.weaknesses}
          placeholder="حدد المجالات التي تحتاج إلى تطوير وتحسين..."
          icon={<AlertTriangle size={14} />}
          iconBg="linear-gradient(135deg, hsl(25,80%,45%), hsl(25,75%,55%))"
          onChange={update("weaknesses")}
        />
        <TextAreaField
          label="توصيات المدير"
          value={comments.recommendations}
          placeholder="اكتب توصياتك للموظف للفترة القادمة والخطة التطويرية..."
          icon={<Lightbulb size={14} />}
          iconBg="linear-gradient(135deg, hsl(45,85%,45%), hsl(45,80%,55%))"
          onChange={update("recommendations")}
        />
      </div>
    </div>
  );
}
