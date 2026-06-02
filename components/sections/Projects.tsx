"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    number: "01",
    title: "JUSense Platform",
    category: "IoT · Web",
    description:
      "End-to-end sensor data platform built at Jadavpur University. Real-time data ingestion, visualization, and alerting for campus-wide sensor networks.",
    tech: ["Next.js", "Node.js", "MQTT", "PostgreSQL"],
    status: "Production",
    href: "#",
  },
  {
    number: "02",
    title: "Algorithmic Trading Bot",
    category: "Finance · Engineering",
    description:
      "Quantitative trading system leveraging technical indicators and ML-based signal generation. Personal research project built alongside my work in financial systems.",
    tech: ["Python", "FastAPI", "PyTorch", "Redis"],
    status: "Research",
    href: "#",
  },
  {
    number: "03",
    title: "Beat Lab",
    category: "Music · Creative Tech",
    description:
      "Browser-based digital audio workstation concept for collaborative beat making. Brings my two worlds — music production and engineering — into one interface.",
    tech: ["Web Audio API", "React", "WebSockets"],
    status: "In Progress",
    href: "#",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section heading drifts right
      gsap.to(".proj-heading", {
        x: 50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Section number drifts left at different rate
      gsap.to(".proj-label", {
        x: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });

      sectionRef.current?.querySelectorAll(".proj-row").forEach((row, i) => {
        gsap.fromTo(
          row,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 86%" },
            delay: i * 0.08,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{
        padding: "9rem 0",
        backgroundColor: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "4rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              className="proj-label"
              style={{
                marginBottom: "1rem",
                fontSize: "0.7rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              03 — Projects
            </p>
            <h2
              className="proj-heading"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 500,
                lineHeight: 1.18,
                color: "var(--ink)",
              }}
            >
              Selected <em style={{ color: "var(--accent)" }}>work.</em>
            </h2>
          </div>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--muted)",
              fontWeight: 300,
              maxWidth: 240,
              lineHeight: 1.7,
            }}
          >
            Placeholder projects — real ones coming soon.
          </p>
        </div>

        {/* Project rows */}
        <div>
          {projects.map((project, i) => (
            <a
              key={i}
              href={project.href}
              className="proj-row"
              style={{
                display: "block",
                borderTop: "1px solid var(--border)",
                padding: "2.5rem 0",
                textDecoration: "none",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(17,17,17,0.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "3rem 1fr",
                  gap: "2rem",
                  alignItems: "start",
                }}
                className="proj-inner"
              >
                {/* Number */}
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--muted)",
                    paddingTop: "0.3rem",
                  }}
                >
                  {project.number}
                </span>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "1rem",
                  }}
                  className="proj-content"
                >
                  {/* Top row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "0.65rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--muted)",
                          marginBottom: "0.35rem",
                        }}
                      >
                        {project.category}
                      </p>
                      <h3
                        style={{
                          fontFamily: "var(--font-playfair), Georgia, serif",
                          fontSize: "1.4rem",
                          fontWeight: 500,
                          color: "var(--ink)",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
                      >
                        {project.title} ↗
                      </h3>
                    </div>

                    <span
                      style={{
                        fontSize: "0.62rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "0.25rem 0.85rem",
                        border: `1px solid ${project.status === "Production" ? "var(--accent)" : "var(--border)"}`,
                        color:
                          project.status === "Production"
                            ? "var(--accent)"
                            : "var(--muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Description + tech */}
                  <div
                    className="proj-desc-row"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 300,
                        lineHeight: 1.8,
                        color: "var(--muted)",
                        maxWidth: 480,
                      }}
                    >
                      {project.description}
                    </p>

                    <div
                      className="proj-tech"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.35rem",
                        alignItems: "flex-start",
                        justifyContent: "flex-end",
                      }}
                    >
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: "0.65rem",
                            color: "var(--muted)",
                            border: "1px solid var(--border)",
                            padding: "0.2rem 0.6rem",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}

          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          #projects { padding: 5rem 0 !important; }
          .proj-inner { grid-template-columns: 2rem 1fr !important; gap: 1rem !important; }
          .proj-desc-row { flex-direction: column !important; }
          .proj-tech { justify-content: flex-start !important; }
          .proj-row { padding: 2rem 0 !important; }
        }
      `}</style>
    </section>
  );
}
