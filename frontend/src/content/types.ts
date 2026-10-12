export type LessonSection = {
  id: string;
  title: string;
  intro: string;
  paragraphs: string[];
  code?: string;
  output?: string;
  mistakes: string;
  practice: string;
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
};
