"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-tile"
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        className="link-tile-inner"
        style={{
          border: "1px solid var(--border)",
          padding: "1rem 1.1rem",
          transition: "border-color 0.2s, background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(192,57,43,0.04)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
        }}
      >
        <p style={{ fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.45rem" }}>
          {label}
        </p>
        <p style={{ fontSize: "0.82rem", fontWeight: 400, color: "var(--ink)", lineHeight: 1.2 }}>
          {handle} <span style={{ color: "var(--accent)", fontSize: "0.7rem" }}>↗</span>
        </p>
      </div>
    </a>
  );
}

export default function Links() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".links-head",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 78%" } }
      );

      sectionRef.current?.querySelectorAll(".links-group").forEach((group, i) => {
        gsap.fromTo(
          group,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: i * 0.15, scrollTrigger: { trigger: sectionRef.current, start: "top 72%" } }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="links"
      style={{ padding: "8rem 0 8rem", backgroundColor: "var(--bg)" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>

        <p style={{ marginBottom: "2rem", fontSize: "0.7rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--accent)" }}>
          05 — Find me
        </p>

        <h2
          className="links-head"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(2.2rem, 5.5vw, 5rem)",
            fontWeight: 500,
            lineHeight: 1.05,
            color: "var(--ink)",
            marginBottom: "4rem",
          }}
        >
          Across the web.
        </h2>

        {/* Social */}
        <div className="links-group" style={{ marginBottom: "3rem" }}>
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1.25rem" }}>
            Social
          </p>
          <div className="tiles-grid">
            {social.map((item) => <Tile key={item.href} {...item} />)}
          </div>
        </div>

        {/* Technical */}
        <div className="links-group">
          <p style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1.25rem" }}>
            Technical
          </p>
          <div className="tiles-grid">
            {technical.map((item) => <Tile key={item.href} {...item} />)}
          </div>
        </div>

      </div>

      <style>{`
        .tiles-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.6rem;
        }
        @media (max-width: 1023px) {
          .tiles-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 767px) {
          #links { padding: 5rem 0 5rem !important; }
          .links-head { margin-bottom: 2.5rem !important; }
          .tiles-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
