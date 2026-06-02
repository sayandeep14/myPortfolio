"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const links = [
  {
    label: "Email",
    value: "sayandeepgiri14@gmail.com",
    href: "mailto:sayandeepgiri14@gmail.com",
  },
  { label: "GitHub", value: "github.com/sayandeepgiri", href: "#" },
  { label: "LinkedIn", value: "linkedin.com/in/sayandeepgiri", href: "#" },
  { label: "SoundCloud", value: "soundcloud.com/sayandeepgiri", href: "#" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-head",
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      sectionRef.current?.querySelectorAll(".contact-link").forEach((el, i) => {
        gsap.fromTo(
          el,
          { x: -24, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power2.out",
            delay: i * 0.08,
            scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        padding: "10rem 0 5rem",
        backgroundColor: "var(--ink)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
        <p
          style={{
            marginBottom: "2rem",
            fontSize: "0.7rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          05 — Contact
        </p>

        <h2
          className="contact-head"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(2.5rem, 7vw, 6rem)",
            fontWeight: 500,
            lineHeight: 1.05,
            color: "var(--bg)",
            marginBottom: "5rem",
          }}
        >
          Let&apos;s make
          <br />
          something <em style={{ color: "var(--accent)" }}>great.</em>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            borderTop: "1px solid rgba(245,244,240,0.1)",
            paddingTop: "3rem",
          }}
          className="contact-grid"
        >
          {/* Left */}
          <p
            style={{
              fontSize: "0.9rem",
              fontWeight: 300,
              lineHeight: 1.9,
              color: "rgba(245,244,240,0.45)",
              maxWidth: 340,
            }}
          >
            Whether it&apos;s a collaboration, a conversation, or just a question —
            I&apos;m always open. The best connections start with a simple hello.
          </p>

          {/* Right: links */}
          <div>
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="contact-link"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.1rem 0",
                  borderBottom: "1px solid rgba(245,244,240,0.08)",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(245,244,240,0.35)",
                  }}
                >
                  {link.label}
                </span>
                <span
                  className="contact-link-val"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 300,
                    color: "rgba(245,244,240,0.65)",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(245,244,240,0.65)")
                  }
                >
                  {link.value} ↗
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "5rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(245,244,240,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.72rem", color: "rgba(245,244,240,0.2)" }}>
            © 2025 Sayandeep Giri
          </p>
          <p style={{ fontSize: "0.72rem", color: "rgba(245,244,240,0.2)" }}>
            Built with Next.js · Three.js · GSAP
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .contact-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 767px) {
          #contact { padding: 6rem 0 3rem !important; }
          .contact-head { margin-bottom: 3rem !important; font-size: clamp(2rem, 9vw, 3.5rem) !important; }
          .contact-link { flex-direction: column !important; align-items: flex-start !important; gap: 0.3rem; padding: 1.4rem 0 !important; }
          .contact-link-val { font-size: 0.78rem !important; word-break: break-all; }
        }
      `}</style>
    </section>
  );
}
