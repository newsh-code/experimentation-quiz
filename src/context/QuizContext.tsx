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

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  // Add structured debug logging
  console.log('Quiz State Update:', {
    action: action.type,
    currentState: {
      isLoading: state.isLoading,
      isComplete: state.isComplete,
      currentQuestion: state.currentQuestion,
      answersCount: Object.keys(state.answers).length,
      categoryScores: state.categoryScores
    }
  });

  switch (action.type) {
    case 'START_QUIZ':
      // Prevent multiple starts if quiz is already in progress
      if (!state.isLoading && state.currentQuestion === 0) {
        console.log('Starting new quiz...');
        return {
          ...state,
          isLoading: true,
          isComplete: false,
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
          percentageScore: 0
        };
      }
      console.log('Quiz already in progress, ignoring START_QUIZ');
      return state;

    case 'ANSWER_QUESTION':
      // Validate question ID and answer
      const questionId = action.questionId;
      const answer = action.answer;
      
      if (questionId === undefined || answer === undefined) {
        console.error('Invalid answer data:', { questionId, answer });
        return state;
      }

      // Get the question to validate the answer
      const question = state.questions.find(q => q.id.toString() === questionId);
      if (!question) {
        console.error('Question not found:', questionId);
        return state;
      }

      // Validate answer is within valid range
      if (answer < 0 || answer >= question.options.length) {
        console.error('Invalid answer value:', { questionId, answer, optionsLength: question.options.length });
        return state;
      }

      // Update answer and calculate category score
      const newAnswers = { ...state.answers, [questionId]: answer };
      const newCategoryScores = { ...state.categoryScores };
      const optionScore = question.options[answer].score;
      
      // Update category score
      newCategoryScores[question.category] = (newCategoryScores[question.category] || 0) + optionScore;

      console.log('Updating answer:', {
        questionId,
        answer,
        score: optionScore,
        category: question.category,
        newCategoryScore: newCategoryScores[question.category]
      });

      return {
        ...state,
        answers: newAnswers,
        categoryScores: newCategoryScores,
        isLoading: false
      };

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
      console.log('Resetting quiz state');
      return {
        ...state,
        isLoading: false,
        isComplete: false,
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
        percentageScore: 0
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
  isLoading: false,
  questions: []
};

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Log state changes
  useEffect(() => {
    console.log('Quiz state updated:', {
      isLoading: state.isLoading,
      currentQuestion: state.currentQuestion,
      answersCount: Object.keys(state.answers).length,
      questionsLength: state.questions?.length ?? 0,
      isComplete: state.isComplete,
      categoryScores: state.categoryScores,
      categoryPercentages: state.categoryPercentages
    });
  }, [state]);

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
    questions: state.questions
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
    state.userData,
    state.questions
  ]);

  // Optimize dispatch with useCallback
  const memoizedDispatch = useCallback((action: QuizAction) => {
    console.log('QuizReducer Debug:', {
      action: {
        type: action.type,
        payload: action.type === 'ANSWER_QUESTION' ? {
          questionId: action.questionId,
          answer: action.answer
        } : undefined
      },
      state: {
        currentQuestion: state.currentQuestion,
        answersCount: Object.keys(state.answers).length,
        totalQuestions: state.questions?.length ?? 0,
        categoryScores: state.categoryScores,
        isComplete: state.isComplete,
        isLoading: state.isLoading
      }
    });
    dispatch(action);
  }, [dispatch, state]);

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