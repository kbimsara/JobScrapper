"use client";

import useSWR from "swr";
import { Activity, Clock, Database, AlertCircle } from "lucide-react";
import { ScraperHealth } from "@/types/scraper";
import { formatDistanceToNow } from "date-fns";
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
      <div className="h-8 border-b border-border bg-surface flex items-center px-4 text-xs font-mono text-secondary animate-pulse">
        Checking scraper status...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-8 border-b border-border bg-surface flex items-center px-4 text-xs font-mono text-error">
        <AlertCircle className="w-3 h-3 mr-2" />
        Failed to load scraper status
      </div>
    );
  }

  const isHealthy = data.status === "healthy";
  const statusColor = isHealthy 
    ? "text-success" 
    : data.status === "warning" 
    ? "text-warning" 
    : "text-error";

  return (
    <div className="h-8 border-b border-border bg-surface flex items-center px-4 text-xs font-mono justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <Activity className={cn("w-3.5 h-3.5", statusColor)} />
          <span className={cn("uppercase tracking-wider font-semibold", statusColor)}>
            {data.status}
          </span>
        </div>
        
        {data.lastSuccessfulRun && (
          <div className="flex items-center text-secondary border-l border-border pl-4 hidden sm:flex">
            <Clock className="w-3 h-3 mr-1.5 opacity-70" />
            <span>
              Last run {formatDistanceToNow(new Date(data.lastSuccessfulRun), { addSuffix: true })}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {data.jobsFound !== undefined && (
          <div className="flex items-center text-secondary">
            <Database className="w-3 h-3 mr-1.5 opacity-70" />
            <span>{data.jobsFound.toLocaleString()} jobs</span>
          </div>
        )}
      </div>
    </div>
  );
}
