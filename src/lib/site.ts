// Central site configuration. Edit member handles / names / links here.

export const SITE = {
  name: "afterimage.thirds",
  title: "afterimage.thirds",
  tagline: "A three-person visual collective.",
  description:
    "afterimage.thirds is a collective of three artists sharing one lens. Photography, frames, and afterimages.",
  instagram: "afterimage.thirds",
  instagramUrl: "https://instagram.com/afterimage.thirds",
  email: "afterimage.thirds@gmail.com",
} as const;

export type Member = {
  /** URL slug for the member's page, e.g. /members/josh */
  slug: string;
  /** Display name shown on the site. Edit freely. */
  name: string;
  /** Instagram handle without the @ */
  handle: string;
  /** Short role / blurb. Edit freely. */
  role: string;
  /**
   * Google Drive folder IDs for this member. Paste the ID from each folder's
   * URL: drive.google.com/drive/folders/<THIS_IS_THE_ID>. Each folder must be
   * shared as "Anyone with the link can view". Leave blank until ready.
   */
  drive: {
    /** Folder under "Photography" for this member. */
    photos?: string;
    /** Folder under "Videography" for this member. */
    videos?: string;
  };
};

export const MEMBERS: Member[] = [
  {
    slug: "josh",
    name: "Josh",
    handle: "josh_cort__",
    role: "Photographer",
    drive: {
      photos: "1NQM0joIZ9t0w5ykBCEgb3q_IxvCvsEXe", // Photography / Josh folder ID
      videos: "1he5CapQVp1hA86gKyh9SUn8Se7Enu05m", // Videography / Josh folder ID
    },
  },
  {
    slug: "daele",
    name: "Daele",
    handle: "daele_koala",
    role: "Photographer",
    drive: {
      photos: "1zx89pXKj4b5LI51zr9uWU_Yh1HkajX1x", // Photography / Daele folder ID
      videos: "1M_XiS8VXmDQMf2Ak5Gn8zFcYf0OmNqBW", // Videography / Daele folder ID
    },
  },
  {
    slug: "leon",
    name: "Leon",
    handle: "flopasd",
    role: "Photographer",
    drive: {
      photos: "12Bbbv-e6FwSJOcD-tQmAtV0Is3zXOScd", // Photography / Leon folder ID
      videos: "1-wuof0ZkPKexcf3kqFMcN7CQmfhH4Upn", // Videography / Leon folder ID
    },
  },
];

export function getMember(slug: string): Member | undefined {
  return MEMBERS.find((m) => m.slug === slug);
}

export function instagramUrl(handle: string): string {
  return `https://instagram.com/${handle}`;
}

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/#contact", label: "Contact us" },
] as const;
