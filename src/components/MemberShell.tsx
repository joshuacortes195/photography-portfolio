import Link from "next/link";
import { InstagramIcon, ArrowIcon } from "@/components/Icons";
import { instagramUrl, type Member } from "@/lib/site";
import { getTheme } from "@/lib/themes";

// Themed, full-bleed wrapper for a member's pages. Applies the member's color
// palette + heading font, and renders the shared header (back link, name,
// eyebrow, Instagram).
export default function MemberShell({
  member,
  eyebrow,
  backHref,
  backLabel,
  children,
}: {
  member: Member;
  eyebrow: string;
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}) {
  const theme = getTheme(member.slug);

  return (
    <div
      style={theme.style}
      className="min-h-screen overflow-x-hidden bg-background text-foreground"
    >
      <div className="mx-auto max-w-6xl px-5 py-16">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ArrowIcon className="size-3.5 rotate-180" />
          {backLabel}
        </Link>

        <header className="mt-8 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-heading text-5xl font-semibold tracking-tight sm:text-6xl">
            {member.name}
          </h1>
          {member.handle && (
            <a
              href={instagramUrl(member.handle)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-foreground/20 px-5 text-sm font-medium transition-colors hover:border-foreground/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <InstagramIcon className="size-4" />@{member.handle}
            </a>
          )}
        </header>

        {children}
      </div>
    </div>
  );
}
