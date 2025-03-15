export interface Question {
  id: number;
  category: 'process' | 'strategy' | 'insight' | 'culture';
  text: string;
  options: string[];
}

export const QUESTIONS: Question[] = [
  // Process Questions
  {
    id: 0,
    category: 'process',
    text: 'How do you manage your experimentation process?',
    options: [
      'We run tests ad-hoc without a formal process',
      'We have a basic process but it\'s not consistently followed',
      'We have a documented process that we usually follow',
      'We have a robust, well-documented process that we always follow'
    ]
  },
  {
    id: 1,
    category: 'process',
    text: 'How do you prioritize experiments?',
    options: [
      'We don\'t have a formal prioritization method',
      'We prioritize based on gut feel and available resources',
      'We use basic metrics like potential impact and effort',
      'We use a comprehensive scoring system with multiple factors'
    ]
  },
  {
    id: 2,
    category: 'process',
    text: 'How do you document your experiments?',
    options: [
      'We don\'t document our experiments consistently',
      'We keep basic records in spreadsheets or documents',
      'We use a standardized template for documentation',
      'We maintain a comprehensive knowledge base with detailed records'
    ]
  },
  {
    id: 3,
    category: 'process',
    text: 'How do you handle quality assurance for experiments?',
    options: [
      'We do minimal testing before launch',
      'We do basic QA checks on major browsers',
      'We follow a QA checklist with multiple environments',
      'We have automated testing and thorough QA processes'
    ]
  },
  {
    id: 4,
    category: 'process',
    text: 'How do you manage experiment duration?',
    options: [
      'We stop tests when we see significant results',
      'We run tests for a predetermined time period',
      'We use sample size calculators to determine duration',
      'We use advanced statistical methods to determine stopping rules'
    ]
  },
  {
    id: 5,
    category: 'process',
    text: 'How do you handle multiple concurrent experiments?',
    options: [
      'We try to avoid running multiple tests at once',
      'We run multiple tests but don\'t track interactions',
      'We plan test interactions and avoid conflicts',
      'We use sophisticated methods to manage multiple tests'
    ]
  },
  // Strategy Questions
  {
    id: 6,
    category: 'strategy',
    text: 'How do you align experiments with business objectives?',
    options: [
      'We don\'t explicitly align tests with objectives',
      'We loosely connect tests to department goals',
      'We map experiments to specific business KPIs',
      'We have a strategic experimentation roadmap'
    ]
  },
  {
    id: 7,
    category: 'strategy',
    text: 'How do you generate test ideas?',
    options: [
      'We test based on stakeholder requests',
      'We brainstorm ideas within our team',
      'We use data and user research to generate ideas',
      'We use a systematic approach combining multiple sources'
    ]
  },
  {
    id: 8,
    category: 'strategy',
    text: 'How do you measure experiment success?',
    options: [
      'We focus on conversion rate only',
      'We track a few key metrics per test',
      'We use primary and secondary metrics',
      'We measure both short and long-term impact'
    ]
  },
  {
    id: 9,
    category: 'strategy',
    text: 'How do you handle failed experiments?',
    options: [
      'We move on to the next test',
      'We try to understand why it failed',
      'We document learnings and iterate',
      'We have a systematic process for learning from failures'
    ]
  },
  {
    id: 10,
    category: 'strategy',
    text: 'How do you approach seasonal changes?',
    options: [
      'We don\'t account for seasonality',
      'We avoid testing during major seasons',
      'We plan our testing calendar around seasons',
      'We have sophisticated seasonal adjustment methods'
    ]
  },
  {
    id: 11,
    category: 'strategy',
    text: 'How do you handle experiment costs?',
    options: [
      'We don\'t track experiment costs',
      'We track basic implementation costs',
      'We calculate ROI for major experiments',
      'We have a comprehensive cost-benefit analysis'
    ]
  },
  // Insight Questions
  {
    id: 12,
    category: 'insight',
    text: 'How do you analyze experiment results?',
    options: [
      'We look at top-line results only',
      'We do basic statistical significance testing',
      'We analyze segments and use confidence intervals',
      'We use advanced statistical methods and ML'
    ]
  },
  {
    id: 13,
    category: 'insight',
    text: 'How do you handle data quality?',
    options: [
      'We trust the data as is',
      'We do basic data cleaning',
      'We have standard data quality checks',
      'We use automated data validation systems'
    ]
  },
  {
    id: 14,
    category: 'insight',
    text: 'How do you share experiment results?',
    options: [
      'We share results informally',
      'We send regular email updates',
      'We have structured sharing sessions',
      'We maintain a searchable knowledge base'
    ]
  },
  {
    id: 15,
    category: 'insight',
    text: 'How do you track long-term impact?',
    options: [
      'We don\'t track long-term impact',
      'We occasionally check past winners',
      'We regularly monitor implemented changes',
      'We have systematic long-term impact analysis'
    ]
  },
  {
    id: 16,
    category: 'insight',
    text: 'How do you use qualitative data?',
    options: [
      'We rarely use qualitative data',
      'We occasionally gather user feedback',
      'We regularly incorporate user research',
      'We integrate multiple qualitative data sources'
    ]
  },
  {
    id: 17,
    category: 'insight',
    text: 'How do you handle unexpected results?',
    options: [
      'We accept the results as they are',
      'We double-check our implementation',
      'We investigate potential causes',
      'We have a systematic investigation process'
    ]
  },
  // Culture Questions
  {
    id: 18,
    category: 'culture',
    text: 'How is experimentation perceived in your organization?',
    options: [
      'It\'s seen as optional or nice-to-have',
      'It\'s important for some teams',
      'It\'s valued across the organization',
      'It\'s fundamental to our decision-making'
    ]
  },
  {
    id: 19,
    category: 'culture',
    text: 'How do teams collaborate on experiments?',
    options: [
      'Teams work independently',
      'There\'s some cross-team communication',
      'We have regular cross-functional collaboration',
      'We have integrated experimentation workflows'
    ]
  },
  {
    id: 20,
    category: 'culture',
    text: 'How do you handle experiment-related conflicts?',
    options: [
      'Through management escalation',
      'Through informal discussion',
      'Through structured resolution processes',
      'Through data-driven decision frameworks'
    ]
  },
  {
    id: 21,
    category: 'culture',
    text: 'How do you approach experimentation training?',
    options: [
      'We learn on the job',
      'We provide basic onboarding',
      'We have regular training sessions',
      'We have comprehensive development programs'
    ]
  },
  {
    id: 22,
    category: 'culture',
    text: 'How do you celebrate experimentation?',
    options: [
      'We don\'t specifically celebrate experiments',
      'We informally acknowledge successes',
      'We regularly recognize achievements',
      'We have formal recognition programs'
    ]
  },
  {
    id: 23,
    category: 'culture',
    text: 'How do you handle resistance to experimentation?',
    options: [
      'We avoid confronting resistance',
      'We try to address concerns as they arise',
      'We proactively address common objections',
      'We have change management processes'
    ]
  }
]; 