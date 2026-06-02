"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const social = [
  { label: "Instagram",  handle: "@shreekalpo",       href: "https://www.instagram.com/shreekalpo/" },
  { label: "LinkedIn",   handle: "in/shreekalpo",      href: "https://www.linkedin.com/in/shreekalpo/" },
  { label: "X / Twitter",handle: "@shreekalpo_",       href: "https://x.com/shreekalpo_/" },
  { label: "Facebook",   handle: "@shreekalpo1",       href: "https://www.facebook.com/shreekalpo1/" },
  { label: "Pinterest",  handle: "@shreekalpo",        href: "https://www.pinterest.com/shreekalpo/" },
  { label: "Behance",    handle: "sayandeepgiri1",     href: "https://www.behance.net/sayandeepgiri1" },
  { label: "Dribbble",   handle: "@sayandeep-giri",    href: "https://dribbble.com/sayandeep-giri" },
  { label: "Reddit",     handle: "u/Actual-Ad4212",    href: "https://www.reddit.com/user/Actual-Ad4212/" },
  { label: "Vimeo",      handle: "shreekalpo",         href: "https://vimeo.com/shreekalpo" },
  { label: "WhatsApp",   handle: "+91 97482 81590",    href: "https://wa.me/+919748281590" },
];

const technical = [
  { label: "GitHub",         handle: "sayandeep14",      href: "https://github.com/sayandeep14" },
  { label: "Stack Overflow", handle: "sayandeep-giri",   href: "https://stackoverflow.com/users/32794709/sayandeep-giri" },
  { label: "Medium",         handle: "@shreekalpo",      href: "https://medium.com/@shreekalpo" },
  { label: "Dev.to",         handle: "@shreekalpo",      href: "https://dev.to/shreekalpo" },
  { label: "Hashnode",       handle: "@shreekalpo",      href: "https://hashnode.com/@shreekalpo" },
  { label: "Substack",       handle: "shreekalpo",       href: "https://shreekalpo.substack.com/" },
  { label: "Beehiiv",        handle: "shreekalpo",       href: "https://shreekalpo.beehiiv.com/" },
  { label: "CodePen",        handle: "Sayandeep-Giri",   href: "https://codepen.io/Sayandeep-Giri" },
  { label: "LeetCode",       handle: "neel-ju14",        href: "https://leetcode.com/u/neel-ju14/" },
  { label: "Codeforces",     handle: "shreekalpo.js",    href: "https://codeforces.com/profile/shreekalpo.js" },
];

function LinkRow({ label, handle, href, index }: { label: string; handle: string; href: string; index: number }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-row"
      data-index={index}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.9rem 0",
        borderBottom: "1px solid var(--border)",
        textDecoration: "none",
        gap: "1rem",
      }}
    >
      <span style={{ fontSize: "0.65rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <span
        className="link-handle"
        style={{ fontSize: "0.82rem", fontWeight: 300, color: "var(--ink)", transition: "color 0.2s", textAlign: "right" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
      >
        {handle} ↗
      </span>
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

      sectionRef.current?.querySelectorAll(".links-col").forEach((col, i) => {
        gsap.fromTo(
          col,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: i * 0.12, scrollTrigger: { trigger: sectionRef.current, start: "top 72%" } }
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

        <div className="links-grid">
          {/* Social column */}
          <div className="links-col">
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem", paddingBottom: "0.75rem", borderBottom: "2px solid var(--ink)" }}>
              Social
            </p>
            {social.map((item, i) => (
              <LinkRow key={item.href} {...item} index={i} />
            ))}
          </div>

          {/* Technical column */}
          <div className="links-col">
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem", paddingBottom: "0.75rem", borderBottom: "2px solid var(--ink)" }}>
              Technical
            </p>
            {technical.map((item, i) => (
              <LinkRow key={item.href} {...item} index={i} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 5rem;
        }
        @media (max-width: 767px) {
          #links { padding: 5rem 0 5rem !important; }
          .links-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .links-head { margin-bottom: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
}
