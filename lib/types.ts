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
};

export type GenerateReadingRequest = {
  sourceLanguage: string;
  translationLanguage: string;
  topic: string;
  level?: string;
};