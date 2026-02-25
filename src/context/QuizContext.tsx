import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback, useState, useRef } from 'react';
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
  isStarted: boolean
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
      answers: state.answers,
      isComplete: state.isComplete,
      isStarted: state.isStarted,
      categoryScores: state.categoryScores,
      categoryPercentages: state.categoryPercentages
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

      // Prevent restarting if already in progress or complete
      if (state.isStarted || state.isComplete || Object.keys(state.answers).length > 0) {
        console.warn('Quiz already in progress or complete, ignoring START_QUIZ');
        return state;
      }

      // Initialize category scores with all required categories
      const initialCategoryScores = {
        process: 0,
        strategy: 0,
        insight: 0,
        culture: 0
      } as Record<CategoryKey, number>;

      // Start fresh with initial state but preserve questions
      return {
        ...initialState,
        questions: state.questions,
        currentQuestion: 0,
        isLoading: false,
        isComplete: false,
        isStarted: true,
        categoryScores: initialCategoryScores,
        categoryPercentages: initialCategoryScores
      };
    }

    case 'ANSWER_QUESTION': {
      const questionId = action.questionId;
      
      // Skip if already answered, loading, or quiz is complete
      if (state.isLoading || state.isComplete) {
        console.warn('Cannot answer while loading or after completion');
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

      console.group('Answer Processing');
      console.log('Question:', {
        id: question.id,
        category: question.category,
        answer: action.answer,
        options: question.options
      });

      // Update answers and scores
      const newAnswers = { ...state.answers, [questionIndex]: action.answer };
      const newCategoryScores = { ...state.categoryScores };
      const optionScore = question.options[action.answer].score;
      newCategoryScores[question.category] = (newCategoryScores[question.category] || 0) + optionScore;

      console.log('Updated scores:', {
        categoryScores: newCategoryScores,
        currentCategory: question.category,
        addedScore: optionScore
      });

      // Check if this was the last question
      const isLastQuestion = questionIndex === state.questions.length - 1;

      console.groupEnd();

      // For the last question, calculate all final scores atomically so the
      // results page always has valid data regardless of COMPLETE_QUIZ timing.
      if (isLastQuestion) {
        const totalScore = Object.values(newCategoryScores).reduce((sum, s) => sum + s, 0);
        const maxPossibleScore = state.questions.length * 4;
        const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);

        const categoryPercentages = Object.entries(newCategoryScores).reduce((acc, [category, score]) => {
          const categoryQuestions = state.questions.filter(q => q.category === category).length;
          const maxCategoryScore = categoryQuestions * 4;
          acc[category as CategoryKey] = Math.round((score / maxCategoryScore) * 100);
          return acc;
        }, { ...initialCategoryState } as Record<CategoryKey, number>);

        return {
          ...state,
          answers: newAnswers,
          categoryScores: newCategoryScores,
          categoryPercentages,
          scores: { ...categoryPercentages },
          totalScore,
          percentageScore,
          isComplete: true
        };
      }

      return {
        ...state,
        answers: newAnswers,
        categoryScores: newCategoryScores,
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

    case 'COMPLETE_QUIZ': {
      // Only allow completion if all questions are answered
      if (Object.keys(state.answers).length !== state.questions.length) {
        console.warn('Cannot complete quiz: Not all questions answered');
        return state;
      }

      console.group('Quiz Completion');
      console.log('Current state:', {
        answers: state.answers,
        categoryScores: state.categoryScores,
        questions: state.questions.map(q => ({ id: q.id, category: q.category }))
      });

      // Calculate final scores
      const totalScore = Object.values(state.categoryScores).reduce((sum, score) => sum + score, 0);
      const maxPossibleScore = state.questions.length * 4; // Max score per question is 4 (0-3)
      const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);

      // Calculate category percentages and ensure all categories are present
      const categoryPercentages = Object.entries(state.categoryScores).reduce((acc, [category, score]) => {
        const categoryQuestions = state.questions.filter(q => q.category === category).length;
        const maxCategoryScore = categoryQuestions * 4; // Max score per question is 4
        acc[category as CategoryKey] = Math.round((score / maxCategoryScore) * 100);
        return acc;
      }, { ...initialCategoryState } as Record<CategoryKey, number>);

      // Ensure all categories have scores
      const finalCategoryScores = { ...initialCategoryState } as Record<CategoryKey, number>;
      Object.entries(state.categoryScores).forEach(([category, score]) => {
        finalCategoryScores[category as CategoryKey] = score;
      });

      // Create scores object for results page - normalize to 0-100 range
      const scores = Object.entries(finalCategoryScores).reduce((acc, [category, score]) => {
        const categoryQuestions = state.questions.filter(q => q.category === category).length;
        const maxCategoryScore = categoryQuestions * 4;
        acc[category as CategoryKey] = Math.round((score / maxCategoryScore) * 100);
        return acc;
      }, { ...initialCategoryState } as Record<CategoryKey, number>);

      console.log('Calculated scores:', {
        totalScore,
        percentageScore,
        categoryScores: finalCategoryScores,
        categoryPercentages,
        scores,
        maxPossibleScore,
        questionsPerCategory: Object.entries(state.categoryScores).map(([category, _]) => ({
          category,
          count: state.questions.filter(q => q.category === category).length
        }))
      });
      console.groupEnd();

      return {
        ...state,
        totalScore,
        percentageScore,
        categoryScores: finalCategoryScores,
        categoryPercentages,
        scores,
        isComplete: true
      };
    }

    case 'RESET_QUIZ': {
      // Preserve questions but reset everything else
      return {
        ...initialState,
        questions: state.questions,
        isComplete: false,
        isStarted: false,
        categoryScores: { ...initialCategoryState },
        categoryPercentages: { ...initialCategoryState }
      };
    }

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
  isLoading: false,
  isStarted: false,
  questions: QUESTIONS
};

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, {
    ...initialState,
    questions: QUESTIONS,
    isLoading: false,
    isComplete: false
  });
  const initializationRef = useRef(false);
  const processingRef = useRef(false);
  const lastActionRef = useRef<string | null>(null);
  const actionQueueRef = useRef<QuizAction[]>([]);
  const lastAnswerRef = useRef<{ questionId: string; answer: number } | null>(null);

  // Process next action in queue
  const processNextAction = useCallback(() => {
    if (processingRef.current || actionQueueRef.current.length === 0) {
      return;
    }

    const action = actionQueueRef.current[0];
    
    // Skip if this is a duplicate of the last action
    if (lastActionRef.current === action.type) {
      console.log('Skipping duplicate action:', action.type);
      actionQueueRef.current.shift();
      if (actionQueueRef.current.length > 0) {
        requestAnimationFrame(processNextAction);
      }
      return;
    }

    processingRef.current = true;
    lastActionRef.current = action.type;

    try {
      dispatch(action);
    } finally {
      actionQueueRef.current.shift();
      processingRef.current = false;
      lastActionRef.current = null;
      
      // Process next action if available
      if (actionQueueRef.current.length > 0) {
        requestAnimationFrame(processNextAction);
      }
    }
  }, [dispatch]);

  // Wrap dispatch to prevent duplicate actions with improved queueing
  const safeDispatch = useCallback((action: QuizAction) => {
    // Skip if trying to start an already started quiz
    if (action.type === 'START_QUIZ' && state.isStarted) {
      console.log('Skipping START_QUIZ - quiz already started');
      return;
    }

    // Skip if trying to complete an already completed quiz
    if (action.type === 'COMPLETE_QUIZ' && state.isComplete) {
      console.log('Skipping COMPLETE_QUIZ - quiz already completed');
      return;
    }

    // Skip if trying to answer a question that's already answered
    if (action.type === 'ANSWER_QUESTION') {
      const questionId = parseInt(action.questionId);
      if (state.answers[questionId] !== undefined) {
        console.warn('Question already answered:', questionId);
        return;
      }

      // Skip if this is the same answer as the last one
      if (lastAnswerRef.current && 
          lastAnswerRef.current.questionId === action.questionId && 
          lastAnswerRef.current.answer === action.answer) {
        console.warn('Duplicate answer detected:', { questionId, answer: action.answer });
        return;
      }
      lastAnswerRef.current = { questionId: action.questionId, answer: action.answer };
    }

    // Add action to queue
    actionQueueRef.current.push(action);
    
    // Process queue if not already processing
    if (!processingRef.current) {
      requestAnimationFrame(processNextAction);
    }
  }, [state.isComplete, state.isStarted, state.answers, processNextAction]);

  // Single initialization effect
  useEffect(() => {
    if (!initializationRef.current && !state.isStarted && !state.isComplete) {
      initializationRef.current = true;
      console.log('Initializing quiz...');
      safeDispatch({ type: 'START_QUIZ' });
    }
  }, [state.isStarted, state.isComplete, safeDispatch]);

  // Question validation effect
  useEffect(() => {
    if (state.currentQuestion >= state.questions.length && !state.isComplete) {
      console.log('Invalid question index, resetting quiz');
      safeDispatch({ type: 'RESET_QUIZ' });
    }
  }, [state.currentQuestion, state.questions.length, state.isComplete, safeDispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      processingRef.current = false;
      lastActionRef.current = null;
      initializationRef.current = false;
      actionQueueRef.current = [];
      lastAnswerRef.current = null;
    };
  }, []);

  const value = useMemo(() => ({
    state,
    dispatch: safeDispatch
  }), [state, safeDispatch]);

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