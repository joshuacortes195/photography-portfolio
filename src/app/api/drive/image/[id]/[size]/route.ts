// Caching proxy for Google Drive thumbnails — path-based on purpose.
//
// The file id and size live in the URL *path* (/api/drive/image/<id>/<size>),
// not a query string, so every CDN varies its cache key on them. An earlier
// query-string version (?u=...) collapsed on the CDN to a single cached image,
// which is why every photo turned into the same picture.
//
// Drive's image hosts are slow and flaky on a cold request; proxying through
// our own origin with long-lived cache headers makes the first paint fast and
// every repeat load instant.

export const dynamic = "force-dynamic";

// Only these sizes are allowed, so the URL space (and cache) stays bounded.
const ALLOWED_SIZES = new Set([600, 2048]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; size: string }> }
) {
  const { id, size } = await params;

  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    return new Response("Bad id", { status: 400 });
  }
  const px = Number(size);
  if (!ALLOWED_SIZES.has(px)) {
    return new Response("Bad size", { status: 400 });
  }

  const target = `https://drive.google.com/thumbnail?id=${id}&sz=w${px}`;

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      headers: { "User-Agent": "Mozilla/5.0" },
      redirect: "follow",
    });
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
  // A given id+size always maps to the same image, so cache it hard at the
  // browser and CDN edge.
  headers.set(
    "cache-control",
    "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400, immutable"
  );

  return new Response(upstream.body, { status: 200, headers });
}
