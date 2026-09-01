"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Job } from "@/types/job";
import { JobRow } from "./JobRow";
import { SkeletonJobRow } from "./SkeletonJobRow";
import { Search, SlidersHorizontal, ChevronDown, RefreshCw } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { getLocalJobs, syncJobs, getLastSyncTime } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";

const PAGE_SIZE = 20;

export function JobFeed() {
  const searchParams = useSearchParams();

  // URL state
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const debouncedSearch = useDebounce(search, 300);
  const currentPlatform = searchParams.get("platform") || "";
  const currentWorkplace = searchParams.get("workplace") || "";
  const currentRegion = searchParams.get("region") || "";
  const currentSort = searchParams.get("sort") || "postedAt:desc";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Local state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [roleKeywords, setRoleKeywords] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  // 1. Initial Load
  useEffect(() => {
    setJobs(getLocalJobs());
    setLastSync(getLastSyncTime());
    setIsInitializing(false);

    // Load saved filters if URL doesn't have them
    try {
      const saved = localStorage.getItem("job_intel_filters");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedKeywords && parsed.selectedKeywords.length > 0) {
          setSelectedKeywords(parsed.selectedKeywords);
        }
        
        const currentUrlParams = new URLSearchParams(window.location.search);
        let updated = false;
        
        if (!currentUrlParams.has("platform") && parsed.platform) {
          currentUrlParams.set("platform", parsed.platform);
          updated = true;
        }
        if (!currentUrlParams.has("workplace") && parsed.workplace) {
          currentUrlParams.set("workplace", parsed.workplace);
          updated = true;
        }
        if (!currentUrlParams.has("region") && parsed.region) {
          currentUrlParams.set("region", parsed.region);
          updated = true;
        }
        if (!currentUrlParams.has("sort") && parsed.sort && parsed.sort !== "postedAt:desc") {
          currentUrlParams.set("sort", parsed.sort);
          updated = true;
        }
        
        if (updated) {
          router.replace(`?${currentUrlParams.toString()}`, { scroll: false });
        }
      }
    } catch (e) {
      console.error("Failed to load filters", e);
    }

    // Fetch roles to get keywords
    fetch('/api/roles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const keywords = new Set<string>();
          data.forEach(role => {
            if (Array.isArray(role.keywords)) {
              role.keywords.forEach((kw: string) => keywords.add(kw.trim()));
            }
          });
          setRoleKeywords(Array.from(keywords).filter(Boolean));
        }
      })
      .catch(console.error);
  }, []);

  // 2. Perform Data Fetch / Sync
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncJobs();
      setJobs(getLocalJobs());
      setLastSync(getLastSyncTime());
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync on first load if we have no jobs OR if it's been more than 1 minute
  useEffect(() => {
    if (!isInitializing && !isSyncing) {
      const timeSinceSync = lastSync ? Date.now() - lastSync.getTime() : Infinity;
      if (jobs.length === 0 || timeSinceSync > 60000) {
        handleSync();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitializing]);

  // 3. Client-side Filtering & Sorting
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // Filter by platform
    if (currentPlatform) {
      result = result.filter(j => 
        (j.platform || "").toLowerCase() === currentPlatform.toLowerCase() ||
        (j.source || "").toLowerCase() === currentPlatform.toLowerCase()
      );
    }

    // Filter by workplace type
    if (currentWorkplace) {
      result = result.filter(j => {
        const loc = (j.location || "").toLowerCase();
        const isRemote = j.remote === true || loc.includes("remote");
        const isHybrid = loc.includes("hybrid");
        
        if (currentWorkplace === "remote") return isRemote;
        if (currentWorkplace === "hybrid") return isHybrid;
        if (currentWorkplace === "onsite") return !isRemote && !isHybrid;
        return true;
      });
    }

    // Filter by Region (Sri Lanka vs Overseas)
    if (currentRegion) {
      result = result.filter(j => {
        const loc = (j.location || "").toLowerCase();
        // Assume it's SL if location contains SL keywords or if it's from topjobs without explicitly stating another country
        const isLK = loc.includes("sri lanka") || loc.includes("colombo") || loc.includes("gampaha") || loc.includes("kandy") || loc.includes("lk") || j.platform === "topjobs";
        
        if (currentRegion === "lk") return isLK;
        if (currentRegion === "overseas") return !isLK;
        return true;
      });
    }

    // Filter by search query
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(j => 
        (j.title || "").toLowerCase().includes(q) || 
        (j.company || "").toLowerCase().includes(q)
      );
    }

    // Filter by selected keywords (OR logic)
    if (selectedKeywords.length > 0) {
      result = result.filter(j => {
        const searchString = `${j.title || ""} ${j.description || ""} ${j.skills?.join(" ") || ""} ${j.requirements?.join(" ") || ""}`.toLowerCase();
        return selectedKeywords.some(kw => searchString.includes(kw.toLowerCase()));
      });
    }

    // Sort
    result.sort((a, b) => {
      if (currentSort === "postedAt:desc") {
        const timeA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
        const timeB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
        if (timeB === timeA) {
          const scrapeA = a.scrapedAt ? new Date(a.scrapedAt).getTime() : 0;
          const scrapeB = b.scrapedAt ? new Date(b.scrapedAt).getTime() : 0;
          return scrapeB - scrapeA;
        }
        return timeB - timeA;
      }
      if (currentSort === "postedAt:asc") {
        const timeA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
        const timeB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
        if (timeB === timeA) {
          const scrapeA = a.scrapedAt ? new Date(a.scrapedAt).getTime() : 0;
          const scrapeB = b.scrapedAt ? new Date(b.scrapedAt).getTime() : 0;
          return scrapeA - scrapeB;
        }
        return timeA - timeB;
      }
      if (currentSort === "scrapedAt:desc") {
        const timeA = a.scrapedAt ? new Date(a.scrapedAt).getTime() : 0;
        const timeB = b.scrapedAt ? new Date(b.scrapedAt).getTime() : 0;
        return timeB - timeA;
      }
      return 0;
    });

    return result;
  }, [jobs, currentPlatform, debouncedSearch, currentSort, selectedKeywords, currentWorkplace, currentRegion]);

  // 4. Client-side Pagination
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedJobs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredAndSortedJobs, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / PAGE_SIZE) || 1;

  const router = useRouter();

  const handleURLChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.set("page", "1");
    
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const toggleKeyword = (kw: string) => {
    setSelectedKeywords(prev => 
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    );
    // Reset to page 1
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Effect to sync search text to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch !== currentQ) {
      handleURLChange("q", debouncedSearch);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (isInitializing) return;
    const filtersToSave = {
      selectedKeywords,
      platform: currentPlatform,
      workplace: currentWorkplace,
      region: currentRegion,
      sort: currentSort
    };
    localStorage.setItem("job_intel_filters", JSON.stringify(filtersToSave));
  }, [selectedKeywords, currentPlatform, currentWorkplace, currentRegion, currentSort, isInitializing]);


  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-secondary" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-surface text-primary placeholder-secondary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm transition-colors"
            placeholder="Search jobs, skills, or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <select
              value={currentPlatform}
              onChange={(e) => handleURLChange("platform", e.target.value)}
              className="appearance-none block w-full pl-3 pr-10 py-2 border border-border rounded-md bg-surface text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent cursor-pointer transition-colors"
            >
              <option value="">All Platforms</option>
              <option value="linkedin">LinkedIn</option>
              <option value="topjobs">Top Jobs</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-secondary">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          <div className="relative shrink-0">
            <select
              value={currentWorkplace}
              onChange={(e) => handleURLChange("workplace", e.target.value)}
              className="appearance-none block w-full pl-3 pr-10 py-2 border border-border rounded-md bg-surface text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent cursor-pointer transition-colors"
            >
              <option value="">All Workplaces</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-secondary">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          <div className="relative shrink-0">
            <select
              value={currentRegion}
              onChange={(e) => handleURLChange("region", e.target.value)}
              className="appearance-none block w-full pl-3 pr-10 py-2 border border-border rounded-md bg-surface text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent cursor-pointer transition-colors"
            >
              <option value="">All Regions</option>
              <option value="lk">Sri Lanka</option>
              <option value="overseas">Overseas</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-secondary">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>

          <div className="relative shrink-0">
            <select
              value={currentSort}
              onChange={(e) => handleURLChange("sort", e.target.value)}
              className="appearance-none block w-full pl-3 pr-10 py-2 border border-border rounded-md bg-surface text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent cursor-pointer transition-colors"
            >
              <option value="postedAt:desc">Recently Posted</option>
              <option value="postedAt:asc">Oldest Posted</option>
              <option value="scrapedAt:desc">Recently Scraped</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-secondary">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
          </div>

          <button 
            onClick={handleSync} 
            disabled={isSyncing}
            className="btn btn-secondary px-3 py-2 shrink-0 transition-all disabled:opacity-50"
            title="Sync Jobs"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Sync Status Banner */}
      {lastSync && !isSyncing && (
        <div className="text-xs text-secondary px-1">
          Last synced {formatDistanceToNow(lastSync, { addSuffix: true })} • {jobs.length} jobs in local storage
        </div>
      )}
      {isSyncing && (
        <div className="text-xs text-accent px-1 flex items-center animate-pulse">
          <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />
          Syncing with server, fetching all pages...
        </div>
      )}

      {/* Keyword Filters */}
      {roleKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {roleKeywords.map(kw => (
            <button
              key={kw}
              onClick={() => toggleKeyword(kw)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedKeywords.includes(kw)
                  ? "bg-accent border-accent text-accent-foreground font-medium"
                  : "bg-surface border-border text-secondary hover:border-primary hover:text-primary"
              }`}
            >
              {kw}
            </button>
          ))}
          {selectedKeywords.length > 0 && (
            <button
              onClick={() => {
                setSelectedKeywords([]);
                handleURLChange("page", "1");
              }}
              className="px-3 py-1 text-xs rounded-full border border-transparent text-secondary hover:text-primary underline-offset-4 hover:underline transition-all"
            >
              Clear selected
            </button>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-4">
        {isInitializing || (isSyncing && jobs.length === 0) ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonJobRow key={i} />
            ))}
          </>
        ) : filteredAndSortedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border border-border border-dashed rounded-md bg-surface/50 text-center">
            <p className="text-lg font-medium text-primary mb-2">No jobs found</p>
            <p className="text-secondary mb-6 text-sm">
              We couldn't find any jobs matching your current filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedKeywords([]);
                handleURLChange("platform", "");
              }}
              className="btn btn-secondary px-4 py-2"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {paginatedJobs.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}

            {/* Pagination Controls */}
            {filteredAndSortedJobs.length > PAGE_SIZE && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                <p className="text-sm text-secondary">
                  Showing <span className="font-semibold text-primary">{((currentPage - 1) * PAGE_SIZE) + 1}</span> to{" "}
                  <span className="font-semibold text-primary">
                    {Math.min(currentPage * PAGE_SIZE, filteredAndSortedJobs.length)}
                  </span>{" "}
                  of <span className="font-semibold text-primary">{filteredAndSortedJobs.length}</span> jobs
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleURLChange("page", String(currentPage - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-secondary px-3 py-1.5 text-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleURLChange("page", String(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="btn btn-secondary px-3 py-1.5 text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
