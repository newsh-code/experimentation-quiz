import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Transition, Dialog } from '@headlessui/react';
import { useQuiz } from '../context/QuizContext';
import { generatePDFReport } from '../services/pdfService';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function EmailCapturePage() {
  const { state, dispatch } = useQuiz();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
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

      // Save user data to quiz state
      dispatch({
        type: 'SUBMIT_EMAIL',
        email,
        userData,
      });

      // Generate PDF
      await generatePDFReport({
        ...state,
        email,
        userData,
      });

      setShowSuccessDialog(true);
      
      // Delay the transition to results page
      setTimeout(() => {
        dispatch({ type: 'GO_TO_RESULTS' });
      }, 2000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSkip = () => {
    dispatch({ type: 'GO_TO_RESULTS' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Quiz Complete!
            </h2>
            <p className="text-gray-600">
              Get your detailed report and personalized recommendations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  bg-white text-gray-900 placeholder-gray-400
                  transition-colors duration-200"
                placeholder="Your name (optional)"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  bg-white text-gray-900 placeholder-gray-400
                  transition-colors duration-200"
                placeholder="your@email.com (optional)"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  bg-white text-gray-900 placeholder-gray-400
                  transition-colors duration-200"
                placeholder="Your company name (optional)"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isGeneratingPDF}
                className={`w-full px-6 py-3 rounded-lg font-medium text-white 
                  ${isGeneratingPDF ? 'bg-primary-400' : 'bg-primary-500 hover:bg-primary-600'} 
                  transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center`}
              >
                {isGeneratingPDF ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Generating Report...
                  </>
                ) : (
                  'Get My Report'
                )}
              </motion.button>

              <button
                type="button"
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 
                  transition-colors duration-200"
              >
                Skip and see results
              </button>
            </div>
          </form>

          <p className="mt-6 text-xs text-center text-gray-500">
            We respect your privacy and will never share your information with third parties.
          </p>
        </motion.div>
      </div>

      <Transition show={showSuccessDialog} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setShowSuccessDialog(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  🎉 Report Generated Successfully!
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Your report has been generated and downloaded. Taking you to your results...
                  </p>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 