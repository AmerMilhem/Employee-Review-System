import { useState } from "react";
import { User, Building2, Briefcase, UserCheck, Calendar, CalendarClock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EmployeeInfo } from "../types";
import { employees, departments } from "../data/employees";

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
  readOnly?: boolean;
}

const ENGLISH_MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function parseMDY(dateStr: string): string {
  if (!dateStr || dateStr === "غير محدد") return "";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return "";
  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function getDaysInMonth(month: string): number {
  if (!month) return 31;
  const m = parseInt(month, 10);
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days[m - 1] ?? 31;
}

const selectClass =
  "px-3 py-3 rounded-2xl border-2 border-border bg-white/70 text-foreground font-medium focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_hsl(142,62%,26%,0.1)] transition-all duration-200 text-sm appearance-none cursor-pointer hover:border-primary/40 hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5";

function Field({ label, value, icon, placeholder, onChange, readOnly = false }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <span className="text-primary/80 group-focus-within:text-primary transition-colors">{icon}</span>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full px-4 py-3 rounded-2xl border-2 border-border bg-white/70 text-foreground font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_hsl(142,62%,26%,0.1)] transition-all duration-200 text-sm hover:border-primary/40 hover:bg-primary/[0.02] hover:shadow-sm${readOnly ? " cursor-default opacity-80" : ""}`}
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

  const displayValue =
    selected && !isNaN(selected.getTime())
      ? selected.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
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
            className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium text-right flex items-center justify-between gap-2 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm hover:-translate-y-0.5"
            style={{
              borderColor: open ? "hsl(142,62%,26%)" : "hsl(var(--border))",
              background: open ? "white" : "rgba(255,255,255,0.7)",
              boxShadow: open ? "0 0 0 4px hsl(142,62%,26%,0.1)" : "none",
            }}
          >
            <span className={displayValue ? "text-foreground font-semibold" : "text-muted-foreground/50"}>
              {displayValue || "Select Hire Date"}
            </span>
            <Calendar size={15} className="shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 rounded-2xl shadow-xl border-0" align="start">
          <CalendarPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                onChange(date.toISOString().split("T")[0]);
                setOpen(false);
              }
            }}
            captionLayout="label"
            startMonth={new Date(1980, 0)}
            endMonth={new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

const triggerBase =
  "w-full h-auto px-4 py-3 rounded-2xl border-2 border-border bg-white text-sm font-medium text-right flex-row-reverse justify-between transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm data-[state=open]:border-primary data-[state=open]:bg-white data-[state=open]:shadow-[0_0_0_4px_hsl(142,62%,26%,0.1)]";

export default function EmployeeInfoSection({ info, onChange }: EmployeeInfoProps) {
  const update = (key: keyof EmployeeInfo) => (val: string) =>
    onChange({ ...info, [key]: val });

  const handleDepartmentChange = (dept: string) => {
    onChange({ ...info, department: dept, employeeId: "", name: "", jobTitle: "" });
  };

  const handleEmployeeChange = (empId: string) => {
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      const hireYear = parseMDY(emp.hireDate);
      onChange({ ...info, employeeId: emp.id, name: emp.name, jobTitle: emp.jobTitle, department: emp.department, evaluatorName: emp.directManager, hireYear });
    }
  };

  const filteredEmployees = info.department
    ? employees.filter((e) => e.department === info.department)
    : [];

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

        {/* Employee Name Select — first */}
        <div className="flex flex-col gap-1.5 group">
          <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <span className="text-primary/80 transition-colors"><User size={13} /></span>
            اسم الموظف
          </label>
          <Select
            value={info.employeeId || ""}
            onValueChange={handleEmployeeChange}
            disabled={!info.department}
          >
            <SelectTrigger className={`${triggerBase} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-white/70 disabled:hover:shadow-none`}>
              <SelectValue placeholder={info.department ? "اختر الموظف" : "اختر القسم أولاً"} />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-border shadow-[0_8px_32px_hsl(142,62%,20%,0.15),0_2px_8px_hsl(0,0%,0%,0.08)] max-h-64 overflow-y-auto z-[9999]" dir="rtl">
              {filteredEmployees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id} className="text-sm font-medium cursor-pointer">
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Department Select — second */}
        <div className="flex flex-col gap-1.5 group">
          <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <span className="text-primary/80 transition-colors"><Building2 size={13} /></span>
            القسم
          </label>
          <Select value={info.department} onValueChange={handleDepartmentChange}>
            <SelectTrigger className={triggerBase}>
              <SelectValue placeholder="اختر القسم" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-border shadow-[0_8px_32px_hsl(142,62%,20%,0.15),0_2px_8px_hsl(0,0%,0%,0.08)] z-[9999] !bg-white" dir="rtl">
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept} className="text-sm font-medium cursor-pointer">
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Field
          label="المسمى الوظيفي"
          value={info.jobTitle}
          icon={<Briefcase size={13} />}
          placeholder="يُملأ تلقائياً عند اختيار الموظف"
          onChange={update("jobTitle")}
          readOnly={!!info.employeeId}
        />

        <Field
          label="المدير المباشر"
          value={info.evaluatorName}
          icon={<UserCheck size={13} />}
          placeholder="أدخل اسم المدير المباشر"
          onChange={update("evaluatorName")}
        />

        <HireDatePicker value={info.hireYear} onChange={update("hireYear")} />

        {/* Evaluation Date */}
        <div className="flex flex-col gap-1.5 group">
          <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors duration-200">
            <span className="text-primary/80 group-hover:scale-110 transition-transform"><Calendar size={13} /></span>
            تاريخ التقييم
          </label>
          <div className="flex items-center gap-2">
            <select
              value={info.month}
              onChange={(e) => handleMonthChange(e.target.value)}
              className={`flex-1 ${selectClass}`}
            >
              <option value="" disabled>Month</option>
              {ENGLISH_MONTHS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select
              value={info.day}
              onChange={(e) => update("day")(e.target.value)}
              className={`w-20 text-center ${selectClass}`}
            >
              <option value="" disabled>Day</option>
              {dayOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <div
              className="shrink-0 px-4 py-3 rounded-2xl font-extrabold text-sm text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md cursor-default"
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
