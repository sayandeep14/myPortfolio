"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";

const social = [
  { label: "Instagram",   handle: "@shreekalpo",     href: "https://www.instagram.com/shreekalpo/" },
  { label: "LinkedIn",    handle: "in/shreekalpo",    href: "https://www.linkedin.com/in/shreekalpo/" },
  { label: "X / Twitter", handle: "@shreekalpo_",     href: "https://x.com/shreekalpo_/" },
  { label: "Facebook",    handle: "@shreekalpo1",     href: "https://www.facebook.com/shreekalpo1/" },
  { label: "Pinterest",   handle: "@shreekalpo",      href: "https://www.pinterest.com/shreekalpo/" },
  { label: "Behance",     handle: "sayandeepgiri1",   href: "https://www.behance.net/sayandeepgiri1" },
  { label: "Dribbble",    handle: "@sayandeep-giri",  href: "https://dribbble.com/sayandeep-giri" },
  { label: "Reddit",      handle: "u/Actual-Ad4212",  href: "https://www.reddit.com/user/Actual-Ad4212/" },
  { label: "Vimeo",       handle: "shreekalpo",       href: "https://vimeo.com/shreekalpo" },
];

const technical = [
  { label: "GitHub",         handle: "sayandeep14",    href: "https://github.com/sayandeep14" },
  { label: "Stack Overflow", handle: "sayandeep-giri", href: "https://stackoverflow.com/users/32794709/sayandeep-giri" },
  { label: "Medium",         handle: "@shreekalpo",    href: "https://medium.com/@shreekalpo" },
  { label: "Dev.to",         handle: "@shreekalpo",    href: "https://dev.to/shreekalpo" },
  { label: "Hashnode",       handle: "@shreekalpo",    href: "https://hashnode.com/@shreekalpo" },
  { label: "Substack",       handle: "shreekalpo",     href: "https://shreekalpo.substack.com/" },
  { label: "Beehiiv",        handle: "shreekalpo",     href: "https://shreekalpo.beehiiv.com/" },
  { label: "CodePen",        handle: "Sayandeep-Giri", href: "https://codepen.io/Sayandeep-Giri" },
  { label: "LeetCode",       handle: "neel-ju14",      href: "https://leetcode.com/u/neel-ju14/" },
  { label: "Codeforces",     handle: "shreekalpo.js",  href: "https://codeforces.com/profile/shreekalpo.js" },
];

function Tile({ label, handle, href }: { label: string; handle: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-tile">
      <p className="link-tile-label">{label}</p>
      <p className="link-tile-handle">
        {handle} <span>↗</span>
      </p>
    </a>
  );
}

export default function Links() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(".links-head", { type: "chars", charsClass: "links-char" });

      gsap.fromTo(
        split.chars,
        { rotateX: -90, y: 40, opacity: 0 },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "journey",
          stagger: 0.03,
          scrollTrigger: { trigger: sectionRef.current, start: "top 76%" },
        }
      );

      // Tiles rise in a diagonal wave across each grid.
      gsap.utils.toArray<HTMLElement>(".tiles-grid").forEach((grid) => {
        gsap.fromTo(
          grid.children,
          { rotateX: -75, y: 50, z: -120, opacity: 0 },
          {
            rotateX: 0,
            y: 0,
            z: 0,
            opacity: 1,
            duration: 0.9,
            ease: "journey",
            stagger: { grid: "auto", from: "start", amount: 0.7 },
            scrollTrigger: { trigger: grid, start: "top 88%" },
          }
        );
      });

      return () => split.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="links" className="links scene-3d">
      <div className="links-wrap">
        <p className="section-label links-label">05 — Find me</p>

        <h2 className="links-head">Across the web.</h2>

        <div className="links-group">
          <p className="links-group-label">Social</p>
          <div className="tiles-grid">
            {social.map((item) => (
              <Tile key={item.href} {...item} />
            ))}
          </div>
        </div>

        <div className="links-group">
          <p className="links-group-label">Technical</p>
          <div className="tiles-grid">
            {technical.map((item) => (
              <Tile key={item.href} {...item} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .links {
          position: relative;
          padding: 10rem 0;
          background-color: transparent;
          border-top: 1px solid var(--border);
        }
        .links-wrap { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .links-label { margin-bottom: 2rem; }

        .links-head {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(2.2rem, 5.5vw, 5rem);
          font-weight: 500;
          line-height: 1.05;
          color: var(--ink);
          margin-bottom: 4rem;
          perspective: 800px;
        }
        .links-char { display: inline-block; transform-origin: 50% 100% -20px; }

        .links-group { margin-bottom: 3rem; }
        .links-group:last-child { margin-bottom: 0; }
        .links-group-label {
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 1.25rem;
        }

        .tiles-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.6rem;
          perspective: 1100px;
        }

        .link-tile {
          display: block;
          text-decoration: none;
          border: 1px solid var(--border);
          padding: 1rem 1.1rem;
          background-color: rgba(245, 244, 240, 0.5);
          backdrop-filter: blur(4px);
          transform-style: preserve-3d;
          will-change: transform;
          transition: border-color 0.25s, background-color 0.25s, transform 0.35s,
            box-shadow 0.35s;
        }
        .link-tile:hover {
          border-color: var(--accent);
          background-color: rgba(192, 57, 43, 0.05);
          transform: translateZ(40px) translateY(-4px);
          box-shadow: 0 20px 40px -24px rgba(17, 17, 17, 0.5);
        }

        .link-tile-label {
          font-size: 0.58rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.45rem;
        }
        .link-tile-handle {
          font-size: 0.82rem;
          font-weight: 400;
          color: var(--ink);
          line-height: 1.2;
        }
        .link-tile-handle span { color: var(--accent); font-size: 0.7rem; }

        @media (max-width: 1023px) {
          .tiles-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 767px) {
          .links { padding: 5rem 0; }
          .links-head { margin-bottom: 2.5rem; }
          .tiles-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
