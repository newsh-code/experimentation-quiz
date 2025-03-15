import { QuizState } from '../context/QuizContext';

interface SalesforceLeadData {
  FirstName?: string;
  LastName: string;
  Company: string;
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

  const [firstName, ...lastNameParts] = state.userData.name.split(' ');
  const lastName = lastNameParts.join(' ') || 'Unknown';

  const leadData: SalesforceLeadData = {
    FirstName: firstName,
    LastName: lastName || 'Unknown',
    Company: state.userData.company,
    Email: state.email,
    Description: `Experimentation Maturity Assessment Results:\n` +
      `Overall Score: ${Math.round(state.scores.overall)}%\n` +
      `Process Score: ${Math.round(state.scores.process)}%\n` +
      `Strategy Score: ${Math.round(state.scores.strategy)}%\n` +
      `Insight Score: ${Math.round(state.scores.insight)}%\n` +
      `Culture Score: ${Math.round(state.scores.culture)}%`,
    LeadSource: 'Experimentation Maturity Assessment',
    Rating: getRating(state.scores.overall),
    Status: 'Open - Not Contacted',
    ExperimentationScore__c: Math.round(state.scores.overall),
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