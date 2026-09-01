// types/job.ts
export interface Job {
  id: string;
  title: string;
  company: string;
  platform: string;
  location?: string;
  remote?: boolean;
  postedAt: string; // ISO date string
  scrapedAt: string; // ISO date string
  description?: string;
  skills?: string[];
  salary?: string;
  url: string;
  // allow extra fields
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
