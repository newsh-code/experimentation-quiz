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

  switch (action.type) {
    case 'START_QUIZ': {
      console.log('START_QUIZ action received:', {
        previousState: {
          isLoading: state.isLoading,
          currentQuestion: state.currentQuestion,
          answersCount: Object.keys(state.answers).length,
          questionsLength: state.questions?.length ?? 0
        }
      });

      // Ensure questions are loaded
      if (!QUESTIONS.length) {
        console.error('No questions available for quiz');
        return state;
      }

      // Reset all state properties
      const newState = {
        ...state,
        isLoading: true,
        currentQuestion: 0,
        answers: {},
        categoryScores: {
          process: 0,
          strategy: 0,
          insight: 0,
          culture: 0
        },
        totalScore: undefined,
        percentageScore: undefined,
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
        isComplete: false,
        email: undefined,
        userData: undefined,
        questions: QUESTIONS
      };

      console.log('New state after START_QUIZ:', {
        isLoading: newState.isLoading,
        currentQuestion: newState.currentQuestion,
        answersCount: Object.keys(newState.answers).length,
        questionsLength: newState.questions.length
      });

      return newState;
    }
    case 'ANSWER_QUESTION': {
      // Validate questions exist
      if (!state.questions?.length) {
        console.error('Quiz Error: No questions available', {
          state: {
            questionsLength: state.questions?.length,
            currentQuestion: state.currentQuestion
          }
        });
        return state;
      }

      // Calculate score for this answer
      const questionIndex = parseInt(action.questionId);
      const question = state.questions[questionIndex];
      
      // Log question and answer details
      console.log('Answer Processing:', {
        questionIndex,
        question: {
          text: question?.text,
          category: question?.category,
          optionsCount: question?.options?.length
        },
        answer: {
          index: action.answer,
          score: question?.options?.[action.answer]?.score
        }
      });

      // Special handling for initial state transition
      if (action.answer === 0 && Object.keys(state.answers).length === 0) {
        console.log('Initial State Transition:', {
          previousState: {
            isLoading: state.isLoading,
            currentQuestion: state.currentQuestion
          }
        });
        return {
          ...state,
          isLoading: false,
          currentQuestion: 0,
          answers: {},
          categoryScores: {
            process: 0,
            strategy: 0,
            insight: 0,
            culture: 0
          }
        };
      }
      
      // Validate question and answer
      if (!question || !question.options || action.answer < 0 || action.answer >= question.options.length) {
        console.error('Quiz Error: Invalid question or answer', {
          questionIndex,
          answer: action.answer,
          question: {
            exists: !!question,
            optionsCount: question?.options?.length
          }
        });
        return state;
      }

      // Get and validate score
      const score = question.options[action.answer]?.score ?? 0;
      if (score < 1 || score > 4) {
        console.error('Quiz Error: Invalid score detected', {
          score,
          questionIndex,
          answer: action.answer,
          options: question.options
        });
        return state;
      }

      // Calculate category scores
      const categoryScores = { ...state.categoryScores };
      const questionCategory = question.category as CategoryKey;
      categoryScores[questionCategory] += score;

      // Log score calculation
      console.log('Score Calculation:', {
        category: questionCategory,
        previousScore: state.categoryScores[questionCategory],
        newScore: categoryScores[questionCategory],
        totalAnswered: Object.keys(state.answers).length + 1,
        totalQuestions: state.questions.length,
        progress: ((Object.keys(state.answers).length + 1) / state.questions.length) * 100
      });

      const newState = {
        ...state,
        isLoading: false,
        answers: {
          ...state.answers,
          [action.questionId]: action.answer
        },
        categoryScores
      };

      // Log final state
      console.log('Answer Processing Complete:', {
        state: {
          currentQuestion: newState.currentQuestion,
          answersCount: Object.keys(newState.answers).length,
          categoryScores: newState.categoryScores,
          progress: (Object.keys(newState.answers).length / newState.questions.length) * 100
        }
      });

      return newState;
    }
    case 'NEXT_QUESTION': {
      // Validate next question index
      const nextIndex = state.currentQuestion + 1;
      if (nextIndex >= QUESTIONS.length) {
        console.warn('Attempted to navigate beyond last question');
        return state;
      }
      return {
        ...state,
        currentQuestion: nextIndex
      };
    }
    case 'PREVIOUS_QUESTION': {
      // Validate previous question index
      const prevIndex = state.currentQuestion - 1;
      if (prevIndex < 0) {
        console.warn('Attempted to navigate before first question');
        return state;
      }
      return {
        ...state,
        currentQuestion: prevIndex
      };
    }
    case 'COMPLETE_QUIZ': {
      console.log('Processing COMPLETE_QUIZ action:', {
        currentState: state,
        questionsLength: state.questions?.length,
        answersLength: Object.keys(state.answers).length
      });

      // Validate state
      if (!state.questions?.length) {
        console.error('Cannot complete quiz: No questions available');
        return state;
      }

      // Ensure all required categories have scores
      const requiredCategories: CategoryKey[] = ['process', 'strategy', 'insight', 'culture'];
      const missingCategories = requiredCategories.filter(cat => !state.categoryScores[cat]);
      
      if (missingCategories.length > 0) {
        console.error('Cannot complete quiz: Missing category scores:', missingCategories);
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

      console.log('Quiz completion calculations:', {
        categoryPercentages,
        categoryScores: state.categoryScores,
        questionsPerCategory: Object.entries(state.categoryScores).map(([cat, _]) => ({
          category: cat,
          count: state.questions.filter(q => q.category === cat).length
        })),
        finalPercentageScore
      });

      // Return new state with all required fields
      return {
        ...state,
        categoryPercentages,
        percentageScore: finalPercentageScore,
        isComplete: true
      };
    }
    case 'RESET_QUIZ': {
      return {
        currentQuestion: 0,
        answers: {},
        categoryScores: {
          process: 0,
          strategy: 0,
          insight: 0,
          culture: 0
        },
        totalScore: undefined,
        percentageScore: undefined,
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
        isComplete: false,
        isLoading: false,
        questions: QUESTIONS
      }
    }
    case 'SUBMIT_EMAIL': {
      return {
        ...state,
        email: action.email,
        userData: action.userData
      }
    }
    case 'SKIP_EMAIL': {
      return {
        ...state,
        email: undefined,
        userData: undefined
      }
    }
    default:
      return state
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