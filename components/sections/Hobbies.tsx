"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, isTouch } from "@/lib/gsap";

const hobbies = [
  {
    glyph: "♩",
    title: "Music Production",
    description:
      "I produce electronic and ambient music — building soundscapes from scratch is a form of architecture. Every track is a small world engineered from silence.",
    detail: "DAW · Synthesis · Sound Design",
  },
  {
    glyph: "✦",
    title: "Gardening",
    description:
      "Growing things teaches patience in a way code doesn't. Watching a plant respond to care over weeks is deeply satisfying — slow feedback loops matter.",
    detail: "Herbs · Succulents · Vegetables",
  },
  {
    glyph: "◎",
    title: "Cooking",
    description:
      "Cooking is where I test hypotheses with flavor. From Bengali cuisine to experimental dishes, the kitchen is my most tactile laboratory.",
    detail: "Bengali · Fusion · Experimental",
  },
];

export default function Hobbies() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Panels swing open from alternating sides, hinged on their vertical edge.
      gsap.utils.toArray<HTMLElement>(".hobby-card").forEach((card, i) => {
        const fromLeft = i % 2 === 0;
        gsap.fromTo(
          card,
          { rotateY: fromLeft ? -62 : 62, z: -260, opacity: 0 },
          {
            rotateY: 0,
            z: 0,
            opacity: 1,
            duration: 1.15,
            ease: "journey",
            delay: i * 0.08,
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });

      gsap.to(".hobbies-heading", {
        x: 40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Pointer tilt per card, with the inner layers sitting at different depths.
  useEffect(() => {
    if (prefersReducedMotion() || isTouch()) return;
    const cards = Array.from(
      sectionRef.current?.querySelectorAll<HTMLElement>(".hobby-card") ?? []
    );

    const cleanups = cards.map((card) => {
      const rx = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3" });
      const ry = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
        ry(((e.clientX - r.left) / r.width - 0.5) * 16);
      };
      const onLeave = () => {
        rx(0);
        ry(0);
      };

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section ref={sectionRef} id="hobbies" className="hobbies">
      <div className="hobbies-wrap">
        <p className="section-label hobbies-label">04 — Beyond Code</p>

        <div className="hobbies-head">
          <h2 className="hobbies-heading">
            Things I do when
            <br />
            I&apos;m not <em>engineering.</em>
          </h2>
          <p className="hobbies-note">
            The creative and contemplative pursuits that shape how I think and build.
          </p>
        </div>

        <div className="hobbies-grid scene-3d">
          {hobbies.map((hobby) => (
            <div key={hobby.title} className="hobby-card layer-3d">
              <div className="hobby-glyph">{hobby.glyph}</div>
              <h3 className="hobby-title">{hobby.title}</h3>
              <p className="hobby-desc">{hobby.description}</p>
              <p className="hobby-detail">{hobby.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hobbies {
          position: relative;
          padding: 11rem 0;
          background-color: transparent;
          border-top: 1px solid var(--border);
        }
        .hobbies-wrap {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .hobbies-label { margin-bottom: 1rem; }

        .hobbies-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 5rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .hobbies-heading {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 500;
          line-height: 1.18;
          color: var(--ink);
        }
        .hobbies-heading em { color: var(--accent); }
        .hobbies-note {
          font-size: 0.85rem;
          font-weight: 300;
          color: var(--muted);
          max-width: 280px;
          line-height: 1.8;
        }

        .hobbies-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        .hobby-card {
          padding: 3rem;
          border: 1px solid var(--border);
          background-color: rgba(245, 244, 240, 0.55);
          backdrop-filter: blur(6px);
          transform-origin: center center;
          will-change: transform;
          transition: background-color 0.35s, border-color 0.35s, box-shadow 0.35s;
        }
        .hobby-card:hover {
          background-color: rgba(245, 244, 240, 0.85);
          border-color: rgba(17, 17, 17, 0.2);
          box-shadow: 0 26px 60px -34px rgba(17, 17, 17, 0.55);
        }

        /* Inner layers float at different depths so the tilt has real parallax */
        .hobby-glyph {
          font-size: 1.8rem;
          color: var(--accent);
          margin-bottom: 2rem;
          font-family: Georgia, serif;
          line-height: 1;
          transform: translateZ(55px);
        }
        .hobby-title {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 1rem;
          transform: translateZ(35px);
        }
        .hobby-desc {
          font-size: 0.875rem;
          font-weight: 300;
          line-height: 1.85;
          color: var(--muted);
          margin-bottom: 2rem;
          transform: translateZ(18px);
        }
        .hobby-detail {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          border-top: 1px solid var(--border);
          padding-top: 1.25rem;
        }

        @media (min-width: 768px) {
          .hobbies-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 767px) {
          .hobbies { padding: 5rem 0; }
          .hobby-card { padding: 2rem; }
        }
      `}</style>
    </section>
  );
}
