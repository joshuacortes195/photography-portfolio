import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy.
//
// Everything the browser loads comes from our own origin: all photos/videos are
// proxied through /api/drive/*, fonts are self-hosted by next/font, and Tailwind
// CSS is bundled. So 'self' covers almost all of it. Next's runtime injects a
// few inline <script>/<style> tags for hydration, which is why 'unsafe-inline'
// is required (there's no user-generated HTML on the site, so the XSS surface is
// minimal). Dev additionally needs 'unsafe-eval' + a websocket for Fast Refresh.
// drive.google.com is allowed as a frame source in case videos are ever shown
// via Drive's iframe embed.
const csp = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `frame-ancestors 'none'`,
  `form-action 'self'`,
  `img-src 'self' data:`,
  `media-src 'self'`,
  `font-src 'self'`,
  `style-src 'self' 'unsafe-inline'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  `frame-src https://drive.google.com`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Force HTTPS for two years (Netlify serves the site over HTTPS).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  // Don't let browsers MIME-sniff responses into a different content type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking protection (legacy browsers; CSP frame-ancestors covers modern).
  { key: "X-Frame-Options", value: "DENY" },
  // Don't leak full URLs to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful APIs the site never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
