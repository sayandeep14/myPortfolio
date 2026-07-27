"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, SplitText, prefersReducedMotion, isTouch } from "@/lib/gsap";

const LiveCodeEditor = dynamic(() => import("@/components/ui/LiveCodeEditor"), { ssr: false });

const stats = [
  { value: "22", label: "Years old" },
  { value: "BE", label: "CSE, Jadavpur" },
  { value: "3+", label: "Years at WF" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) return;

      // Heading reveals line by line, each line hinging up from below.
      const split = new SplitText(".about-heading", {
        type: "lines",
        mask: "lines",
        linesClass: "about-line",
      });

      gsap.fromTo(
        split.lines,
        { yPercent: 115, rotateX: -55, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1.1,
          ease: "journey",
          stagger: 0.09,
          scrollTrigger: { trigger: sectionRef.current, start: "top 76%" },
        }
      );

      gsap.fromTo(
        ".about-copy p",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "journey",
          stagger: 0.1,
          scrollTrigger: { trigger: ".about-copy", start: "top 84%" },
        }
      );

      // Stats flip in on the X axis.
      gsap.fromTo(
        ".about-stat-item",
        { rotateX: -80, y: 24, opacity: 0 },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "journey",
          stagger: 0.1,
          scrollTrigger: { trigger: ".about-stats", start: "top 88%" },
        }
      );

      // The editor card swings through the Y axis as the section passes.
      gsap.fromTo(
        cardRef.current,
        { rotateY: 26, rotateX: 8, z: -180, opacity: 0 },
        {
          rotateY: -10,
          rotateX: -2,
          z: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "bottom 55%",
            scrub: 1,
          },
        }
      );

      return () => split.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Pointer tilt on the card, layered on top of the scroll-driven rotation.
  useEffect(() => {
    if (prefersReducedMotion() || isTouch()) return;
    const card = cardRef.current;
    const host = card?.parentElement;
    if (!card || !host) return;

    const rx = gsap.quickTo(card, "rotateX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(card, "rotateY", { duration: 0.6, ease: "power3" });
    let active = false;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(-py * 14);
      ry(px * 20);
      active = true;
    };
    const onLeave = () => {
      if (!active) return;
      active = false;
      // Hand control back to the scroll-driven tween.
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "journey" });
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about scene-3d">
      <div className="about-wrap">
        <p className="section-label">01 — About</p>

        <div className="about-grid">
          <div className="about-text">
            <h2 className="about-heading">
              Engineer by degree, <em>creator</em> by nature.
            </h2>

            <div className="about-copy">
              <p>
                I&apos;m Sayandeep Giri — a computer science engineer from Jadavpur
                University with a deep curiosity for how systems work, and an even
                deeper one for how humans feel.
              </p>
              <p>
                At Wells Fargo, I bridge technology and finance as a Program Associate.
                Previously, I co-built JUSense — an in-house startup at Jadavpur — where
                I first got hooked on solving real problems with code.
              </p>
              <p>
                Beyond the screen, I produce music, grow things, and cook elaborate meals.
                Each one a reminder that the best outputs come from patient, deliberate craft.
              </p>
            </div>

            <div className="about-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="about-stat-item">
                  <p className="about-stat-value">{stat.value}</p>
                  <p className="about-stat-label">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Editor card — real 3D, with a depth-offset frame behind it */}
          <div className="about-card-host">
            <div ref={cardRef} className="about-card layer-3d">
              <div className="about-card-frame" aria-hidden />
              <div className="about-card-screen">
                <LiveCodeEditor />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .about {
          position: relative;
          padding: 11rem 0;
          background-color: transparent;
          border-top: 1px solid var(--border);
        }
        .about-wrap { max-width: 1200px; min-width: 0; margin: 0 auto; padding: 0 2rem; }

        .about-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 4rem;
          align-items: center;
        }
        .about-text { max-width: 520px; min-width: 0; }

        .about-heading {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 500;
          line-height: 1.18;
          color: var(--ink);
          margin-bottom: 2rem;
        }
        .about-heading em { color: var(--accent); }
        .about-line { transform-style: preserve-3d; }

        .about-copy {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-size: 0.95rem;
          font-weight: 300;
          line-height: 1.9;
          min-width: 0;
          color: var(--muted);
        }

        .about-stats {
          margin-top: 2.5rem;
          display: flex;
          align-items: center;
          perspective: 800px;
        }
        .about-stat-item {
          flex: 1;
          min-width: 0;
          text-align: center;
          padding: 0 1.5rem;
          border-right: 1px solid var(--border);
        }
        .about-stat-item:first-child { padding-left: 0; }
        .about-stat-item:last-child { padding-right: 0; border-right: none; }
        .about-stat-value {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 2rem;
          font-weight: 600;
          color: var(--ink);
          line-height: 1;
          margin-bottom: 0.4rem;
        }
        .about-stat-label {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .about-card-host {
          perspective: 1300px;
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
        }
        .about-card {
          position: relative;
          aspect-ratio: 4 / 5;
          width: 100%;
        }
        .about-card-frame {
          position: absolute;
          top: 16px; right: -16px; bottom: -16px; left: 16px;
          border: 1px solid rgba(17, 17, 17, 0.18);
          transform: translateZ(-60px);
        }
        .about-card-screen {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 14px;
          background: var(--bg);
          transform: translateZ(30px);
          box-shadow: 0 30px 70px -30px rgba(17, 17, 17, 0.4);
        }

        @media (min-width: 1024px) {
          .about-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
        }
        @media (max-width: 767px) {
          .about { padding: 5rem 0; }
          .about-card-host { max-width: 100%; }
          .about-card { aspect-ratio: auto; height: 460px; }
          .about-card-frame { display: none; }

          .about-stats {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            align-items: start;
          }
          .about-stat-item { padding: 0 0.5rem; overflow: hidden; }
          .about-stat-value { font-size: 1.4rem; }
          .about-stat-label {
            font-size: 0.5rem;
            letter-spacing: 0.04em;
            word-break: break-word;
          }
        }
      `}</style>
    </section>
  );
}
