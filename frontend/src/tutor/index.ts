// Future provider boundary. The app currently uses deterministic error explanations,
// not an AI service. Never put provider secrets in Vite public variables.
export interface TutorRequest {
  code: string;
  error?: string;
  lessonId: string;
  hintLevel: number;
}
export interface TutorReply {
  explanation: string;
  nextQuestion?: string;
  source: "ai";
}
export interface TutorProvider {
  ask(request: TutorRequest, signal: AbortSignal): Promise<TutorReply>;
}
export const tutorAvailability = {
  enabled: false,
  label: "AI tutor · Coming soon",
} as const;
