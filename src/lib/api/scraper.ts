// lib/api/scraper.ts
import { request } from "@/lib/api/client";
import { ScraperHealth } from "@/types/scraper";

export async function getHealth(): Promise<ScraperHealth> {
  const path = `/api/v1/dashboard`; // Based on API docs, dashboard has scraperHealth
  try {
    const raw = await request<any>(path);
    const dashData = raw.data || raw;
    return dashData.scraperHealth;
  } catch (error: any) {
    // If the API is completely down, return a failed state rather than crashing
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function runScraperNow(): Promise<void> {
  const path = `/api/v1/settings/scraper/run`;
  await request<void>(path, { method: "POST" });
}
