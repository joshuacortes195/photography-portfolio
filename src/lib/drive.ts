// Google Drive integration.
//
// Lists media (photos + videos) from a public Drive folder using a simple API
// key. For this to work:
//   1. The folder must be shared as "Anyone with the link can view".
//   2. GOOGLE_DRIVE_API_KEY must be set (a Drive-API-enabled key from Google
//      Cloud). See SETUP-DRIVE.md.
//
// Listings are fetched server-side and revalidated on an interval (see the
// `revalidate` export on the pages that use this), so new uploads appear on the
// site automatically without a rebuild.

const DRIVE_FILES_ENDPOINT = "https://www.googleapis.com/drive/v3/files";

export type DriveMedia = {
  id: string;
  name: string;
  type: "image" | "video";
  /** Small thumbnail (poster frame for videos) for the grid. */
  thumbnailUrl: string;
  /** Larger image for the in-site lightbox. */
  fullUrl: string;
  /** Drive's inline preview/player, used in an iframe for videos. */
  embedUrl: string;
  width?: number;
  height?: number;
};

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  imageMediaMetadata?: { width?: number; height?: number };
  videoMediaMetadata?: { width?: number; height?: number };
};

/**
 * URL of a file's thumbnail through our caching proxy (see
 * app/api/drive/image/[id]/[size]/route.ts). Path-based so the CDN caches each
 * id+size separately and repeat loads are served instantly instead of hitting
 * Drive's slow thumbnail host each time. `size` must match an allowed size in
 * the route.
 */
function driveImage(id: string, size: 600 | 2048): string {
  return `/api/drive/image/${id}/${size}`;
}

/**
 * Lists images and videos inside a public Drive folder, newest first.
 * Returns an empty array if the folder isn't configured, the API key is
 * missing, or the request fails — callers can treat that as "nothing yet".
 */
export async function listFolderMedia(
  folderId: string | undefined,
  { revalidate = 300 }: { revalidate?: number } = {}
): Promise<DriveMedia[]> {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  if (!folderId || !apiKey) return [];

  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed = false and (mimeType contains 'image/' or mimeType contains 'video/')`,
    key: apiKey,
    fields:
      "files(id,name,mimeType,thumbnailLink,imageMediaMetadata(width,height),videoMediaMetadata(width,height))",
    orderBy: "createdTime desc",
    pageSize: "200",
    // Needed so public/shared-drive folders resolve correctly.
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
  });

  let res: Response;
  try {
    res = await fetch(`${DRIVE_FILES_ENDPOINT}?${params}`, {
      next: { revalidate, tags: ["drive"] },
    });
  } catch {
    return [];
  }

  if (!res.ok) {
    console.error(
      `Drive list failed for folder ${folderId}: ${res.status} ${res.statusText}`
    );
    return [];
  }

  const data: { files?: DriveFile[] } = await res.json();
  const files = data.files ?? [];

  return files
    .filter((f) => f.thumbnailLink)
    .map((f) => {
      const isVideo = f.mimeType.startsWith("video/");
      const meta = isVideo ? f.videoMediaMetadata : f.imageMediaMetadata;
      return {
        id: f.id,
        name: f.name,
        type: isVideo ? "video" : "image",
        thumbnailUrl: driveImage(f.id, 600),
        fullUrl: driveImage(f.id, 2048),
        embedUrl: `https://drive.google.com/file/d/${f.id}/preview`,
        width: meta?.width,
        height: meta?.height,
      } satisfies DriveMedia;
    });
}
