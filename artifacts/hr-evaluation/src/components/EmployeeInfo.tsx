import { User, Building2, Briefcase, UserCheck, Calendar } from "lucide-react";
import type { EmployeeInfo } from "../types";

interface EmployeeInfoProps {
  info: EmployeeInfo;
  onChange: (info: EmployeeInfo) => void;
}

interface FieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  placeholder: string;
  onChange: (val: string) => void;
  type?: string;
}

function Field({ label, value, icon, placeholder, onChange, type = "text" }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
      />
    </div>
  );
}

export default function EmployeeInfoSection({ info, onChange }: EmployeeInfoProps) {
  const update = (key: keyof EmployeeInfo) => (val: string) =>
    onChange({ ...info, [key]: val });

  return (
    <div className="bg-card border border-border rounded-2xl card-shadow overflow-hidden fade-in-up">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border"
        style={{ background: "linear-gradient(135deg, hsl(142,60%,28%) 0%, hsl(142,55%,35%) 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">بيانات الموظف</h2>
            <p className="text-white/70 text-xs">معلومات أساسية عن الموظف والتقييم</p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Field
          label="الاسم الكامل"
          value={info.name}
          icon={<User size={15} />}
          placeholder="أدخل اسم الموظف"
          onChange={update("name")}
        />
        <Field
          label="القسم / الإدارة"
          value={info.department}
          icon={<Building2 size={15} />}
          placeholder="مثال: إدارة تقنية المعلومات"
          onChange={update("department")}
        />
        <Field
          label="المسمى الوظيفي"
          value={info.jobTitle}
          icon={<Briefcase size={15} />}
          placeholder="مثال: مهندس برمجيات أول"
          onChange={update("jobTitle")}
        />
        <Field
          label="اسم المقيِّم"
          value={info.evaluatorName}
          icon={<UserCheck size={15} />}
          placeholder="اسم المدير المباشر"
          onChange={update("evaluatorName")}
        />
        <Field
          label="سنة التقييم"
          value={info.year}
          icon={<Calendar size={15} />}
          placeholder="مثال: 2025"
          onChange={update("year")}
          type="number"
        />
      </div>
    </div>
  );
}
