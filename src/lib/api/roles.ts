import { request } from "@/lib/api/client";
import { JobRole } from "@/types/role";

export async function getRoles(): Promise<JobRole[]> {
  const path = `/api/v1/job-roles`;
  const raw = await request<any>(path);
  const roles = raw.data?.roles || raw.data || raw;
  if (Array.isArray(roles)) {
    return roles.map((r: any) => ({
      ...r,
      id: r._id || r.id,
    }));
  }
  return [];
}

export async function createRole(data: Partial<JobRole>): Promise<JobRole> {
  const path = `/api/v1/job-roles`;
  const raw = await request<any>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const r = raw.data?.role || raw.data || raw;
  return { ...r, id: r._id || r.id };
}

export async function updateRole(id: string, data: Partial<JobRole>): Promise<JobRole> {
  const path = `/api/v1/job-roles/${encodeURIComponent(id)}`;
  const raw = await request<any>(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const r = raw.data?.role || raw.data || raw;
  return { ...r, id: r._id || r.id };
}

export async function deleteRole(id: string): Promise<void> {
  const path = `/api/v1/job-roles/${encodeURIComponent(id)}`;
  await request<any>(path, { method: "DELETE" });
}
