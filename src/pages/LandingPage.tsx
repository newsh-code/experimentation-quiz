import React from 'react';
import { motion } from 'framer-motion';
import { Transition } from '@headlessui/react';
import { useQuiz } from '../context/QuizContext';

export default function LandingPage() {
  const { dispatch } = useQuiz();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Transition
        show={show}
        appear={true}
        enter="transition-all duration-500"
        enterFrom="opacity-0 translate-y-6"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              Discover Your Experimentation Maturity Level
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="prose prose-lg dark:prose-invert mx-auto mb-12"
          >
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Take our quick quiz to assess your organization's experimentation practices
              and get personalized recommendations for improvement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch({ type: 'START_QUIZ' })}
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg 
                text-white bg-primary-500 hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Quiz
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Takes about 5 minutes • No registration required
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            {[
              { title: 'Quick Assessment', icon: '⚡', description: 'Get instant insights about your maturity level' },
              { title: 'Actionable Insights', icon: '💡', description: 'Receive personalized recommendations' },
              { title: 'Free Report', icon: '📊', description: 'Download a detailed PDF report' }
            ].map((feature, index) => (
              <Transition
                key={feature.title}
                show={show}
                appear={true}
                enter="transition-all duration-500"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </Transition>
            ))}
          </motion.div>
        </div>
      </Transition>
    </div>
  );
} 