import type { Metadata } from "next";
import { InstagramIcon, ArrowIcon } from "@/components/Icons";
import { MEMBERS, SITE, instagramUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: SITE.description,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          About
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Four people, one lens.
        </h1>
        <p className="mt-5 text-lg text-muted">
          {SITE.name} is a collective of four artists sharing a single feed.
          Each of us shoots our own way — together it&apos;s an afterimage.
          Follow the shared account, or find us individually below.
        </p>
        <a
          href={SITE.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-medium transition-colors hover:border-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <InstagramIcon className="size-4" />@{SITE.instagram}
        </a>
      </header>

      <section className="mt-16">
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-muted">
          Members
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MEMBERS.map((m) => (
            <li key={m.handle}>
              <a
                href={instagramUrl(m.handle)}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <div>
                  <p className="text-lg font-medium">{m.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted">
                    @{m.handle}
                  </p>
                  <p className="mt-2 text-sm text-muted">{m.role}</p>
                </div>
                <span className="flex items-center gap-2 text-foreground/50 transition-colors group-hover:text-foreground">
                  <InstagramIcon className="size-5" />
                  <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
