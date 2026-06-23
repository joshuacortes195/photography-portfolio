# Connecting Google Drive to the site

Each member's page (`/members/josh`, `/members/daele`, `/members/flo`) pulls
photos and videos straight from that person's Google Drive folders. Drop a file
in the folder, and it shows up on the site within ~5 minutes — no code changes,
no redeploy.

There are three one-time steps: **(1)** get an API key, **(2)** share the
folders, **(3)** paste the folder IDs into the config.

---

## 1. Get a Google Drive API key (~5 min)

1. Go to <https://console.cloud.google.com/> and sign in with the account that
   owns the Drive (the one with the Photography / Videography folders).
2. Create a project (top bar → project dropdown → **New Project**). Name it
   anything, e.g. `afterimage-thirds`.
3. With that project selected, go to **APIs & Services → Library**, search for
   **Google Drive API**, open it, and click **Enable**.
4. Go to **APIs & Services → Credentials → Create credentials → API key**.
5. Copy the key. Click **Edit API key** and, under **API restrictions**, choose
   **Restrict key → Google Drive API**. Save. (This limits what the key can do.)
6. Put the key in your env files:
   - Local: `.env.local` → `GOOGLE_DRIVE_API_KEY=AIza...`
   - Production (Vercel): Project → **Settings → Environment Variables** → add
     `GOOGLE_DRIVE_API_KEY`.

## 2. Share the folders publicly

The API key can only read folders that are publicly viewable.

For **each** of the 6 folders (Photography/Josh, Photography/Daele,
Photography/Leon, and the three Videography ones):

1. Right-click the folder → **Share**.
2. Under **General access**, switch to **Anyone with the link** → role
   **Viewer**.
3. Done. (Only people with the link can see them, and the site has the link.)

> Tip: if you set "Anyone with the link" on the top-level **Photography** and
> **Videography** folders, the subfolders inherit it automatically.

## 3. Paste the folder IDs into config

Open each folder in Drive. The URL looks like:

```
https://drive.google.com/drive/folders/1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUv
                                        └──────────── this is the ID ────────────┘
```

Copy that ID and paste it into `src/lib/site.ts`, in the matching member's
`drive` block:

```ts
{
  slug: "josh",
  ...
  drive: {
    photos: "1A2b3C4d...",  // Photography / Josh folder ID
    videos: "9Z8y7X6w...",  // Videography / Josh folder ID
  },
},
```

Leave a field blank if there's no folder for it yet — that section just won't
show.

---

## Testing

- Locally: `npm run dev`, then open <http://localhost:3000/members/josh>. The
  test image in Josh's folder should appear under **Photography**.
- The list is cached for 5 minutes. To force an immediate refresh without
  waiting, set `REVALIDATE_SECRET` in your env and POST to:
  `/api/revalidate?secret=YOUR_SECRET`.

## How "auto-update" works

The member pages use Incremental Static Regeneration (`export const revalidate
= 300`). Each page is served instantly from cache; at most once every 5 minutes
the server re-lists the Drive folder in the background and swaps in any new
files. Tune the interval by changing `revalidate` in
`src/app/members/[slug]/page.tsx`.

## Notes / limitations

- This uses Google's public thumbnail URLs (good up to ~1600px). They're great
  for a portfolio grid. If you later want full-resolution downloads or inline
  video playback, we can add a small proxy route.
- Videos open on Google Drive in a new tab when clicked. Inline playback can be
  added later if you want it.
- Keep the API key restricted to the Drive API (step 1.5) so it can't be abused
  if it leaks.
