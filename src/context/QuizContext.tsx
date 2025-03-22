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
  // Debug logging for state transitions
  if (action.type !== 'SET_LOADING') {
    console.group(`Quiz Action: ${action.type}`);
    console.log('Action:', { type: action.type, payload: action });
    console.log('Current State:', {
      currentQuestion: state.currentQuestion,
      questionsCount: state.questions.length,
      answersCount: Object.keys(state.answers).length,
      isLoading: state.isLoading,
      hasQuestions: state.questions.length > 0,
      answers: state.answers
    });
    console.groupEnd();
  }

  switch (action.type) {
    case 'START_QUIZ': {
      // Prevent starting if no questions available
      if (!Array.isArray(state.questions) || state.questions.length === 0) {
        console.error('Cannot start quiz: No questions available');
        return {
          ...state,
          isLoading: true
        };
      }

      // Prevent restarting if already in progress
      if (Object.keys(state.answers).length > 0) {
        console.warn('Quiz already in progress, ignoring START_QUIZ');
        return state;
      }

      // Start fresh with initial state but preserve questions
      return {
        ...initialState,
        questions: state.questions,
        currentQuestion: 0,
        isLoading: false
      };
    }

    case 'ANSWER_QUESTION': {
      const questionId = action.questionId;
      
      // Skip if already answered or loading
      if (state.isLoading) {
        console.warn('Cannot answer while loading');
        return state;
      }

      // Validate question index
      const questionIndex = parseInt(questionId);
      if (isNaN(questionIndex) || questionIndex < 0 || questionIndex >= state.questions.length) {
        console.error('Invalid question index:', { questionIndex, totalQuestions: state.questions.length });
        return state;
      }

      // Prevent duplicate answers
      if (typeof state.answers[questionIndex] !== 'undefined') {
        console.warn('Question already answered:', questionIndex);
        return state;
      }

      const question = state.questions[questionIndex];
      if (!question) {
        console.error('Question not found:', { questionIndex, questions: state.questions.length });
        return state;
      }

      // Update answers and scores
      const newAnswers = { ...state.answers, [questionIndex]: action.answer };
      const newCategoryScores = { ...state.categoryScores };
      const optionScore = question.options[action.answer].score;
      newCategoryScores[question.category] = (newCategoryScores[question.category] || 0) + optionScore;

      return {
        ...state,
        answers: newAnswers,
        categoryScores: newCategoryScores
      };
    }

    case 'NEXT_QUESTION': {
      // Validate current question before incrementing
      if (state.currentQuestion >= state.questions.length - 1) {
        console.warn('Already at last question');
        return state;
      }

      return {
        ...state,
        currentQuestion: state.currentQuestion + 1
      };
    }

    case 'PREVIOUS_QUESTION': {
      // Validate current question before decrementing
      if (state.currentQuestion <= 0) {
        console.warn('Already at first question');
        return state;
      }

      return {
        ...state,
        currentQuestion: state.currentQuestion - 1
      };
    }

    case 'RESET_QUIZ':
      // Preserve questions but reset everything else
      return {
        ...initialState,
        questions: state.questions
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
    questions: QUESTIONS, // Initialize with questions
    isLoading: false // Start with loading false since we have questions
  });
  const [hasInitialized, setHasInitialized] = useState(false);

  // Single initialization effect
  useEffect(() => {
    if (!hasInitialized && state.questions.length > 0) {
      console.group('Quiz Initialization');
      console.log('Initializing quiz:', {
        questionCount: state.questions.length,
        currentQuestion: state.currentQuestion,
        hasAnswers: Object.keys(state.answers).length > 0
      });

      setHasInitialized(true);
      
      // Only start if not already in progress
      if (Object.keys(state.answers).length === 0) {
        dispatch({ type: 'START_QUIZ' });
      }
      
      console.groupEnd();
    }
  }, [hasInitialized, state.questions.length, state.answers]);

  // Question validation effect
  useEffect(() => {
    if (hasInitialized && state.questions.length > 0) {
      if (state.currentQuestion >= state.questions.length) {
        console.error('Invalid question index, resetting to last valid question:', {
          current: state.currentQuestion,
          max: state.questions.length - 1
        });
        dispatch({ type: 'RESET_QUIZ' });
      }
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