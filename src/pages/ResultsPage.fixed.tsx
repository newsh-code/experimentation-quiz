import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import { RadarChart } from '../components/ui/RadarChart';
import { PERSONAS } from '../data/personas';
import { type CategoryKey } from '../types';
import { useRouter } from 'next/router';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { cn } from '../lib/utils';

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  process: 'Process',
  strategy: 'Strategy',
  insight: 'Insight',
  culture: 'Culture',
};

const CATEGORY_DESCRIPTIONS: Record<CategoryKey, Record<'low' | 'medium' | 'high', string>> = {
  process: {
    low: 'Your experimentation process is in its early stages. Focus on establishing consistent practices.',
    medium: 'You have a foundation for experimentation but could benefit from more structure.',
    high: 'You have a mature, well-structured experimentation process in place.',
  },
  strategy: {
    low: 'Your experimentation strategy needs development. Start by aligning tests with business goals.',
    medium: 'Your strategy shows promise but could use more systematic planning.',
    high: 'Your strategic approach to experimentation is sophisticated and business-aligned.',
  },
  insight: {
    low: "You're beginning to gather insights. Work on improving data collection and analysis.",
    medium: 'You extract valuable insights but could enhance your analysis methods.',
    high: 'You excel at deriving and applying insights from your experiments.',
  },
  culture: {
    low: 'Your experimentation culture is emerging. Focus on building buy-in and engagement.',
    medium: 'You have good cultural foundations but could strengthen experimentation advocacy.',
    high: 'You have a strong culture of experimentation embedded in your organisation.',
  },
};

const CATEGORY_ICONS: Record<CategoryKey, React.ReactNode> = {
  process: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
    </svg>
  ),
  strategy: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  insight: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  culture: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const getScoreLevel = (score: number): 'low' | 'medium' | 'high' =>
  score < 40 ? 'low' : score < 70 ? 'medium' : 'high';

const getScoreColor = (score: number): string => {
  if (score < 40) return '#ef4444';
  if (score < 70) return '#f59e0b';
  return '#22c55e';
};

const getPersonaLevel = (score: number): keyof typeof PERSONAS => {
  if (score < 20) return 'novice';
  if (score < 40) return 'beginner';
  if (score < 60) return 'intermediate';
  if (score < 80) return 'advanced';
  return 'expert';
};

const getNextStep = (score: number) =>
  score > 75
    ? { text: "Based on your score, you'd be a strong fit for the", linkText: 'Experimentation Accelerator®', href: 'https://kyznacademy.com/accelerator/' }
    : { text: 'Based on where you are, a', linkText: 'Conversion Clarity Call', href: 'https://cal.com/kyznacademy/clarity' };

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

// ── Sub-components ────────────────────────────────────────────────────────────

function ScoreDisplay({ score }: { score: number }) {
  const [current, setCurrent] = useState(0);
  const color = getScoreColor(score);

  useEffect(() => {
    const steps = 60;
    const increment = score / steps;
    let frame = 0;
    let value = 0;
    const timer = setInterval(() => {
      value += increment;
      frame++;
      if (frame >= steps) { setCurrent(score); clearInterval(timer); return; }
      setCurrent(Math.min(Math.round(value), score));
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center">
        {/* Pulsating glow behind the number */}
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background: color,
            animation: 'score-glow 2.5s ease-in-out infinite',
          }}
        />
        <span
          className="relative tabular-nums leading-none"
          style={{
            fontFamily: 'RecklessCondensed, Georgia, serif',
            fontWeight: 400,
            fontSize: 'clamp(5rem, 15vw, 8rem)',
            color,
          }}
        >
          {current}%
        </span>
      </div>
      <span className="text-xs text-gray-400 font-light tracking-widest uppercase">Maturity Score</span>
    </div>
  );
}

function CategoryCard({ category, score, description }: { category: CategoryKey; score: number; description: string }) {
  const [width, setWidth] = useState(0);
  const color = getScoreColor(score);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 200);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex w-7 h-7 items-center justify-center rounded-lg flex-shrink-0"
            style={{ color: '#7a00df', background: 'rgba(122,0,223,0.08)' }}
          >
            {CATEGORY_ICONS[category]}
          </span>
          <span
            className="text-[10px] font-medium tracking-widest uppercase"
            style={{ color: '#7a00df' }}
          >
            {CATEGORY_LABELS[category]}
          </span>
        </div>
        <span className="text-lg font-medium tabular-nums" style={{ color }}>{score}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>

      <p className="text-sm text-gray-500 font-light leading-relaxed">{description}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { state, dispatch } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    if (!state.isComplete || state.percentageScore === undefined) {
      router.push('/quiz');
    }
  }, [state.isComplete, state.percentageScore, router]);

  if (state.isLoading || !state.scores || !state.categoryPercentages) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="large" />
          <p className="text-sm text-gray-400 font-light">Calculating your results...</p>
        </div>
      </div>
    );
  }

  if (!state.isComplete || Object.keys(state.answers).length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-400 font-light">No results available. Please complete the quiz first.</p>
          <button
            onClick={() => router.push('/quiz')}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7a00df, #a855f7)' }}
          >
            Take the quiz
          </button>
        </div>
      </div>
    );
  }

  const percentageScore = state.percentageScore ?? 0;
  const persona = PERSONAS[getPersonaLevel(percentageScore)];
  const nextStep = getNextStep(percentageScore);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-5 w-full border-b border-gray-100">
        <img src="/images/k-v4-black.png" alt="Kyzn Academy" className="h-8 w-auto" />
        <a
          href="https://kyznacademy.com"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-light"
        >
          Back to site
        </a>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16 space-y-16">

          {/* ── Section 1: Score hero ───────────────────────────────────────── */}
          <motion.section
            initial="initial"
            animate="animate"
            variants={stagger}
            className="rounded-2xl border border-gray-100 bg-white px-8 py-12 flex flex-col items-center text-center space-y-6"
          >
            <motion.div variants={fadeUp}>
              <ScoreDisplay score={percentageScore} />
            </motion.div>

            {persona.imageUrl && (
              <motion.img
                variants={fadeUp}
                src={persona.imageUrl}
                alt={persona.title}
                className="h-40 sm:h-52 w-auto object-contain"
              />
            )}

            <motion.div variants={fadeUp} className="space-y-3 max-w-2xl">
              <h1
                className="text-4xl sm:text-5xl leading-tight"
                style={{ fontFamily: 'RecklessCondensed, Georgia, serif', fontWeight: 400, color: '#7a00df' }}
              >
                {persona.title}
              </h1>
              <p className="text-base text-gray-500 font-light leading-relaxed">
                {persona.description}
              </p>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-gray-400 font-light">
              {nextStep.text}{' '}
              <a
                href={nextStep.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
                style={{ color: '#7a00df' }}
              >
                {nextStep.linkText}
              </a>
              {percentageScore > 75 ? '.' : ' would give you the most immediate direction.'}
            </motion.p>
          </motion.section>

          {/* ── Section 2: Category breakdown ──────────────────────────────── */}
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="space-y-2">
              <h2
                className="text-3xl sm:text-4xl text-gray-900"
                style={{ fontFamily: 'RecklessCondensed, Georgia, serif', fontWeight: 400 }}
              >
                Your Performance Profile
              </h2>
              <p className="text-sm text-gray-500 font-light">
                How you score across the four key dimensions of experimentation maturity.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
              {(Object.entries(state.scores) as [CategoryKey, number][]).map(([category, score]) => (
                <CategoryCard
                  key={category}
                  category={category}
                  score={score ?? 0}
                  description={CATEGORY_DESCRIPTIONS[category][getScoreLevel(score ?? 0)]}
                />
              ))}
            </motion.div>
          </motion.section>

          {/* ── Section 3: Radar chart ─────────────────────────────────────── */}
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="space-y-2">
              <h2
                className="text-3xl sm:text-4xl text-gray-900"
                style={{ fontFamily: 'RecklessCondensed, Georgia, serif', fontWeight: 400 }}
              >
                Performance Analysis
              </h2>
              <p className="text-sm text-gray-500 font-light">
                Visualise your scores across all four dimensions at a glance.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-xl border border-gray-100 bg-white p-6 flex items-center justify-center"
            >
              <RadarChart
                data={[
                  { category: 'Process', score: state.categoryPercentages.process ?? 0 },
                  { category: 'Strategy', score: state.categoryPercentages.strategy ?? 0 },
                  { category: 'Insight', score: state.categoryPercentages.insight ?? 0 },
                  { category: 'Culture', score: state.categoryPercentages.culture ?? 0 },
                ]}
                className="max-w-lg mx-auto w-full"
              />
            </motion.div>
          </motion.section>

          {/* ── Section 4: Recommendations ────────────────────────────────── */}
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="space-y-2">
              <h2
                className="text-3xl sm:text-4xl text-gray-900"
                style={{ fontFamily: 'RecklessCondensed, Georgia, serif', fontWeight: 400 }}
              >
                Personalised Recommendations
              </h2>
              <p className="text-sm text-gray-500 font-light">
                Specific actions to advance your experimentation programme, based on your score.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
              {persona.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-100 bg-white p-5 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex w-7 h-7 items-center justify-center rounded-lg flex-shrink-0"
                      style={{ color: '#7a00df', background: 'rgba(122,0,223,0.08)' }}
                    >
                      {CATEGORY_ICONS[rec.category]}
                    </span>
                    <h3
                      className="text-lg text-gray-900 leading-snug"
                      style={{ fontFamily: 'RecklessCondensed, Georgia, serif', fontWeight: 400 }}
                    >
                      {rec.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">{rec.description}</p>
                </div>
              ))}
            </motion.div>
          </motion.section>

          {/* ── Section 5: What's Next CTA ────────────────────────────────── */}
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-gray-100 px-8 py-12 text-center space-y-5"
              style={{ background: 'rgba(122,0,223,0.03)' }}
            >
              <h2
                className="text-3xl sm:text-4xl text-gray-900"
                style={{ fontFamily: 'RecklessCondensed, Georgia, serif', fontWeight: 400 }}
              >
                What&apos;s Next?
              </h2>
              <p className="text-sm text-gray-500 font-light max-w-md mx-auto leading-relaxed">
                Share your results, or book a call to talk through what the recommendations mean for your programme in practice.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href="https://cal.com/kyznacademy/intro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-2 px-8 py-3 rounded-full text-white text-sm font-medium',
                    'transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                  )}
                  style={{ background: 'linear-gradient(135deg, #7a00df, #a855f7)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book a Call
                </a>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'My Experimentation Maturity Score', text: `I scored ${percentageScore}% on the Kyzn Academy Experimentation Maturity Quiz. Find out your score:`, url: window.location.origin });
                    } else {
                      navigator.clipboard.writeText(window.location.origin);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-800 transition-all duration-200 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Results
                </button>
              </div>
            </motion.div>
          </motion.section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-6 text-center space-y-2">
        <button
          onClick={() => { dispatch({ type: 'RESET_QUIZ' }); router.push('/'); }}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-light cursor-pointer underline underline-offset-4"
        >
          Retake the quiz
        </button>
        <p className="text-xs text-gray-400 font-light">
          &copy; {new Date().getFullYear()} Kyzn Academy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
