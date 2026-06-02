"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    period: "2024 — Present",
    role: "Program Associate",
    org: "Wells Fargo",
    type: "Full-time",
    accent: true,
    description:
      "Building technology solutions within Wells Fargo's financial infrastructure. Bridging engineering expertise with enterprise-scale systems to deliver impact at scale.",
    tags: ["Finance", "Engineering", "Enterprise"],
  },
  {
    period: "2023",
    role: "Technology Intern",
    org: "Wells Fargo",
    type: "Internship",
    accent: false,
    description:
      "Contributed to core engineering projects, gaining hands-on experience with large-scale financial systems and agile development in a Fortune 500 environment.",
    tags: ["Internship", "Agile", "FinTech"],
  },
  {
    period: "2021 — 2024",
    role: "Co-founder & Developer",
    org: "JUSense",
    type: "Startup",
    accent: true,
    description:
      "Part of the founding team at JUSense, an in-house startup at Jadavpur University focused on sensor-based IoT solutions. Worked across product design, full-stack development, and go-to-market.",
    tags: ["IoT", "Startup", "Product"],
  },
  {
    period: "2021 — 2025",
    role: "B.E. Computer Science & Engineering",
    org: "Jadavpur University",
    type: "Education",
    accent: false,
    description:
      "Graduated from one of India's premier engineering institutions. Focus areas included systems programming, distributed computing, algorithms, and machine learning.",
    tags: ["CSE", "Research", "Kolkata"],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading drifts left as you scroll
      gsap.to(".exp-heading", {
        x: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.fromTo(
        ".exp-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.8,
          ease: "power3.out",
          transformOrigin: "top",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );

      sectionRef.current?.querySelectorAll(".exp-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 84%" },
            delay: i * 0.04,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      style={{
        padding: "9rem 0",
        backgroundColor: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
        <p
          style={{
            marginBottom: "4rem",
            fontSize: "0.7rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          02 — Experience & Education
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "4rem",
          }}
          className="exp-grid"
        >
          {/* Sticky heading */}
          <div>
            <h2
              className="exp-heading"
              style={{
                position: "sticky",
                top: "8rem",
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                fontWeight: 500,
                lineHeight: 1.18,
                color: "var(--ink)",
              }}
            >
              Where I&apos;ve
              <br />
              <em style={{ color: "var(--accent)" }}>been.</em>
            </h2>
          </div>

          {/* Timeline */}
          <div style={{ position: "relative" }}>
            {/* Vertical rule */}
            <div
              className="exp-line"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 1,
                backgroundColor: "var(--border)",
              }}
            />

            {timeline.map((item, i) => (
              <div
                key={i}
                className="exp-item"
                style={{
                  position: "relative",
                  paddingLeft: "2.5rem",
                  paddingBottom: i < timeline.length - 1 ? "3.5rem" : 0,
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "0.4rem",
                    transform: "translateX(-50%)",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: item.accent ? "var(--accent)" : "var(--ink)",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                    }}
                  >
                    {item.period}
                  </p>
                  <span style={{ fontSize: "0.68rem", color: "var(--border)" }}>·</span>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                    }}
                  >
                    {item.type}
                  </p>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontSize: "1.25rem",
                    fontWeight: 500,
                    color: "var(--ink)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {item.role}
                </h3>

                <p
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "var(--accent)",
                    marginBottom: "0.85rem",
                  }}
                >
                  {item.org}
                </p>

                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 300,
                    lineHeight: 1.8,
                    color: "var(--muted)",
                    marginBottom: "1rem",
                    maxWidth: 520,
                  }}
                >
                  {item.description}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "0.62rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "0.25rem 0.75rem",
                        border: "1px solid var(--border)",
                        color: "var(--muted)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .exp-grid { grid-template-columns: 1fr 2fr !important; }
        }
        @media (max-width: 767px) {
          #experience { padding: 5rem 0 !important; }
          .exp-grid { gap: 2.5rem !important; }
          /* Hide sticky heading on mobile — it's above the timeline in single-col anyway */
          .exp-heading { position: static !important; font-size: 2rem !important; }
        }
      `}</style>
    </section>
  );
}
