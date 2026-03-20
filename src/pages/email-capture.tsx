import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useQuiz } from '../context/QuizContext';
import { PERSONAS } from '../data/personas';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { cn } from '../lib/utils';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function EmailCapturePage() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const userData = { name, email, company };
      dispatch({ type: 'SUBMIT_EMAIL', email, userData });

      if (email) {
        const score = state.percentageScore ?? 0;
        const level =
          score < 20 ? 'novice'
          : score < 40 ? 'beginner'
          : score < 60 ? 'intermediate'
          : score < 80 ? 'advanced'
          : 'expert';
        const personaName = PERSONAS[level].title;

        fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, company, score, personaName }),
        }).catch(err => console.error('MailerLite subscription failed:', err));
      }

      router.push('/results');
    } catch (err) {
      console.error('Error saving details:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    dispatch({ type: 'SKIP_EMAIL' });
    router.push('/results');
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden flex flex-col">
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

      {/* Header */}
      <header className="relative z-10 flex-shrink-0 flex items-center px-6 py-5 w-full">
        <img src="/images/k-v4-black.png" alt="Kyzn Academy" className="h-8 w-auto" />
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-12 max-w-lg mx-auto w-full">
        <motion.div
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-8"
        >
          {/* Heading + value prop */}
          <motion.div variants={fadeUp} className="space-y-3">
            <h1
              className="text-[2.4rem] sm:text-[3rem] leading-tight text-gray-900"
              style={{ fontFamily: 'RecklessCondensed, Georgia, serif', fontWeight: 400 }}
            >
              Your results are ready
            </h1>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              Enter your details to save your score and receive your personalised breakdown
              across all four dimensions. All fields are optional.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form variants={fadeUp} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-11 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 font-light focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-11 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 font-light focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </Label>
              <Input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your organisation"
                className="h-11 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 font-light focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 rounded-lg"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="animate-in fade-in-50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full h-11 rounded-full text-sm font-medium text-white cursor-pointer',
                  'transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
                  isSubmitting && 'opacity-70 cursor-not-allowed'
                )}
                style={{ background: 'linear-gradient(135deg, #7a00df, #a855f7)' }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="small" />
                    Saving...
                  </span>
                ) : (
                  'See My Results'
                )}
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="w-full h-11 text-sm text-gray-400 hover:text-gray-600 transition-colors font-light cursor-pointer"
              >
                Skip and see results
              </button>
            </div>

            <p className="text-xs text-center text-gray-400 font-light">
              We never share your information with third parties.
            </p>
          </motion.form>
        </motion.div>
      </main>
    </div>
  );
}
