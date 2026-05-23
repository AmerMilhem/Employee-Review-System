import logo from "@assets/image_1779310449719.png";
import type { EmployeeInfo } from "../types";

interface PrintHeaderProps {
  employeeInfo: EmployeeInfo;
  totalScore: number;
}

const GREEN = "hsl(142,62%,22%)";
const GREEN_MID = "hsl(142,55%,30%)";
const GREEN_LIGHT = "hsl(142,22%,96%)";
const BLACK = "hsl(0,0%,10%)";

export default function PrintHeader({ employeeInfo, totalScore }: PrintHeaderProps) {
  const dateStr =
    [employeeInfo.day, employeeInfo.month, "2026"].filter(Boolean).join("/") || "—";

  const scoreLabel =
    totalScore >= 90 ? "ممتاز"
    : totalScore >= 80 ? "جيد جداً"
    : totalScore >= 70 ? "جيد"
    : totalScore >= 60 ? "ضعيف"
    : totalScore > 0 ? "يحتاج تحسين"
    : "—";

  return (
    <div className="print-only mb-4" style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>

      {/* ── Brand bar: mirrors the Navbar layout ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#ffffff",
          marginBottom: "6px",
        }}
      >
        {/* Arabic name – right */}
        <p style={{
          color: GREEN,
          fontWeight: 900,
          fontSize: "14px",
          margin: 0,
          whiteSpace: "nowrap",
          fontFamily: "'Cairo', sans-serif",
        }}>
          شركة مصانع الزيوت النباتية الأردنية م.ع.م.
        </p>

        {/* Logo – center */}
        <img
          src={logo}
          alt="شعار الشركة"
          style={{ width: "64px", height: "64px", objectFit: "contain", display: "block" }}
        />

        {/* English name – left */}
        <p style={{
          color: GREEN,
          fontWeight: 900,
          fontSize: "14px",
          margin: 0,
          whiteSpace: "nowrap",
          fontFamily: "'Cairo', sans-serif",
        }}>
          Jordan Vegetable Oil Industries Co. Ltd
        </p>
      </div>

      {/* ── Document title ── */}
      <div style={{ textAlign: "center", padding: "8px 0 8px", marginBottom: "12px" }}>
        <h1 style={{ fontSize: "17px", fontWeight: 900, color: BLACK, margin: "0 0 2px", letterSpacing: "0.3px" }}>
          نموذج تقييم الأداء السنوي
        </h1>
        <p style={{ fontSize: "15px", color: BLACK, margin: 0, fontWeight: 700, letterSpacing: "0.8px" }}>
           2026
        </p>
      </div>

      {/* ── Employee data summary ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "7px 20px",
          padding: "10px 16px",
          background: BLACK,
          borderRadius: "8px",
          border: `1px solid ${BLACK}`,
          fontSize: "12px",
          color: BLACK,
        }}
      >
        {[
          { label: "اسم الموظف", value: employeeInfo.name },
          { label: "الدائرة", value: employeeInfo.department },
          { label: "المسمى الوظيفي", value: employeeInfo.jobTitle },
          { label: "المدير المباشر", value: employeeInfo.evaluatorName },
          { label: "سنة التعيين", value: employeeInfo.hireYear },
          { label: "تاريخ التقييم", value: dateStr },
          { label: "النتيجة الإجمالية", value: totalScore > 0 ? `${totalScore.toFixed(1)}%` : "—" },
          { label: "التقدير", value: scoreLabel },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", gap: "4px", alignItems: "baseline" }}>
            <span style={{ fontWeight: 800, color: BLACK, whiteSpace: "nowrap" }}>{label}:</span>
            <span style={{ color: "#222", fontWeight: 600 }}>{value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
