import type { AppProps } from 'next/app';
import { QuizProvider } from '../context/QuizContext';
import { MantineProvider } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const preferredColorScheme = useColorScheme();

  return (
    <MantineProvider
      defaultColorScheme={preferredColorScheme}
      theme={{
        primaryColor: 'blue',
        fontFamily: 'Inter, sans-serif',
        defaultRadius: 'md',
        spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem' },
      }}
    >
      <QuizProvider>
        <Component {...pageProps} />
      </QuizProvider>
    </MantineProvider>
  );
} 