"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { ScrollWorldSection } from "@/lib/scrub-engine";

// three.js stays out of the initial bundle — the film is what needs to paint first.
const LinksConstellation = dynamic(
  () => import("@/components/three/LinksConstellation"),
  { ssr: false }
);

/** Index of the chapter that is rendered in real time rather than pre-rendered. */
const LIVE_CHAPTER = 5; // "elsewhere"

const ACCENT = "#c0392b";

/**
 * The seven chapters of the flight. Copy is lifted from the original section
 * components so the voice is unchanged — only the delivery is.
 *
 * `still` is each clip's OWN first frame, not the gpt_image_2 scene still: in a
 * continuous-forward-take chain only the first leg starts from a still, so a
 * still-based poster would pop the moment the video paints.
 */
const SECTIONS: ScrollWorldSection[] = [
  {
    id: "origin",
    label: "Origin",
    still: "/world/origin.webp",
    stillMobile: "/world/origin-m.webp",
    clip: "/world/vid/origin.mp4",
    clipMobile: "/world/vid/origin-m.mp4",
    accent: ACCENT,
    scroll: 1.5,
    linger: 0.4,
    eyebrow: "Portfolio · 2025",
    title: "Sayandeep Giri.",
    body: "Engineer at Wells Fargo, CS graduate from Jadavpur University, music producer, creator.",
    tags: ["Kolkata"],
  },
  {
    id: "about",
    label: "About",
    still: "/world/about.webp",
    stillMobile: "/world/about-m.webp",
    clip: "/world/vid/about.mp4",
    clipMobile: "/world/vid/about-m.mp4",
    accent: ACCENT,
    scroll: 1.4,
    linger: 0.35,
    eyebrow: "01 — About",
    title: "Engineer by degree, creator by nature.",
    body: "A deep curiosity for how systems work, and an even deeper one for how humans feel.",
    tags: ["22", "BE CSE, Jadavpur", "3+ yrs at WF"],
  },
  {
    id: "path",
    label: "Path",
    still: "/world/path.webp",
    stillMobile: "/world/path-m.webp",
    clip: "/world/vid/path.mp4",
    clipMobile: "/world/vid/path-m.mp4",
    accent: ACCENT,
    scroll: 1.3,
    eyebrow: "02 — Experience",
    title: "The path so far.",
    body: "Bridging technology and finance at Wells Fargo, after co-building JUSense at Jadavpur.",
    tags: ["Wells Fargo", "JUSense", "Jadavpur"],
  },
  {
    id: "work",
    label: "Work",
    still: "/world/work.webp",
    stillMobile: "/world/work-m.webp",
    clip: "/world/vid/work.mp4",
    clipMobile: "/world/vid/work-m.mp4",
    accent: ACCENT,
    scroll: 1.6,
    linger: 0.45,
    eyebrow: "03 — Projects",
    title: "Things I've built.",
    body: "A campus IoT platform, a quantitative trading system, and a browser-based DAW.",
    tags: ["JUSense", "Trading Bot", "Beat Lab"],
  },
  {
    id: "beyond",
    label: "Beyond",
    still: "/world/beyond.webp",
    stillMobile: "/world/beyond-m.webp",
    clip: "/world/vid/beyond.mp4",
    clipMobile: "/world/vid/beyond-m.mp4",
    accent: ACCENT,
    scroll: 1.3,
    eyebrow: "04 — Beyond",
    title: "Patient, deliberate craft.",
    body: "I produce music, grow things, and cook elaborate meals. The best outputs come slowly.",
    tags: ["Music", "Gardening", "Cooking"],
  },
  {
    id: "elsewhere",
    label: "Elsewhere",
    still: "/world/elsewhere.webp",
    stillMobile: "/world/elsewhere-m.webp",
    clip: "/world/vid/elsewhere.mp4",
    clipMobile: "/world/vid/elsewhere-m.mp4",
    accent: ACCENT,
    scroll: 1.2,
    eyebrow: "05 — Elsewhere",
    title: "Find me around.",
    body: "Writing, code, design and sound, scattered across a dozen corners of the internet.",
    tags: ["GitHub", "Behance", "Substack"],
  },
  {
    id: "contact",
    label: "Contact",
    still: "/world/contact.webp",
    stillMobile: "/world/contact-m.webp",
    clip: "/world/vid/contact.mp4",
    clipMobile: "/world/vid/contact-m.mp4",
    accent: ACCENT,
    scroll: 1.7,
    linger: 0.5,
    eyebrow: "06 — Contact",
    title: "Let's build something.",
    body: "Always open to interesting problems and good conversation.",
    cta: {
      primary: { label: "Say hello", href: "mailto:sayandeepgiri14@gmail.com" },
      secondary: { label: "Resume ↗", href: "/resume.pdf" },
    },
  },
];

export default function ScrollWorld() {
  const hostRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const [liveActive, setLiveActive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    // React 19 StrictMode double-invokes effects in dev; the engine builds DOM
    // and would mount twice.
    if (!host || mounted.current) return;
    mounted.current = true;

    let cancelled = false;
    // Kept out of the initial bundle — it's ~28KB of DOM/CSS builder that only
    // matters once the page is interactive.
    import("@/lib/scrub-engine").then(({ mountScrollWorld }) => {
      if (cancelled || !hostRef.current) return;
      mountScrollWorld(hostRef.current, {
        brand: { name: "Sayandeep Giri", href: "#origin" },
        hint: "scroll to begin the journey",
        nav: true,
        atmosphere: true,
        // Architecture A: one continuous forward take. The legs ARE the journey,
        // so there are no connector clips — just a short dissolve at each seam
        // to absorb any sub-frame drift in the handoff.
        connectors: [],
        crossfade: 0.08,
        sections: SECTIONS,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Pointer parallax over the film ──────────────────────────────────────
  // The camera path is baked, but the plane it plays on doesn't have to be
  // static. Writes CSS custom properties; globals.css does the transform, so
  // this never fights the engine's own inline styles.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return; // coalesce to one write per frame
      raf = requestAnimationFrame(() => {
        raf = 0;
        host.style.setProperty("--swp-x", String(e.clientX / window.innerWidth - 0.5));
        host.style.setProperty("--swp-y", String(e.clientY / window.innerHeight - 0.5));
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ── Which chapter is on screen ──────────────────────────────────────────
  // The engine owns the scroll→segment mapping and marks the current chapter
  // by toggling `.is-active` on its route dots. Observing that is far more
  // robust than duplicating its segment maths here — if the pacing config
  // changes, this follows automatically.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let observer: MutationObserver | null = null;
    const attach = () => {
      const dots = host.querySelectorAll(".sw-route__dot");
      if (!dots.length) return false;
      const read = () =>
        setLiveActive(dots[LIVE_CHAPTER]?.classList.contains("is-active") ?? false);
      observer = new MutationObserver(read);
      dots.forEach((d) =>
        observer!.observe(d, { attributes: true, attributeFilter: ["class"] })
      );
      read();
      return true;
    };

    // The engine builds its DOM after an async import, so poll briefly for it.
    if (!attach()) {
      let tries = 0;
      const id = setInterval(() => {
        if (attach() || ++tries > 40) clearInterval(id);
      }, 100);
      return () => {
        clearInterval(id);
        observer?.disconnect();
      };
    }
    return () => observer?.disconnect();
  }, []);

  return (
    <>
      <div ref={hostRef} className="sw-host" />
      <LinksConstellation active={liveActive} />
    </>
  );
}
