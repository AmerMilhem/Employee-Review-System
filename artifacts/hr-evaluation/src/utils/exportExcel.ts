import * as XLSX from "xlsx";
import type { EmployeeInfo, Scores, Comments, ScoreBreakdown } from "../types";
import { EVALUATION_CATEGORIES, SCORE_LABELS } from "../data/evaluationData";

export function exportToExcel(
  employeeInfo: EmployeeInfo,
  scores: Scores,
  comments: Comments,
  breakdown: ScoreBreakdown[],
  totalScore: number
) {
  const wb = XLSX.utils.book_new();

  /* ─── Sheet 1: ملخص التقييم ─── */
  const summaryData = [
    ["نظام تقييم الأداء السنوي", "", "", ""],
    ["", "", "", ""],
    ["بيانات الموظف", "", "", ""],
    ["الاسم الكامل", employeeInfo.name, "سنة التقييم", employeeInfo.year],
    ["القسم / الإدارة", employeeInfo.department, "اسم المقيِّم", employeeInfo.evaluatorName],
    ["المسمى الوظيفي", employeeInfo.jobTitle, "", ""],
    ["", "", "", ""],
    ["النتيجة الإجمالية", `${totalScore.toFixed(1)}%`, "", ""],
    [
      "التقدير",
      totalScore >= 85
        ? "ممتاز"
        : totalScore >= 70
          ? "جيد جداً"
          : totalScore >= 50
            ? "جيد"
            : "يحتاج تحسين",
      "",
      "",
    ],
    ["", "", "", ""],
    ["توزيع الدرجات حسب المحور", "", "", ""],
    ["المحور", "الوزن", "متوسط الدرجة", "النتيجة المئوية"],
  ];

  breakdown.forEach((b) => {
    const pct = b.rawAvg > 0 ? ((b.weightedScore / b.weight) * 100).toFixed(1) + "%" : "—";
    summaryData.push([b.title, `${b.weight}%`, b.rawAvg > 0 ? b.rawAvg.toFixed(2) : "—", pct]);
  });

  summaryData.push(["", "", "", ""]);
  summaryData.push(["التعليقات والتوصيات", "", "", ""]);
  summaryData.push(["نقاط القوة والإنجازات", comments.strengths || "—", "", ""]);
  summaryData.push(["نقاط الضعف ومجالات التحسين", comments.weaknesses || "—", "", ""]);
  summaryData.push(["توصيات المدير", comments.recommendations || "—", "", ""]);

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

  wsSummary["!cols"] = [
    { wch: 35 },
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(wb, wsSummary, "ملخص التقييم");

  /* ─── Sheet 2: التفاصيل الكاملة ─── */
  const detailRows: (string | number)[][] = [
    ["التفاصيل الكاملة للتقييم", "", "", ""],
    ["", "", "", ""],
    ["المحور", "المعيار", "الدرجة", "التقدير"],
  ];

  EVALUATION_CATEGORIES.forEach((cat) => {
    cat.criteria.forEach((criterion, i) => {
      const score = scores[criterion.id] || 0;
      detailRows.push([
        i === 0 ? cat.title : "",
        criterion.label,
        score > 0 ? score : "—",
        score > 0 ? SCORE_LABELS[score] : "—",
      ]);
    });
    detailRows.push(["", "", "", ""]);
  });

  const wsDetail = XLSX.utils.aoa_to_sheet(detailRows);

  wsDetail["!cols"] = [
    { wch: 28 },
    { wch: 55 },
    { wch: 12 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(wb, wsDetail, "التفاصيل الكاملة");

  /* ─── Export ─── */
  const empName = employeeInfo.name || "موظف";
  const year = employeeInfo.year || new Date().getFullYear();
  XLSX.writeFile(wb, `تقييم_${empName}_${year}.xlsx`);
}
