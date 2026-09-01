"use client";

import { Job } from "@/types/job";

const STORAGE_KEY = "job_intel_jobs";
const LAST_SYNC_KEY = "job_intel_last_sync";
const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

export interface SyncResult {
  added: number;
  total: number;
  purged: number;
}

export function getLocalJobs(): Job[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data) as Job[];
    const uniqueIds = new Set<string>();
    return parsed.filter((job) => {
      if (!job.id || uniqueIds.has(job.id)) return false;
      uniqueIds.add(job.id);
      return true;
    });
  } catch (error) {
    console.error("Failed to parse jobs from localStorage", error);
    return [];
  }
}

export function getLastSyncTime(): Date | null {
  if (typeof window === "undefined") return null;
  const time = localStorage.getItem(LAST_SYNC_KEY);
  return time ? new Date(time) : null;
}

export async function syncJobs(): Promise<SyncResult> {
  const existingJobs = getLocalJobs();
  const existingJobIds = new Set(existingJobs.map((j) => j.id));
  let newJobs: Job[] = [];
  
  // We fetch all pages sequentially
  let page = 1;
  const limit = 50;
  let totalPages = 1;

  try {
    while (page <= totalPages) {
      const res = await fetch(`/api/jobs?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch jobs page " + page);
      const data = await res.json();
      
      const items = data.items || [];
      totalPages = Math.ceil((data.total || 0) / limit) || 1;

      // Add jobs we don't already have
      for (const job of items) {
        if (job.id && !existingJobIds.has(job.id)) {
          newJobs.push(job);
          existingJobIds.add(job.id);
        }
      }
      page++;
    }
  } catch (error) {
    console.error("Sync interrupted:", error);
    // If it fails partway through, we still save what we got
  }

  // Combine and sort by postedAt descending
  let allJobs = [...newJobs, ...existingJobs];
  
  // Deduplicate in case existing local storage was already corrupted
  const uniqueIds = new Set<string>();
  allJobs = allJobs.filter((job) => {
    if (!job.id || uniqueIds.has(job.id)) return false;
    uniqueIds.add(job.id);
    return true;
  });

  // Purge jobs older than 15 days (by postedAt)
  const now = Date.now();
  const initialCount = allJobs.length;
  allJobs = allJobs.filter((job) => {
    if (!job.postedAt) return true;
    const postDate = new Date(job.postedAt).getTime();
    return (now - postDate) <= FIFTEEN_DAYS_MS;
  });

  const purgedCount = initialCount - allJobs.length;

  allJobs.sort((a, b) => {
    const timeA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
    const timeB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
    if (timeB === timeA) {
      const scrapeA = a.scrapedAt ? new Date(a.scrapedAt).getTime() : 0;
      const scrapeB = b.scrapedAt ? new Date(b.scrapedAt).getTime() : 0;
      return scrapeB - scrapeA;
    }
    return timeB - timeA;
  });

  // Save back to local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allJobs));
  localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());

  return {
    added: newJobs.length,
    total: allJobs.length,
    purged: purgedCount,
  };
}
