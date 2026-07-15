export type VocabularyItem = {
  word: string;
  translation: string;
  example: string;
};

export type HistoryEntry = {
  id: string;
  date: string; // ISO string
  topic: string;
  age: string;
  difficulty: string;
  words: VocabularyItem[];
};

export type QuizResult = {
  id: string;
  date: string;
  score: number;
  total: number;
};

