import React, { useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { IconCalendar, IconFlask, IconRocket, IconBrain, IconTrophy } from '@tabler/icons-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { RadarChart } from '../components/ui/RadarChart';
import { ScoreCard } from '../components/ui/ScoreCard';
import { AnimatedScore } from '../components/ui/AnimatedScore';
import { PERSONAS, type Persona } from '../data/personas';
import { type CategoryKey, type ScoreLevelInfo } from '../types';
import { useRouter } from 'next/router';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Constants
const CATEGORY_TOOLTIPS: Record<CategoryKey, string> = {
  process: "Measures how systematically and effectively you conduct experiments and implement findings",
  strategy: "Evaluates how well your experimentation efforts align with and inform business strategy",
  insight: "Assesses your ability to generate and utilize actionable insights from experiments",
  culture: "Reflects how deeply experimentation is integrated into organizational decision-making"
};

const CATEGORY_ICONS: Record<CategoryKey, React.ReactNode> = {
  process: <IconFlask className="h-5 w-5" />,
  strategy: <IconRocket className="h-5 w-5" />,
  insight: <IconBrain className="h-5 w-5" />,
  culture: <IconTrophy className="h-5 w-5" />
};

export const CATEGORY_DESCRIPTIONS: Record<CategoryKey, Record<'low' | 'medium' | 'high', string>> = {
  process: {
    low: "Your experimentation process is in its early stages. Focus on establishing consistent practices.",
    medium: "You have a foundation for experimentation but could benefit from more structure.",
    high: "You have a mature, well-structured experimentation process in place."
  },
  strategy: {
    low: "Your experimentation strategy needs development. Start by aligning tests with business goals.",
    medium: "Your strategy shows promise but could use more systematic planning.",
    high: "Your strategic approach to experimentation is sophisticated and business-aligned."
  },
  insight: {
    low: "You&apos;re beginning to gather insights. Work on improving data collection and analysis.",
    medium: "You extract valuable insights but could enhance your analysis methods.",
    high: "You excel at deriving and applying insights from your experiments."
  },
  culture: {
    low: "Your experimentation culture is emerging. Focus on building buy-in and engagement.",
    medium: "You have good cultural foundations but could strengthen experimentation advocacy.",
    high: "You have a strong culture of experimentation embedded in your organization."
  }
};

// Score-based next-step routing
const getNextStep = (score: number): { text: string; linkText: string; href: string } => {
  if (score > 75) {
    return {
      text: "Based on your score, you'd be a strong fit for the",
      linkText: "Experimentation Accelerator®",
      href: "https://kyznacademy.com/accelerator/",
    };
  }
  return {
    text: "Based on where you are, a",
    linkText: "Conversion Clarity Call",
    href: "https://cal.com/kyznacademy/clarity",
  };
};

// Helper functions
const getScoreLevelInfo = (score: number): ScoreLevelInfo => {
  if (score < 40) return { color: 'red', label: 'Needs Improvement' };
  if (score < 70) return { color: 'yellow', label: 'Good' };
  return { color: 'green', label: 'Excellent' };
};

const getPersonaLevel = (score: number): keyof typeof PERSONAS => {
  if (score < 20) return 'novice';
  if (score < 40) return 'beginner';
  if (score < 60) return 'intermediate';
  if (score < 80) return 'advanced';
  return 'expert';
};

const getPersona = (score: number): Persona => {
  const level = getPersonaLevel(score);
  return PERSONAS[level];
};

export default function ResultsPage() {
  const { state } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    console.log('Results page mounted, current state:', {
      isComplete: state.isComplete,
      answersCount: Object.keys(state.answers).length,
      scores: state.scores,
      categoryPercentages: state.categoryPercentages
    });

    // Validate required state: quiz must be complete and scores must have been calculated
    if (!state.isComplete || state.percentageScore === undefined) {
      console.error('Invalid results state — quiz not complete or scores not calculated:', {
        isComplete: state.isComplete,
        percentageScore: state.percentageScore,
      });
      router.push('/quiz');
      return;
    }
  }, [state.isComplete, state.answers, state.scores, state.categoryPercentages, router]);

  // Calculate scores and persona
  const percentageScore = state.percentageScore ?? 0;

  // Determine persona based on score
  const persona = getPersona(percentageScore);
  const nextStep = getNextStep(percentageScore);

  // Add loading state
  if (state.isLoading || !state.scores || !state.categoryPercentages) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="large" />
          <p className="text-lg text-muted-foreground animate-pulse">
            Calculating your results...
          </p>
        </div>
      </div>
    );
  }

  // Add error state
  if (!state.isComplete || Object.keys(state.answers).length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            No results available. Please complete the quiz first.
          </p>
          <Button onClick={() => router.push('/quiz')}>
            Take Quiz
          </Button>
        </div>
      </div>
    );
  }

  // Helper function to get score level
  const getScoreLevel = (score: number | undefined): 'low' | 'medium' | 'high' => {
    const validScore = score ?? 0;
    return validScore < 40 ? 'low' : validScore < 70 ? 'medium' : 'high';
  };

  // Helper function to get category description
  const getCategoryDescription = (category: CategoryKey, score: number | undefined): string => {
    // Validate category exists in CATEGORY_DESCRIPTIONS
    if (!category || !CATEGORY_DESCRIPTIONS[category]) {
      console.error('Invalid category:', category);
      return 'Category description not available.';
    }

    // Get the level and validate it exists
    const level = getScoreLevel(score);
    if (!CATEGORY_DESCRIPTIONS[category][level]) {
      console.error('Invalid level for category:', { category, level });
      return 'Description not available for this score level.';
    }

    return CATEGORY_DESCRIPTIONS[category][level];
  };

  return (
    <div className="min-h-screen p-8">
      <ThemeToggle className="absolute top-4 right-4" />
      <div className="min-h-screen py-12 space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Score */}
        <section className="relative">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-primary-100/20 to-transparent dark:from-primary-950/30 dark:via-primary-900/20 dark:to-transparent pointer-events-none" />
            <CardContent className="pt-16 pb-12">
              <div className="flex flex-col items-center space-y-12">
                <AnimatedScore score={percentageScore} size="lg" />

                <div className="w-full max-w-2xl space-y-6 animate-fade-in">
                  <h1 className="text-center text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600">
                    {persona.title}
                  </h1>
                  <p className="text-center text-xl text-gray-600 dark:text-gray-300">
                    {persona.description}
                  </p>
                  <p className="text-center text-base text-muted-foreground">
                    {nextStep.text}{' '}
                    <a
                      href={nextStep.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                    >
                      {nextStep.linkText}
                    </a>
                    {percentageScore > 75 ? '.' : ' would give you the most immediate direction.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Performance Overview */}
        <section className="space-y-12 scroll-m-20" id="performance">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold">Your Performance Profile</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how you score across the four key dimensions of experimentation maturity.
              Each score reflects your current capabilities and highlights areas for growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(state.scores).map(([category, score]) => {
              const categoryKey = category as CategoryKey;
              const scoreLevelInfo = getScoreLevelInfo(score ?? 0);
              return (
                <ScoreCard
                  key={category}
                  category={categoryKey}
                  score={score ?? 0}
                  description={getCategoryDescription(categoryKey, score)}
                  tooltip={CATEGORY_TOOLTIPS[categoryKey]}
                  icon={CATEGORY_ICONS[categoryKey]}
                  scoreLevelInfo={scoreLevelInfo}
                  className="animate-fade-in"
                />
              );
            })}
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-2xl">Performance Analysis</CardTitle>
              <p className="text-muted-foreground mt-2">
                Visualize your performance across all dimensions in this radar chart. Hover over any point for detailed scores.
              </p>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <div className="w-full flex items-center justify-center p-4">
                <RadarChart 
                  data={[
                    { category: 'Process', score: state.categoryPercentages.process ?? 0 },
                    { category: 'Strategy', score: state.categoryPercentages.strategy ?? 0 },
                    { category: 'Insight', score: state.categoryPercentages.insight ?? 0 },
                    { category: 'Culture', score: state.categoryPercentages.culture ?? 0 },
                  ]} 
                  className="max-w-xl mx-auto"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recommendations */}
        <section className="space-y-12 scroll-m-20" id="recommendations">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold">Personalized Recommendations</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Based on your assessment results, we've identified key areas where you can improve your experimentation program.
              Focus on these recommendations to advance your maturity level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {persona.recommendations.map((recommendation: { category: CategoryKey; title: string; description: string }, index: number) => (
              <Card 
                key={index} 
                className="bg-gray-50/50 dark:bg-gray-900/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-primary-500">
                      {CATEGORY_ICONS[recommendation.category]}
                    </span>
                    {recommendation.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{recommendation.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="space-y-8">
          <Card className="bg-gradient-to-br from-primary-50 via-primary-100/50 to-primary-200/30 dark:from-primary-950 dark:via-primary-900/50 dark:to-primary-800/30">
            <CardContent className="pt-16 pb-12">
              <div className="text-center space-y-8">
                <h2 className="text-4xl font-bold">What&apos;s Next?</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Share your results, or book a call to talk through what the recommendations mean for your programme in practice.
                </p>

                <div className="flex flex-wrap gap-6 justify-center">
                  <Button
                    variant="default"
                    onClick={() => window.open('https://cal.com/kyznacademy/intro', '_blank')}
                    className="min-w-[200px] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <IconCalendar className="mr-2 h-4 w-4" />
                    Book a Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
} 