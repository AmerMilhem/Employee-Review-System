import type { EmployeeInfo } from "../types";

export const FORM_NUMBER = "QQAA001F.1";

interface FormMetaFooterProps {
  employeeInfo: EmployeeInfo;
  /** Fixed footer shown on every printed page */
  printFixed?: boolean;
  className?: string;
}

function formatEvalDate(info: EmployeeInfo): string {
  const { day, month, year } = info;
  if (day && month && year) {
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }
  const today = new Date();
  return today.toLocaleDateString("en-GB");
}

export default function FormMetaFooter({ employeeInfo, printFixed = false, className = "" }: FormMetaFooterProps) {
  const date = formatEvalDate(employeeInfo);

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
