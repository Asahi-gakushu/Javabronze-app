export interface Question {
  id: string;
  prompt: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface TopicProgress {
  bestScore: number;
  total: number;
  attempts: number;
  lastPlayedAt: string;
}

export type ProgressMap = Record<string, TopicProgress>;
