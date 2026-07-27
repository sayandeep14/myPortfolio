"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";

const links = [
  { label: "Email",        value: "sayandeepgiri14@gmail.com", href: "mailto:sayandeepgiri14@gmail.com" },
  { label: "Email",        value: "neel.ju14@hotmail.com",     href: "mailto:neel.ju14@hotmail.com" },
  { label: "Phone",        value: "+91 97482 81590",           href: "tel:+919748281590" },
  { label: "Phone",        value: "+91 82502 47128",           href: "tel:+918250247128" },
  { label: "WhatsApp",     value: "+91 97482 81590",           href: "https://wa.me/+919748281590" },
  { label: "Drop a note",  value: "Anonymous or signed →",     href: "/message" },
];

const builtWith = [
  { name: "Claude Code", desc: "AI pair programmer" },
  { name: "Next.js 16", desc: "App Router · React framework" },
  { name: "Three.js", desc: "WebGL · morphing particle journey" },
  { name: "GSAP", desc: "ScrollSmoother · ScrollTrigger · SplitText" },
  { name: "TipTap", desc: "Rich text editor" },
  { name: "Supabase", desc: "PostgreSQL · Auth · Storage" },
  { name: "Resend", desc: "Transactional email" },
  { name: "Vercel", desc: "Hosting · Edge network" },
  { name: "TypeScript", desc: "Type-safe codebase" },
  { name: "GoDaddy", desc: "Domain registrar" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(".contact-head", {
        type: "lines,chars",
        mask: "lines",
        linesClass: "contact-line",
        charsClass: "contact-char",
      });

      gsap.fromTo(
        split.chars,
        { rotateX: -95, y: 60, opacity: 0 },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 1.15,
          ease: "journey",
          stagger: 0.022,
          scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
        }
      );

      gsap.fromTo(
        ".contact-link",
        { rotateY: -40, x: -30, opacity: 0 },
        {
          rotateY: 0,
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "journey",
          stagger: 0.07,
          scrollTrigger: { trigger: ".contact-links", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".built-with-grid > div",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: { grid: "auto", from: "start", amount: 0.5 },
          scrollTrigger: { trigger: ".built-with-grid", start: "top 90%" },
        }
      );

      return () => split.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="contact scene-3d">
      <div className="contact-wrap">
        <p className="contact-label">06 — Contact</p>

        <h2 className="contact-head">
          Let&apos;s make
          <br />
          something <em>great.</em>
        </h2>

        <div className="contact-grid">
          <p className="contact-intro">
            Whether it&apos;s a collaboration, a conversation, or just a question — I&apos;m
            always open. The best connections start with a simple hello.
          </p>

          <div className="contact-links">
            {links.map((link, i) => (
              <a key={i} href={link.href} className="contact-link">
                <span className="contact-link-key">{link.label}</span>
                <span className="contact-link-val">{link.value} ↗</span>
              </a>
            ))}
          </div>
        </div>

        <div className="built-with">
          <p className="built-with-label">Built with</p>
          <div className="built-with-grid">
            {builtWith.map((tool) => (
              <div key={tool.name}>
                <p className="built-with-name">{tool.name}</p>
                <p className="built-with-desc">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-foot">
          <p>© 2025 Sayandeep Giri</p>
          <a href="/admin/login" aria-label="Admin">·</a>
        </div>
      </div>

      <style>{`
        .contact {
          position: relative;
          padding: 12rem 0 5rem;
          background-color: transparent;
        }
        .contact-wrap { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }

        .contact-label {
          margin-bottom: 2rem;
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .contact-head {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(2.5rem, 7vw, 6rem);
          font-weight: 500;
          line-height: 1.05;
          color: var(--bg);
          margin-bottom: 5rem;
          perspective: 900px;
        }
        .contact-head em { color: var(--accent); font-style: italic; }
        .contact-line { transform-style: preserve-3d; }
        .contact-char { display: inline-block; transform-origin: 50% 100% -40px; }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          border-top: 1px solid rgba(245, 244, 240, 0.1);
          padding-top: 3rem;
        }
        .contact-intro {
          font-size: 0.9rem;
          font-weight: 300;
          line-height: 1.9;
          color: rgba(245, 244, 240, 0.45);
          max-width: 340px;
        }

        .contact-links { perspective: 900px; }
        .contact-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 0;
          border-bottom: 1px solid rgba(245, 244, 240, 0.08);
          text-decoration: none;
          transform-origin: left center;
          transition: padding-left 0.3s, border-color 0.3s;
        }
        .contact-link:hover {
          padding-left: 0.75rem;
          border-color: rgba(192, 57, 43, 0.6);
        }
        .contact-link-key {
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(245, 244, 240, 0.35);
        }
        .contact-link-val {
          font-size: 0.875rem;
          font-weight: 300;
          color: rgba(245, 244, 240, 0.65);
          transition: color 0.25s;
        }
        .contact-link:hover .contact-link-val { color: var(--accent); }

        .built-with {
          margin-top: 5rem;
          padding-top: 3rem;
          border-top: 1px solid rgba(245, 244, 240, 0.08);
        }
        .built-with-label {
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245, 244, 240, 0.25);
          margin-bottom: 1.75rem;
        }
        .built-with-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.25rem 2rem;
        }
        .built-with-grid > div {
          border-bottom: 1px solid rgba(245, 244, 240, 0.06);
          padding-bottom: 0.9rem;
        }
        .built-with-name {
          font-size: 0.78rem;
          color: rgba(245, 244, 240, 0.6);
          margin-bottom: 0.2rem;
        }
        .built-with-desc {
          font-size: 0.65rem;
          color: rgba(245, 244, 240, 0.25);
          letter-spacing: 0.04em;
        }

        .contact-foot {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(245, 244, 240, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .contact-foot p { font-size: 0.72rem; color: rgba(245, 244, 240, 0.2); }
        .contact-foot a {
          font-size: 0.6rem;
          color: rgba(245, 244, 240, 0.08);
          text-decoration: none;
          letter-spacing: 0.06em;
          transition: color 0.25s;
        }
        .contact-foot a:hover { color: rgba(245, 244, 240, 0.25); }

        @media (min-width: 768px) {
          .contact-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 1023px) {
          .built-with-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 767px) {
          .contact { padding: 7rem 0 3rem; }
          .contact-head {
            margin-bottom: 3rem;
            font-size: clamp(2rem, 9vw, 3.5rem);
          }
          .contact-link {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.3rem;
            padding: 1.4rem 0;
          }
          .contact-link-val { font-size: 0.78rem; word-break: break-all; }
          .built-with-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
