import React from 'react';
import { motion } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import { useRouter } from 'next/router';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function LandingPage() {
  const { dispatch } = useQuiz();
  const router = useRouter();

  const handleStartQuiz = () => {
    dispatch({ type: 'START_QUIZ' });
    router.push('/quiz').catch(error => {
      console.error('Navigation error:', error);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <motion.div
          className="space-y-16"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold tracking-tight"
            >
              Discover Your{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600">
                Experimentation Maturity
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Take our quick quiz to assess your organization's experimentation practices
              and get personalized recommendations for improvement.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="pt-6"
            >
              <Button
                size="lg"
                onClick={handleStartQuiz}
                className={cn(
                  "text-lg h-12 px-8 font-medium shadow-lg hover:shadow-xl transition-all",
                  "bg-primary hover:bg-primary/90 text-primary-foreground"
                )}
              >
                Start Quiz
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
              <p className="text-sm text-muted-foreground mt-4 font-medium">
                Takes about 5 minutes • No registration required
              </p>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              { 
                title: 'Quick Assessment', 
                icon: '⚡', 
                description: 'Get instant insights about your maturity level' 
              },
              { 
                title: 'Actionable Insights', 
                icon: '💡', 
                description: 'Receive personalized recommendations' 
              },
              { 
                title: 'Free Report', 
                icon: '📊', 
                description: 'Download a detailed PDF report' 
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }
                }}
              >
                <Card className="p-6 h-full border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 