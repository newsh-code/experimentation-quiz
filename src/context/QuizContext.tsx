import React, { createContext, useContext, useReducer } from 'react';
import { QUESTIONS } from '../data/questions';

interface QuizState {
  currentQuestionIndex: number;
  answers: { [key: number]: number };
  scores: {
    process: number;
    strategy: number;
    insight: number;
    culture: number;
  };
  email: string | null;
  isLoading: boolean;
  isQuizComplete: boolean;
  userData: {
    name?: string;
    company?: string;
    timestamp?: string;
  } | null;
}

type QuizAction =
  | { type: 'START_QUIZ' }
  | { type: 'ANSWER_QUESTION'; questionId: number; answer: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'GO_TO_EMAIL' }
  | { type: 'SUBMIT_EMAIL'; email: string; userData: any }
  | { type: 'SKIP_EMAIL' }
  | { type: 'CALCULATE_SCORES' }
  | { type: 'SET_LOADING'; isLoading: boolean };

const initialState: QuizState = {
  currentQuestionIndex: 0,
  answers: {},
  scores: {
    process: 0,
    strategy: 0,
    insight: 0,
    culture: 0,
  },
  email: null,
  isLoading: false,
  isQuizComplete: false,
  userData: null,
};

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...initialState,
        currentQuestionIndex: 0,
      };

    case 'ANSWER_QUESTION':
      const newAnswers = {
        ...state.answers,
        [action.questionId]: action.answer,
      };
      
      // Check if this was the last question
      const isLastQuestion = action.questionId === QUESTIONS.length - 1;
      const allQuestionsAnswered = Object.keys(newAnswers).length === QUESTIONS.length;
      
      // Calculate scores if all questions are answered
      let newScores = { ...state.scores };
      if (allQuestionsAnswered) {
        const finalScores = {
          process: 0,
          strategy: 0,
          insight: 0,
          culture: 0,
        };

        // Count questions per category
        const categoryCounts = {
          process: 0,
          strategy: 0,
          insight: 0,
          culture: 0,
        };
        
        // First pass: count questions per category
        QUESTIONS.forEach(question => {
          if (question.category in categoryCounts) {
            categoryCounts[question.category as keyof typeof categoryCounts]++;
          }
        });

        // Second pass: calculate normalized scores
        Object.entries(newAnswers).forEach(([questionId, answer]) => {
          const question = QUESTIONS[parseInt(questionId)];
          if (question && question.category in finalScores) {
            // Add 1 to answer since it's 0-based but we want 1-4 scale
            finalScores[question.category as keyof typeof finalScores] += (answer + 1);
          }
        });

        // Normalize scores to percentages (1-4 scale to 0-100%)
        Object.keys(finalScores).forEach(category => {
          if (category in categoryCounts) {
            const maxScore = categoryCounts[category as keyof typeof categoryCounts] * 4;
            finalScores[category as keyof typeof finalScores] = Math.round((finalScores[category as keyof typeof finalScores] / maxScore) * 100);
          }
        });

        newScores = finalScores;
        
        console.log('Calculating final scores:', {
          rawScores: finalScores,
          categoryCounts,
          totalAnswers: Object.keys(newAnswers).length,
          hasAllAnswers: allQuestionsAnswered,
          questionsPerCategory: categoryCounts
        });
      }
      
      console.log('Answer recorded in context:', {
        questionId: action.questionId,
        answer: action.answer,
        totalAnswers: Object.keys(newAnswers).length,
        isLastQuestion,
        allQuestionsAnswered,
        currentValue: newAnswers[action.questionId]
      });

      return {
        ...state,
        answers: newAnswers,
        scores: newScores,
        isQuizComplete: isLastQuestion && allQuestionsAnswered,
      };

    case 'NEXT_QUESTION':
      // Prevent going beyond the last question
      if (state.currentQuestionIndex >= QUESTIONS.length - 1) {
        return state;
      }

      // Ensure current question is answered
      const currentAnswer = state.answers[state.currentQuestionIndex];
      if (currentAnswer === undefined) {
        console.log('Cannot proceed: current question not answered', {
          currentQuestionIndex: state.currentQuestionIndex,
          answers: state.answers
        });
        return state;
      }

      console.log('Moving to next question:', {
        fromIndex: state.currentQuestionIndex,
        toIndex: state.currentQuestionIndex + 1,
        currentAnswer,
        answers: state.answers
      });

      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      };

    case 'PREVIOUS_QUESTION':
      // Prevent going before the first question
      if (state.currentQuestionIndex <= 0) {
        return state;
      }
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex - 1,
      };

    case 'GO_TO_EMAIL':
      // Only proceed if all questions are answered
      const hasAllAnswers = Object.keys(state.answers).length === QUESTIONS.length;
      
      if (!hasAllAnswers) {
        console.log('Cannot proceed to email: not all questions answered');
        return state;
      }
      
      // Calculate scores before proceeding
      const finalScores = {
        process: 0,
        strategy: 0,
        insight: 0,
        culture: 0,
      };

      // Count questions per category
      const categoryCounts = {
        process: 0,
        strategy: 0,
        insight: 0,
        culture: 0,
      };
      
      // First pass: count questions per category
      QUESTIONS.forEach(question => {
        if (question.category in categoryCounts) {
          categoryCounts[question.category as keyof typeof categoryCounts]++;
        }
      });

      // Second pass: calculate normalized scores
      Object.entries(state.answers).forEach(([questionId, answer]) => {
        const question = QUESTIONS[parseInt(questionId)];
        if (question && question.category in finalScores) {
          // Add 1 to answer since it's 0-based but we want 1-4 scale
          finalScores[question.category as keyof typeof finalScores] += (answer + 1);
        }
      });

      // Normalize scores to percentages (1-4 scale to 0-100%)
      Object.keys(finalScores).forEach(category => {
        if (category in categoryCounts) {
          const maxScore = categoryCounts[category as keyof typeof categoryCounts] * 4; // 4 is max score per question
          finalScores[category as keyof typeof finalScores] = Math.round((finalScores[category as keyof typeof finalScores] / maxScore) * 100);
        }
      });

      console.log('Calculating final scores:', {
        rawScores: finalScores,
        categoryCounts,
        totalAnswers: Object.keys(state.answers).length,
        hasAllAnswers,
        questionsPerCategory: categoryCounts
      });

      return {
        ...state,
        scores: finalScores, // Store scores but don't mark as complete yet
        currentQuestionIndex: QUESTIONS.length - 1, // Keep at last question if going back
        isQuizComplete: false, // Don't mark as complete until email is submitted
      };

    case 'SUBMIT_EMAIL':
      console.log('Email submitted, marking quiz as complete');
      return {
        ...state,
        email: action.email,
        userData: action.userData,
        isQuizComplete: true, // Only mark as complete after email is submitted
      };

    case 'SKIP_EMAIL':
      return {
        ...state,
        isQuizComplete: true,
      };

    case 'CALCULATE_SCORES':
      // Calculate scores based on answers
      const scores = {
        process: 0,
        strategy: 0,
        insight: 0,
        culture: 0,
      };
      
      Object.entries(state.answers).forEach(([questionId, answer]) => {
        const question = QUESTIONS[parseInt(questionId)];
        if (question) {
          scores[question.category] += answer;
        }
      });

      return {
        ...state,
        scores,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };

    default:
      return state;
  }
}

const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
} | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
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