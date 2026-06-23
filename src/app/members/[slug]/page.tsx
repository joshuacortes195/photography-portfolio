import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/Icons";
import MemberShell from "@/components/MemberShell";
import { MEMBERS, SITE, getMember } from "@/lib/site";
import { listFolderMedia, type DriveMedia } from "@/lib/drive";

export const revalidate = 300;

export function generateStaticParams() {
  return MEMBERS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = getMember(slug);
  if (!member) return { title: "Member" };
  return {
    title: member.name,
    description: `${member.name} — ${member.role} at ${SITE.name}.`,
  };
}

export default async function MemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = getMember(slug);
  if (!member) notFound();

  const [photos, videos] = await Promise.all([
    listFolderMedia(member.drive.photos, { revalidate }),
    listFolderMedia(member.drive.videos, { revalidate }),
  ]);

  return (
    <MemberShell
      member={member}
      eyebrow={member.role}
      backHref="/"
      backLabel="afterimage.thirds"
    >
      <section className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <CollectionCard
          href={`/members/${member.slug}/photography`}
          label="Photography"
          count={photos.length}
          cover={photos[0]}
        />
        <CollectionCard
          href={`/members/${member.slug}/videography`}
          label="Videography"
          count={videos.length}
          cover={videos[0]}
        />
      </section>
    </MemberShell>
  );
}

function CollectionCard({
  href,
  label,
  count,
  cover,
}: {
  href: string;
  label: string;
  count: number;
  cover?: DriveMedia;
}) {
  return (
    <Link
      href={href}
      className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.03] p-6 transition-colors hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {cover && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover.thumbnailUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 size-full object-cover opacity-60 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-75"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      )}
      <span className="relative flex items-end justify-between">
        <span>
          <span className="block font-heading text-2xl font-semibold text-white">
            {label}
          </span>
          <span className="mt-1 block font-mono text-xs text-white/70">
            {count} {count === 1 ? "piece" : "pieces"}
          </span>
        </span>
        <ArrowIcon className="size-5 text-white transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
