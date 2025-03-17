import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadioGroup, Transition } from '@headlessui/react';
import { useQuiz } from '../context/QuizContext';
import { QUESTIONS, Question } from '../data/questions';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useRouter } from 'next/router';
import { Progress } from '../components/ui/Progress';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export default function QuizPage() {
  const { state, dispatch } = useQuiz();
  const router = useRouter();
  
  const currentQuestion = state.currentQuestionIndex < QUESTIONS.length 
    ? QUESTIONS[state.currentQuestionIndex] 
    : null;
  const selectedValue = state.answers[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === QUESTIONS.length - 1;

  useEffect(() => {
    console.log('Quiz state updated:', {
      currentQuestionIndex: state.currentQuestionIndex,
      totalQuestions: QUESTIONS.length,
      isComplete: state.isQuizComplete,
      answersCount: Object.keys(state.answers).length
    });
  }, [state.currentQuestionIndex, state.answers, state.isQuizComplete]);

  const getProgressPhrase = (progress: number, isLastQuestionAnswered: boolean) => {
    if (isLastQuestionAnswered && progress === 100) {
      return "Done! 🎉";
    }
    if (progress >= 75) {
      return "Almost finished! 🚀";
    }
    if (progress >= 50) {
      return "You're halfway there! 💪";
    }
    if (progress >= 25) {
      return "Great progress! 👍";
    }
    return "Just getting started! 🌟";
  };

  const progress = (state.currentQuestionIndex / QUESTIONS.length) * 100;
  const isLastQuestionAnswered = state.answers[QUESTIONS.length - 1] !== undefined;
  const progressPhrase = getProgressPhrase(progress, isLastQuestionAnswered);

  const allQuestionsAnswered = Object.keys(state.answers).length === QUESTIONS.length;

  const handleAnswer = (value: number) => {
    if (!currentQuestion) return;

    if (value < 0 || value >= currentQuestion.options.length) {
      console.log('Invalid answer value:', {
        value,
        optionsLength: currentQuestion.options.length,
        questionIndex: state.currentQuestionIndex
      });
      return;
    }

    dispatch({
      type: 'ANSWER_QUESTION',
      questionId: state.currentQuestionIndex,
      answer: value,
    });

    if (!isLastQuestion) {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  const handleSeeScoreClick = () => {
    dispatch({ type: 'GO_TO_EMAIL' });
    router.push('/email-capture');
  };

  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      dispatch({ type: 'PREVIOUS_QUESTION' });
    }
  };

  useEffect(() => {
    let lastKeyPressTime = 0;
    const DEBOUNCE_DELAY = 300;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (!currentQuestion) return;

      const currentTime = Date.now();
      if (currentTime - lastKeyPressTime < DEBOUNCE_DELAY) return;

      lastKeyPressTime = currentTime;

      const key = event.key;
      if (['1', '2', '3', '4'].includes(key)) {
        const answerIndex = parseInt(key) - 1;
        if (answerIndex >= 0 && answerIndex < currentQuestion.options.length) {
          handleAnswer(answerIndex);
        }
      } else if (key === 'ArrowLeft' && state.currentQuestionIndex > 0) {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.currentQuestionIndex, currentQuestion]);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-lg text-muted-foreground animate-pulse">
            Preparing your results...
          </p>
        </div>
      </div>
    );
  }

  const question = currentQuestion as Question;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <motion.span
              key={progressPhrase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-muted-foreground"
            >
              {progressPhrase}
            </motion.span>
            <span className="text-sm font-medium text-muted-foreground">
              Question {state.currentQuestionIndex + 1} of {QUESTIONS.length}
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-2.5 bg-secondary/50"
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className="border border-border/50 shadow-lg">
              <div className="p-8">
                <h2 className="text-2xl font-semibold mb-8 text-foreground leading-relaxed">
                  {question.text}
                </h2>

                <RadioGroup 
                  value={selectedValue ?? null} 
                  onChange={handleAnswer} 
                  className="space-y-4"
                >
                  {question.options.map((option: string, index: number) => (
                    <Transition
                      key={index}
                      show={true}
                      enter="transition duration-200 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <RadioGroup.Option
                        value={index}
                        className={({ active, checked }) =>
                          cn(
                            "relative rounded-lg px-6 py-4 cursor-pointer flex focus:outline-none transition-all duration-200",
                            "hover:bg-accent/50",
                            active && "ring-2 ring-ring ring-offset-2",
                            checked
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-card hover:bg-accent/50"
                          )
                        }
                      >
                        {({ checked }) => (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="text-base">
                                <RadioGroup.Label
                                  as="p"
                                  className={cn(
                                    "font-medium",
                                    checked ? "text-primary-foreground" : "text-foreground"
                                  )}
                                >
                                  <span className={cn(
                                    "inline-block w-8 font-semibold",
                                    checked ? "text-primary-foreground/80" : "text-muted-foreground"
                                  )}>
                                    {index + 1}.
                                  </span>{' '}
                                  {option}
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
                    </Transition>
                  ))}
                </RadioGroup>

                {isLastQuestion && selectedValue !== undefined && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                  >
                    <Button
                      onClick={handleSeeScoreClick}
                      className={cn(
                        "w-full h-11 font-medium shadow-lg hover:shadow-xl transition-all",
                        "bg-primary hover:bg-primary/90 text-primary-foreground"
                      )}
                    >
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
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={state.currentQuestionIndex === 0}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Previous
          </Button>
        </div>
      </div>
    </div>
  );
} 