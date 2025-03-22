import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
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

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  // Improved debug logging
  console.group('Quiz State Update');
  console.log('Action:', JSON.stringify(action, null, 2));
  console.log('Current State:', JSON.stringify({
    action: action.type,
    isLoading: state.isLoading,
    currentQuestion: state.currentQuestion,
    questionsCount: state.questions.length,
    answersCount: Object.keys(state.answers).length,
    isComplete: state.isComplete,
    questions: state.questions.map(q => ({ id: q.id, text: q.text.substring(0, 30) + '...' }))
  }, null, 2));
  console.groupEnd();

  switch (action.type) {
    case 'START_QUIZ': {
      // Validate questions before starting
      if (!Array.isArray(state.questions) || state.questions.length === 0) {
        console.error('Cannot start quiz: Questions not loaded');
        return {
          ...state,
          isLoading: true // Keep loading if no questions
        };
      }

      // Prevent starting if already in progress
      if (!state.isLoading && Object.keys(state.answers).length > 0) {
        console.warn('Quiz already in progress');
        return state;
      }

      console.log('Starting quiz with questions:', JSON.stringify({
        questionCount: state.questions.length,
        firstQuestion: state.questions[0]
      }, null, 2));

      return {
        ...state,
        currentQuestion: 0,
        answers: {},
        categoryScores: {
          process: 0,
          strategy: 0,
          insight: 0,
          culture: 0
        },
        categoryPercentages: {
          process: 0,
          strategy: 0,
          insight: 0,
          culture: 0
        },
        scores: {
          process: 0,
          strategy: 0,
          insight: 0,
          culture: 0
        },
        totalScore: undefined,
        percentageScore: undefined,
        isComplete: false,
        isLoading: false // Set to false only after validation
      };
    }

    case 'ANSWER_QUESTION': {
      // Enhanced validation logging
      console.group('Answer Question Validation');
      console.log('Questions Array:', JSON.stringify({
        length: state.questions.length,
        currentQuestion: state.currentQuestion,
        questionExists: state.questions[state.currentQuestion] !== undefined
      }, null, 2));

      // Validate state before processing answer
      if (state.isLoading) {
        console.warn('Cannot answer question while loading');
        console.groupEnd();
        return state;
      }

      if (!Array.isArray(state.questions) || state.questions.length === 0) {
        console.error('Cannot answer question: No questions available');
        console.groupEnd();
        return state;
      }

      const questionId = action.questionId;
      const answer = action.answer;
      const questionIndex = parseInt(questionId);

      // Validate question index
      if (isNaN(questionIndex) || questionIndex < 0 || questionIndex >= state.questions.length) {
        console.error('Invalid question index:', JSON.stringify({
          questionId,
          questionsLength: state.questions.length
        }, null, 2));
        console.groupEnd();
        return state;
      }

      const question = state.questions[questionIndex];
      if (!question) {
        console.error('Question not found:', JSON.stringify({
          questionId,
          questionsLength: state.questions.length,
          questions: state.questions.map(q => q.id)
        }, null, 2));
        console.groupEnd();
        return state;
      }

      console.groupEnd();

      // Process answer
      const newAnswers = { ...state.answers, [questionId]: answer };
      const newCategoryScores = { ...state.categoryScores };
      const optionScore = question.options[answer].score;
      newCategoryScores[question.category] = (newCategoryScores[question.category] || 0) + optionScore;

      return {
        ...state,
        answers: newAnswers,
        categoryScores: newCategoryScores,
        isLoading: false
      };
    }

    case 'NEXT_QUESTION': {
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
      if (state.currentQuestion <= 0) {
        console.warn('Already at first question');
        return state;
      }
      return {
        ...state,
        currentQuestion: state.currentQuestion - 1
      };
    }

    case 'COMPLETE_QUIZ':
      // Validate all questions are answered
      const requiredCategories = ['process', 'strategy', 'insight', 'culture'] as const;
      const hasAllAnswers = Object.keys(state.answers).length === state.questions.length;
      
      if (!hasAllAnswers) {
        console.error('Cannot complete quiz: Not all questions answered', {
          answersCount: Object.keys(state.answers).length,
          totalQuestions: state.questions.length
        });
        return state;
      }

      // Calculate category percentages with improved validation
      const categoryPercentages = Object.entries(state.categoryScores).reduce((acc, [category, score]) => {
        const categoryKey = category as CategoryKey;
        const categoryQuestions = state.questions.filter(q => q.category === categoryKey).length;
        
        // Validate category questions count
        if (categoryQuestions === 0) {
          console.error(`No questions found for category: ${categoryKey}`);
          acc[categoryKey] = 0;
          return acc;
        }
        
        // Each question in category has max score of 4
        const maxCategoryScore = categoryQuestions * 4;
        
        // Validate score is within expected range
        if (score < 0 || score > maxCategoryScore) {
          console.error(`Invalid score for category ${categoryKey}:`, {
            score,
            maxScore: maxCategoryScore,
            questions: categoryQuestions
          });
          acc[categoryKey] = 0;
          return acc;
        }
        
        // Calculate percentage and round to 2 decimal places
        const categoryPercentage = Math.round((score / maxCategoryScore) * 100);
        
        console.log(`Category ${categoryKey} calculation:`, {
          score,
          maxScore: maxCategoryScore,
          questions: categoryQuestions,
          percentage: categoryPercentage
        });
        
        acc[categoryKey] = categoryPercentage;
        return acc;
      }, {
        process: 0,
        strategy: 0,
        insight: 0,
        culture: 0
      } as Record<CategoryKey, number>);

      // Calculate final score as average of category percentages and round to whole number
      const finalPercentageScore = Math.round(
        Object.values(categoryPercentages).reduce((sum, percentage) => sum + percentage, 0) / Object.keys(categoryPercentages).length
      );

      console.log('Completing quiz:', {
        categoryPercentages,
        finalScore: finalPercentageScore,
        answersCount: Object.keys(state.answers).length
      });

      return {
        ...state,
        categoryPercentages,
        percentageScore: finalPercentageScore,
        isComplete: true,
        isLoading: false
      };

    case 'RESET_QUIZ':
      return {
        ...initialState,
        questions: state.questions, // Preserve loaded questions
        isLoading: false
      };

    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.questions
      };

    default:
      console.warn('Unknown action type:', action.type);
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
  isLoading: true,
  questions: QUESTIONS // Initialize with questions immediately
};

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Initialize questions and validate state
  useEffect(() => {
    console.group('Quiz Provider Initialization');
    console.log('Questions Status:', JSON.stringify({
      questionsAvailable: QUESTIONS.length > 0,
      questionsCount: QUESTIONS.length,
      firstQuestion: QUESTIONS[0],
      stateQuestionsCount: state.questions.length,
      currentQuestion: state.currentQuestion,
      isLoading: state.isLoading
    }, null, 2));

    // Ensure questions are loaded
    if (QUESTIONS.length > 0 && (!state.questions.length || state.questions !== QUESTIONS)) {
      console.log('Initializing questions array');
      dispatch({ type: 'SET_QUESTIONS', questions: QUESTIONS });
    }

    // Start quiz only if not already started
    if (!state.isLoading && Object.keys(state.answers).length === 0) {
      console.log('Starting new quiz');
      dispatch({ type: 'START_QUIZ' });
    }
    
    console.groupEnd();
  }, [state.questions, state.isLoading, state.answers]);

  // Debug log for questions availability
  useEffect(() => {
    if (state.currentQuestion >= 0) {
      console.group('Question Access Validation');
      console.log('Current Question Status:', JSON.stringify({
        currentQuestionIndex: state.currentQuestion,
        questionsCount: state.questions.length,
        questionExists: state.questions[state.currentQuestion] !== undefined,
        currentQuestionData: state.questions[state.currentQuestion],
        isLoading: state.isLoading
      }, null, 2));
      console.groupEnd();
    }
  }, [state.questions, state.currentQuestion, state.isLoading]);

  // Prevent invalid current question
  useEffect(() => {
    if (state.currentQuestion >= state.questions.length) {
      console.error('Invalid question index detected:', JSON.stringify({
        currentQuestion: state.currentQuestion,
        questionsLength: state.questions.length,
        isLoading: state.isLoading
      }, null, 2));
      dispatch({ type: 'RESET_QUIZ' });
    }
  }, [state.currentQuestion, state.questions.length, state.isLoading]);

  // Log only meaningful state changes
  useEffect(() => {
    // Only log when specific state properties change
    const shouldLog = [
      state.isComplete,
      state.currentQuestion,
      Object.keys(state.answers).length,
      state.isLoading
    ];

    console.group('Quiz State Update');
    console.log('State changed:', {
      isLoading: state.isLoading,
      currentQuestion: state.currentQuestion,
      answersCount: Object.keys(state.answers).length,
      isComplete: state.isComplete,
      categoryScores: state.categoryScores,
      categoryPercentages: state.categoryPercentages
    });
    console.groupEnd();
  }, [
    state.isComplete,
    state.currentQuestion,
    state.answers,
    state.isLoading
  ]);

  // Optimize state updates with useMemo
  const memoizedState = useMemo(() => ({
    currentQuestion: state.currentQuestion,
    answers: state.answers,
    categoryScores: state.categoryScores,
    categoryPercentages: state.categoryPercentages,
    scores: state.scores,
    totalScore: state.totalScore,
    percentageScore: state.percentageScore,
    isComplete: state.isComplete,
    isLoading: state.isLoading,
    email: state.email,
    userData: state.userData,
    questions: QUESTIONS // Use QUESTIONS directly instead of state.questions
  }), [
    state.currentQuestion,
    state.answers,
    state.categoryScores,
    state.categoryPercentages,
    state.scores,
    state.totalScore,
    state.percentageScore,
    state.isComplete,
    state.isLoading,
    state.email,
    state.userData
  ]);

  // Optimize dispatch with useCallback
  const memoizedDispatch = useCallback((action: QuizAction) => {
    // Only log specific actions
    if (['START_QUIZ', 'COMPLETE_QUIZ', 'ANSWER_QUESTION'].includes(action.type)) {
      console.group(`Quiz Action: ${action.type}`);
      console.log('Action:', {
        type: action.type,
        payload: action.type === 'ANSWER_QUESTION' ? {
          questionId: action.questionId,
          answer: action.answer
        } : undefined
      });
      console.log('Current State:', {
        currentQuestion: state.currentQuestion,
        answersCount: Object.keys(state.answers).length,
        isComplete: state.isComplete,
        isLoading: state.isLoading
      });
      console.groupEnd();
    }
    
    dispatch(action);
  }, [dispatch]);

  return (
    <QuizContext.Provider value={{ state: memoizedState, dispatch: memoizedDispatch }}>
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