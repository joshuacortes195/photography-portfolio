import type { CSSProperties } from "react";

// Per-member visual theme. The `style` object overrides the global CSS color
// variables (and heading font) on the member's page wrapper, which re-skins all
// the Tailwind color utilities used inside it. `layout` chooses the gallery
// presentation. Members will personalize these later; the values here are
// starting points.

export type GalleryLayout = "grid" | "scattered";

export type MemberTheme = {
  style: CSSProperties;
  layout: GalleryLayout;
};

// Helper so TS accepts CSS custom properties in the style object.
function vars(v: Record<string, string>): CSSProperties {
  return v as CSSProperties;
}

const DEFAULT_THEME: MemberTheme = {
  style: {},
  layout: "grid",
};

export const THEMES: Record<string, MemberTheme> = {
  // Josh — warm vintage: aged paper, sepia ink, terracotta, serif headings,
  // photos scattered like prints on a table.
  josh: {
    style: vars({
      "--background": "#ece3d0",
      "--foreground": "#3a2f25",
      "--muted": "#897a63",
      "--accent": "#9c4a2f",
      "--heading": "var(--font-fraunces)",
    }),
    layout: "scattered",
  },
  // Daele — cool, moody, deep blue-black with a teal accent.
  daele: {
    style: vars({
      "--background": "#0b1014",
      "--foreground": "#e8eef2",
      "--muted": "#7c8da0",
      "--accent": "#56b6c9",
    }),
    layout: "grid",
  },
  // Leon — near-black violet with a neon magenta accent.
  leon: {
    style: vars({
      "--background": "#0f0b13",
      "--foreground": "#efe9f4",
      "--muted": "#9b8fa8",
      "--accent": "#c264d8",
    }),
    layout: "grid",
  },
};

export function getTheme(slug: string): MemberTheme {
  return THEMES[slug] ?? DEFAULT_THEME;
}
