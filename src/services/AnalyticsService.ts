/**
 * Service for managing analytics events (opt-in)
 */

import { AnalyticsEvent } from '../types';

export class AnalyticsService {
  private optedIn: boolean = false;
  private events: AnalyticsEvent[] = [];

  setOptIn(optIn: boolean): void {
    this.optedIn = optIn;
    if (!optIn) {
      this.events = [];
    }
  }

  trackEvent(
    eventType: AnalyticsEvent['eventType'],
    metadata?: Record<string, unknown>
  ): void {
    if (!this.optedIn) {
      return;
    }

    const event: AnalyticsEvent = {
      eventType,
      metadata,
      timestamp: Date.now(),
    };

    this.events.push(event);
    
    // In a real implementation, this would send events to an analytics service
    // eslint-disable-next-line no-console
    console.log('Analytics event:', event);
  }

  getEvents(): AnalyticsEvent[] {
    return this.optedIn ? [...this.events] : [];
  }

  clearEvents(): void {
    this.events = [];
  }
}

export default new AnalyticsService();
