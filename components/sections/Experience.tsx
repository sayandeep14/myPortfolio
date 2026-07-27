"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

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
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) return;

      // Pin the heading column beside the scrolling timeline. ScrollTrigger's
      // pin behaves correctly inside ScrollSmoother; `position: sticky` does not.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const pin = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 22%",
          end: "bottom 78%",
          pin: ".exp-heading-col",
          pinSpacing: false,
        });
        return () => pin.kill();
      });

      // The accent line grows as you descend the timeline.
      gsap.fromTo(
        ".exp-line-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: ".exp-timeline",
            start: "top 70%",
            end: "bottom 70%",
            scrub: 0.6,
          },
        }
      );

      // Entries hinge in from the side, rotating around their left edge.
      gsap.utils.toArray<HTMLElement>(".exp-item").forEach((item) => {
        gsap.fromTo(
          item,
          { rotateY: -42, z: -220, x: -40, opacity: 0 },
          {
            rotateY: 0,
            z: 0,
            x: 0,
            opacity: 1,
            duration: 1.1,
            ease: "journey",
            scrollTrigger: { trigger: item, start: "top 86%" },
          }
        );
      });

      // Heading drifts as the section passes.
      gsap.to(".exp-heading", {
        x: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="exp scene-3d">
      <div className="exp-wrap">
        <p className="section-label">02 — Experience &amp; Education</p>

        <div className="exp-grid">
          <div className="exp-heading-col">
            <h2 className="exp-heading">
              Where I&apos;ve
              <br />
              <em>been.</em>
            </h2>
          </div>

          <div className="exp-timeline">
            <div className="exp-line" aria-hidden>
              <div className="exp-line-fill" />
            </div>

            {timeline.map((item, i) => (
              <div
                key={i}
                className="exp-item"
                style={{ paddingBottom: i < timeline.length - 1 ? "3.5rem" : 0 }}
              >
                <span className={`exp-dot${item.accent ? " is-accent" : ""}`} aria-hidden />

                <div className="exp-meta">
                  <p>{item.period}</p>
                  <span aria-hidden>·</span>
                  <p>{item.type}</p>
                </div>

                <h3 className="exp-role">{item.role}</h3>
                <p className="exp-org">{item.org}</p>
                <p className="exp-desc">{item.description}</p>

                <div className="exp-tags">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .exp {
          position: relative;
          padding: 11rem 0;
          background-color: transparent;
          border-top: 1px solid var(--border);
        }
        .exp-wrap { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }

        .exp-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; }

        .exp-heading {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 500;
          line-height: 1.18;
          color: var(--ink);
        }
        .exp-heading em { color: var(--accent); }

        .exp-timeline { position: relative; transform-style: preserve-3d; }

        .exp-line {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 1px;
          background-color: var(--border);
        }
        .exp-line-fill {
          position: absolute;
          inset: 0;
          background-color: var(--accent);
          transform-origin: top;
        }

        .exp-item {
          position: relative;
          padding-left: 2.5rem;
          transform-origin: left center;
          transform-style: preserve-3d;
        }
        .exp-dot {
          position: absolute;
          left: 0;
          top: 0.4rem;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--ink);
        }
        .exp-dot.is-accent { background-color: var(--accent); }

        .exp-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .exp-meta p {
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .exp-meta span { font-size: 0.68rem; color: var(--border); }

        .exp-role {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 0.25rem;
        }
        .exp-org {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--accent);
          margin-bottom: 0.85rem;
        }
        .exp-desc {
          font-size: 0.875rem;
          font-weight: 300;
          line-height: 1.8;
          color: var(--muted);
          margin-bottom: 1rem;
          max-width: 520px;
        }
        .exp-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .exp-tags span {
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.25rem 0.75rem;
          border: 1px solid var(--border);
          color: var(--muted);
        }

        @media (min-width: 1024px) {
          .exp-grid { grid-template-columns: 1fr 2fr; }
        }
        @media (max-width: 767px) {
          .exp { padding: 5rem 0; }
          .exp-grid { gap: 2.5rem; }
          .exp-heading { font-size: 2rem; }
        }
      `}</style>
    </section>
  );
}
