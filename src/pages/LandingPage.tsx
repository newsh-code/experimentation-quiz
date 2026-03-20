import React from 'react';
import { motion } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import { useRouter } from 'next/router';
import { cn } from '../lib/utils';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const features = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Quick Assessment',
    description: 'Answer questions across four key dimensions — process, strategy, insight, and culture — in about 5 minutes.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Actionable Insights',
    description: 'Receive a personalised maturity score with specific recommendations to level up.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Personalised Roadmap',
    description: 'Get specific next steps based on where you are — not generic advice, but actions matched to your score.',
  },
];

export default function LandingPage() {
  const { dispatch } = useQuiz();
  const router = useRouter();

  const handleStartQuiz = async () => {
    try {
      dispatch({ type: 'RESET_QUIZ' });
      dispatch({ type: 'START_QUIZ' });
      await router.push('/quiz');
    } catch {
      dispatch({ type: 'RESET_QUIZ' });
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Animated blob background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.12] blur-3xl animate-blob"
          style={{ background: 'radial-gradient(circle, #7a00df, #a855f7)', animationDelay: '0s' }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.10] blur-3xl animate-blob"
          style={{ background: 'radial-gradient(circle, #0693e3, #7a00df)', animationDelay: '4s' }}
        />
        <div
          className="absolute -bottom-20 left-1/4 w-[450px] h-[450px] rounded-full opacity-[0.10] blur-3xl animate-blob"
          style={{ background: 'radial-gradient(circle, #a855f7, #ff6900)', animationDelay: '8s' }}
        />
      </div>

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center">
          <img src="/images/k-v4-black.png" alt="Kyzn Academy" className="h-8 w-auto" />
        </div>
        <a
          href="https://kyznacademy.com"
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-light"
        >
          Back to site
        </a>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="flex flex-col items-center justify-center text-center px-6 pt-12 pb-20 sm:pt-20 sm:pb-28 max-w-4xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="space-y-6 sm:space-y-8"
          >
            {/* Label */}
            <motion.div variants={fadeUp}>
              <span
                className="inline-block text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full border"
                style={{ color: '#7a00df', borderColor: 'rgba(122,0,223,0.25)', background: 'rgba(122,0,223,0.05)' }}
              >
                Free Assessment
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="text-[2.8rem] sm:text-[4.5rem] leading-[1.05] tracking-tight text-gray-900"
              style={{ fontFamily: 'RecklessCondensed, Georgia, serif', fontWeight: 300 }}
            >
              Discover Your{' '}
              <br className="hidden sm:block" />
              <em
                className="not-italic"
                style={{ color: '#7a00df' }}
              >
                Experimentation
              </em>
              <br className="hidden sm:block" />
              Maturity
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed font-light"
            >
              A 5-minute assessment to benchmark your organisation&apos;s experimentation capability
              and get a personalised roadmap for growth.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 pt-2">
              <button
                onClick={handleStartQuiz}
                className={cn(
                  'group inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-medium',
                  'transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                )}
                style={{ background: 'linear-gradient(135deg, #7a00df, #a855f7)' }}
              >
                Start the quiz
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <p className="text-xs text-gray-400 font-light">
                Takes about 5 minutes &nbsp;·&nbsp; No registration required
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Divider line */}
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="border-t border-gray-100" />
        </div>

        {/* Features */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="flex flex-col items-center text-center gap-3"
              >
                <div
                  className="inline-flex w-10 h-10 items-center justify-center rounded-xl"
                  style={{ color: '#7a00df', background: 'rgba(122,0,223,0.08)' }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="text-lg text-gray-900"
                  style={{ fontFamily: 'RecklessCondensed, Georgia, serif', fontWeight: 400, fontSize: '1.2rem' }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-light">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-100 py-6 px-6 text-center">
        <p className="text-xs text-gray-400 font-light">
          &copy; {new Date().getFullYear()} Kyzn Academy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
