import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { QuizProvider } from '../context/QuizContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QuizProvider>
        <Component {...pageProps} />
      </QuizProvider>
    </ThemeProvider>
  );
} 