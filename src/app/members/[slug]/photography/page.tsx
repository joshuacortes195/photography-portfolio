import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import MemberShell from "@/components/MemberShell";
import { MEMBERS, SITE, getMember } from "@/lib/site";
import { getTheme } from "@/lib/themes";
import { listFolderMedia } from "@/lib/drive";

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
  if (!member) return { title: "Photography" };
  return {
    title: `${member.name} — Photography`,
    description: `Photography by ${member.name} at ${SITE.name}.`,
  };
}

export default async function PhotographyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = getMember(slug);
  if (!member) notFound();

  const photos = await listFolderMedia(member.drive.photos, { revalidate });

  return (
    <MemberShell
      member={member}
      eyebrow="Photography"
      backHref={`/members/${member.slug}`}
      backLabel={`Back to ${member.name}`}
    >
      {photos.length > 0 ? (
        <Gallery items={photos} layout={getTheme(member.slug).layout} />
      ) : (
        <EmptyNote name={member.name} kind="photos" />
      )}
    </MemberShell>
  );
}

function EmptyNote({ name, kind }: { name: string; kind: string }) {
  return (
    <div className="mt-10 rounded-xl border border-dashed border-foreground/20 p-10 text-center">
      <p className="text-muted">
        No {kind} yet — anything {name} adds to the Drive folder will show up
        here automatically.
      </p>
    </div>
  );
}
