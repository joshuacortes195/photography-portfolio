// Streams a video's ORIGINAL bytes from Google Drive, with HTTP Range support
// so the browser's native <video> player can seek and play at full resolution.
//
// We proxy (rather than linking the googleapis URL directly) so the API key
// stays server-side. The Drive `/preview` iframe transcodes down to ~720p; this
// serves the source file untouched (1080p, 4K, whatever was uploaded).

export const dynamic = "force-dynamic";

const PASS_THROUGH = [
  "content-type",
  "content-length",
  "content-range",
  "accept-ranges",
  "etag",
  "last-modified",
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Only allow well-formed Drive file IDs.
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    return new Response("Bad request", { status: 400 });
  }

  const key = process.env.GOOGLE_DRIVE_API_KEY;
  if (!key) return new Response("Drive not configured", { status: 500 });

  const url =
    `https://www.googleapis.com/drive/v3/files/${id}` +
    `?alt=media&supportsAllDrives=true&key=${key}`;

  const range = request.headers.get("range");
  const upstream = await fetch(url, {
    headers: range ? { Range: range } : undefined,
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Upstream error", { status: upstream.status });
  }

  const headers = new Headers();
  for (const h of PASS_THROUGH) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }
  if (!headers.has("accept-ranges")) headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=3600");

  return new Response(upstream.body, { status: upstream.status, headers });
}
