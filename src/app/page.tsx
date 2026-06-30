import Link from "next/link";
import { ArrowIcon, InstagramIcon, MailIcon } from "@/components/Icons";
import ScatterFrames, {
  SPOTS_COUNT,
  type CollageItem,
} from "@/components/ScatterFrames";
import { SITE, MEMBERS } from "@/lib/site";
import { listFolderMedia } from "@/lib/drive";

export const revalidate = 300;

// Shuffle so the scattered frames vary between revalidations.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build the scattered set so every member's folder is represented: take one
// random photo from each non-empty folder first, then fill the remaining spots
// with random photos from the combined pool. A final shuffle randomizes which
// frame lands in which spot.
function pickCollage(lists: CollageItem[][], count: number): CollageItem[] {
  const guaranteed = lists
    .filter((l) => l.length > 0)
    .map((l) => shuffle(l)[0]);

  const usedIds = new Set(guaranteed.map((p) => p.id));
  const rest = shuffle(lists.flat().filter((p) => !usedIds.has(p.id)));

  const fill = rest.slice(0, Math.max(0, count - guaranteed.length));
  return shuffle([...guaranteed, ...fill]);
}

export default async function Home() {
  // Pull photos from every member's folder, tag each with its member, and
  // scatter a random few around the hero — at least one from each member.
  const lists = await Promise.all(
    MEMBERS.map(async (m) => {
      const photos = await listFolderMedia(m.drive.photos, { revalidate });
      return photos.map((p): CollageItem => ({ ...p, slug: m.slug }));
    })
  );
  const collage = pickCollage(lists, SPOTS_COUNT);

  return (
    <div>
      {/* Hero / about — full-bleed so the frames can scatter to the edges */}
      <section className="relative overflow-hidden">
        <ScatterFrames items={collage} />
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-5 py-20">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            Visual collective
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            afterimage
            <span className="text-muted">.</span>
            thirds
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            A collective of three photographers. Each of us shoots our own way with our
            own perspective. Follow the shared account, or follow each of us
            individually below!
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-6 text-sm font-medium text-foreground transition-colors hover:border-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <InstagramIcon className="size-4" />@{SITE.instagram}
            </a>
          </div>
        </div>
      </section>

      {/* The collective */}
      <section className="mx-auto max-w-6xl border-t border-white/10 px-5 py-16">
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-muted">
          The collective
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MEMBERS.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/members/${m.slug}`}
                className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className="flex items-center gap-1.5 text-lg font-medium">
                  {m.name}
                  <ArrowIcon className="size-3.5 text-muted transition-transform group-hover:translate-x-0.5" />
                </span>
                {m.handle && (
                  <span className="mt-1 font-mono text-xs text-muted">
                    @{m.handle}
                  </span>
                )}
                <span className="mt-4 text-sm text-muted">{m.role}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact us */}
      <section className="mx-auto max-w-6xl border-t border-white/10 px-5 py-16">
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-muted">
          Contact us
        </h2>
        <p className="mt-8 max-w-xl text-lg text-muted">
          Want to work with us or just say hello? Send us an email and we&apos;ll
          get back to you.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-6 text-sm font-medium text-foreground transition-colors hover:border-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <MailIcon className="size-4" />
            {SITE.email}
          </a>
        </div>

        <p className="mt-6 text-sm text-muted">
          Or message us on{" "}
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Instagram
          </a>
          !
        </p>
      </section>
    </div>
  );
}
