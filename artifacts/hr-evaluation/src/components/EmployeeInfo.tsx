import { useState, useRef, useEffect } from "react";
import { User, Building2, Briefcase, UserCheck, Calendar, CalendarClock, ChevronDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
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

const DEPARTMENTS = [
  "الإنتاج",
  "المستودعات",
  "المالية",
  "المبيعات",
  "الشؤون الإدارية والموارد البشرية",
  "الجودة",
  "الإدارة",
];

const ARABIC_MONTHS = [
  { value: "01", label: "يناير" },
  { value: "02", label: "فبراير" },
  { value: "03", label: "مارس" },
  { value: "04", label: "أبريل" },
  { value: "05", label: "مايو" },
  { value: "06", label: "يونيو" },
  { value: "07", label: "يوليو" },
  { value: "08", label: "أغسطس" },
  { value: "09", label: "سبتمبر" },
  { value: "10", label: "أكتوبر" },
  { value: "11", label: "نوفمبر" },
  { value: "12", label: "ديسمبر" },
];

function getDaysInMonth(month: string): number {
  if (!month) return 31;
  const m = parseInt(month, 10);
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[m - 1] ?? 31;
}

const selectClass =
  "px-3 py-3 rounded-2xl border-2 border-border bg-white/70 text-foreground font-medium focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_hsl(142,62%,26%,0.1)] transition-all duration-200 text-sm appearance-none cursor-pointer";

function Field({ label, value, icon, placeholder, onChange, type = "text" }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <span className="text-primary/80 group-focus-within:text-primary transition-colors">{icon}</span>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-white/70 text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_hsl(142,62%,26%,0.1)] transition-all duration-200 text-sm"
      />
    </div>
  );
}

interface HireDatePickerProps {
  value: string;
  onChange: (val: string) => void;
}

function HireDatePicker({ value, onChange }: HireDatePickerProps) {
  const [open, setOpen] = useState(false);

  const selected = value ? new Date(value) : undefined;

  const displayValue = selected && !isNaN(selected.getTime())
    ? selected.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })
    : value || "";

  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <span className="text-primary/80 group-focus-within:text-primary transition-colors">
          <CalendarClock size={13} />
        </span>
        تاريخ التعيين
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium text-right flex items-center justify-between gap-2 transition-all duration-200"
            style={{
              borderColor: open ? "hsl(142,62%,26%)" : "hsl(var(--border))",
              background: open ? "white" : "rgba(255,255,255,0.7)",
              boxShadow: open ? "0 0 0 4px hsl(142,62%,26%,0.1)" : "none",
            }}
          >
            <span className={displayValue ? "text-foreground font-semibold" : "text-muted-foreground/50"}>
              {displayValue || "اختر تاريخ التعيين"}
            </span>
            <Calendar size={15} className="shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                onChange(date.toISOString().split("T")[0]);
                setOpen(false);
              }
            }}
            captionLayout="dropdown"
            startMonth={new Date(1980, 0)}
            endMonth={new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface DepartmentDropdownProps {
  value: string;
  onChange: (val: string) => void;
}

function DepartmentDropdown({ value, onChange }: DepartmentDropdownProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 group relative" style={{ zIndex: open ? 50 : "auto" }} ref={containerRef}>
      <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <span className="transition-colors duration-200" style={{ color: open ? "hsl(142,62%,26%)" : undefined }}>
          <Building2 size={13} />
        </span>
        الدائرة
      </label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium text-right flex items-center justify-between gap-2 transition-all duration-200"
        style={{
          borderColor: open ? "hsl(142,62%,26%)" : "hsl(var(--border))",
          background: open ? "white" : "rgba(255,255,255,0.7)",
          boxShadow: open ? "0 0 0 4px hsl(142,62%,26%,0.1)" : "none",
        }}
      >
        <span className={value ? "text-foreground font-semibold" : "text-muted-foreground/50"}>
          {value || "اختر الدائرة"}
        </span>
        <ChevronDown
          size={16}
          className="shrink-0 text-muted-foreground transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            left: 0,
            zIndex: 9999,
            borderRadius: "16px",
            border: "1px solid hsl(var(--border))",
            background: "white",
            boxShadow: "0 8px 32px hsl(142,62%,20%,0.15), 0 2px 8px hsl(0,0%,0%,0.08)",
            animation: "dropdownIn 0.18s cubic-bezier(0.16,1,0.3,1)",
            overflow: "hidden",
          }}
        >
          {DEPARTMENTS.map((dept, i) => {
            const isSelected = value === dept;
            const isHov = hovered === dept;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => { onChange(dept); setOpen(false); }}
                onMouseEnter={() => setHovered(dept)}
                onMouseLeave={() => setHovered(null)}
                className="w-full px-4 py-3 text-sm text-right flex items-center justify-between gap-2 transition-all duration-150 font-medium"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, hsl(142,62%,26%,0.10), hsl(142,55%,36%,0.07))"
                    : isHov
                    ? "hsl(142,62%,26%,0.06)"
                    : "transparent",
                  color: isSelected ? "hsl(142,62%,22%)" : "hsl(0,0%,12%)",
                  borderBottom: i < DEPARTMENTS.length - 1 ? "1px solid hsl(0,0%,93%)" : "none",
                }}
              >
                <span>{dept}</span>
                {isSelected && <Check size={14} style={{ color: "hsl(142,62%,26%)", flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function EmployeeInfoSection({ info, onChange }: EmployeeInfoProps) {
  const update = (key: keyof EmployeeInfo) => (val: string) =>
    onChange({ ...info, [key]: val });

  const daysInMonth = getDaysInMonth(info.month);
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => {
    const d = String(i + 1).padStart(2, "0");
    return { value: d, label: String(i + 1) };
  });

  const handleMonthChange = (val: string) => {
    const max = getDaysInMonth(val);
    const currentDay = parseInt(info.day || "0", 10);
    onChange({ ...info, month: val, day: currentDay > max ? String(max).padStart(2, "0") : info.day });
  };

  return (
    <div className="bg-card border border-border/60 rounded-3xl card-shadow fade-in-up" style={{ position: "relative", zIndex: 100 }}>
      {/* Header */}
      <div className="section-header-gradient px-6 py-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
            <User size={21} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-wide">بيانات الموظف</h2>
            <p className="text-white/60 text-xs mt-0.5 font-medium">معلومات أساسية عن الموظف والتقييم</p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Field
          label="اسم الموظف"
          value={info.name}
          icon={<User size={13} />}
          placeholder="أدخل اسم الموظف"
          onChange={update("name")}
        />

        <DepartmentDropdown value={info.department} onChange={update("department")} />

        <Field
          label="المسمى الوظيفي"
          value={info.jobTitle}
          icon={<Briefcase size={13} />}
          placeholder="مثال: مهندس برمجيات أول"
          onChange={update("jobTitle")}
        />
        <Field
          label="المدير المباشر"
          value={info.evaluatorName}
          icon={<UserCheck size={13} />}
          placeholder="أدخل اسم المدير المباشر"
          onChange={update("evaluatorName")}
        />

        <HireDatePicker value={info.hireYear} onChange={update("hireYear")} />

        {/* تاريخ التقييم */}
        <div className="flex flex-col gap-1.5 group">
          <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <span className="text-primary/80"><Calendar size={13} /></span>
            التاريخ
          </label>
          <div className="flex items-center gap-2">
            <select
              value={info.month}
              onChange={(e) => handleMonthChange(e.target.value)}
              className={`flex-1 ${selectClass}`}
            >
              <option value="" disabled>الشهر</option>
              {ARABIC_MONTHS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select
              value={info.day}
              onChange={(e) => update("day")(e.target.value)}
              className={`w-20 text-center ${selectClass}`}
            >
              <option value="" disabled>يوم</option>
              {dayOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <div
              className="shrink-0 px-4 py-3 rounded-2xl font-extrabold text-sm text-white shadow-sm"
              style={{ background: "linear-gradient(135deg, hsl(142,65%,24%), hsl(142,55%,36%))" }}
            >
              2026
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}
