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
    text: 'How does a new experiment idea move from initial concept to a live test in your organisation?',
    options: [
      { text: 'There\'s no formal process — tests get run when someone has bandwidth or a strong opinion', score: 1 },
      { text: 'We have a loose process but it varies by team and individual', score: 2 },
      { text: 'We follow a documented workflow: hypothesis → design → QA → launch → analysis', score: 3 },
      { text: 'We have a structured end-to-end programme with defined stages, owners, and agreed SLAs', score: 4 }
    ]
  },
  {
    id: 1,
    category: 'process',
    text: 'How does your team decide which experiments to run next?',
    options: [
      { text: 'Tests are chosen based on stakeholder requests or whoever has the loudest voice', score: 1 },
      { text: 'We use gut feel, rough effort estimates, or which ideas seem most promising', score: 2 },
      { text: 'We use a scoring framework (e.g. PIE, ICE, PXL) to rank and select experiments', score: 3 },
      { text: 'Prioritisation combines research data, business KPI impact, and programme-level strategic planning', score: 4 }
    ]
  },
  {
    id: 2,
    category: 'process',
    text: 'How do you document experiments before they run?',
    options: [
      { text: 'We don\'t — experiment context lives in people\'s heads or ad-hoc messages', score: 1 },
      { text: 'We keep basic notes in a shared doc or spreadsheet, usually after the test is already set up', score: 2 },
      { text: 'We use a pre-test brief that captures hypothesis, metrics, audience, and setup details', score: 3 },
      { text: 'Every experiment has a pre-registered brief, a live-monitoring record, and a post-test report in a searchable repository', score: 4 }
    ]
  },
  {
    id: 3,
    category: 'process',
    text: 'How do you QA experiments before they go live?',
    options: [
      { text: 'We do a quick visual check and ship — bugs get caught in the wild', score: 1 },
      { text: 'We manually check the variant on a few devices and browsers', score: 2 },
      { text: 'We follow a QA checklist covering cross-device, cross-browser, edge cases, and analytics validation', score: 3 },
      { text: 'We use automated test suites, staging environments, and data layer validation to sign off each experiment', score: 4 }
    ]
  },
  {
    id: 4,
    category: 'process',
    text: 'How do you determine when to stop a test and call a result?',
    options: [
      { text: 'We stop when results look significant — often within the first few days of seeing a lift', score: 1 },
      { text: 'We run for a fixed time period (e.g. two weeks) regardless of what the data shows', score: 2 },
      { text: 'We pre-calculate the required sample size and run until we hit it, checking significance at the end', score: 3 },
      { text: 'We use sequential testing or pre-registered stopping rules that control false positive rates across the test lifecycle', score: 4 }
    ]
  },
  {
    id: 5,
    category: 'process',
    text: 'How do you manage experiment overlap and interaction effects?',
    options: [
      { text: 'We don\'t run concurrent tests — or we do without tracking interactions', score: 1 },
      { text: 'We run concurrent tests on different pages but don\'t formally check for overlap', score: 2 },
      { text: 'We use audience segmentation and a test-interaction log to minimise conflicts', score: 3 },
      { text: 'We use mutual exclusion groups, a collision-detection system, or factorial design to manage concurrent experimentation at scale', score: 4 }
    ]
  },
  // Strategy Questions
  {
    id: 6,
    category: 'strategy',
    text: 'How are your experiments connected to company or team OKRs?',
    options: [
      { text: 'They\'re not — experiments are chosen independently of formal business goals', score: 1 },
      { text: 'There\'s a loose connection, but it\'s not formally tracked or reviewed', score: 2 },
      { text: 'Each experiment maps to a specific KPI owned by a business team', score: 3 },
      { text: 'We have a strategic experimentation roadmap that maps test hypotheses directly to OKRs and is reviewed quarterly', score: 4 }
    ]
  },
  {
    id: 7,
    category: 'strategy',
    text: 'Where do your experiment ideas primarily come from?',
    options: [
      { text: 'Stakeholder opinions, gut feel, or copying what competitors appear to be doing', score: 1 },
      { text: 'Team brainstorms and analytics data (e.g. funnel drop-off, heatmaps)', score: 2 },
      { text: 'A structured ideation process combining analytics, user research, and behavioural data', score: 3 },
      { text: 'A systematic insight pipeline integrating quantitative data, qualitative research, expert heuristics, and external benchmarks', score: 4 }
    ]
  },
  {
    id: 8,
    category: 'strategy',
    text: 'How do you define what a "successful" experiment looks like before it runs?',
    options: [
      { text: 'An experiment is a success if conversion rate goes up', score: 1 },
      { text: 'We define one or two metrics we\'re watching, though these are sometimes revised mid-test', score: 2 },
      { text: 'We pre-specify a primary metric, guardrail metrics, and a minimum detectable effect before launch', score: 3 },
      { text: 'We pre-register the full statistical plan — primary metric, secondary metrics, guardrails, MDE, and power — and we don\'t deviate from it', score: 4 }
    ]
  },
  {
    id: 9,
    category: 'strategy',
    text: 'What happens after an experiment where the variant doesn\'t beat the control?',
    options: [
      { text: 'We move on and try something else', score: 1 },
      { text: 'We spend some time trying to understand what went wrong', score: 2 },
      { text: 'We document the learnings and use them to inform the next iteration or related test ideas', score: 3 },
      { text: 'We have a structured post-test review process that extracts insights regardless of outcome and feeds a cumulative learning repository', score: 4 }
    ]
  },
  {
    id: 10,
    category: 'strategy',
    text: 'How do you account for external factors (seasonality, promotions, platform algorithm changes) when planning tests?',
    options: [
      { text: 'We don\'t — external factors have sometimes invalidated results we\'ve already acted on', score: 1 },
      { text: 'We avoid testing during obviously disruptive periods like major sales events', score: 2 },
      { text: 'We maintain a testing calendar that flags high-risk windows and adjusts our roadmap accordingly', score: 3 },
      { text: 'We have documented protocols for pausing, excluding, or adjusting tests during disruptive external events, with clear criteria for a valid result', score: 4 }
    ]
  },
  {
    id: 11,
    category: 'strategy',
    text: 'How do you measure the throughput and velocity of your experimentation programme?',
    options: [
      { text: 'We don\'t track how many tests we run or how long they take', score: 1 },
      { text: 'We have a rough sense of test volume but don\'t formally track cycle time or throughput', score: 2 },
      { text: 'We track tests launched per month and average test cycle time, and review trends periodically', score: 3 },
      { text: 'We monitor a programme dashboard covering test velocity, cycle time breakdown by stage, win rate, and estimated cumulative business impact', score: 4 }
    ]
  },
  // Insight Questions
  {
    id: 12,
    category: 'insight',
    text: 'How do you analyse experiment results once a test reaches its target sample size?',
    options: [
      { text: 'We check whether the primary metric went up and by how much', score: 1 },
      { text: 'We run a significance test (e.g. chi-squared or t-test) and report the p-value', score: 2 },
      { text: 'We report confidence intervals, check guardrail metrics, and run segment breakdowns (device, channel, new vs. returning)', score: 3 },
      { text: 'We conduct a full statistical review including confidence intervals, segment analysis, novelty effect checks, and guardrail validation before reaching a decision', score: 4 }
    ]
  },
  {
    id: 13,
    category: 'insight',
    text: 'How do you validate the integrity of your experiment data before analysing results?',
    options: [
      { text: 'We trust the numbers the testing tool reports', score: 1 },
      { text: 'We do a basic sanity check — comparing sample sizes to expected traffic splits', score: 2 },
      { text: 'We run SRM (Sample Ratio Mismatch) checks, verify tracking accuracy, and cross-reference with our analytics platform', score: 3 },
      { text: 'We have an automated data validation pipeline that flags SRM issues, tracking anomalies, and quality problems before results are reviewed', score: 4 }
    ]
  },
  {
    id: 14,
    category: 'insight',
    text: 'How are experiment results communicated to stakeholders and the wider organisation?',
    options: [
      { text: 'Results are shared ad-hoc with whoever asks', score: 1 },
      { text: 'We send a summary to the immediate team after each test closes', score: 2 },
      { text: 'We have a regular readout cadence with a standardised results report shared cross-functionally', score: 3 },
      { text: 'Results live in a searchable experiment repository and key learnings are regularly surfaced to senior leadership in structured reviews', score: 4 }
    ]
  },
  {
    id: 15,
    category: 'insight',
    text: 'How do you monitor the performance of changes that were shipped based on winning tests?',
    options: [
      { text: 'We don\'t — once a test is won and shipped, we move on', score: 1 },
      { text: 'We occasionally look back at a shipped change if something seems off', score: 2 },
      { text: 'We schedule a post-ship review (e.g. at 30 and 90 days) for significant winners to check metric durability', score: 3 },
      { text: 'We have a systematic post-ship monitoring process with defined metrics, alert thresholds, and regular reviews to detect novelty decay or downstream effects', score: 4 }
    ]
  },
  {
    id: 16,
    category: 'insight',
    text: 'How do you use qualitative research (user interviews, session recordings, surveys) in your experimentation programme?',
    options: [
      { text: 'Rarely — our programme is primarily analytics-driven', score: 1 },
      { text: 'We occasionally look at session recordings or survey responses when we\'re stuck for ideas', score: 2 },
      { text: 'Qualitative research is a regular input into ideation and helps us interpret unexpected test results', score: 3 },
      { text: 'We have an integrated mixed-methods process where qualitative insight systematically informs hypothesis generation, and quantitative results are explained through follow-up qualitative research', score: 4 }
    ]
  },
  {
    id: 17,
    category: 'insight',
    text: 'When a test produces a surprising or counter-intuitive result, what is your team\'s typical response?',
    options: [
      { text: 'We accept the result and either ship or drop the variant based on the number', score: 1 },
      { text: 'We re-check the implementation to make sure there wasn\'t a bug', score: 2 },
      { text: 'We investigate through segment analysis and cross-reference with qualitative data before drawing conclusions', score: 3 },
      { text: 'We follow a structured investigation process examining SRM, implementation fidelity, segment behaviour, and external factors before reaching a decision', score: 4 }
    ]
  },
  // Culture Questions
  {
    id: 18,
    category: 'culture',
    text: 'How are major product or design decisions made in your organisation?',
    options: [
      { text: 'Mostly through senior stakeholder opinion, convention, or what competitors appear to be doing', score: 1 },
      { text: 'A mix — data is consulted but the final call usually comes from the most senior voice in the room', score: 2 },
      { text: 'Data and experiment results are consistently referenced in decision-making, though opinion-driven decisions still surface', score: 3 },
      { text: 'Experiments are the default mechanism for resolving significant product or design disagreements — data makes the call', score: 4 }
    ]
  },
  {
    id: 19,
    category: 'culture',
    text: 'Which functions are actively involved in your experimentation programme?',
    options: [
      { text: 'Primarily one team (e.g. CRO, growth, or marketing) — other functions are observers at best', score: 1 },
      { text: 'A small cluster of teams participate, though involvement is inconsistent', score: 2 },
      { text: 'Product, design, engineering, and analytics regularly collaborate on experiments with clear roles', score: 3 },
      { text: 'Experimentation spans multiple business functions — product, marketing, engineering, commercial, and customer — with embedded capability in each', score: 4 }
    ]
  },
  {
    id: 20,
    category: 'culture',
    text: 'When a test result contradicts a senior stakeholder\'s preferred direction, what typically happens?',
    options: [
      { text: 'The stakeholder\'s preference usually wins — the result is questioned or rationalised away', score: 1 },
      { text: 'It creates tension, but results are generally respected if the sample size was large enough', score: 2 },
      { text: 'We have an established norm that data takes precedence, and this is rarely challenged', score: 3 },
      { text: 'We have explicit governance requiring experiment results to be the primary input for defined decision types, with stakeholder override treated as a documented exception', score: 4 }
    ]
  },
  {
    id: 21,
    category: 'culture',
    text: 'How do you build statistical and experimental design literacy across your organisation?',
    options: [
      { text: 'People pick it up on the job — there\'s no formal development for experimentation skills', score: 1 },
      { text: 'We provide onboarding for new team members and point people to external resources', score: 2 },
      { text: 'We run internal training sessions and maintain documentation covering experimental design, statistical concepts, and tool usage', score: 3 },
      { text: 'We have a structured capability programme with role-based learning paths, internal certification, and regular methodology reviews facilitated by senior practitioners', score: 4 }
    ]
  },
  {
    id: 22,
    category: 'culture',
    text: 'How does your organisation treat an experiment where the variant loses to control?',
    options: [
      { text: 'It\'s seen as a failure or a waste of time — there\'s pressure to only run tests we expect to win', score: 1 },
      { text: 'It\'s accepted, but wins generate far more visibility and credit than learnings from losses', score: 2 },
      { text: 'Losing tests are treated as valid learning — we document what we ruled out and why', score: 3 },
      { text: 'A well-designed test that produces a clear null result is valued equally to a winner — learning velocity is tracked alongside win rate', score: 4 }
    ]
  },
  {
    id: 23,
    category: 'culture',
    text: 'How does your organisation respond when someone proposes shipping a change without testing it?',
    options: [
      { text: 'It happens regularly — shipping untested changes is the norm, not the exception', score: 1 },
      { text: 'It depends on the team and the change — there\'s no consistent standard', score: 2 },
      { text: 'There\'s a general expectation that significant changes go through a test, though there are frequent exceptions', score: 3 },
      { text: 'We have clear, agreed criteria for what requires a test, and bypassing them requires formal justification and sign-off', score: 4 }
    ]
  }
];
