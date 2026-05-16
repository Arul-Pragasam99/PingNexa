// app/api/ping/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Server-side proxy for pinging URLs. Runs on the Next.js server so there
// are no CORS restrictions. Returns status code + latency.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // Fast Edge runtime

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Validate URL
  let parsed: URL;
  try {
    parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("bad protocol");
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(parsed.toString(), {
      method:  "HEAD", // lightweight — only checks server responds
      signal:  controller.signal,
      headers: { "User-Agent": "PingNexa/1.0 (uptime monitor)" },
      redirect: "follow",
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - start;

    return NextResponse.json({
      success:      res.ok || res.status < 500,
      statusCode:   res.status,
      latencyMs,
      errorMessage: null,
      result:       res.ok || res.status < 500 ? "success" : "error",
    });
  } catch (err: unknown) {
    const latencyMs = Date.now() - start;
    const isTimeout = err instanceof Error && err.name === "AbortError";

    return NextResponse.json({
      success:      false,
      statusCode:   null,
      latencyMs,
      errorMessage: isTimeout ? "Request timed out" : String(err),
      result:       isTimeout ? "timeout" : "error",
    });
  }
}
