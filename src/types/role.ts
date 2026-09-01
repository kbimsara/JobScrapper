// types/role.ts
export interface JobRole {
  id: string;
  name: string;
  keywords: string[];
  locations: string[];
  enabled: boolean;
  createdAt: string; // ISO date
  updatedAt?: string;
}
