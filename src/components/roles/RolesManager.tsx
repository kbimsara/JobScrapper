"use client";

import useSWR from "swr";
import { JobRole } from "@/types/role";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "An error occurred");
  return data;
};

export function RolesManager() {
  const { data: roles, error, isLoading } = useSWR<JobRole[]>("/api/roles", fetcher);

  if (error) {
    return (
      <div className="p-6 border border-error bg-error/10 text-error rounded-md">
        Unable to load roles: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary">Your Roles</h2>
      </div>

      {isLoading && !roles ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      ) : roles?.length === 0 ? (
        <div className="text-center p-12 border border-border border-dashed rounded-lg text-secondary">
          No roles configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles?.map((role) => (
            <div key={role.id} className="p-5 border border-border bg-surface rounded-lg relative group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-primary">{role.name}</h3>
                  <span 
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.enabled ? 'bg-accent/20 text-accent' : 'bg-surface-secondary text-secondary'}`}
                  >
                    {role.enabled ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div>
                  <p className="text-xs text-secondary mb-1 uppercase tracking-wider">Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {role.keywords.map((k, i) => (
                      <span key={i} className="tag bg-background">{k}</span>
                    ))}
                  </div>
                </div>
                
                {role.locations && role.locations.length > 0 && (
                  <div>
                    <p className="text-xs text-secondary mb-1 uppercase tracking-wider">Locations</p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.locations.map((l, i) => (
                        <span key={i} className="tag bg-background">{l}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-border text-xs text-secondary font-mono">
                Added {role.createdAt ? formatDistanceToNow(new Date(role.createdAt), { addSuffix: true }) : 'Unknown'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
