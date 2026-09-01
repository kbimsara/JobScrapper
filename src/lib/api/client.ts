// lib/api/client.ts
const BASE_URL = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/*$/, "");

/**
 * Central request helper.
 * Server‑side calls (run in Next.js server components or API routes) use the secret key.
 * Client‑side calls (inside useSWR/react‑query) also forward the header via Next.js Edge runtime.
 */
export async function request<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers = new Headers(opts.headers);
  // Attach auth header if we have the secret (available only on server).
  if (process.env.SERVICE_API_KEY) {
    headers.set("Authorization", `Bearer ${process.env.SERVICE_API_KEY}`);
  }
  const response = await fetch(url, {
    ...opts,
    headers,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = {
      message: payload?.message || response.statusText,
      code: response.status,
      details: payload,
    } as const;
    throw error;
  }
  return payload as T;
}
