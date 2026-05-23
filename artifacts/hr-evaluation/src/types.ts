export interface EmployeeInfo {
  name: string;
  department: string;
  jobTitle: string;
  evaluatorName: string;
  year: string;
  month: string;
  day: string;
  hireYear: string;
}

export interface Criterion {
  id: string;
  label: string;
}

export interface EvaluationCategory {
  id: string;
  title: string;
  weight: number;
  criteria: Criterion[];
}

export interface Scores {
  [criterionId: string]: number;
}

export interface Comments {
  strengths: string;
  weaknesses: string;
  recommendations: string;
}

export interface EvaluationState {
  employeeInfo: EmployeeInfo;
  scores: Scores;
  comments: Comments;
}

export interface ScoreBreakdown {
  categoryId: string;
  title: string;
  weight: number;
  rawAvg: number;
  weightedScore: number;
}
