import Link from "next/link";
import { ArrowIcon, InstagramIcon } from "@/components/Icons";
import { SITE, MEMBERS } from "@/lib/site";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      {/* Hero */}
      <section className="flex min-h-[70vh] flex-col justify-center py-20">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          Visual collective
        </p>
        <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
          afterimage
          <span className="text-muted"> / </span>
          thirds
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{SITE.description}</p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/work"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View work
            <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-6 text-sm font-medium text-foreground transition-colors hover:border-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <InstagramIcon className="size-4" />@{SITE.instagram}
          </a>
        </div>
      </section>

      {/* Members strip */}
      <section className="border-t border-white/10 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-muted">
            The collective
          </h2>
          <Link
            href="/about"
            className="inline-flex min-h-11 items-center gap-1 text-sm text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            About us <ArrowIcon className="size-3.5" />
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4">
          {MEMBERS.map((m) => (
            <li key={m.handle} className="bg-background p-6">
              <p className="text-lg font-medium">{m.name}</p>
              <p className="mt-1 font-mono text-xs text-muted">@{m.handle}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
