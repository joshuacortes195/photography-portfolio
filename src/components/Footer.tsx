import { InstagramIcon } from "@/components/Icons";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-foreground/50">
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <a
          href={SITE.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <InstagramIcon className="size-4" />
          <span>@{SITE.instagram}</span>
        </a>
      </div>
    </footer>
  );
}
