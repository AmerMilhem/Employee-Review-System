import type { EvaluationCategory } from "../types";

export const EVALUATION_CATEGORIES: EvaluationCategory[] = [
  {
    id: "performance",
    title: "الأداء والنتائج",
    weight: 25,
    criteria: [
      { id: "perf_1", label: "تحقيق الأهداف والمؤشرات المحددة" },
      { id: "perf_2", label: "جودة العمل المنجز ومستوى الإتقان" },
      { id: "perf_3", label: "الإنتاجية والكفاءة في استخدام الموارد" },
      { id: "perf_4", label: "الالتزام بالمواعيد النهائية والتسليم في الوقت المحدد" },
      { id: "perf_5", label: "القدرة على تحقيق نتائج متميزة تحت الضغط" },
    ],
  },
  {
    id: "competence",
    title: "الكفاءة المهنية",
    weight: 20,
    criteria: [
      { id: "comp_1", label: "المعرفة التقنية والمهنية في مجال التخصص" },
      { id: "comp_2", label: "مهارات تحليل وحل المشكلات" },
      { id: "comp_3", label: "القدرة على اتخاذ القرارات السليمة" },
      { id: "comp_4", label: "التطوير المهني المستمر وتحديث المعرفة" },
      { id: "comp_5", label: "تطبيق أفضل الممارسات في مجال العمل" },
    ],
  },
  {
    id: "quality",
    title: "الجودة والسلامة",
    weight: 20,
    criteria: [
      { id: "qual_1", label: "الالتزام بمعايير الجودة المعتمدة" },
      { id: "qual_2", label: "الاهتمام بالتفاصيل والدقة في الإنجاز" },
      { id: "qual_3", label: "الالتزام بأنظمة وإجراءات السلامة المهنية" },
      { id: "qual_4", label: "تقليل الأخطاء والعمل على تصحيحها فور اكتشافها" },
    ],
  },
  {
    id: "discipline",
    title: "الالتزام والانضباط",
    weight: 15,
    criteria: [
      { id: "disc_1", label: "الحضور المنتظم والالتزام بأوقات العمل" },
      { id: "disc_2", label: "الالتزام بسياسات وأنظمة المؤسسة" },
      { id: "disc_3", label: "تسليم المهام والتقارير في المواعيد المحددة" },
      { id: "disc_4", label: "الاستجابة للتوجيهات والتعليمات الإدارية" },
    ],
  },
  {
    id: "communication",
    title: "التواصل والعمل الجماعي",
    weight: 10,
    criteria: [
      { id: "comm_1", label: "مهارات التواصل الفعال مع الزملاء والمدراء" },
      { id: "comm_2", label: "روح التعاون والمساهمة في نجاح الفريق" },
      { id: "comm_3", label: "المساهمة في خلق بيئة عمل إيجابية ومحفزة" },
      { id: "comm_4", label: "القدرة على تلقي وتقديم الملاحظات البناءة" },
    ],
  },
  {
    id: "innovation",
    title: "الابتكار والتحسين",
    weight: 10,
    criteria: [
      { id: "innov_1", label: "تقديم أفكار وحلول إبداعية للتحديات" },
      { id: "innov_2", label: "المبادرة في تحسين العمليات وآليات العمل" },
      { id: "innov_3", label: "التكيف مع التغييرات والمستجدات بمرونة" },
      { id: "innov_4", label: "المساهمة في تطوير منتجات أو خدمات جديدة" },
    ],
  },
];

export const SCORE_LABELS: Record<number, string> = {
  1: "ضعيف",
  2: "مقبول",
  3: "جيد",
  4: "جيد جداً",
  5: "ممتاز",
};

export const INITIAL_EMPLOYEE_INFO = {
  name: "",
  department: "",
  jobTitle: "",
  evaluatorName: "",
  year: new Date().getFullYear().toString(),
};

export const INITIAL_COMMENTS = {
  strengths: "",
  weaknesses: "",
  recommendations: "",
};
