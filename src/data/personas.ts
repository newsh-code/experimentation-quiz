import { CategoryKey } from '../types';

export interface Recommendation {
  category: CategoryKey;
  title: string;
  description: string;
  items?: string[];
}

export interface Persona {
  title: string;
  description: string;
  recommendations: Recommendation[];
}

export const PERSONAS = {
  novice: {
    title: 'Experimentation Novice',
    description: 'You are at the beginning of your experimentation journey. Focus on building foundational processes and gathering basic data.',
  },
  beginner: {
    title: 'Developing Experimenter',
    description: 'You have started implementing experimentation practices. Work on strengthening your methodology and expanding test coverage.',
  },
  intermediate: {
    title: 'Established Experimenter',
    description: 'You have a solid experimentation foundation. Focus on scaling your program and enhancing analysis capabilities.',
  },
  advanced: {
    title: 'Expert Experimenter',
    description: 'You have a sophisticated experimentation program. Continue innovating and leading industry best practices.',
  },
  expert: {
    title: 'Experimentation Leader',
    description: 'You are at the forefront of experimentation excellence. Focus on pioneering new methodologies and sharing knowledge.',
  },
} as const; 