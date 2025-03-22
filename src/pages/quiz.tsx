import React, { useState, useEffect, useCallback } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RadioGroup } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QUESTIONS } from '../data/questions';
import { Progress } from '../components/ui/Progress';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useRouter } from 'next/router';

export default function QuizPage() {
  const { state, dispatch } = useQuiz();
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [hasInitialized, setHasInitialized] = React.useState(false);
  
  const currentQuestion = state.currentQuestion < QUESTIONS.length 
    ? QUESTIONS[state.currentQuestion] 
    : null;
  const isLastQuestion = state.currentQuestion === QUESTIONS.length - 1;

  useEffect(() => {
    console.log('Quiz Page Mount:', {
      state: {
        isLoading: state.isLoading,
        currentQuestion: state.currentQuestion,
        answersCount: Object.keys(state.answers).length,
        isComplete: state.isComplete,
        questionsLoaded: state.questions?.length > 0,
        hasInitialized
      }
    });

    // Only initialize once when the page first loads and no answers exist
    if (!hasInitialized && !state.isLoading && Object.keys(state.answers).length === 0 && state.questions?.length > 0) {
      console.log('Quiz Initialization:', {
        previousState: {
          hasInitialized,
          isLoading: state.isLoading,
          answersCount: Object.keys(state.answers).length,
          questionsLength: state.questions.length
        }
      });
      
      // Set initialized flag first to prevent race conditions
      setHasInitialized(true);
      
      // Add a small delay to ensure state is synchronized
      const timer = setTimeout(() => {
        if (!state.isLoading && Object.keys(state.answers).length === 0) {
          dispatch({ type: 'START_QUIZ' });
        }
      }, 100);
      
      return () => {
        console.log('Cleaning up initialization timer');
        clearTimeout(timer);
      };
    }
  }, [dispatch, state.isLoading, state.answers, state.isComplete, state.questions, hasInitialized, state.currentQuestion, setHasInitialized]);

  // Handle loading state transition
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (state.isLoading) {
      console.log('Loading State Transition:', {
        state: {
          isLoading: state.isLoading,
          questionsLength: state.questions?.length,
          currentQuestion: state.currentQuestion
        }
      });
      
      if (state.questions?.length > 0) {
        timer = setTimeout(() => {
          console.log('Loading Timer Complete:', {
            state: {
              isLoading: state.isLoading,
              currentQuestion: state.currentQuestion
            }
          });
          dispatch({ type: 'ANSWER_QUESTION', questionId: '0', answer: 0 });
        }, 500);
      } else {
        console.error('Quiz Error: No questions available during loading transition', {
          state: {
            isLoading: state.isLoading,
            questionsLength: state.questions?.length
          }
        });
        dispatch({ type: 'RESET_QUIZ' });
        router.push('/');
      }
    }

    return () => {
      if (timer) {
        console.log('Loading Timer Cleanup');
        clearTimeout(timer);
      }
    };
  }, [state.isLoading, dispatch, state.questions, router, state.currentQuestion]);

  // Add error boundary for invalid states
  useEffect(() => {
    if (!state.questions?.length) {
      console.error('No questions available:', {
        currentQuestion: state.currentQuestion,
        isLoading: state.isLoading
      });
      dispatch({ type: 'RESET_QUIZ' });
      router.push('/');
      return;
    }

    if (state.currentQuestion >= state.questions.length) {
      console.error('Invalid question index detected:', {
        currentQuestion: state.currentQuestion,
        totalQuestions: state.questions.length,
        isLoading: state.isLoading
      });
      dispatch({ type: 'RESET_QUIZ' });
      router.push('/');
    }
  }, [state.currentQuestion, state.questions, dispatch, router, state.isLoading]);

  // Log state changes
  useEffect(() => {
    console.log('Quiz state updated:', {
      currentQuestionIndex: state.currentQuestion,
      totalQuestions: state.questions?.length ?? 0,
      isComplete: state.isComplete,
      answersCount: Object.keys(state.answers).length,
      isLoading: state.isLoading,
      currentQuestion: state.questions?.[state.currentQuestion]
    });
  }, [state.currentQuestion, state.answers, state.isComplete, state.isLoading, state.questions]);

  const getProgressPhrase = (progress: number, isLastQuestionAnswered: boolean) => {
    if (isLastQuestionAnswered && progress === 100) {
      return "Done! 🎉";
    }
    if (progress >= 75) {
      return "Almost finished! 🚀";
    }
    if (progress >= 50) {
      return "You&apos;re halfway there! 💪";
    }
    if (progress >= 25) {
      return "Great progress! 👍";
    }
    return "Just getting started! 🌟";
  };

  const progress = (state.currentQuestion / QUESTIONS.length) * 100;
  const isLastQuestionAnswered = state.answers[QUESTIONS.length - 1] !== undefined;
  const progressPhrase = getProgressPhrase(progress, isLastQuestionAnswered);

  const handleAnswer = useCallback(async (value: number) => {
    if (!state.questions?.length || isSubmitting) {
      console.error('Cannot submit answer:', {
        hasQuestions: !!state.questions?.length,
        isSubmitting
      });
      return;
    }

    const currentQuestion = state.questions[state.currentQuestion];
    if (!currentQuestion) {
      console.error('No current question available');
      return;
    }

    if (value < 0 || value >= currentQuestion.options.length) {
      console.error('Invalid answer value:', {
        value,
        optionsLength: currentQuestion.options.length,
        questionIndex: state.currentQuestion
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting answer:', {
        questionIndex: state.currentQuestion,
        answer: value,
        score: currentQuestion.options[value].score,
        isLoading: state.isLoading,
        questionsLength: state.questions.length
      });

      // Update selected value
      setSelectedValue(value);

      // First update the answer
      dispatch({
        type: 'ANSWER_QUESTION',
        questionId: state.currentQuestion.toString(),
        answer: value,
      });

      // Then move to next question after a short delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!isLastQuestion) {
        console.log('Moving to next question');
        dispatch({ type: 'NEXT_QUESTION' });
        // Reset selected value for next question
        setSelectedValue(undefined);
      } else {
        console.log('Last question answered, enabling See My Score button');
        // Keep the selected value for the last question
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, isLastQuestion, isSubmitting, state.currentQuestion, state.isLoading, state.questions, setSelectedValue, setIsSubmitting]);

  const handleSeeScoreClick = useCallback(async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log('Starting quiz completion...', {
        currentState: {
          answers: state.answers,
          categoryScores: state.categoryScores,
          isComplete: state.isComplete
        }
      });
      
      // First validate we have all answers
      const hasAllAnswers = Object.keys(state.answers).length === QUESTIONS.length;
      
      if (!hasAllAnswers) {
        console.error('Quiz completion failed: Not all questions answered');
        return;
      }
      
      // Dispatch complete action
      dispatch({ type: 'COMPLETE_QUIZ' });
      
      // Navigate to email capture page
      console.log('Navigating to email capture page...');
      await router.push('/email-capture');
      
    } catch (error) {
      console.error('Error completing quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, isSubmitting, state.answers, state.categoryScores, state.isComplete, router, setIsSubmitting]);

  const handlePrevious = useCallback(() => {
    if (state.currentQuestion > 0) {
      dispatch({ type: 'PREVIOUS_QUESTION' });
    }
  }, [dispatch, state.currentQuestion]);

  // Fix callback dependencies
  const debouncedHandleKeyPress = React.useCallback(
    (e: KeyboardEvent) => {
      console.log('Keyboard Event:', {
        key: e.key,
        state: {
          isLoading: state.isLoading,
          hasCurrentQuestion: !!currentQuestion,
          selectedValue,
          isLastQuestion,
          isSubmitting
        }
      });

      // Prevent handling if loading or no current question
      if (state.isLoading || !currentQuestion) {
        console.log('Ignoring key press - invalid state', {
          reason: state.isLoading ? 'loading' : 'no current question'
        });
        return;
      }

      // Handle number keys 1-4
      const numKey = parseInt(e.key);
      if (numKey >= 1 && numKey <= 4) {
        e.preventDefault();
        if (numKey <= currentQuestion.options.length) {
          console.log('Processing number key:', {
            key: numKey,
            optionsLength: currentQuestion.options.length,
            currentQuestion: state.currentQuestion
          });
          handleAnswer(numKey - 1);
        } else {
          console.log('Invalid number key for current question');
        }
        return;
      }

      // Handle Enter key
      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedValue !== undefined) {
          console.log('Processing Enter key:', {
            selectedValue,
            isLastQuestion,
            currentQuestion: state.currentQuestion
          });
          if (isLastQuestion) {
            handleSeeScoreClick();
          } else {
            dispatch({ type: 'NEXT_QUESTION' });
          }
        } else {
          console.log('Ignoring Enter key - no answer selected');
        }
      }

      // Handle Escape key
      if (e.key === 'Escape' && state.currentQuestion > 0) {
        e.preventDefault();
        console.log('Processing Escape key:', {
          currentQuestion: state.currentQuestion,
          previousQuestion: state.currentQuestion - 1
        });
        handlePrevious();
      }
    },
    [currentQuestion, dispatch, handleAnswer, handlePrevious, handleSeeScoreClick, isLastQuestion, isSubmitting, selectedValue, state.currentQuestion, state.isLoading]
  );

  useEffect(() => {
    window.addEventListener('keydown', debouncedHandleKeyPress);
    return () => {
      window.removeEventListener('keydown', debouncedHandleKeyPress);
    };
  }, [debouncedHandleKeyPress]);

  // Add UI state validation
  useEffect(() => {
    console.log('UI State Update:', {
      progress: {
        current: state.currentQuestion,
        total: QUESTIONS.length,
        percentage: (state.currentQuestion / QUESTIONS.length) * 100
      },
      state: {
        selectedValue,
        isSubmitting,
        isLoading: state.isLoading,
        answersCount: Object.keys(state.answers).length,
        categoryScores: state.categoryScores
      }
    });
  }, [state.currentQuestion, selectedValue, isSubmitting, state.isLoading, state.answers, state.categoryScores]);

  // Add error boundary for invalid states
  useEffect(() => {
    if (!state.questions?.length) {
      console.error('No questions available:', {
        currentQuestion: state.currentQuestion,
        isLoading: state.isLoading,
        questionsLength: state.questions?.length
      });
      dispatch({ type: 'RESET_QUIZ' });
      router.push('/');
      return;
    }

    if (state.currentQuestion >= state.questions.length) {
      console.error('Invalid question index detected:', {
        currentQuestion: state.currentQuestion,
        totalQuestions: state.questions.length,
        isLoading: state.isLoading,
        answers: state.answers
      });
      dispatch({ type: 'RESET_QUIZ' });
      router.push('/');
    }

    // Validate answer state
    if (selectedValue !== undefined && currentQuestion) {
      if (selectedValue < 0 || selectedValue >= currentQuestion.options.length) {
        console.error('Invalid answer state detected:', {
          selectedValue,
          optionsLength: currentQuestion.options.length,
          questionIndex: state.currentQuestion,
          question: currentQuestion
        });
        // Reset the invalid answer
        dispatch({
          type: 'ANSWER_QUESTION',
          questionId: state.currentQuestion.toString(),
          answer: 0
        });
      }
    }

    // Validate category scores
    if (state.categoryScores) {
      Object.entries(state.categoryScores).forEach(([category, score]) => {
        if (score < 0) {
          console.error('Invalid category score detected:', {
            category,
            score,
            currentQuestion: state.currentQuestion,
            answers: state.answers
          });
        }
      });
    }
  }, [state.currentQuestion, state.questions, dispatch, router, state.isLoading, selectedValue, currentQuestion, state.categoryScores, state.answers]);

  // Add performance monitoring
  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      console.log('Question Render Performance:', {
        metrics: {
          duration: endTime - startTime,
          questionIndex: state.currentQuestion,
          hasAnswer: selectedValue !== undefined
        }
      });
    };
  }, [state.currentQuestion, selectedValue]);

  // Add smooth scroll to top when question changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [state.currentQuestion]);

  useEffect(() => {
    if (state.questions?.length > 0) {
      setQuestionsLoaded(true);
    }
  }, [state.questions]);

  // Update selected value when navigating between questions
  useEffect(() => {
    // If we have an answer for the current question, set it as selected
    const currentAnswer = state.answers[state.currentQuestion];
    if (currentAnswer !== undefined) {
      setSelectedValue(currentAnswer);
    } else {
      setSelectedValue(undefined);
    }
    
    console.log('Question navigation:', {
      currentQuestion: state.currentQuestion,
      hasAnswer: currentAnswer !== undefined,
      selectedValue: currentAnswer
    });
  }, [state.currentQuestion, state.answers]);

  if (!questionsLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="text-center space-y-4">
          <LoadingSpinner size="large" />
          <p className="text-lg text-muted-foreground animate-pulse">
            Loading questions...
          </p>
        </div>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="text-center space-y-4">
          <LoadingSpinner size="large" />
          <p className="text-lg text-muted-foreground animate-pulse">
            Preparing your quiz...
          </p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div className="text-center space-y-4">
          <LoadingSpinner size="large" />
          <p className="text-lg text-muted-foreground animate-pulse">
            Loading questions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <motion.span
                key={progressPhrase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-muted-foreground"
              >
                {progressPhrase}
              </motion.span>
              <motion.span
                key={`${state.currentQuestion + 1}-${QUESTIONS.length}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm font-medium text-muted-foreground"
              >
                Question {state.currentQuestion + 1} of {QUESTIONS.length}
              </motion.span>
            </div>
            <Progress 
              value={progress} 
              className="h-2.5 bg-secondary/50"
            />
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={state.currentQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl font-bold mb-6">{currentQuestion?.text}</h2>
                  <RadioGroup
                    value={selectedValue}
                    onChange={handleAnswer}
                    className="space-y-4"
                    disabled={isSubmitting}
                  >
                    {currentQuestion?.options.map((option: { text: string; score: number }, index) => (
                      <RadioGroup.Option
                        key={index}
                        value={index}
                        className={({ checked }) =>
                          cn(
                            'relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none',
                            'hover:bg-accent/50 transition-colors duration-200',
                            'min-h-[80px] w-full',
                            checked
                              ? 'bg-primary text-primary-foreground border-2 border-primary'
                              : 'bg-card border-2 border-border hover:border-primary/50',
                            isSubmitting && 'opacity-50 cursor-not-allowed'
                          )
                        }
                      >
                        {({ checked }) => (
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center flex-1">
                              <div className="text-sm">
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-medium ${
                                    checked ? 'text-primary-foreground' : 'text-foreground'
                                  }`}
                                >
                                  <span className={cn(
                                    "inline-block w-8 font-semibold",
                                    checked ? "text-primary-foreground/80" : "text-muted-foreground"
                                  )}>
                                    {index + 1}.
                                  </span>{' '}
                                  <span className="inline-block align-middle">{option.text}</span>
                                </RadioGroup.Label>
                              </div>
                            </div>
                            {checked && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={cn(
                                  "flex items-center justify-center w-6 h-6",
                                  checked ? "text-primary-foreground" : "text-foreground"
                                )}
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </RadioGroup>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={state.currentQuestion === 0 || isSubmitting}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Previous
            </Button>
            {isLastQuestion && (
              <Button 
                onClick={handleSeeScoreClick}
                disabled={isSubmitting || selectedValue === undefined}
                className={cn(
                  "w-full h-11 font-medium shadow-lg hover:shadow-xl transition-all",
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                  (isSubmitting || selectedValue === undefined) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    Processing...
                    <LoadingSpinner size="small" />
                  </>
                ) : (
                  <>
                    See My Results
                    <svg 
                      className="ml-2 -mr-1 w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 