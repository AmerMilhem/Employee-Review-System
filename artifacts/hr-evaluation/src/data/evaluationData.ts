import type { EvaluationCategory } from "../types";

export const EVALUATION_CATEGORIES: EvaluationCategory[] = [
  {
    id: "performance",
    title: "الأداء والنتائج",
    weight: 25,
    criteria: [
      { id: "perf_1", label: "تحقيق الأهداف" },
      { id: "perf_2", label: "جودة ونوعية نتائج العمل" },
      { id: "perf_3", label: "الاستغلال الأمثل للوقت" },
      { id: "perf_4", label: "التصرف في العمل كمالك للشركة والمحافظة على مصالحها" },
      { id: "perf_5", label: "القدرة على حل المشكلات" },
    ],
  },
  {
    id: "competence",
    title: "الكفاءة المهنية",
    weight: 20,
    criteria: [
      { id: "comp_1", label: "المهارات الوظيفية" },
      { id: "comp_2", label: "التعلم المستمر" },
      { id: "comp_3", label: "تطبيق المعرفة" },
      { id: "comp_4", label: "الدقة والانتباه للتفاصيل" },
      { id: "comp_5", label: "تنظيم العمل" },
    ],
  },
  {
    id: "quality",
    title: "الجودة والسلامة",
    weight: 15,
    criteria: [
      { id: "qual_1", label: "الالتزام بالجودة" },
      { id: "qual_2", label: "الالتزام بتعليمات السلامة والصحة المهنية" },
      { id: "qual_3", label: "تطبيق معايير سلامة الغذاء" },
      { id: "qual_4", label: "النظافة وترتيب مكان العمل" },
    ],
  },
  {
    id: "discipline",
    title: "الالتزام والانضباط",
    weight: 20,
    criteria: [
      { id: "disc_1", label: "الالتزام بالدوام الرسمي" },
      { id: "disc_2", label: "الالتزام بالإجراءات والسياسات" },
      { id: "disc_3", label: "القدرة على تحمل المسؤولية" },
      { id: "disc_4", label: "القدرة على تحمل ضغط العمل" },
    ],
  },
  {
    id: "communication",
    title: "التواصل والعمل الجماعي",
    weight: 15,
    criteria: [
      { id: "comm_1", label: "العمل الجماعي" },
      { id: "comm_2", label: "التواصل الفعال مع الآخرين" },
      { id: "comm_3", label: "التعاون ما بين الأقسام" },
    ],
  },
  {
    id: "innovation",
    title: "الابتكار والتطوير",
    weight: 5,
    criteria: [
      { id: "innov_1", label: "المبادرة" },
      { id: "innov_2", label: "تقديم أفكار تطويرية" },
      { id: "innov_3", label: "الاستجابة للتغيير" },
      { id: "innov_4", label: "التحسين المستمر" },
    ],
  },
];

export const SCORE_LABELS: Record<number, string> = {
  1: "ضعيف",
  2: "دون المستوى",
  3: "مقبول",
  4: "متوسط",
  5: "جيد",
  6: "جيد جداً",
  7: "متميز",
  8: "قوي",
  9: "ممتاز جداً",
  10: "ممتاز",
};

const _today = new Date();

export const INITIAL_EMPLOYEE_INFO = {
  employeeId: "",
  name: "",
  department: "",
  jobTitle: "",
  evaluatorName: "",
  year: String(_today.getFullYear()),
  month: String(_today.getMonth() + 1).padStart(2, "0"),
  day: String(_today.getDate()).padStart(2, "0"),
  hireYear: "",
};

export const INITIAL_COMMENTS = {
  strengths: "",
  weaknesses: "",
  recommendations: "",
};
