import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useQuiz } from '../context/QuizContext';
import { generatePDFReport } from '../services/pdfService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/Dialog';
import { cn } from '../lib/utils';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function EmailCapturePage() {
  const router = useRouter();
  const { state, dispatch } = useQuiz();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsGeneratingPDF(true);

    try {
      const userData = {
        name,
        email,
        company,
        timestamp: new Date().toISOString(),
      };

      dispatch({
        type: 'SUBMIT_EMAIL',
        email,
        userData,
      });

      await generatePDFReport({
        ...state,
        email,
        userData,
      });

      setShowSuccessDialog(true);
      
      setTimeout(() => {
        router.push('/results');
      }, 2000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSkip = () => {
    dispatch({ type: 'SKIP_EMAIL' });
    router.push('/results');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container max-w-lg mx-auto px-4 py-16">
        <motion.div
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
          className="space-y-8"
        >
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600">
              🎉 Quiz Complete!
            </h1>
            <p className="text-xl text-muted-foreground">
              Get your detailed report and personalized recommendations
            </p>
          </motion.div>

          <Card className="bg-card/50 backdrop-blur-sm border-2">
            <CardContent className="pt-6">
              <motion.form 
                variants={fadeInUp} 
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                    <Input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name (optional)"
                      className="w-full h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com (optional)"
                      className="w-full h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">Company</Label>
                    <Input
                      type="text"
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Your company name (optional)"
                      className="w-full h-11"
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="animate-in fade-in-50">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4 pt-2">
                  <Button
                    type="submit"
                    disabled={isGeneratingPDF}
                    className={cn(
                      "w-full h-11 font-medium shadow-lg hover:shadow-xl transition-all",
                      "bg-primary hover:bg-primary/90",
                      "text-primary-foreground",
                      isGeneratingPDF && "opacity-90"
                    )}
                  >
                    {isGeneratingPDF ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoadingSpinner size="small" />
                        <span>Generating Report...</span>
                      </div>
                    ) : (
                      'Get My Report'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSkip}
                    className="w-full h-11 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip and see results
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/10">
                  <p className="text-sm text-center text-muted-foreground">
                    We respect your privacy and will never share your information with third parties.
                  </p>
                </div>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">🎉</span> Report Generated!
            </DialogTitle>
            <p className="text-muted-foreground pt-2">
              Your report has been generated and downloaded. Taking you to your results...
            </p>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
} 