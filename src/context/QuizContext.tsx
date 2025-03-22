import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback, useState } from 'react';
import { QUESTIONS, type Question } from '../data/questions';
import { type CategoryKey } from '../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export type UserData = {
  name?: string;
  company?: string;
  role?: string;
}

export type QuizState = {
  currentQuestion: number
  answers: Record<number, number>
  categoryScores: Record<CategoryKey, number>
  categoryPercentages: Record<CategoryKey, number>
  scores: Record<CategoryKey, number>
  totalScore?: number
  percentageScore?: number
  isComplete: boolean
  isLoading: boolean
  email?: string
  userData?: UserData
  questions: Question[]
}

type QuizAction =
  | { type: 'START_QUIZ' }
  | { type: 'ANSWER_QUESTION'; questionId: string; answer: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ' }
  | { type: 'SUBMIT_EMAIL'; email: string; userData: UserData }
  | { type: 'SKIP_EMAIL' }
  | { type: 'SET_QUESTIONS'; questions: Question[] }
  | { type: 'SET_LOADING'; isLoading: boolean }

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  // Limit logging to prevent console flooding
  if (action.type !== 'SET_LOADING') {
    console.group(`Quiz Action: ${action.type}`);
    console.log('Action:', { type: action.type, payload: action });
    console.log('Current State:', {
      currentQuestion: state.currentQuestion,
      questionsCount: state.questions.length,
      answersCount: Object.keys(state.answers).length,
      isLoading: state.isLoading,
      hasQuestions: state.questions.length > 0
    });
    console.groupEnd();
  }

  switch (action.type) {
    case 'START_QUIZ': {
      // Prevent starting if already in progress or no questions
      if (Object.keys(state.answers).length > 0) {
        console.warn('Quiz already in progress, ignoring START_QUIZ');
        return state;
      }

      if (!Array.isArray(state.questions) || state.questions.length === 0) {
        console.error('Cannot start quiz: No questions available');
        return {
          ...state,
          isLoading: true // Keep loading if no questions
        };
      }

      // Start fresh with initial state but keep questions
      return {
        ...initialState,
        questions: state.questions,
        isLoading: false,
        currentQuestion: 0
      };
    }

    case 'ANSWER_QUESTION': {
      const questionId = action.questionId;
      const answer = action.answer;

      // Skip if already answered or loading
      if (state.isLoading || state.answers[questionId] !== undefined) {
        return state;
      }

      const questionIndex = parseInt(questionId);
      if (isNaN(questionIndex) || questionIndex < 0 || questionIndex >= state.questions.length) {
        console.error('Invalid question index:', questionIndex);
        return state;
      }

      const question = state.questions[questionIndex];
      if (!question) {
        console.error('Question not found:', questionIndex);
        return state;
      }

      const newAnswers = { ...state.answers, [questionId]: answer };
      const newCategoryScores = { ...state.categoryScores };
      const optionScore = question.options[answer].score;
      newCategoryScores[question.category] = (newCategoryScores[question.category] || 0) + optionScore;

      return {
        ...state,
        answers: newAnswers,
        categoryScores: newCategoryScores
      };
    }

    case 'NEXT_QUESTION': {
      if (state.currentQuestion >= state.questions.length - 1) {
        return state;
      }
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1
      };
    }

    case 'PREVIOUS_QUESTION': {
      if (state.currentQuestion <= 0) {
        return state;
      }
      return {
        ...state,
        currentQuestion: state.currentQuestion - 1
      };
    }

    case 'RESET_QUIZ':
      return {
        ...initialState,
        questions: state.questions // Preserve questions
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading
      };

    default:
      return state;
  }
}

const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
} | null>(null);

const initialCategoryState = {
  process: 0,
  strategy: 0,
  insight: 0,
  culture: 0
} as const;

const initialState: QuizState = {
  currentQuestion: 0,
  answers: {},
  categoryScores: { ...initialCategoryState },
  categoryPercentages: { ...initialCategoryState },
  scores: { ...initialCategoryState },
  totalScore: undefined,
  percentageScore: undefined,
  isComplete: false,
  isLoading: false, // Start with loading false since we have questions
  questions: QUESTIONS // Initialize with questions immediately
};

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, {
    ...initialState,
    isLoading: !QUESTIONS.length // Start loading only if no questions
  });
  const [hasInitialized, setHasInitialized] = useState(false);

  // Improved initialization effect
  useEffect(() => {
    if (!hasInitialized && !state.isLoading && state.questions.length > 0) {
      console.group('Quiz Initialization');
      console.log('Starting quiz with:', {
        questionCount: state.questions.length,
        isLoading: state.isLoading,
        hasInitialized
      });
      setHasInitialized(true);
      dispatch({ type: 'START_QUIZ' });
      console.groupEnd();
    }
  }, [hasInitialized, state.isLoading, state.questions.length]);

  // Validate current question
  useEffect(() => {
    if (hasInitialized && state.currentQuestion >= state.questions.length) {
      console.error('Invalid question index detected:', {
        currentQuestion: state.currentQuestion,
        questionsLength: state.questions.length
      });
      dispatch({ type: 'RESET_QUIZ' });
    }
  }, [hasInitialized, state.currentQuestion, state.questions.length]);

  const value = useMemo(() => ({
    state,
    dispatch
  }), [state]);

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
} 