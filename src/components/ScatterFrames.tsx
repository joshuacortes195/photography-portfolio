import Link from "next/link";
import type { DriveMedia } from "@/lib/drive";

export type CollageItem = DriveMedia & { slug: string };

// Fixed spots around the edges of the hero. A couple show on phones; more
// appear as the screen widens. Positions stay near the corners/sides so they
// don't sit on top of the headline.
const SPOTS = [
  "left-[1%] top-[6%] w-28 -rotate-6 sm:w-36 lg:w-48",
  "right-[2%] bottom-[8%] w-28 rotate-[7deg] sm:w-36 lg:w-48",
  "right-[3%] top-[7%] hidden w-32 rotate-3 sm:block lg:w-44",
  "left-[3%] bottom-[6%] hidden w-32 -rotate-3 sm:block lg:w-44",
  "right-[23%] top-[2%] hidden rotate-2 lg:block lg:w-32",
];

/** Number of scatter spots — the home page uses this to size its photo pick. */
export const SPOTS_COUNT = SPOTS.length;

export default function ScatterFrames({ items }: { items: CollageItem[] }) {
  const frames = items.slice(0, SPOTS.length);
  if (frames.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0">
      {frames.map((m, i) => (
        <Link
          key={m.id}
          href={`/members/${m.slug}`}
          aria-hidden
          tabIndex={-1}
          className={`absolute ${SPOTS[i]} block overflow-hidden rounded-md border border-white/15 opacity-55 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:opacity-100 hover:[rotate:0deg]`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.thumbnailUrl}
            alt=""
            // The first two frames show on phones and sit above the fold, so load
            // them eagerly with high priority for a fast first paint. The rest
            // (desktop-only) stay lazy.
            loading={i < 2 ? "eager" : "lazy"}
            fetchPriority={i < 2 ? "high" : "auto"}
            referrerPolicy="no-referrer"
            style={{ aspectRatio: m.width && m.height ? m.width / m.height : 1 }}
            className="w-full object-cover"
          />
        </Link>
      ))}
    </div>
  );
}
