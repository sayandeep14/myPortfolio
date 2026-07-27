"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

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
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop/tablet: pin the stage and drive the track sideways. Each card's
      // 3D rotation is derived from its live distance to the viewport centre,
      // so the row reads as a carousel turning past you.
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current!;
        const cards = gsap.utils.toArray<HTMLElement>(".proj-card");

        const setters = cards.map((c) => ({
          rotY: gsap.quickSetter(c, "rotateY", "deg"),
          z: gsap.quickSetter(c, "z", "px"),
          opacity: gsap.quickSetter(c, "opacity"),
        }));

        const shape = () => {
          const mid = window.innerWidth / 2;
          cards.forEach((card, i) => {
            const r = card.getBoundingClientRect();
            const d = (r.left + r.width / 2 - mid) / window.innerWidth; // ≈ -1…1
            const s = setters[i];
            s.rotY(gsap.utils.clamp(-52, 52, -d * 58));
            s.z(-Math.abs(d) * 380);
            s.opacity(1 - gsap.utils.clamp(0, 0.6, Math.abs(d) * 0.7));
          });
        };

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 160);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".proj-stage",
            start: "top top",
            end: () => "+=" + (distance() + window.innerHeight * 0.6),
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: shape,
            onRefresh: shape,
          },
        });

        shape();
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(cards, { clearProps: "rotateY,z,opacity" });
          gsap.set(track, { clearProps: "x" });
        };
      });

      // Mobile: no pinning — cards stack and tilt in individually.
      mm.add("(max-width: 767px)", () => {
        const tweens = gsap.utils.toArray<HTMLElement>(".proj-card").map((card) =>
          gsap.fromTo(
            card,
            { rotateX: -35, y: 60, opacity: 0 },
            {
              rotateX: 0,
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "journey",
              scrollTrigger: { trigger: card, start: "top 88%" },
            }
          )
        );
        return () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="proj">
      <div className="proj-stage">
        <div className="proj-head">
          <div>
            <p className="section-label proj-label">03 — Projects</p>
            <h2 className="proj-heading">
              Selected <em>work.</em>
            </h2>
          </div>
          <p className="proj-note">
            Placeholder projects — real ones coming soon.
            <span className="proj-hint">Keep scrolling →</span>
          </p>
        </div>

        <div className="proj-viewport">
          <div ref={trackRef} className="proj-track layer-3d">
            {projects.map((project) => (
              <a
                key={project.number}
                href={project.href}
                className="proj-card layer-3d"
              >
                <div className="proj-card-top">
                  <span className="proj-num">{project.number}</span>
                  <span
                    className={`proj-status${
                      project.status === "Production" ? " is-live" : ""
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="proj-cat">{project.category}</p>
                <h3 className="proj-title">{project.title} ↗</h3>
                <p className="proj-desc">{project.description}</p>

                <div className="proj-tech">
                  {project.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .proj {
          position: relative;
          background-color: transparent;
          border-top: 1px solid var(--border);
        }
        .proj-stage {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 3rem;
          padding: 6rem 0;
          overflow: hidden;
        }

        .proj-head {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .proj-label { margin-bottom: 1rem; }
        .proj-heading {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 500;
          line-height: 1.18;
          color: var(--ink);
        }
        .proj-heading em { color: var(--accent); }
        .proj-note {
          font-size: 0.8rem;
          color: var(--muted);
          font-weight: 300;
          max-width: 240px;
          line-height: 1.7;
        }
        .proj-hint {
          display: block;
          margin-top: 0.6rem;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
        }

        /* Perspective must live on the cards' immediate ancestor chain. The
           stage can't provide it: it only reaches its direct children, and a
           plain .proj-viewport would flatten everything below it. */
        .proj-viewport {
          width: 100%;
          overflow: visible;
          perspective: 1500px;
          perspective-origin: 50% 50%;
        }
        .proj-track {
          display: flex;
          align-items: stretch;
          gap: 2rem;
          padding: 2rem max(2rem, calc((100vw - 1200px) / 2));
          width: max-content;
          transform-style: preserve-3d;
        }

        .proj-card {
          flex: 0 0 auto;
          width: min(480px, 74vw);
          display: flex;
          flex-direction: column;
          padding: 2.5rem;
          border: 1px solid var(--border);
          background-color: rgba(245, 244, 240, 0.72);
          backdrop-filter: blur(8px);
          text-decoration: none;
          transform-origin: center center;
          will-change: transform, opacity;
          transition: border-color 0.3s, background-color 0.3s;
        }
        .proj-card:hover {
          border-color: var(--accent);
          background-color: rgba(245, 244, 240, 0.9);
        }

        .proj-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2.5rem;
        }
        .proj-num {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 2.4rem;
          font-weight: 600;
          line-height: 1;
          color: var(--border);
        }
        .proj-status {
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.25rem 0.85rem;
          border: 1px solid var(--border);
          color: var(--muted);
          white-space: nowrap;
        }
        .proj-status.is-live { border-color: var(--accent); color: var(--accent); }

        .proj-cat {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.5rem;
        }
        .proj-title {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.75rem;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 1.25rem;
          transition: color 0.25s;
        }
        .proj-card:hover .proj-title { color: var(--accent); }
        .proj-desc {
          font-size: 0.875rem;
          font-weight: 300;
          line-height: 1.85;
          color: var(--muted);
          margin-bottom: auto;
          padding-bottom: 2rem;
        }
        .proj-tech { display: flex; flex-wrap: wrap; gap: 0.35rem; }
        .proj-tech span {
          font-size: 0.65rem;
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 0.2rem 0.6rem;
        }

        @media (max-width: 767px) {
          .proj-stage {
            min-height: 0;
            padding: 5rem 0;
            gap: 2.5rem;
            overflow: visible;
          }
          .proj-hint { display: none; }
          .proj-viewport { overflow: visible; }
          .proj-track {
            flex-direction: column;
            width: 100%;
            padding: 0 2rem;
            gap: 1.5rem;
            perspective: 900px;
          }
          .proj-card { width: 100%; padding: 2rem; }
          .proj-desc { padding-bottom: 1.5rem; }
        }
      `}</style>
    </section>
  );
}
