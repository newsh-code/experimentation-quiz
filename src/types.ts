export type CategoryKey = 'process' | 'strategy' | 'insight' | 'culture';
export type ScoreLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ScoreRange = 'low' | 'medium' | 'high';

export interface ScoreLevelInfo {
  color: 'red' | 'yellow' | 'green';
  label: string;
}

export interface Scores {
  process: number;
  strategy: number;
  insight: number;
  culture: number;
}

export interface QuizState {
  scores: Scores;
  isQuizComplete: boolean;
}

export type Question = {
  id: string;
  text: string;
  category: CategoryKey;
  options: Array<{
    text: string;
    score: number;
  }>;
}; 