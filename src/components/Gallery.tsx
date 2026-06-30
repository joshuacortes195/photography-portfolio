"use client";

import { useCallback, useEffect, useState } from "react";
import { PlayIcon, ArrowIcon } from "@/components/Icons";
import type { DriveMedia } from "@/lib/drive";
import type { GalleryLayout } from "@/lib/themes";

// Small, deterministic tilt per tile so the "scattered" layout looks hand-placed
// without being random on every render.
const TILTS = [-2.5, 1.5, -1, 2, -1.75, 1.25, -0.5, 2.25];

function aspect(m: DriveMedia): number {
  if (m.width && m.height) return m.width / m.height;
  return 0.8; // sensible default (4:5 portrait)
}

export default function Gallery({
  items,
  layout = "grid",
}: {
  items: DriveMedia[];
  layout?: GalleryLayout;
}) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const move = useCallback(
    (dir: number) =>
      setActive((cur) =>
        cur === null ? cur : (cur + dir + items.length) % items.length
      ),
    [items.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, move]);

  const current = active === null ? null : items[active];

  return (
    <>
      {layout === "scattered" ? (
        <div className="mt-8 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {items.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Open ${m.name}`}
              style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
              className="group mb-6 block w-full break-inside-avoid rounded-[2px] bg-[#fbf7ee] p-2.5 shadow-[0_8px_24px_rgba(40,28,12,0.22)] transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:p-3"
            >
              <span className="relative block overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.thumbnailUrl}
                  alt={m.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  style={{ aspectRatio: aspect(m) }}
                  className="w-full object-cover"
                />
                {m.type === "video" && <PlayBadge />}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((m, i) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Open ${m.name}`}
                className="group relative block aspect-square w-full overflow-hidden rounded-lg border border-foreground/10 bg-foreground/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.thumbnailUrl}
                  alt={m.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {m.type === "video" && <PlayBadge />}
              </button>
            </li>
          ))}
        </ul>
      )}

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.name}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <span aria-hidden className="text-xl leading-none">
              &times;
            </span>
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  move(-1);
                }}
                aria-label="Previous"
                className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
              >
                <ArrowIcon className="size-5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  move(1);
                }}
                aria-label="Next"
                className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
              >
                <ArrowIcon className="size-5" />
              </button>
            </>
          )}

          {current.type === "video" ? (
            <video
              key={current.id}
              src={`/api/drive/video/${current.id}`}
              poster={current.thumbnailUrl}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-lg bg-black"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.fullUrl}
              alt={current.name}
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
          )}
        </div>
      )}
    </>
  );
}

function PlayBadge() {
  return (
    <span className="absolute inset-0 flex items-center justify-center bg-black/20">
      <span className="flex size-11 items-center justify-center rounded-full bg-black/55 backdrop-blur transition-colors group-hover:bg-black/70">
        <PlayIcon className="size-5 translate-x-px text-white" />
      </span>
    </span>
  );
}
