import { revalidateTag } from "next/cache";

// Force-refresh all Drive galleries immediately, instead of waiting for the
// time-based revalidation window. Call:
//   POST /api/revalidate?secret=YOUR_SECRET
// Set REVALIDATE_SECRET in the environment. Useful as a "refresh now" button or
// as a Google Drive push-notification webhook later.
export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ revalidated: false, error: "Invalid token" }, { status: 401 });
  }

  revalidateTag("drive", "max");
  return Response.json({ revalidated: true, now: Date.now() });
}
