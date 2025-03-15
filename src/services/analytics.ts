type EventType = 
  | 'quiz_start'
  | 'question_answer'
  | 'quiz_complete'
  | 'email_submit'
  | 'email_skip';

type EventData = {
  questionId?: number;
  answer?: number;
  email?: string;
  scores?: Record<string, number>;
  timeSpent?: number;
};

class Analytics {
  private startTime: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  private track(eventType: EventType, data: EventData = {}) {
    // Add timestamp and time spent
    const timestamp = new Date().toISOString();
    const timeSpent = Date.now() - this.startTime;

    const event = {
      eventType,
      timestamp,
      timeSpent,
      ...data,
    };

    // For now, just log to console, but you can integrate with any analytics service
    console.log('Analytics Event:', event);

    // You can send this to your analytics service
    // Example: 
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   body: JSON.stringify(event),
    // });
  }

  public trackQuizStart() {
    this.startTime = Date.now();
    this.track('quiz_start');
  }

  public trackQuestionAnswer(questionId: number, answer: number) {
    this.track('question_answer', { questionId, answer });
  }

  public trackQuizComplete(scores: Record<string, number>) {
    this.track('quiz_complete', { scores });
  }

  public trackEmailSubmit(email: string) {
    this.track('email_submit', { email });
  }

  public trackEmailSkip() {
    this.track('email_skip');
  }
}

export const analytics = new Analytics(); 