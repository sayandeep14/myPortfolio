"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".hero-anim", { opacity: 1, y: 0 });
        return;
      }

      // Split both name lines into characters for the 3D type reveal.
      const splits = gsap.utils
        .toArray<HTMLElement>(".hero-name")
        .map((el) => new SplitText(el, { type: "chars", charsClass: "hero-char" }));
      const chars = splits.flatMap((s) => s.chars);

      gsap.set(chars, { transformOrigin: "50% 100% -30px" });

      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        ".hero-label",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "journey" }
      )
        // Characters swing up out of the page plane, one after another.
        .fromTo(
          chars,
          { rotateX: -92, y: 46, z: -120, opacity: 0 },
          {
            rotateX: 0,
            y: 0,
            z: 0,
            opacity: 1,
            duration: 1.25,
            ease: "journey",
            stagger: 0.035,
          },
          "-=0.35"
        )
        .fromTo(
          ".hero-rule",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: "swoop" },
          "-=0.75"
        )
        .fromTo(
          ".hero-sub",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "journey" },
          "-=0.6"
        )
        .fromTo(
          ".hero-cta > *",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "journey", stagger: 0.08 },
          "-=0.5"
        )
        .fromTo(".hero-scroll", { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.3");

      // Scroll exit: the whole text block tips back into the page and recedes.
      gsap.to(stageRef.current, {
        rotateX: 24,
        y: -90,
        z: -320,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(".scroll-pip", {
        y: 14,
        duration: 1.3,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

      return () => splits.forEach((s) => s.revert());
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="hero scene-3d">
      {/* Grid — drifts slower than the page via ScrollSmoother's data-speed */}
      <div className="hero-grid" data-speed="0.85" aria-hidden />

      <div className="hero-inner">
        <div ref={stageRef} className="hero-stage layer-3d">
          <p className="hero-label hero-anim">Portfolio · 2025</p>

          <h1 className="hero-title">
            <span className="hero-name hero-name-a">Sayandeep</span>
            <span className="hero-name hero-name-b">Giri.</span>
          </h1>

          <div className="hero-rule hero-anim" />

          <p className="hero-sub hero-anim">
            Engineer at Wells Fargo · CS graduate from Jadavpur University · Music
            producer · Creator.
          </p>

          <div className="hero-cta">
            <a href="#about" className="hero-cta-primary hero-anim">
              Begin the journey
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-secondary hero-anim"
            >
              Resume ↗
            </a>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="hero-scroll-track">
          <div className="scroll-pip" />
        </div>
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          background-color: transparent;
        }
        .hero-grid {
          position: absolute;
          inset: -20% 0;
          opacity: 0.04;
          background-image:
            linear-gradient(var(--ink) 1px, transparent 1px),
            linear-gradient(90deg, var(--ink) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }
        .hero-inner {
          position: relative;
          z-index: 3;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          width: 100%;
        }
        .hero-stage { max-width: 620px; }

        .hero-label {
          margin-bottom: 1.5rem;
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .hero-title {
          line-height: 1;
          margin-bottom: 1.5rem;
          perspective: 700px;
        }
        .hero-name {
          display: block;
          padding-bottom: 0.14em;
          font-family: var(--font-playfair), Georgia, serif;
          font-size: clamp(3.5rem, 8.5vw, 7.5rem);
          font-weight: 600;
          transform-style: preserve-3d;
        }
        .hero-name-a { color: var(--ink); }
        .hero-name-b { color: var(--accent); font-style: italic; padding-bottom: 0.22em; }
        /* SplitText emits these; they need to be 3D-transformable */
        .hero-char { display: inline-block; will-change: transform; }

        .hero-rule {
          height: 1px;
          width: 100px;
          background-color: var(--ink);
          margin-bottom: 1.5rem;
          transform-origin: left center;
        }
        .hero-sub {
          font-size: 1.05rem;
          font-weight: 300;
          line-height: 1.85;
          color: var(--muted);
          margin-bottom: 2.5rem;
          max-width: 420px;
        }
        .hero-cta { display: flex; align-items: center; gap: 2.5rem; }
        .hero-cta a {
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.25s, border-color 0.25s;
        }
        .hero-cta-primary {
          color: var(--ink);
          border-bottom: 1px solid var(--ink);
          padding-bottom: 2px;
        }
        .hero-cta-primary:hover { color: var(--accent); border-color: var(--accent); }
        .hero-cta-secondary { color: var(--muted); }
        .hero-cta-secondary:hover { color: var(--ink); }

        .hero-scroll {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          z-index: 4;
        }
        .hero-scroll span {
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .hero-scroll-track {
          width: 1px;
          height: 52px;
          background-color: rgba(17, 17, 17, 0.12);
          position: relative;
          overflow: hidden;
        }
        .scroll-pip {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 45%;
          background-color: var(--accent);
        }

        @media (max-width: 767px) {
          .hero-stage { max-width: 100%; padding: 6rem 0 7rem; }
          .hero-cta { flex-direction: column; align-items: flex-start; gap: 1.25rem; }
          .hero-cta a { font-size: 0.78rem; }
          .hero-scroll { display: none; }
        }
      `}</style>
    </section>
  );
}
