// lib/api/jobs.ts
import { request } from "@/lib/api/client";
import { Job, PaginatedResponse } from "@/types/job";

export interface GetJobsParams {
  page?: number;
  limit?: number;
  q?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  sort?: string; // e.g., "postedAt:desc"
  platform?: string;
  role?: string;
}

/** Fetch paginated jobs list using backend API */
export async function getJobs(params: GetJobsParams = {}): Promise<PaginatedResponse<Job>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.q) query.set("q", params.q);
  if (params.type) query.set("type", params.type);
  if (params.startDate) query.set("startDate", params.startDate);
  if (params.endDate) query.set("endDate", params.endDate);
  if (params.sort) query.set("sort", params.sort);
  if (params.platform) query.set("platform", params.platform);
  if (params.role) query.set("role", params.role);

  const path = `/api/v1/jobs?${query.toString()}`;
  const raw = await request<any>(path);
  
  if (raw && raw.data && Array.isArray(raw.data.jobs)) {
    return {
      items: raw.data.jobs.map((j: any) => ({
        ...j,
        id: j._id || j.id,
        platform: j.source || j.platform,
        url: j.url || "",
        scrapedAt: j.collectedAt || j.createdAt || j.scrapedAt
      })),
      total: raw.data.pagination?.total || 0,
      page: raw.data.pagination?.page || 1,
      limit: raw.data.pagination?.limit || 20,
    };
  }
  
  return raw as PaginatedResponse<Job>;
}

/** Fetch a single job by its identifier */
export async function getJobById(id: string): Promise<Job> {
  const path = `/api/v1/jobs/${encodeURIComponent(id)}`;
  const raw = await request<any>(path);
  const j = raw.data?.job || raw.data || raw;
  return {
    ...j,
    id: j._id || j.id,
    platform: j.source || j.platform,
    url: j.url || "",
    scrapedAt: j.collectedAt || j.createdAt || j.scrapedAt
  };
}

/** Delete all jobs – admin operation */
export async function deleteAllJobs(): Promise<void> {
  const path = `/api/v1/jobs`;
  await request<void>(path, { method: "DELETE" });
}
