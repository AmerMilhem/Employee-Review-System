import { PenLine } from "lucide-react";

const SIGNATORIES = [
  { key: "employee", label: "الموظف", subtitle: "توقيع الموظف المُقيَّم" },
  { key: "direct_manager", label: "المدير المباشر", subtitle: "توقيع المدير المباشر" },
  { key: "dept_manager", label: "مدير القسم", subtitle: "توقيع مدير القسم / الإدارة" },
  { key: "hr", label: "إدارة الموارد البشرية", subtitle: "توقيع مسؤول الموارد البشرية" },
];

export default function SignaturesSection() {
  return (
    <div className="bg-card border border-border rounded-2xl card-shadow overflow-hidden fade-in-up">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border"
        style={{ background: "linear-gradient(135deg, hsl(142,60%,28%) 0%, hsl(142,55%,35%) 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <PenLine size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">التوقيعات والاعتماد</h2>
            <p className="text-white/70 text-xs">توقيعات جميع الأطراف المعنية</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {SIGNATORIES.map((sig) => (
            <div key={sig.key} className="flex flex-col items-center gap-3">
              <div className="w-full">
                <p className="text-sm font-bold text-center text-foreground mb-1">{sig.label}</p>
                <p className="text-xs text-center text-muted-foreground mb-4">{sig.subtitle}</p>
                {/* Signature box */}
                <div className="w-full h-20 rounded-xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
                  <PenLine size={18} className="text-muted-foreground/40" />
                </div>
              </div>
              {/* Date line */}
              <div className="w-full">
                <p className="text-xs text-muted-foreground text-center mb-1">التاريخ</p>
                <div className="w-full h-8 rounded-lg border border-dashed border-border bg-muted/20 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground/60">_ _ / _ _ / _ _ _ _</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            بالتوقيع أدناه، يُقرّ جميع الأطراف بأن هذا التقييم قد تم مراجعته ومناقشته وأنه يعكس بدقة أداء الموظف خلال فترة التقييم المذكورة.
          </p>
        </div>
      </div>
    </div>
  );
}
