// Caching proxy for Google Drive thumbnail images.
//
// Drive's image hosts (lh3.googleusercontent.com / drive.google.com) are slow
// and flaky on a cold request — the thumbnail is generated on demand, so the
// first visit trickles photos in while a refresh (now browser-cached) looks
// instant. We proxy those images through our own origin and slap long-lived
// cache headers on them, so the CDN/browser serve repeat loads immediately and
// the very first paint is fast and consistent.
//
// Only Google's own image hosts are allowed, so this can't be abused as an open
// proxy for arbitrary URLs.

export const dynamic = "force-dynamic";

function isAllowedHost(hostname: string): boolean {
  return (
    hostname === "drive.google.com" ||
    hostname === "googleusercontent.com" ||
    hostname.endsWith(".googleusercontent.com") ||
    hostname.endsWith(".google.com")
  );
}

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("u");
  if (!src) return new Response("Missing url", { status: 400 });

  let target: URL;
  try {
    target = new URL(src);
  } catch {
    return new Response("Bad url", { status: 400 });
  }

  if (target.protocol !== "https:" || !isAllowedHost(target.hostname)) {
    return new Response("Forbidden", { status: 403 });
  }

  let upstream: Response;
  try {
    // Drive rejects requests that carry a referrer; send none.
    upstream = await fetch(target, { referrerPolicy: "no-referrer" });
  } catch {
    return new Response("Upstream error", { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream error", { status: 502 });
  }

  const headers = new Headers();
  headers.set(
    "content-type",
    upstream.headers.get("content-type") ?? "image/jpeg"
  );
  // Thumbnails are immutable per URL (size is baked in), so cache hard at the
  // browser and CDN edge.
  headers.set(
    "cache-control",
    "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400, immutable"
  );

  return new Response(upstream.body, { status: 200, headers });
}
