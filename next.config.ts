import type { NextConfig } from "next";

// Shortlink redirects — shreekalpo.com/<slug> → social / technical profiles
// mailto: and tel: links are handled in middleware.ts (next.config only supports http/https)
const shortlinks = [
  // ── Social ───────────────────────────────────────────────────────────────
  { source: "/instagram",  destination: "https://www.instagram.com/shreekalpo/" },
  { source: "/linkedin",   destination: "https://www.linkedin.com/in/shreekalpo/" },
  { source: "/li",         destination: "https://www.linkedin.com/in/shreekalpo/" },
  { source: "/twitter",    destination: "https://x.com/shreekalpo_/" },
  { source: "/x",          destination: "https://x.com/shreekalpo_/" },
  { source: "/facebook",   destination: "https://www.facebook.com/shreekalpo1/" },
  { source: "/fb",         destination: "https://www.facebook.com/shreekalpo1/" },
  { source: "/pinterest",  destination: "https://www.pinterest.com/shreekalpo/" },
  { source: "/pin",        destination: "https://www.pinterest.com/shreekalpo/" },
  { source: "/behance",    destination: "https://www.behance.net/sayandeepgiri1" },
  { source: "/dribbble",   destination: "https://dribbble.com/sayandeep-giri" },
  { source: "/drib",       destination: "https://dribbble.com/sayandeep-giri" },
  { source: "/reddit",     destination: "https://www.reddit.com/user/Actual-Ad4212/" },
  { source: "/vimeo",      destination: "https://vimeo.com/shreekalpo" },
  // ── Technical ────────────────────────────────────────────────────────────
  { source: "/github",     destination: "https://github.com/sayandeep14" },
  { source: "/gh",         destination: "https://github.com/sayandeep14" },
  { source: "/stackoverflow", destination: "https://stackoverflow.com/users/32794709/sayandeep-giri" },
  { source: "/so",         destination: "https://stackoverflow.com/users/32794709/sayandeep-giri" },
  { source: "/medium",     destination: "https://medium.com/@shreekalpo" },
  { source: "/devto",      destination: "https://dev.to/shreekalpo" },
  { source: "/dev",        destination: "https://dev.to/shreekalpo" },
  { source: "/hashnode",   destination: "https://hashnode.com/@shreekalpo" },
  { source: "/substack",   destination: "https://shreekalpo.substack.com/" },
  { source: "/beehiiv",    destination: "https://shreekalpo.beehiiv.com/" },
  { source: "/codepen",    destination: "https://codepen.io/Sayandeep-Giri" },
  { source: "/cp",         destination: "https://codepen.io/Sayandeep-Giri" },
  { source: "/leetcode",   destination: "https://leetcode.com/u/neel-ju14/" },
  { source: "/lc",         destination: "https://leetcode.com/u/neel-ju14/" },
  { source: "/codeforces", destination: "https://codeforces.com/profile/shreekalpo.js" },
  { source: "/cf",         destination: "https://codeforces.com/profile/shreekalpo.js" },
  // ── Contact (WhatsApp — https) ────────────────────────────────────────────
  { source: "/whatsapp",   destination: "https://wa.me/919748281590" },
  { source: "/wa",         destination: "https://wa.me/919748281590" },
].map((r) => ({ ...r, permanent: false }));

const nextConfig: NextConfig = {
  async redirects() {
    return shortlinks;
  },
};

export default nextConfig;
