# afterimage.thirds

Portfolio website for **afterimage.thirds** — a four-person visual collective.

Built with [Next.js 16](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS v4.

## Pages

- `/` — Home / hero + the collective
- `/work` — Portfolio gallery (placeholder tiles; drop images into `public/work`)
- `/about` — The four members, each linking to their Instagram

## Edit content

Almost everything lives in [`src/lib/site.ts`](src/lib/site.ts):

- `SITE` — name, tagline, description, shared Instagram (`@afterimage.thirds`)
- `MEMBERS` — each member's display name, Instagram handle, and role
  - ⚠️ The 4th member is a placeholder — update its `handle` and `name`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy

Push to GitHub, then import the repo at [vercel.com/new](https://vercel.com/new) for a free live URL.
