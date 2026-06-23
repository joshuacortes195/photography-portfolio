// Central site configuration. Edit member handles / names / links here.

export const SITE = {
  name: "afterimage.thirds",
  title: "afterimage / thirds",
  tagline: "A four-person visual collective.",
  description:
    "afterimage.thirds is a collective of four artists sharing one lens. Photography, frames, and afterimages.",
  instagram: "afterimage.thirds",
  instagramUrl: "https://instagram.com/afterimage.thirds",
} as const;

export type Member = {
  /** Display name shown on the site. Edit freely. */
  name: string;
  /** Instagram handle without the @ */
  handle: string;
  /** Short role / blurb. Edit freely. */
  role: string;
};

export const MEMBERS: Member[] = [
  { name: "Josh", handle: "josh_cort__", role: "Photographer" },
  { name: "Daele", handle: "daele_koala", role: "Photographer" },
  { name: "Flo", handle: "flopasd", role: "Photographer" },
  // TODO: replace with the 4th member's real handle + name.
  { name: "Member Four", handle: "afterimage.thirds", role: "Photographer" },
];

export function instagramUrl(handle: string): string {
  return `https://instagram.com/${handle}`;
}

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
] as const;
