import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadioGroup, Transition } from '@headlessui/react';
import { useQuiz } from '../context/QuizContext';
import { QUESTIONS } from '../data/questions';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function QuizPage() {
  const { state, dispatch } = useQuiz();
  const currentQuestion = QUESTIONS[state.currentQuestionIndex];
  const selectedValue = state.answers[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === QUESTIONS.length - 1;

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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      if (['1', '2', '3', '4'].includes(key)) {
        const answerIndex = parseInt(key) - 1;
        if (answerIndex < currentQuestion.options.length) {
          handleAnswer(answerIndex);
        }
      } else if (key === 'ArrowLeft' && state.currentQuestionIndex > 0) {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.currentQuestionIndex, currentQuestion]);

  const handleAnswer = (value: number) => {
    // Record the answer
    dispatch({
      type: 'ANSWER_QUESTION',
      questionId: state.currentQuestionIndex,
      answer: value,
    });

    // Wait for a short delay before moving to the next question
    setTimeout(() => {
      if (isLastQuestion) {
        if (allQuestionsAnswered) {
          dispatch({ type: 'GO_TO_EMAIL' });
        }
      } else {
        dispatch({ type: 'NEXT_QUESTION' });
      }
    }, 500); // 500ms delay for smooth transition
  };

  const handlePrevious = () => {
    dispatch({ type: 'PREVIOUS_QUESTION' });
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {progressPhrase}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question {state.currentQuestionIndex + 1} of {QUESTIONS.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {currentQuestion.text}
            </h2>

            <RadioGroup value={selectedValue} onChange={handleAnswer} className="space-y-4">
              {currentQuestion.options.map((option, index) => (
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
                      `${
                        active
                          ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800'
                          : ''
                      }
                      ${
                        checked
                          ? 'bg-primary-500 text-white'
                          : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }
                      relative rounded-lg px-5 py-4 cursor-pointer flex focus:outline-none transition-all duration-200`
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <RadioGroup.Label
                                as="p"
                                className={`font-medium ${
                                  checked ? 'text-white' : 'text-gray-900 dark:text-white'
                                }`}
                              >
                                <span className="inline-block w-6 text-gray-400 dark:text-gray-500">
                                  {index + 1}.
                                </span>{' '}
                                {option}
                              </RadioGroup.Label>
                            </div>
                          </div>
                          {checked && (
                            <div className="text-white">
                              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </RadioGroup.Option>
                </Transition>
              ))}
            </RadioGroup>

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Press 1-4 to select an answer or use arrow keys to navigate
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrevious}
            disabled={state.currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200
              ${
                state.currentQuestionIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }
            `}
          >
            Back
          </motion.button>

          {isLastQuestion && selectedValue !== undefined && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch({ type: 'GO_TO_EMAIL' })}
              className="px-6 py-2 rounded-lg font-medium bg-primary-500 text-white hover:bg-primary-600 
                transition-all duration-200 animate-glow shadow-lg hover:shadow-xl"
            >
              See My Score
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
} 