export type ReadingBlock = {
  source: string;
  translation: string;
};

export type ReadingStage =
  | "new"
  | "shadowing"
  | "parallel-reading"
  | "analysis"
  | "review";

export type Reading = {
  id: string;
  title: string;
  sourceLanguage: string;
  translationLanguage: string;
  stage: ReadingStage;
  notes: string;
  blocks: ReadingBlock[];
level: string;
audioPath?: string | null;
};

export type GenerateReadingRequest = {
  sourceLanguage: string;
  translationLanguage: string;
  topic: string;
  level?: string;
};

export type QuizQuestion = {
  question: string;
  options: [string, string, string];
  correctIndex: number;
};

export type Quiz = {
  questions: QuizQuestion[];
};