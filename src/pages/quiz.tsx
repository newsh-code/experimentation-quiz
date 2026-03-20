import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RadioGroup } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QUESTIONS } from '../data/questions';
import { Progress } from '../components/ui/Progress';
import { useRouter } from 'next/router';

const CATEGORY_LABELS: Record<string, string> = {
  process: 'Process',
  strategy: 'Strategy',
  insight: 'Insight',
  culture: 'Culture',
};

function getProgressPhrase(progress: number): string {
  if (progress >= 100) return "All done";
  if (progress >= 75) return "Almost there";
  if (progress >= 50) return "Halfway through";
  if (progress >= 25) return "Good progress";
  return "Getting started";
}

export default function QuizPage() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const currentQuestion = useMemo(() => {
    if (!Array.isArray(state.questions) || state.questions.length === 0) return null;
    if (state.currentQuestion < 0 || state.currentQuestion >= state.questions.length) return null;
    return state.questions[state.currentQuestion];
  }, [state.questions, state.currentQuestion]);

  const isLastQuestion = useMemo(() =>
    state.currentQuestion === state.questions.length - 1,
    [state.currentQuestion, state.questions.length]
  );

  // Navigate to email capture once quiz is complete
  useEffect(() => {
    if (state.isComplete) {
      router.push('/email-capture');
    }
  }, [state.isComplete, router]);

  // P1: IntersectionObserver — track when the nav bar (CTA) is in viewport
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNavVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleAnswer = useCallback((value: number) => {
    if (isSubmitting || !currentQuestion) return;

    setIsSubmitting(true);

    dispatch({
      type: 'ANSWER_QUESTION',
      questionId: currentQuestion.id.toString(),
      answer: value,
    });

    // ANSWER_QUESTION sets isComplete on the last question — navigation is handled by useEffect above.
    // For all other questions, advance immediately.
    if (state.currentQuestion < state.questions.length - 1) {
      dispatch({ type: 'NEXT_QUESTION' });
    }

    setIsSubmitting(false);
    setSelectedValue(null);
  }, [currentQuestion, dispatch, isSubmitting, state.currentQuestion, state.questions.length]);

  // Keep a stable ref so the timer closure always calls the latest handleAnswer
  const handleAnswerRef = useRef(handleAnswer);
  useEffect(() => { handleAnswerRef.current = handleAnswer; }, [handleAnswer]);

  // Auto-advance 300ms after selection on non-last questions
  useEffect(() => {
    if (selectedValue === null || isLastQuestion) return;

    advanceTimerRef.current = setTimeout(() => {
      handleAnswerRef.current(selectedValue);
    }, 300);

    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, [selectedValue, isLastQuestion]);

  // Scroll to top on question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [state.currentQuestion]);

  const handlePrevious = useCallback(() => {
    // Cancel any pending auto-advance before going back
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setSelectedValue(null);
    if (state.currentQuestion > 0) {
      dispatch({ type: 'PREVIOUS_QUESTION' });
    }
  }, [dispatch, state.currentQuestion]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (state.isLoading || !currentQuestion || isSubmitting) return;

    const numKey = parseInt(e.key);
    if (numKey >= 1 && numKey <= 4) {
      e.preventDefault();
      if (numKey <= currentQuestion.options.length) {
        setSelectedValue(numKey - 1);
      }
      return;
    }

    if (e.key === 'Enter' && selectedValue !== null && isLastQuestion) {
      e.preventDefault();
      handleAnswer(selectedValue);
    }

    if (e.key === 'Escape' && state.currentQuestion > 0) {
      e.preventDefault();
      handlePrevious();
    }
  }, [currentQuestion, handleAnswer, handlePrevious, selectedValue, state.currentQuestion, state.isLoading, isSubmitting, isLastQuestion]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const progress = ((state.currentQuestion + 1) / QUESTIONS.length) * 100;
  const progressPhrase = getProgressPhrase(progress);

  const showStickyBar = isLastQuestion && selectedValue !== null && !navVisible;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <span
            className="block text-xl font-light text-foreground"
            style={{ fontFamily: 'RecklessCondensed, Georgia, serif' }}
          >
            Loading your quiz...
          </span>
          <p className="text-sm text-muted-foreground font-light">Preparing your questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1A1A1A] flex flex-col">
      {/* Header: logo + progress phrase + counter */}
      <div className="flex-shrink-0 px-6 py-4 max-w-2xl w-full mx-auto">
        <div className="flex items-center justify-between mb-3">
          <img src="/images/k-v4-black.png" alt="Kyzn Academy" className="h-8 w-auto dark:hidden" />
          <img src="/images/k-v4-offwhite.png" alt="Kyzn Academy" className="h-8 w-auto hidden dark:block" />
          <div className="flex items-center gap-3">
            <motion.span
              key={progressPhrase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-gray-400 dark:text-[#888888] font-light"
            >
              {progressPhrase}
            </motion.span>
            <motion.span
              key={state.currentQuestion}
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-medium text-gray-500 dark:text-[#b8b4ae] tabular-nums"
              data-testid="quiz-counter"
            >
              {state.currentQuestion + 1} / {QUESTIONS.length}
            </motion.span>
          </div>
        </div>
        <Progress value={progress} className="h-1 bg-gray-100 dark:bg-[#3a3a3a]" />
      </div>

      {/* Question card — fills remaining viewport */}
      <div className="flex-1 flex flex-col px-6 pb-6 max-w-2xl w-full mx-auto">
        <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border border-border/60">
          <CardContent className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentQuestion}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col flex-1"
              >
                {/* Category pill */}
                <span
                  className="inline-block self-start text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full mb-3 sm:mb-4"
                  style={{ color: 'var(--brand-accent)', background: 'var(--brand-tint)' }}
                >
                  {CATEGORY_LABELS[currentQuestion.category] ?? currentQuestion.category}
                </span>

                <h2
                  className="leading-snug mb-4 sm:mb-5 text-foreground"
                  style={{
                    fontFamily: 'RecklessCondensed, Georgia, serif',
                    fontWeight: 400,
                    fontSize: 'clamp(1.05rem, 2.5vw + 0.5rem, 1.4rem)',
                  }}
                >
                  {currentQuestion.text}
                </h2>

                <RadioGroup
                  value={selectedValue}
                  onChange={setSelectedValue}
                  className="space-y-2 sm:space-y-2.5 flex-1"
                  disabled={isSubmitting}
                >
                  {currentQuestion.options.map((option, index) => (
                    <RadioGroup.Option
                      key={index}
                      value={index}
                      className={({ checked }) =>
                        cn(
                          'relative flex cursor-pointer rounded-xl focus:outline-none',
                          'transition-all duration-150 border overflow-hidden',
                          checked
                            ? 'border-transparent'
                            : 'bg-card border-border/60 hover:border-primary/40 hover:bg-secondary/30',
                          isSubmitting && 'opacity-50 cursor-not-allowed'
                        )
                      }
                    >
                      {({ checked }) => (
                        <div
                          className="flex w-full items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3"
                          style={checked ? { background: 'var(--brand-gradient)' } : {}}
                        >
                          <span
                            className={cn(
                              'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
                              checked ? 'bg-white/20' : 'bg-secondary text-muted-foreground'
                            )}
                            style={checked ? { color: 'var(--brand-btn-text)' } : {}}
                          >
                            {index + 1}
                          </span>
                          <RadioGroup.Label
                            as="p"
                            className={cn(
                              'flex-1 text-sm leading-snug',
                              checked ? 'font-medium' : 'text-foreground font-light'
                            )}
                            style={checked ? { color: 'var(--brand-btn-text)' } : {}}
                          >
                            {option.text}
                          </RadioGroup.Label>
                          {checked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex-shrink-0"
                              style={{ color: 'var(--brand-btn-text)' }}
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Navigation */}
        <div ref={navRef} className="flex items-center gap-3 mt-3">
          {/* invisible on Q1 to preserve layout balance */}
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isSubmitting}
            className={cn(
              'shrink-0 text-muted-foreground hover:text-foreground border-border/60 transition-colors text-sm h-9',
              state.currentQuestion === 0 && 'invisible'
            )}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>

          {/* Only shown on last question — non-last questions auto-advance on selection */}
          {isLastQuestion && (
            <Button
              onClick={() => selectedValue !== null && handleAnswer(selectedValue)}
              disabled={isSubmitting || selectedValue === null}
              className={cn(
                'flex-1 h-9 text-sm font-medium transition-all shadow-md hover:shadow-lg rounded-full',
                (isSubmitting || selectedValue === null) && 'opacity-50 cursor-not-allowed'
              )}
              style={{ background: 'var(--brand-gradient)', color: 'var(--brand-btn-text)' }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  Processing... <LoadingSpinner size="small" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  See My Results
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* P1: Sticky bottom bar — mobile only, last question, answer selected, nav out of view */}
      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[99] bg-[#2A2A2A] px-6 py-4 border-t border-[#3a3a3a]">
          <button
            onClick={() => selectedValue !== null && handleAnswer(selectedValue)}
            disabled={isSubmitting}
            className={cn(
              'w-full h-11 rounded-full text-sm font-medium text-[#1A1A1A] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer',
              isSubmitting && 'opacity-70 cursor-not-allowed'
            )}
            style={{ background: '#FFC313' }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="small" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                See My Results
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
