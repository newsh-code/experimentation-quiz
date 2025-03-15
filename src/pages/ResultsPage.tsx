import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Popover, Transition, Tab } from '@headlessui/react';
import { useQuiz } from '../context/QuizContext';
import type { QuizState } from '../context/QuizContext';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

const PERSONAS = {
  beginner: {
    name: "Experimentation Explorer ��",
    description: {
      overview: "You're taking your first steps into the world of experimentation, showing great potential for growth and innovation.",
      approach: `Your approach to experimentation is characterized by curiosity and eagerness to learn. Like a scientist in training, you're beginning to understand the importance of data-driven decision making, but may still rely heavily on intuition.`,
      strengths: [
        "Natural curiosity and willingness to learn",
        "Open-minded approach to new ideas",
        "Recognition of the importance of testing",
        "Enthusiasm for improvement"
      ],
      challenges: [
        "Limited formal testing processes",
        "Inconsistent documentation practices",
        "Reliance on gut feelings over data",
        "Ad-hoc experiment selection"
      ],
      currentPractices: `Your current experimentation practices are emerging but not yet systematic. You likely run tests when obvious opportunities arise, but might miss more subtle testing opportunities. Documentation tends to be informal, and result sharing happens on an ad-hoc basis.`,
      teamDynamics: `Your team shows interest in experimentation but may lack formal roles and responsibilities. Decision-making often involves multiple stakeholders, but without clear processes for incorporating test results.`,
      tooling: `Your tooling is basic but functional. You might use spreadsheets for tracking and simple A/B testing tools for implementation, though integration with other systems may be limited.`
    },
    color: "bg-emerald-100 text-emerald-800",
    recommendations: [
      {
        title: "Build Your Foundation",
        items: [
          "Establish a basic experimentation framework",
          "Create templates for experiment documentation",
          "Set up regular team reviews of test results",
          "Implement basic A/B testing tools"
        ]
      },
      {
        title: "Develop Your Process",
        items: [
          "Start tracking key metrics consistently",
          "Create a simple prioritization framework",
          "Document learnings from each experiment",
          "Build a basic experiment roadmap"
        ]
      },
      {
        title: "Grow Your Culture",
        items: [
          "Schedule regular team training sessions",
          "Share success stories across the organization",
          "Create a central repository for test results",
          "Establish basic experimentation guidelines"
        ]
      }
    ]
  },
  intermediate: {
    name: "Test & Learn Tactician 🚀",
    description: {
      overview: "You've established a solid foundation in experimentation and are now ready to scale your program to new heights.",
      approach: `Your approach to experimentation is methodical and increasingly sophisticated. Like a skilled chef, you understand the importance of both following recipes (established processes) and knowing when to improvise.`,
      strengths: [
        "Established testing processes",
        "Data-driven decision making",
        "Cross-functional collaboration",
        "Regular experiment reviews"
      ],
      challenges: [
        "Scaling experimentation across teams",
        "Maintaining consistency in processes",
        "Balancing speed and rigor",
        "Resource allocation"
      ],
      currentPractices: `Your experimentation program runs like a well-oiled machine, with regular test cycles and clear documentation practices. You have established processes for prioritization and implementation, though there's room for further optimization.`,
      teamDynamics: `Your team has defined roles and responsibilities around testing, with regular touchpoints for planning and review. There's growing excitement about experimentation across the organization.`,
      tooling: `You utilize professional testing tools and have basic integrations with analytics platforms. Your tech stack supports both simple and more complex experiments, though advanced features might not be fully utilized.`
    },
    color: "bg-blue-100 text-blue-800",
    recommendations: [
      {
        title: "Scale Your Program",
        items: [
          "Implement advanced statistical methods",
          "Develop automated reporting systems",
          "Create cross-team experimentation guides",
          "Establish center of excellence"
        ]
      },
      {
        title: "Optimize Your Process",
        items: [
          "Refine your experimentation framework",
          "Implement advanced prioritization models",
          "Create detailed documentation standards",
          "Develop quality assurance protocols"
        ]
      },
      {
        title: "Strengthen Your Culture",
        items: [
          "Build experimentation champions program",
          "Create advanced training curriculum",
          "Establish mentorship opportunities",
          "Develop internal certification program"
        ]
      }
    ]
  },
  advanced: {
    name: "Experimentation Expert 🎯",
    description: {
      overview: "You're operating at an advanced level, pushing the boundaries of what's possible with experimentation.",
      approach: `Your approach to experimentation is sophisticated and nuanced. Like a master conductor, you orchestrate complex testing programs that drive significant business impact.`,
      strengths: [
        "Advanced testing methodologies",
        "Sophisticated analysis capabilities",
        "Strong experimentation culture",
        "Strategic program alignment"
      ],
      challenges: [
        "Pushing boundaries of current tools",
        "Managing complex test interactions",
        "Maintaining high standards at scale",
        "Finding new areas for innovation"
      ],
      currentPractices: `Your experimentation program is a model of excellence, with sophisticated processes for test design, implementation, and analysis. You likely employ advanced techniques like multi-armed bandits and automated experimentation.`,
      teamDynamics: `Your organization has fully embraced experimentation, with testing embedded in the decision-making process at all levels. Teams are highly autonomous yet collaborative in their testing efforts.`,
      tooling: `You leverage advanced testing platforms and have built custom tools to support your specific needs. Your tech stack is fully integrated, allowing for sophisticated analysis and automated decision-making.`
    },
    color: "bg-purple-100 text-purple-800",
    recommendations: [
      {
        title: "Innovate & Lead",
        items: [
          "Pioneer new testing methodologies",
          "Develop predictive testing models",
          "Create industry-leading practices",
          "Build advanced automation systems"
        ]
      },
      {
        title: "Maximize Impact",
        items: [
          "Implement AI-driven experimentation",
          "Develop custom testing frameworks",
          "Create advanced analysis models",
          "Establish industry partnerships"
        ]
      },
      {
        title: "Share Knowledge",
        items: [
          "Publish thought leadership content",
          "Speak at industry conferences",
          "Mentor other organizations",
          "Contribute to open source tools"
        ]
      }
    ]
  }
};

const CATEGORY_DESCRIPTIONS = {
  process: {
    low: "Your experimentation process is like a seed waiting to sprout. Time to water it with some structure! 🌱",
    medium: "Your process is growing nicely, like a well-tended garden. Keep nurturing it! 🌿",
    high: "Your process is a well-oiled machine, humming along like a master gardener's greenhouse! 🌺"
  },
  strategy: {
    low: "Your testing strategy is like a curious explorer without a map. Let's get you some direction! 🗺️",
    medium: "You're navigating the testing waters like a skilled sailor. Keep charting your course! ⛵",
    high: "You're playing testing chess while others play checkers. Strategic genius! ♟️"
  },
  insight: {
    low: "Your data insights are like puzzle pieces waiting to be connected. Time to start solving! 🧩",
    medium: "You're connecting the dots like a budding detective. Keep investigating! 🔍",
    high: "You're a data whisperer, turning numbers into narratives like magic! ✨"
  },
  culture: {
    low: "Your testing culture is like a tiny spark ready to ignite. Let's fan those flames! 💫",
    medium: "Your organization is catching the testing bug, like a positive epidemic! 🌟",
    high: "You've built a testing paradise where experimentation thrives! 🎯"
  }
};

function getPersonaLevel(score: number): keyof typeof PERSONAS {
  if (score >= 80) return 'advanced';
  if (score >= 60) return 'intermediate';
  return 'beginner';
}

function getScoreLevel(score: number): keyof typeof CATEGORY_DESCRIPTIONS['process'] {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

interface CaseStudy {
  title: string;
  company: string;
  challenge: string;
  solution: string;
  results: string;
  maturityLevel: 'beginner' | 'intermediate' | 'advanced';
}

const CASE_STUDIES: CaseStudy[] = [
  {
    title: "Implementing A/B Testing Culture",
    company: "E-commerce Giant",
    challenge: "Low conversion rates and lack of data-driven decision making",
    solution: "Implemented systematic A/B testing program and built testing infrastructure",
    results: "40% increase in conversion rate within 6 months",
    maturityLevel: "beginner"
  },
  {
    title: "Scaling Experimentation Program",
    company: "SaaS Platform",
    challenge: "Limited testing capacity and slow iteration cycles",
    solution: "Developed automated testing pipeline and democratized experimentation",
    results: "10x increase in experiments run per month",
    maturityLevel: "intermediate"
  },
  {
    title: "Advanced Multi-variant Testing",
    company: "Financial Services",
    challenge: "Complex user journeys and compliance requirements",
    solution: "Implemented sophisticated MVT framework with compliance controls",
    results: "200% increase in user engagement while maintaining compliance",
    maturityLevel: "advanced"
  }
];

const RESOURCES = {
  beginner: [
    { title: "Introduction to A/B Testing", url: "#" },
    { title: "Building Your First Experiment", url: "#" },
    { title: "Basic Statistical Concepts", url: "#" }
  ],
  intermediate: [
    { title: "Advanced Experimentation Techniques", url: "#" },
    { title: "Statistical Significance Deep Dive", url: "#" },
    { title: "Building an Experimentation Roadmap", url: "#" }
  ],
  advanced: [
    { title: "Multi-armed Bandit Algorithms", url: "#" },
    { title: "Bayesian vs Frequentist Approaches", url: "#" },
    { title: "Experimentation at Scale", url: "#" }
  ]
};

export default function ResultsPage() {
  const { state, dispatch } = useQuiz();
  const { scores } = state;
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  
  const overallScore = (
    Object.values(scores).reduce((sum, score) => sum + score, 0) / 4
  ).toFixed(1);

  const maturityLevel = getMaturityLevel(parseFloat(overallScore));
  const relevantCaseStudies = CASE_STUDIES.filter(study => study.maturityLevel === maturityLevel);
  const recommendedResources = RESOURCES[maturityLevel];

  const chartData = [
    { category: 'Process', score: scores.process },
    { category: 'Strategy', score: scores.strategy },
    { category: 'Insight', score: scores.insight },
    { category: 'Culture', score: scores.culture },
  ];

  const handleRetakeQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    const text = `I just completed the Experimentation Maturity Assessment and scored ${scores.overall}%! Check it out:`;
    const url = window.location.href;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    } else {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
    }
  };

  const personaLevel = getPersonaLevel(parseFloat(overallScore));
  const persona = PERSONAS[personaLevel];

  const getDetailedFeedback = (categoryScores: Record<string, number>) => {
    return [
      'Your overall experimentation program shows good maturity.',
      'Your processes are well-defined and documented.',
      'Your strategy aligns well with business objectives.',
      'You effectively generate and utilize insights.',
      'Your organization has a strong experimentation culture.'
    ];
  };

  const feedback = getDetailedFeedback(scores);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl p-8"
        >
          {/* Persona and Score Section */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${persona.color} text-lg font-medium mb-4`}>
              <span className="mr-2">{persona.emoji}</span>
              {persona.name}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Experimentation Maturity Score
            </h1>
            <div className="inline-flex items-center justify-center px-6 py-3 bg-primary-100 text-primary-800 rounded-full text-3xl font-bold">
              {Math.round(scores.overall)}%
            </div>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {persona.description.overview}
            </p>
          </div>

          {/* Persona Description */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Experimentation Profile</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Overview</h3>
                <p className="text-gray-600 leading-relaxed">{persona.description.overview}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Approach</h3>
                <p className="text-gray-600 leading-relaxed">{persona.description.approach}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Strengths</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {persona.description.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-600">{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Current Challenges</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {persona.description.challenges.map((challenge, index) => (
                      <li key={index} className="text-gray-600">{challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Current Practices</h3>
                <p className="text-gray-600 leading-relaxed">{persona.description.currentPractices}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Team Dynamics</h3>
                <p className="text-gray-600 leading-relaxed">{persona.description.teamDynamics}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Tools & Technology</h3>
                <p className="text-gray-600 leading-relaxed">{persona.description.tooling}</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Next Steps</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {persona.recommendations.map((section, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="text-primary-500 mr-2">•</span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="h-80 mb-12">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Scores"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdowns */}
          <div className="grid gap-6 mb-12">
            {Object.entries(scores).map(([category, score]) => {
              if (category === 'overall') return null;
              const level = getScoreLevel(score);
              return (
                <div key={category} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold capitalize">{category}</h3>
                    <div className="px-4 py-1 bg-white rounded-full font-medium">
                      {Math.round(score)}%
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {CATEGORY_DESCRIPTIONS[category as keyof typeof CATEGORY_DESCRIPTIONS][level]}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col items-center space-y-4">
            <a
              href="mailto:contact@example.com?subject=Experimentation%20Maturity%20Assessment%20Results"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 
                transition-colors duration-200 font-medium"
            >
              Want to discuss your results? Get in touch →
            </a>
            <button
              onClick={handleRetakeQuiz}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Take quiz again
            </button>
          </div>
        </motion.div>

        {/* Case Studies and Resources */}
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-primary-900/20 p-1 mb-8">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${
                  selected
                    ? 'bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-400 shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/[0.12] hover:text-primary-600'
                }`
              }
            >
              Case Studies
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${
                  selected
                    ? 'bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-400 shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/[0.12] hover:text-primary-600'
                }`
              }
            >
              Resources
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relevantCaseStudies.map((study, index) => (
                  <motion.div
                    key={study.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {study.title}
                    </h4>
                    <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">
                      {study.company}
                    </p>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <p><strong>Challenge:</strong> {study.challenge}</p>
                      <p><strong>Solution:</strong> {study.solution}</p>
                      <p><strong>Results:</strong> {study.results}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Recommended Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedResources.map((resource, index) => (
                    <motion.a
                      key={resource.title}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {resource.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Learn more →
                      </p>
                    </motion.a>
                  ))}
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Share Buttons */}
        <div className="mt-12 flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare('twitter')}
            className="inline-flex items-center px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a91da] transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Share on Twitter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare('linkedin')}
            className="inline-flex items-center px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#094c8f] transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Share on LinkedIn
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function calculateCategoryScore(answers: Record<number, number>, category: string): number {
  // Implementation depends on your scoring logic
  return 7.5; // Placeholder
}

function getMaturityLevel(score: number): 'beginner' | 'intermediate' | 'advanced' {
  if (score < 5) return 'beginner';
  if (score < 8) return 'intermediate';
  return 'advanced';
}

function getMaturityLevelLabel(level: 'beginner' | 'intermediate' | 'advanced'): string {
  const labels = {
    beginner: 'Getting Started',
    intermediate: 'Building Momentum',
    advanced: 'Leading the Way'
  };
  return labels[level];
}

function getCategoryDescription(category: string): string {
  const descriptions = {
    process: 'How well-defined and efficient are your experimentation workflows?',
    strategy: 'How effectively do you align experiments with business goals?',
    insight: 'How do you analyze and implement learnings from experiments?',
    culture: 'How deeply is experimentation embedded in your organization?'
  };
  return descriptions[category as keyof typeof descriptions];
}

function getRecommendations(category: string, score: number): string[] {
  // Implement recommendation logic based on category and score
  return [
    'Establish clear experimentation processes',
    'Define success metrics',
    'Build a culture of testing'
  ];
} 