"use client";

import useSWR from "swr";
import { ScraperHealth } from "@/types/scraper";
import { cn } from "@/lib/utils";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "An error occurred");
  }
  return data;
};

export function ScraperHealthStrip() {
  const { data, error, isLoading } = useSWR<ScraperHealth>(
    "/api/scraper/health",
    fetcher,
    { refreshInterval: 30000 } // Poll every 30s as requested by default
  );

  if (isLoading) {
    return (
      <div className="h-8 flex items-center justify-center px-4 text-sm font-bold text-white bg-surface animate-pulse">
        Checking server health...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-8 flex items-center justify-center px-4 text-sm font-bold text-white health-wave-orange">
        Bad health
      </div>
    );
  }

  const isHealthy = data.status === "healthy";

  return (
    <div className={cn(
      "h-8 flex items-center justify-center px-4 text-sm font-bold text-white transition-all duration-500",
      isHealthy ? "health-wave-green" : "health-wave-orange"
    )}>
      {isHealthy ? "healthy" : "Bad health"}
    </div>
  );
}
