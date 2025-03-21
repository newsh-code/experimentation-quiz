import { type CategoryKey } from '../types';

export type Persona = {
  title: string;
  description: string;
  recommendations: Array<{
    category: CategoryKey;
    title: string;
    description: string;
  }>;
};

export const PERSONAS: Record<'novice' | 'beginner' | 'intermediate' | 'advanced' | 'expert', Persona> = {
  novice: {
    title: "Experimentation Novice",
    description: "You are at the beginning of your experimentation journey. Focus on building foundational processes and gathering basic data.",
    recommendations: [
      {
        category: 'process',
        title: 'Establish Basic Processes',
        description: 'Start by documenting your current testing procedures and identify areas for improvement.'
      },
      {
        category: 'strategy',
        title: 'Define Clear Goals',
        description: 'Set specific, measurable objectives for your experimentation program.'
      },
      {
        category: 'insight',
        title: 'Data Collection Basics',
        description: 'Implement basic analytics tracking and establish regular reporting practices.'
      },
      {
        category: 'culture',
        title: 'Build Awareness',
        description: 'Share initial results with stakeholders to build support for experimentation.'
      }
    ]
  },
  beginner: {
    title: "Experimentation Beginner",
    description: "You've started implementing basic experimentation practices. Focus on expanding your testing capabilities and improving data analysis.",
    recommendations: [
      {
        category: 'process',
        title: 'Standardize Testing',
        description: 'Create templates and guidelines for running experiments consistently.'
      },
      {
        category: 'strategy',
        title: 'Align with Business',
        description: 'Connect your tests to key business metrics and objectives.'
      },
      {
        category: 'insight',
        title: 'Enhance Analysis',
        description: 'Implement more sophisticated data analysis techniques and visualization tools.'
      },
      {
        category: 'culture',
        title: 'Expand Participation',
        description: 'Encourage more team members to participate in experimentation.'
      }
    ]
  },
  intermediate: {
    title: "Experimentation Intermediate",
    description: "You have a solid foundation in experimentation. Focus on scaling your program and improving efficiency.",
    recommendations: [
      {
        category: 'process',
        title: 'Optimize Workflow',
        description: 'Implement automation tools to streamline your testing process.'
      },
      {
        category: 'strategy',
        title: 'Strategic Planning',
        description: 'Develop a roadmap for scaling your experimentation program.'
      },
      {
        category: 'insight',
        title: 'Advanced Analytics',
        description: 'Utilize advanced statistical methods and predictive analytics.'
      },
      {
        category: 'culture',
        title: 'Foster Innovation',
        description: 'Create an environment that encourages creative testing approaches.'
      }
    ]
  },
  advanced: {
    title: "Experimentation Advanced",
    description: "You have a mature experimentation program. Focus on optimization and advanced techniques.",
    recommendations: [
      {
        category: 'process',
        title: 'Continuous Improvement',
        description: 'Regularly review and optimize your testing methodology.'
      },
      {
        category: 'strategy',
        title: 'Long-term Vision',
        description: 'Develop a comprehensive strategy for sustained growth.'
      },
      {
        category: 'insight',
        title: 'Predictive Modeling',
        description: 'Implement machine learning models for test prediction.'
      },
      {
        category: 'culture',
        title: 'Knowledge Sharing',
        description: 'Establish a center of excellence for experimentation.'
      }
    ]
  },
  expert: {
    title: "Experimentation Expert",
    description: "You have mastered the art of experimentation. Focus on innovation and pushing boundaries.",
    recommendations: [
      {
        category: 'process',
        title: 'Innovation Lab',
        description: 'Create a dedicated space for testing cutting-edge ideas.'
      },
      {
        category: 'strategy',
        title: 'Industry Leadership',
        description: 'Share your expertise and influence industry standards.'
      },
      {
        category: 'insight',
        title: 'AI Integration',
        description: 'Leverage artificial intelligence for automated testing and optimization.'
      },
      {
        category: 'culture',
        title: 'Global Impact',
        description: 'Extend your experimentation culture across global teams.'
      }
    ]
  }
}; 