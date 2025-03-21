import { QuizState } from '../context/QuizContext';

interface SalesforceLeadData {
  FirstName?: string;
  LastName: string;
  Company?: string;
  Email: string;
  Description: string;
  LeadSource: string;
  Rating: string;
  Status: string;
  ExperimentationScore__c: number;
  ProcessScore__c: number;
  StrategyScore__c: number;
  InsightScore__c: number;
  CultureScore__c: number;
}

export async function createSalesforceLead(state: QuizState): Promise<void> {
  if (!state.email || !state.userData) return;

  const name = (state.userData.name ?? 'Unknown') as string;
  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ') || 'Unknown';

  // Calculate overall score as average of category scores
  const overallScore = Object.values(state.scores).reduce((sum, score) => sum + score, 0) / Object.keys(state.scores).length;

  const leadData: SalesforceLeadData = {
    FirstName: firstName,
    LastName: lastName || 'Unknown',
    Company: state.userData.company || 'Not Provided',
    Email: state.email,
    Description: `Experimentation Maturity Assessment Results:\n` +
      `Overall Score: ${Math.round(overallScore)}%\n` +
      `Process Score: ${Math.round(state.scores.process)}%\n` +
      `Strategy Score: ${Math.round(state.scores.strategy)}%\n` +
      `Insight Score: ${Math.round(state.scores.insight)}%\n` +
      `Culture Score: ${Math.round(state.scores.culture)}%`,
    LeadSource: 'Experimentation Maturity Assessment',
    Rating: getRating(overallScore),
    Status: 'Open - Not Contacted',
    ExperimentationScore__c: Math.round(overallScore),
    ProcessScore__c: Math.round(state.scores.process),
    StrategyScore__c: Math.round(state.scores.strategy),
    InsightScore__c: Math.round(state.scores.insight),
    CultureScore__c: Math.round(state.scores.culture)
  };

  try {
    const response = await fetch('/api/salesforce/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      throw new Error('Failed to create Salesforce lead');
    }
  } catch (error) {
    console.error('Error creating Salesforce lead:', error);
    // Don't throw error - we don't want to block the user flow
  }
}

function getRating(score: number): string {
  if (score >= 75) return 'Hot';
  if (score >= 50) return 'Warm';
  return 'Cold';
} 