"use client";

import { Job } from "@/types/job";
import { formatDistanceToNow } from "date-fns";
import { Bookmark, Building, ExternalLink, Globe, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface JobRowProps {
  job: Job;
}

export function JobRow({ job }: JobRowProps) {
  let postedAgo = 'Unknown date';
  if (job.postedAt) {
    const isMidnightUTC = typeof job.postedAt === 'string' && job.postedAt.endsWith('T00:00:00.000Z');
    
    if (isMidnightUTC) {
      // It's an imprecise date-only value (e.g. 2026-09-01).
      // Check if it's today's date in UTC.
      const postedDate = new Date(job.postedAt);
      const now = new Date();
      if (
        postedDate.getUTCFullYear() === now.getUTCFullYear() &&
        postedDate.getUTCMonth() === now.getUTCMonth() &&
        postedDate.getUTCDate() === now.getUTCDate()
      ) {
        postedAgo = 'Today';
      } else {
        postedAgo = postedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
    } else {
      postedAgo = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });
    }
  }

  const scrapedAgo = job.scrapedAt ? formatDistanceToNow(new Date(job.scrapedAt), { addSuffix: true }) : 'Recently';

  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 border border-border bg-surface hover:bg-surface-secondary/50 rounded-lg transition-all">
      <div className="flex-1 min-w-0">
        <Link href={`/jobs/${encodeURIComponent(job.id)}`} className="block focus:outline-none">
          <h3 className="text-base font-semibold text-primary truncate group-hover:text-accent transition-colors">
            {job.title}
          </h3>
        </Link>
        
        <div className="mt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-secondary">
          <div className="flex items-center">
            <Building className="w-3.5 h-3.5 mr-1.5 opacity-70" />
            <span className="truncate max-w-[150px]">{job.company}</span>
          </div>
          
          {(job.location || job.remote) && (
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 opacity-70" />
              <span className="truncate max-w-[150px]">
                {job.location || "Remote"}
                {job.remote && job.location ? " (Remote)" : ""}
              </span>
            </div>
          )}

          {job.salary && (
            <div className="flex items-center font-mono text-xs px-2 py-0.5 rounded bg-accent/10 text-accent">
              {job.salary}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono text-secondary">
          <div className="flex items-center px-1.5 py-0.5 border border-border rounded bg-background">
            <Globe className="w-3 h-3 mr-1" />
            {job.platform}
          </div>
          <span>Posted {postedAgo}</span>
          <span className="text-border mx-1">•</span>
          <span className="opacity-70">Scraped {scrapedAgo}</span>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
        <button 
          className="btn btn-ghost px-3 py-1.5 text-xs w-full sm:w-auto"
          aria-label="Save job"
        >
          <Bookmark className="w-3.5 h-3.5 mr-1.5" />
          <span className="sm:hidden">Save</span>
        </button>
        <a 
          href={job.url}
          target="_blank"
          rel="noreferrer noopener"
          className="btn btn-secondary px-3 py-1.5 text-xs w-full sm:w-auto"
        >
          Open
          <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
        </a>
      </div>
    </div>
  );
}
