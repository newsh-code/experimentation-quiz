import React, { Suspense, lazy } from 'react';
import { QuizProvider } from './context/QuizContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useQuiz } from './context/QuizContext';
import { motion } from 'framer-motion';

// Lazy load page components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const EmailCapturePage = lazy(() => import('./pages/EmailCapturePage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));

function AppContent() {
  const { state } = useQuiz();

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      {(() => {
        switch (state.page) {
          case 'landing':
            return <LandingPage />;
          case 'quiz':
            return <QuizPage />;
          case 'email':
            return <EmailCapturePage />;
          case 'results':
            return <ResultsPage />;
          default:
            return <LandingPage />;
        }
      })()}
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QuizProvider>
        <div className="relative min-h-screen">
          {/* Beta Badge */}
          <div className="absolute top-4 right-4 z-50">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg"
            >
              Beta
            </motion.div>
          </div>
          <AppContent />
        </div>
      </QuizProvider>
    </ErrorBoundary>
  );
}

export default App; 