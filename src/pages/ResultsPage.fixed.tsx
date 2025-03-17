import React from 'react';
import { useQuiz } from '../context/QuizContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { IconBrandX, IconBrandLinkedin, IconMail, IconFlask, IconRocket, IconBrain, IconTrophy } from '@tabler/icons-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { cn } from '../lib/utils';
import { RadarChart } from '../components/ui/RadarChart';
import { ScoreCard } from '../components/ui/ScoreCard';
import { AnimatedScore } from '../components/ui/AnimatedScore';
import { PERSONAS, type Persona } from '../data/personas';
import { type CategoryKey, type ScoreLevelInfo } from '../types';

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
    low: "You're beginning to gather insights. Work on improving data collection and analysis.",
    medium: "You extract valuable insights but could enhance your analysis methods.",
    high: "You excel at deriving and applying insights from your experiments."
  },
  culture: {
    low: "Your experimentation culture is emerging. Focus on building buy-in and engagement.",
    medium: "You have good cultural foundations but could strengthen experimentation advocacy.",
    high: "You have a strong culture of experimentation embedded in your organization."
  }
};

// Success Stories Data
const SUCCESS_STORIES = [
  {
    title: "Implementing A/B Testing Culture",
    category: "E-commerce",
    challenge: "Low conversion rates and lack of data-driven decision making",
    solution: "Implemented systematic A/B testing program and built testing infrastructure",
    impact: "40% increase in conversion rate within 6 months"
  },
  {
    title: "Scaling Experimentation Program",
    category: "SaaS Platform",
    challenge: "Limited testing capacity and slow iteration cycles",
    solution: "Developed automated testing pipeline and democratized experimentation",
    impact: "10x increase in experiments run per month"
  },
  {
    title: "Advanced Multi-Variant Testing",
    category: "Enterprise",
    challenge: "Complex user journey optimization requirements",
    solution: "Implemented sophisticated testing and compliance controls",
    impact: "200% increase in user engagement"
  }
];

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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function ResultsPage() {
  const { state } = useQuiz();
  const totalScore = Math.round(
    Object.values(state.scores).reduce((sum, score) => sum + score, 0) / Object.keys(state.scores).length
  );

  const persona: Persona = {
    title: PERSONAS[getPersonaLevel(totalScore)].title,
    description: PERSONAS[getPersonaLevel(totalScore)].description,
    recommendations: [
      {
        category: 'process',
        title: 'Streamline Your Workflow',
        description: 'Implement automated testing and continuous integration to reduce manual overhead and improve code quality.',
      },
      {
        category: 'strategy',
        title: 'Long-term Planning',
        description: 'Develop a clear roadmap for technical debt reduction and feature development over the next 6-12 months.',
      },
      {
        category: 'insight',
        title: 'Data-Driven Decisions',
        description: 'Set up analytics and monitoring to track key performance indicators and make informed decisions.',
      },
      {
        category: 'culture',
        title: 'Team Collaboration',
        description: 'Establish regular knowledge sharing sessions and pair programming practices to build a stronger engineering culture.',
      },
    ],
  };

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    const url = window.location.href;
    const text = `Check out my Digital Transformation Assessment results! My score: ${totalScore}%`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank');
  };

  if (!state.isQuizComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center animate-pulse space-y-4">
          <h2 className="text-2xl font-bold">Loading results...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ThemeToggle />

      {/* Hero Section with Score */}
      <section className="relative">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-primary-100/20 to-transparent dark:from-primary-950/30 dark:via-primary-900/20 dark:to-transparent pointer-events-none" />
          <CardContent className="pt-16 pb-12">
            <div className="flex flex-col items-center space-y-12">
              <AnimatedScore score={totalScore} size="lg" />

              <div className="w-full max-w-2xl space-y-8 animate-fade-in">
                <h1 className="text-center text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600">
                  {persona.title}
                </h1>
                <p className="text-center text-xl text-gray-600 dark:text-gray-300">
                  {persona.description}
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
            const scoreLevelInfo = getScoreLevelInfo(score);
            return (
              <ScoreCard
                key={category}
                category={category as CategoryKey}
                score={score}
                description={CATEGORY_DESCRIPTIONS[category as CategoryKey][score < 40 ? 'low' : score < 70 ? 'medium' : 'high']}
                tooltip={CATEGORY_TOOLTIPS[category as CategoryKey]}
                icon={CATEGORY_ICONS[category as CategoryKey]}
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
                  { category: 'Process', score: state.scores.process },
                  { category: 'Strategy', score: state.scores.strategy },
                  { category: 'Insight', score: state.scores.insight },
                  { category: 'Culture', score: state.scores.culture },
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
          {persona.recommendations.map((recommendation, index) => (
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

      {/* Success Stories */}
      <section className="space-y-12 scroll-m-20" id="success-stories">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold">Success Stories</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover how other organizations have successfully improved their experimentation programs.
            These case studies demonstrate the impact of implementing our recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {SUCCESS_STORIES.map((story, index) => (
            <Card 
              key={index} 
              className="bg-gray-50/50 dark:bg-gray-900/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader>
                <Badge 
                  variant="default" 
                  className="w-fit px-3 py-1 text-xs font-medium"
                >
                  {story.category}
                </Badge>
                <CardTitle className="text-xl mt-2">{story.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Challenge</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{story.challenge}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Solution</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{story.solution}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Impact</h4>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{story.impact}</p>
                </div>
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
              <h2 className="text-4xl font-bold">Ready to Level Up?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Take the next step in your experimentation journey. Our team of experts can help you implement these recommendations and accelerate your program's growth.
              </p>

              <div className="flex flex-wrap gap-6 justify-center">
                <Button
                  variant="outline"
                  onClick={() => handleShare('twitter')}
                  className="min-w-[200px] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  <IconBrandX className="mr-2 h-4 w-4" />
                  Share on X
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleShare('linkedin')}
                  className="min-w-[200px] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <IconBrandLinkedin className="mr-2 h-4 w-4" />
                  Share on LinkedIn
                </Button>
                <Button 
                  variant="default"
                  className="min-w-[200px] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <IconMail className="mr-2 h-4 w-4" />
                  Contact Sales
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
} 