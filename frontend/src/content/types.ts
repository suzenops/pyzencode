export type LessonSection = {
  id: string;
  title: string;
  intro: string;
  paragraphs: string[];
  code?: string;
  output?: string;
  mistakes: string;
  practice: string;
  examples?: {
    id: string;
    title: string;
    code: string;
    output: string;
    notes: string;
  }[];
  breakdown?: { token: string; label: string; detail: string }[];
  table?: { headers: string[]; rows: string[][] };
  quickCheck?: QuizQuestion;
};
export type QuizQuestion = {
  id: string;
  question: string;
  options: { text: string; explanation: string }[];
  correct: number;
};
export type Exercise = {
  id: string;
  title: string;
  description: string;
  starter: string;
  expected: string;
  hints: string[];
  minPrints?: number;
  integer?: number;
  explanation: string;
  variables?: VariableRequirement[];
  cases?: GradingCase[];
  typeOf?: string;
  difficulty?: "Beginner" | "Intermediate" | "Challenge";
  assessment?: boolean;
  inputs?: string[];
};

export type VariableRequirement = {
  name: string;
  type: "int" | "float" | "str" | "bool";
  value: string;
  history?: string[];
};
export type GradingCase = {
  name: string;
  overrides: Record<string, string | number | boolean>;
  expected: string;
};
export type LessonContent = {
  id: string;
  number: number;
  level: number;
  title: string;
  subtitle: string;
  time: string;
  prerequisite?: string;
  sections: LessonSection[];
  quiz: QuizQuestion[];
  exercises: Exercise[];
  debugExercises?: Exercise[];
};
