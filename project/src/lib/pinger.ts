// lib/pinger.ts
// ─────────────────────────────────────────────────────────────────────────────
// Core pinging logic. Called by the usePingScheduler hook.
// Uses the Next.js API route (/api/ping) as a server-side proxy to avoid
// CORS issues when pinging third-party URLs from the browser.
// ─────────────────────────────────────────────────────────────────────────────

export interface PingResponse {
  success:      boolean;
  statusCode:   number | null;
  latencyMs:    number | null;
  errorMessage: string | null;
  result:       "success" | "error" | "timeout";
}

/** Ping a URL via the Next.js API proxy route */
export async function pingUrl(url: string, timeoutMs = 10000): Promise<PingResponse> {
  try {
    const res  = await fetch(`/api/ping?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(timeoutMs + 2000), // extra buffer for server round-trip
    });
    const data = await res.json() as PingResponse;
    return data;
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    return {
      success:      false,
      statusCode:   null,
      latencyMs:    null,
      errorMessage: isTimeout ? "Request timed out" : String(err),
      result:       isTimeout ? "timeout" : "error",
    };
  }
}
