// types/scraper.ts
export interface ScraperHealth {
  status: 'healthy' | 'warning' | 'failed' | 'unknown';
  lastRun?: string; // ISO date
  lastSuccessfulRun?: string; // ISO date
  durationMs?: number;
  jobsFound?: number;
  error?: string;
  nextRun?: string; // ISO date
}

export interface ScraperSettings {
  syncIntervalMinutes: number;
}
