import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected work from the afterimage.thirds collective.",
};

// Placeholder grid. Replace with real images:
// drop files in /public/work and map over them here, or wire up next/image.
const PLACEHOLDERS = Array.from({ length: 9 }, (_, i) => i + 1);

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <header className="max-w-xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          Portfolio
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Work
        </h1>
        <p className="mt-4 text-muted">
          A selection of frames from the collective. Images coming soon — drop
          photos into <code className="font-mono text-foreground/80">/public/work</code>{" "}
          and they&apos;ll live here.
        </p>
      </header>

      <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDERS.map((n) => (
          <li
            key={n}
            className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-sm text-muted/60">
                {String(n).padStart(2, "0")}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
