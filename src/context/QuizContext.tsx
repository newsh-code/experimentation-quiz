import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { analytics } from '../services/analytics';

export type QuizState = {
  currentQuestionIndex: number;
  answers: Record<number, number>;
  scores: {
    overall: number;
    process: number;
    strategy: number;
    insight: number;
    culture: number;
  };
  email?: string;
  userData?: {
    name: string;
    company: string;
    timestamp: string;
  };
  isLoading: boolean;
  page: 'landing' | 'quiz' | 'email' | 'results';
};

export type ActionType =
  | { type: 'START_QUIZ' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'ANSWER_QUESTION'; questionId: number; answer: number }
  | { type: 'SUBMIT_EMAIL'; email: string; userData: any }
  | { type: 'SKIP_EMAIL' }
  | { type: 'GO_TO_EMAIL' }
  | { type: 'GO_TO_RESULTS' }
  | { type: 'RESET_QUIZ' }
  | { type: 'CALCULATE_SCORES' }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'RESTORE_STATE'; state: QuizState };

const STORAGE_KEY = 'quiz_state';

const initialState: QuizState = {
  currentQuestionIndex: 0,
  answers: {},
  scores: {
    process: 0,
    strategy: 0,
    insight: 0,
    culture: 0,
    overall: 0,
  },
  isLoading: false,
  page: 'landing',
};

function calculateScores(answers: Record<number, number>): QuizState['scores'] {
  const categoryScores = {
    process: 0,
    strategy: 0,
    insight: 0,
    culture: 0,
  };

  // Calculate scores for each category
  Object.entries(answers).forEach(([questionId, answer]) => {
    const id = parseInt(questionId);
    const category = Math.floor(id / 6); // 6 questions per category
    const normalizedScore = ((answer + 1) / 4) * 100; // Convert 0-3 to 25-100 scale

    switch (category) {
      case 0:
        categoryScores.process += normalizedScore;
        break;
      case 1:
        categoryScores.strategy += normalizedScore;
        break;
      case 2:
        categoryScores.insight += normalizedScore;
        break;
      case 3:
        categoryScores.culture += normalizedScore;
        break;
    }
  });

  // Calculate averages
  const numQuestions = 6; // questions per category
  const scores = {
    process: Math.round(categoryScores.process / numQuestions),
    strategy: Math.round(categoryScores.strategy / numQuestions),
    insight: Math.round(categoryScores.insight / numQuestions),
    culture: Math.round(categoryScores.culture / numQuestions),
    overall: 0,
  };

  // Calculate overall score
  scores.overall = Math.round(
    (scores.process + scores.strategy + scores.insight + scores.culture) / 4
  );

  return scores;
}

type QuizContextType = {
  state: QuizState;
  dispatch: React.Dispatch<ActionType>;
};

const QuizContext = createContext<QuizContextType | null>(null);
QuizContext.displayName = 'QuizContext';

async function sendToSlack(userData: QuizState['userData'], email: string, scores: QuizState['scores']) {
  try {
    const response = await fetch('YOUR_SLACK_WEBHOOK_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: `New Quiz Lead:\nName: ${userData?.name}\nCompany: ${userData?.company}\nEmail: ${email}\nOverall Score: ${Math.round(scores.overall)}%`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*New Quiz Lead*"
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Name:*\n${userData?.name}`
              },
              {
                type: "mrkdwn",
                text: `*Company:*\n${userData?.company}`
              },
              {
                type: "mrkdwn",
                text: `*Email:*\n${email}`
              },
              {
                type: "mrkdwn",
                text: `*Overall Score:*\n${Math.round(scores.overall)}%`
              }
            ]
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send to Slack');
    }
  } catch (error) {
    console.error('Error sending to Slack:', error);
  }
}

function quizReducer(state: QuizState, action: ActionType): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      analytics.trackQuizStart();
      return {
        ...state,
        page: 'quiz',
        isLoading: false,
      };
    case 'NEXT_QUESTION':
      if (state.currentQuestionIndex === 23) {
        const scores = calculateScores(state.answers);
        analytics.trackQuizComplete(scores);
        return {
          ...state,
          page: 'email',
          scores,
          isLoading: false,
        };
      }
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        isLoading: false,
      };
    case 'GO_TO_EMAIL':
      const scores = calculateScores(state.answers);
      analytics.trackQuizComplete(scores);
      return {
        ...state,
        page: 'email',
        scores,
        isLoading: false,
      };
    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        isLoading: false,
      };
    case 'ANSWER_QUESTION':
      analytics.trackQuestionAnswer(action.questionId, action.answer);
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: action.answer,
        },
        isLoading: false,
      };
    case 'SUBMIT_EMAIL':
      analytics.trackEmailSubmit(action.email);
      // Send to Slack
      if (state.userData) {
        sendToSlack(state.userData, action.email, state.scores);
      }
      return {
        ...state,
        email: action.email,
        page: 'results',
        isLoading: false,
      };
    case 'SKIP_EMAIL':
      analytics.trackEmailSkip();
      return {
        ...state,
        page: 'results',
        isLoading: false,
      };
    case 'CALCULATE_SCORES':
      return {
        ...state,
        scores: calculateScores(state.answers),
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case 'RESTORE_STATE':
      return {
        ...state,
        ...action.state,
        isLoading: false,
      };
    case 'RESET_QUIZ':
      return {
        ...initialState,
        page: 'landing'
      };
    case 'GO_TO_RESULTS':
      return {
        ...state,
        page: 'results',
      };
    default:
      return state;
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'RESTORE_STATE', state: parsedState });
      } catch (error) {
        console.error('Error restoring quiz state:', error);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

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