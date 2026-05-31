import logo from "@assets/image_1779310449719.png";
import type { EmployeeInfo } from "../types";

interface PrintHeaderProps {
  employeeInfo: EmployeeInfo;
  totalScore: number;
}

const GREEN = "hsl(142,62%,22%)";
const BLACK = "hsl(0,0%,10%)";

export default function PrintHeader({ employeeInfo: _employeeInfo, totalScore: _totalScore }: PrintHeaderProps) {

  return (
    <div className="print-only mb-4" style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>

      {/* ── Brand bar: mirrors the Navbar layout ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "6px 20px",
          background: "#ffffff",
          marginBottom: "6px",
        }}
      >
        {/* Arabic name – right */}
        <p style={{
          color: GREEN,
          fontWeight: 900,
          fontSize: "18px",
          margin: 0,
          whiteSpace: "nowrap",
          fontFamily: "'Cairo', sans-serif",
          textAlign: "right",
          flex: "1",
        }}>
          شركة مصانع الزيوت النباتية الأردنية م.ع.م.
        </p>

        {/* Logo – center */}
        <img
          src={logo}
          alt="شعار الشركة"
          style={{ width: "100px", height: "100px", objectFit: "contain", display: "block", flexShrink: 0 }}
        />

        {/* English name – left */}
        <p style={{
          color: GREEN,
          fontWeight: 900,
          fontSize: "18px",
          margin: 0,
          whiteSpace: "nowrap",
          fontFamily: "'Cairo', sans-serif",
          textAlign: "left",
          flex: "1",
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

    </div>
  );
}
