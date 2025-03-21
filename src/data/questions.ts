export interface Question {
  id: number;
  category: 'process' | 'strategy' | 'insight' | 'culture';
  text: string;
  options: Array<{
    text: string;
    score: number;
  }>;
}

export const QUESTIONS: Question[] = [
  // Process Questions
  {
    id: 0,
    category: 'process',
    text: 'How do you manage your experimentation process?',
    options: [
      { text: 'We run tests ad-hoc without a formal process', score: 1 },
      { text: 'We have a basic process but it\'s not consistently followed', score: 2 },
      { text: 'We have a documented process that we usually follow', score: 3 },
      { text: 'We have a robust, well-documented process that we always follow', score: 4 }
    ]
  },
  {
    id: 1,
    category: 'process',
    text: 'How do you prioritize experiments?',
    options: [
      { text: 'We don\'t have a formal prioritization method', score: 1 },
      { text: 'We prioritize based on gut feel and available resources', score: 2 },
      { text: 'We use basic metrics like potential impact and effort', score: 3 },
      { text: 'We use a comprehensive scoring system with multiple factors', score: 4 }
    ]
  },
  {
    id: 2,
    category: 'process',
    text: 'How do you document your experiments?',
    options: [
      { text: 'We don\'t document our experiments consistently', score: 1 },
      { text: 'We keep basic records in spreadsheets or documents', score: 2 },
      { text: 'We use a standardized template for documentation', score: 3 },
      { text: 'We maintain a comprehensive knowledge base with detailed records', score: 4 }
    ]
  },
  {
    id: 3,
    category: 'process',
    text: 'How do you handle quality assurance for experiments?',
    options: [
      { text: 'We do minimal testing before launch', score: 1 },
      { text: 'We do basic QA checks on major browsers', score: 2 },
      { text: 'We follow a QA checklist with multiple environments', score: 3 },
      { text: 'We have automated testing and thorough QA processes', score: 4 }
    ]
  },
  {
    id: 4,
    category: 'process',
    text: 'How do you manage experiment duration?',
    options: [
      { text: 'We stop tests when we see significant results', score: 1 },
      { text: 'We run tests for a predetermined time period', score: 2 },
      { text: 'We use sample size calculators to determine duration', score: 3 },
      { text: 'We use advanced statistical methods to determine stopping rules', score: 4 }
    ]
  },
  {
    id: 5,
    category: 'process',
    text: 'How do you handle multiple concurrent experiments?',
    options: [
      { text: 'We try to avoid running multiple tests at once', score: 1 },
      { text: 'We run multiple tests but don\'t track interactions', score: 2 },
      { text: 'We plan test interactions and avoid conflicts', score: 3 },
      { text: 'We use sophisticated methods to manage multiple tests', score: 4 }
    ]
  },
  // Strategy Questions
  {
    id: 6,
    category: 'strategy',
    text: 'How do you align experiments with business objectives?',
    options: [
      { text: 'We don\'t explicitly align tests with objectives', score: 1 },
      { text: 'We loosely connect tests to department goals', score: 2 },
      { text: 'We map experiments to specific business KPIs', score: 3 },
      { text: 'We have a strategic experimentation roadmap', score: 4 }
    ]
  },
  {
    id: 7,
    category: 'strategy',
    text: 'How do you generate test ideas?',
    options: [
      { text: 'We test based on stakeholder requests', score: 1 },
      { text: 'We brainstorm ideas within our team', score: 2 },
      { text: 'We use data and user research to generate ideas', score: 3 },
      { text: 'We use a systematic approach combining multiple sources', score: 4 }
    ]
  },
  {
    id: 8,
    category: 'strategy',
    text: 'How do you measure experiment success?',
    options: [
      { text: 'We focus on conversion rate only', score: 1 },
      { text: 'We track a few key metrics per test', score: 2 },
      { text: 'We use primary and secondary metrics', score: 3 },
      { text: 'We measure both short and long-term impact', score: 4 }
    ]
  },
  {
    id: 9,
    category: 'strategy',
    text: 'How do you handle failed experiments?',
    options: [
      { text: 'We move on to the next test', score: 1 },
      { text: 'We try to understand why it failed', score: 2 },
      { text: 'We document learnings and iterate', score: 3 },
      { text: 'We have a systematic process for learning from failures', score: 4 }
    ]
  },
  {
    id: 10,
    category: 'strategy',
    text: 'How do you approach seasonal changes?',
    options: [
      { text: 'We don\'t account for seasonality', score: 1 },
      { text: 'We avoid testing during major seasons', score: 2 },
      { text: 'We plan our testing calendar around seasons', score: 3 },
      { text: 'We have sophisticated seasonal adjustment methods', score: 4 }
    ]
  },
  {
    id: 11,
    category: 'strategy',
    text: 'How do you handle experiment costs?',
    options: [
      { text: 'We don\'t track experiment costs', score: 1 },
      { text: 'We track basic implementation costs', score: 2 },
      { text: 'We calculate ROI for major experiments', score: 3 },
      { text: 'We have a comprehensive cost-benefit analysis', score: 4 }
    ]
  },
  // Insight Questions
  {
    id: 12,
    category: 'insight',
    text: 'How do you analyze experiment results?',
    options: [
      { text: 'We look at top-line results only', score: 1 },
      { text: 'We do basic statistical significance testing', score: 2 },
      { text: 'We analyze segments and use confidence intervals', score: 3 },
      { text: 'We use advanced statistical methods and ML', score: 4 }
    ]
  },
  {
    id: 13,
    category: 'insight',
    text: 'How do you handle data quality?',
    options: [
      { text: 'We trust the data as is', score: 1 },
      { text: 'We do basic data cleaning', score: 2 },
      { text: 'We have standard data quality checks', score: 3 },
      { text: 'We use automated data validation systems', score: 4 }
    ]
  },
  {
    id: 14,
    category: 'insight',
    text: 'How do you share experiment results?',
    options: [
      { text: 'We share results informally', score: 1 },
      { text: 'We send regular email updates', score: 2 },
      { text: 'We have structured sharing sessions', score: 3 },
      { text: 'We maintain a searchable knowledge base', score: 4 }
    ]
  },
  {
    id: 15,
    category: 'insight',
    text: 'How do you track long-term impact?',
    options: [
      { text: 'We don\'t track long-term impact', score: 1 },
      { text: 'We occasionally check past winners', score: 2 },
      { text: 'We regularly monitor implemented changes', score: 3 },
      { text: 'We have systematic long-term impact analysis', score: 4 }
    ]
  },
  {
    id: 16,
    category: 'insight',
    text: 'How do you use qualitative data?',
    options: [
      { text: 'We rarely use qualitative data', score: 1 },
      { text: 'We occasionally gather user feedback', score: 2 },
      { text: 'We regularly incorporate user research', score: 3 },
      { text: 'We integrate multiple qualitative data sources', score: 4 }
    ]
  },
  {
    id: 17,
    category: 'insight',
    text: 'How do you handle unexpected results?',
    options: [
      { text: 'We accept the results as they are', score: 1 },
      { text: 'We double-check our implementation', score: 2 },
      { text: 'We investigate potential causes', score: 3 },
      { text: 'We have a systematic investigation process', score: 4 }
    ]
  },
  // Culture Questions
  {
    id: 18,
    category: 'culture',
    text: 'How is experimentation perceived in your organization?',
    options: [
      { text: 'It\'s seen as optional or nice-to-have', score: 1 },
      { text: 'It\'s important for some teams', score: 2 },
      { text: 'It\'s valued across the organization', score: 3 },
      { text: 'It\'s fundamental to our decision-making', score: 4 }
    ]
  },
  {
    id: 19,
    category: 'culture',
    text: 'How do teams collaborate on experiments?',
    options: [
      { text: 'Teams work independently', score: 1 },
      { text: 'There\'s some cross-team communication', score: 2 },
      { text: 'We have regular cross-functional collaboration', score: 3 },
      { text: 'We have integrated experimentation workflows', score: 4 }
    ]
  },
  {
    id: 20,
    category: 'culture',
    text: 'How do you handle experiment-related conflicts?',
    options: [
      { text: 'Through management escalation', score: 1 },
      { text: 'Through informal discussion', score: 2 },
      { text: 'Through structured resolution processes', score: 3 },
      { text: 'Through data-driven decision frameworks', score: 4 }
    ]
  },
  {
    id: 21,
    category: 'culture',
    text: 'How do you approach experimentation training?',
    options: [
      { text: 'We learn on the job', score: 1 },
      { text: 'We provide basic onboarding', score: 2 },
      { text: 'We have regular training sessions', score: 3 },
      { text: 'We have comprehensive development programs', score: 4 }
    ]
  },
  {
    id: 22,
    category: 'culture',
    text: 'How do you celebrate experimentation?',
    options: [
      { text: 'We don\'t specifically celebrate experiments', score: 1 },
      { text: 'We informally acknowledge successes', score: 2 },
      { text: 'We regularly recognize achievements', score: 3 },
      { text: 'We have formal recognition programs', score: 4 }
    ]
  },
  {
    id: 23,
    category: 'culture',
    text: 'How do you handle resistance to experimentation?',
    options: [
      { text: 'We avoid confronting resistance', score: 1 },
      { text: 'We try to address concerns as they arise', score: 2 },
      { text: 'We proactively address common objections', score: 3 },
      { text: 'We have change management processes', score: 4 }
    ]
  }
]; 