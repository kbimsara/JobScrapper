"use client";

import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import { 
  Activity, CheckCircle2, Clock, 
  AlertCircle, Briefcase, Bell, AlertTriangle, RefreshCw
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScraperHealth } from "@/types/scraper";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "An error occurred");
  return data;
};

interface DashboardStats {
  activeJobRoles: number;
  totalJobs: number;
  notificationsSent: number;
  notificationsFailed: number;
}

interface DashboardData {
  stats: DashboardStats;
  scraperHealth: ScraperHealth;
  recentJobs: any[];
  recentNotifications: any[];
}

export function ScraperDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>("/api/dashboard", fetcher, {
    refreshInterval: 30000 // refresh every 30s
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/scraper/sync", { method: "POST" });
      if (!res.ok) throw new Error("Failed to trigger sync");
      // Add a slight delay before refetching to allow the sync state to register
      setTimeout(() => mutate(), 2000);
    } catch (e) {
      alert("Failed to trigger manual sync");
    } finally {
      setIsSyncing(false);
    }
  };

  if (error) {
    return (
      <div className="p-6 border border-error bg-error/10 text-error rounded-md text-center">
        <h3 className="text-lg font-semibold mb-2">Unable to load dashboard</h3>
        <p className="text-sm opacity-80 mb-4">{error.message || "An unknown error occurred"}</p>
        <button onClick={() => mutate()} className="btn btn-secondary px-4 py-2">
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="flex justify-center p-12">
        <RefreshCw className="w-8 h-8 text-secondary animate-spin" />
      </div>
    );
  }

  const { stats, scraperHealth } = data!;
  
  const healthColors = {
    healthy: "text-accent bg-accent/10 border-accent/20",
    warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    failed: "text-error bg-error/10 border-error/20",
    unknown: "text-secondary bg-surface border-border"
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 border border-border bg-surface rounded-lg flex flex-col gap-2">
          <div className="flex items-center text-secondary mb-1">
            <Activity className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Active Roles</span>
          </div>
          <div className="text-2xl font-bold text-primary">{stats.activeJobRoles}</div>
        </div>
        
        <div className="p-5 border border-border bg-surface rounded-lg flex flex-col gap-2">
          <div className="flex items-center text-secondary mb-1">
            <Briefcase className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Total Jobs</span>
          </div>
          <div className="text-2xl font-bold text-primary">{stats.totalJobs}</div>
        </div>
        
        <div className="p-5 border border-border bg-surface rounded-lg flex flex-col gap-2">
          <div className="flex items-center text-secondary mb-1">
            <Bell className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Alerts Sent</span>
          </div>
          <div className="text-2xl font-bold text-primary">{stats.notificationsSent}</div>
        </div>
        
        <div className="p-5 border border-border bg-surface rounded-lg flex flex-col gap-2">
          <div className="flex items-center text-secondary mb-1">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Failed Alerts</span>
          </div>
          <div className="text-2xl font-bold text-error">{stats.notificationsFailed}</div>
        </div>
      </div>

      {/* Scraper Status Panel */}
      <div className="p-6 border border-border bg-surface rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-primary mb-1">Scraper Status</h2>
            <p className="text-sm text-secondary">Current background worker health and timings.</p>
          </div>
          <button 
            onClick={handleManualSync}
            disabled={isSyncing}
            className="btn btn-primary px-4 py-2 text-sm whitespace-nowrap"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} />
            {isSyncing ? "Syncing..." : "Run Sync Now"}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-secondary">Overall Status</span>
            <div className={cn("inline-flex items-center px-3 py-1.5 rounded-md border w-fit font-medium text-sm capitalize", healthColors[scraperHealth.status || 'unknown'])}>
              {scraperHealth.status === 'healthy' ? <CheckCircle2 className="w-4 h-4 mr-2" /> : 
               scraperHealth.status === 'failed' ? <AlertCircle className="w-4 h-4 mr-2" /> : 
               <Clock className="w-4 h-4 mr-2" />}
              {scraperHealth.status || 'Unknown'}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm text-secondary">Last Sync Run</span>
            <div className="text-primary font-medium">
              {scraperHealth.lastRun ? formatDistanceToNow(new Date(scraperHealth.lastRun), { addSuffix: true }) : 'Never'}
            </div>
            {scraperHealth.lastRun && (
              <div className="text-xs text-secondary font-mono">
                {new Date(scraperHealth.lastRun).toLocaleString()}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm text-secondary">Jobs Found (Last Run)</span>
            <div className="text-primary font-medium">
              {scraperHealth.jobsFound ?? 'N/A'}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm text-secondary">Next Scheduled Run</span>
            <div className="text-primary font-medium">
              {scraperHealth.nextRun ? formatDistanceToNow(new Date(scraperHealth.nextRun), { addSuffix: true }) : 'Unknown'}
            </div>
          </div>
          
          {scraperHealth.error && (
            <div className="col-span-full mt-2 p-4 bg-error/10 border border-error/20 rounded-md">
              <div className="flex items-start text-error text-sm">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                <span className="font-mono">{scraperHealth.error}</span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
