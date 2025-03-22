import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Memoize current question with validation
  const currentQuestion = useMemo(() => {
    if (!Array.isArray(state.questions) || state.questions.length === 0) {
      console.error('Questions array is invalid:', {
        isArray: Array.isArray(state.questions),
        length: state.questions?.length
      });
      return null;
    }

    if (state.currentQuestion < 0 || state.currentQuestion >= state.questions.length) {
      console.error('Current question index out of bounds:', {
        index: state.currentQuestion,
        length: state.questions.length
      });
      return null;
    }

    const question = state.questions[state.currentQuestion];
    if (!question) {
      console.error('Question not found at index:', state.currentQuestion);
      return null;
    }

    return question;
  }, [state.questions, state.currentQuestion]);

  const isLastQuestion = useMemo(() => 
    state.currentQuestion === state.questions.length - 1,
    [state.currentQuestion, state.questions.length]
  );

  // Single initialization effect
  useEffect(() => {
    if (!hasInitialized && state.questions.length > 0) {
      console.group('Quiz Page Mount');
      console.log('Initial State:', {
        hasInitialized,
        questionsCount: state.questions.length,
        currentQuestion: state.currentQuestion,
        hasAnswers: Object.keys(state.answers).length > 0
      });
      setHasInitialized(true);
      console.groupEnd();
    }
  }, [hasInitialized, state.questions.length, state.currentQuestion, state.answers]);

  // Navigation guard effect
  useEffect(() => {
    if (hasInitialized && state.questions.length > 0) {
      if (state.currentQuestion >= state.questions.length) {
        console.error('Invalid navigation state:', {
          currentQuestion: state.currentQuestion,
          totalQuestions: state.questions.length
        });
        router.push('/');
      }
    }
  }, [hasInitialized, state.questions.length, state.currentQuestion, router]);

  const handleAnswer = useCallback(async (value: number) => {
    if (isSubmitting || !currentQuestion) {
      console.warn('Cannot submit answer:', {
        isSubmitting,
        hasCurrentQuestion: !!currentQuestion
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.group('Answer Submission');
      console.log('Processing answer:', {
        questionIndex: state.currentQuestion,
        value,
        isLast: isLastQuestion,
        currentAnswers: state.answers
      });

      // Submit answer
      dispatch({
        type: 'ANSWER_QUESTION',
        questionId: state.currentQuestion.toString(),
        answer: value,
      });

      setSelectedValue(value);

      // Move to next question after a brief delay
      if (!isLastQuestion) {
        await new Promise(resolve => setTimeout(resolve, 300));
        dispatch({ type: 'NEXT_QUESTION' });
        setSelectedValue(undefined);
      }

      console.groupEnd();
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, isLastQuestion, isSubmitting, state.currentQuestion, currentQuestion, state.answers]);

  const handleSeeScoreClick = useCallback(async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log('Navigating to results page');
      await router.push('/results');
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [router, isSubmitting]);

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

  // Remove unnecessary logging effects
  
  // Keep the performance monitoring effect but reduce its frequency
  useEffect(() => {
    if (state.currentQuestion % 5 === 0) { // Only monitor every 5th question
      const startTime = performance.now();
      return () => {
        const endTime = performance.now();
        console.log('Performance Check:', {
          questionIndex: state.currentQuestion,
          duration: endTime - startTime
        });
      };
    }
  }, [state.currentQuestion]);

  // Keep smooth scroll effect
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [state.currentQuestion]);

  const handlePrevious = useCallback(() => {
    if (state.currentQuestion > 0) {
      dispatch({ type: 'PREVIOUS_QUESTION' });
    }
  }, [dispatch, state.currentQuestion]);

  // Fix callback dependencies
  const debouncedHandleKeyPress = React.useCallback(
    (e: KeyboardEvent) => {
      // Prevent handling if loading or no current question
      if (state.isLoading || !currentQuestion) {
        return;
      }

      // Handle number keys 1-4
      const numKey = parseInt(e.key);
      if (numKey >= 1 && numKey <= 4) {
        e.preventDefault();
        if (numKey <= currentQuestion.options.length) {
          handleAnswer(numKey - 1);
        }
        return;
      }

      // Handle Enter key
      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedValue !== undefined) {
          if (isLastQuestion) {
            handleSeeScoreClick();
          } else {
            dispatch({ type: 'NEXT_QUESTION' });
          }
        }
      }

      // Handle Escape key
      if (e.key === 'Escape' && state.currentQuestion > 0) {
        e.preventDefault();
        handlePrevious();
      }
    },
    [currentQuestion, dispatch, handleAnswer, handlePrevious, handleSeeScoreClick, isLastQuestion, selectedValue, state.currentQuestion, state.isLoading]
  );

  useEffect(() => {
    window.addEventListener('keydown', debouncedHandleKeyPress);
    return () => {
      window.removeEventListener('keydown', debouncedHandleKeyPress);
    };
  }, [debouncedHandleKeyPress]);

  // Loading state with improved validation
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Loading Quiz...</h1>
          <p className="text-muted-foreground">
            {!state.questions.length 
              ? "Preparing your questions..."
              : state.currentQuestion >= state.questions.length
                ? "Validating quiz state..."
                : "Loading your progress..."}
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