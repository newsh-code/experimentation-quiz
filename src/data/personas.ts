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
    title: "The Ad-Hoc Tester",
    description: "Testing happens reactively — when someone has an idea or a problem surfaces. There's no formal programme, and decisions are still largely driven by stakeholder opinion rather than evidence. The upside: you have significant headroom, and the foundational moves at this stage create compounding returns.",
    recommendations: [
      {
        category: 'process',
        title: 'Build Your First Test Backlog',
        description: 'Create a simple backlog to capture test ideas with a hypothesis, expected impact, and effort estimate. Even a shared spreadsheet with a consistent format beats ad-hoc requests — it makes the programme visible and prioritisable.'
      },
      {
        category: 'strategy',
        title: 'Anchor Tests to One Primary Metric',
        description: 'Pick a single business metric your experiments will move (e.g. checkout conversion, sign-up rate) and run your first tests against it. Demonstrating a clear metric impact is the fastest way to build organisational buy-in.'
      },
      {
        category: 'insight',
        title: 'Instrument Your Baseline',
        description: 'Before running tests, establish reliable baseline metrics. Verify your analytics are firing correctly and gather at least four weeks of clean data to inform sample size calculations. A practical first check: compare your testing tool\'s visitor counts against your analytics platform over the same window — a discrepancy of more than 5% is a red flag that needs resolving before any test starts.'
      },
      {
        category: 'culture',
        title: 'Find Your First Internal Champion',
        description: 'Identify one senior stakeholder who is open to evidence-based decisions and share your early results with them. A single executive champion accelerates programme growth more than any process improvement in this stage.'
      }
    ]
  },
  beginner: {
    title: "The Structured Starter",
    description: "You have some testing infrastructure in place and are running experiments with a degree of regularity. Processes exist but aren't consistently followed, and statistical rigour is still developing. The priority now is replacing informal norms with documented standards before bad habits become entrenched.",
    recommendations: [
      {
        category: 'process',
        title: 'Standardise Your Hypothesis Format',
        description: 'Adopt a structured hypothesis template — for example: "We believe that [change] will [outcome] for [audience] because [rationale]." Consistent hypotheses make post-test analysis significantly more useful and force clearer thinking before tests are built.'
      },
      {
        category: 'strategy',
        title: 'Introduce a Prioritisation Framework',
        description: 'Move beyond gut-feel test selection by scoring ideas against a framework like PIE (Potential, Importance, Ease) or ICE (Impact, Confidence, Ease). The framework matters less than the discipline of using one consistently.'
      },
      {
        category: 'insight',
        title: 'Pre-Register Before You Launch',
        description: 'Define your primary metric, guardrail metrics, minimum detectable effect, and required sample size before launching each test. Pre-registration prevents p-hacking, builds analytical credibility, and makes it much harder to rationalise ambiguous results.'
      },
      {
        category: 'culture',
        title: 'Run a Monthly Results Readout',
        description: 'Schedule a regular session where experiment results — wins, losses, and inconclusive — are shared with a cross-functional audience. Transparency about what you\'re learning (not just what you\'re winning) builds programme trust and surfaces new test ideas.'
      }
    ]
  },
  intermediate: {
    title: "The Scaling Optimiser",
    description: "You're running a functioning programme with documented processes and growing participation across teams. The challenge now is maintaining quality and statistical integrity as test velocity increases. Programmes at this stage often reach a plateau — the next level requires deliberate investment in methodology and organisational reach.",
    recommendations: [
      {
        category: 'process',
        title: 'Implement a Pre-Launch Review Step',
        description: 'Before tests go live, introduce a lightweight peer-review to validate hypotheses, QA implementations, and confirm the statistical setup is correct. This single step catches the most costly errors — flawed tracking, misconfigured splits, and under-powered tests — before they contaminate your data.'
      },
      {
        category: 'strategy',
        title: 'Build a Research-to-Roadmap Pipeline',
        description: 'Establish a regular cadence (e.g. quarterly) to translate user research, analytics insights, and competitive intelligence into a prioritised test roadmap. Without this, backlogs drift toward whoever shouted loudest recently.'
      },
      {
        category: 'insight',
        title: 'Segment Every Winning Test',
        description: 'Make segment analysis mandatory for all winning tests. Device, acquisition channel, new vs. returning user, and cohort breakdowns frequently reveal that "winners" only win for a specific sub-population — a finding that shapes both implementation decisions and future test design.'
      },
      {
        category: 'culture',
        title: 'Celebrate Learnings, Not Just Wins',
        description: 'Explicitly recognise tests that generated strong learnings even when they didn\'t lift the primary metric. This is the most effective way to reduce pressure on analysts to p-hack results and signals that the programme\'s purpose is building knowledge, not chasing win rates.'
      }
    ]
  },
  advanced: {
    title: "The Data-Driven Programme",
    description: "Your programme is strategically aligned, statistically rigorous, and has meaningful cross-functional buy-in. The focus now is on compounding learnings, increasing the programme's influence on major product and business decisions, and investing in the infrastructure that sustains high velocity without sacrificing quality.",
    recommendations: [
      {
        category: 'process',
        title: 'Reduce Median Cycle Time',
        description: 'Map your end-to-end test cycle (idea to decision) and identify the biggest bottlenecks — typically dev handoff, QA, or stakeholder review. A 20% reduction in median cycle time often doubles your annual experiment volume without additional headcount.'
      },
      {
        category: 'strategy',
        title: 'Build a Cumulative Knowledge Repository',
        description: 'Move beyond individual test reports. Create a searchable repository of experiment learnings tagged by page type, audience segment, and hypothesis category. Over time this becomes your most valuable strategic asset — a compendium of what your customers have told you through their behaviour.'
      },
      {
        category: 'insight',
        title: 'Explore Sequential or Bayesian Testing',
        description: 'Fixed-horizon frequentist testing creates pressure to peek at results early and inflate false positive rates. Consider adopting sequential testing frameworks (e.g. mSPRT) or Bayesian approaches that support continuous monitoring while maintaining statistical integrity.'
      },
      {
        category: 'culture',
        title: 'Establish a Centre of Excellence',
        description: 'Create a cross-functional CoE that sets statistical standards, reviews test methodology, and acts as an internal consultancy for teams wanting to run their own experiments. A CoE shifts the programme from a service function to an organisational capability.'
      }
    ]
  },
  expert: {
    title: "The Experimentation-Led Organisation",
    description: "Experimentation is embedded in how your organisation makes decisions at all levels. You have the infrastructure, culture, and analytical depth to compound learnings at scale. The challenge at this stage is sustaining rigour as the programme grows, and continuing to extract strategic value from an asset — accumulated experimental knowledge — that most organisations never fully exploit.",
    recommendations: [
      {
        category: 'process',
        title: 'Address Experiment Interaction Effects',
        description: 'At high test velocity, interaction effects between concurrent experiments become a meaningful source of noise. Implement a formal collision-detection and mutual exclusion framework, or explore factorial experimental design where testing multiple factors simultaneously is more efficient than sequential A/B tests.'
      },
      {
        category: 'strategy',
        title: 'Apply Expected Value of Information',
        description: 'Use decision-theory frameworks such as Expected Value of Perfect Information (EVPI) to prioritise your experimentation investment. The highest-value tests are not always the highest-impact hypotheses — they are the decisions where uncertainty is most costly and evidence is most actionable.'
      },
      {
        category: 'insight',
        title: 'Build Predictive Models from Accumulated Data',
        description: 'Your historical experiment data is a significant strategic asset. Use it to train models that predict test outcomes based on hypothesis type, page context, and audience characteristics — helping focus resources on the experiments most likely to generate decisive results.'
      },
      {
        category: 'culture',
        title: 'Export Your Culture',
        description: 'Identify one practitioner in your team who can represent your methodology publicly — at CXL Live, Experimentation Elite, or in published teardowns on LinkedIn. The process of preparing external content forces internal teams to articulate and defend their methods in ways no internal review achieves. It also attracts senior experimentation talent who specifically seek organisations that take the craft seriously.'
      }
    ]
  }
};
