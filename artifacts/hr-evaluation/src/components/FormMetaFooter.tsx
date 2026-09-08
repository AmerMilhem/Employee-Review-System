import type { EmployeeInfo } from "../types";

export const FORM_NUMBER = "QQAA001F.1";
const FORM_DATE = "5-09-2026";

interface FormMetaFooterProps {
  employeeInfo: EmployeeInfo;
  /** Fixed footer shown on every printed page */
  printFixed?: boolean;
  className?: string;
}

export default function FormMetaFooter({ employeeInfo: _employeeInfo, printFixed = false, className = "" }: FormMetaFooterProps) {
  const date = FORM_DATE;

  if (printFixed) {
    return (
      <div className="print-page-footer print-only" aria-hidden="true">
        <span>التاريخ: {date}</span>
        <span>رقم النموذج: {FORM_NUMBER}</span>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border/60 rounded-2xl card-shadow px-5 py-4 fade-in-up ${className}`.trim()}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-bold text-foreground">
        <span>
          التاريخ: <span className="tabular-nums font-extrabold">{date}</span>
        </span>
        <span>
          رقم النموذج:{" "}
          <span className="font-extrabold tracking-wide" dir="ltr">
            {FORM_NUMBER}
          </span>
        </span>
      </div>
    </div>
  );
}
