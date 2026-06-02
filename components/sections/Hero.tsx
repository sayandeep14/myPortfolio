"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";

const NeuralBrain = dynamic(() => import("@/components/three/NeuralBrain"), {
  ssr: false,
});

export default function Hero() {
  const nameRef = useRef<HTMLSpanElement>(null);
  const surnameRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.15 });

    tl.fromTo(
      labelRef.current,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    )
      .fromTo(
        nameRef.current,
        { y: "105%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1, ease: "power4.out" },
        "-=0.3"
      )
      .fromTo(
        surnameRef.current,
        { y: "105%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1, ease: "power4.out" },
        "-=0.75"
      )
      .fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
        "-=0.4"
      )
      .fromTo(
        subtitleRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        ctaRef.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.2"
      );

    gsap.to(".scroll-pip", {
      y: 14,
      duration: 1.3,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "var(--bg)",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}
      />

      {/* Three.js brain — right side on desktop, full-bg on mobile */}
      <div className="hero-3d" style={{ pointerEvents: "none" }}>
        <NeuralBrain />
      </div>

      {/* Mobile-only gradient scrim — sits between brain and text so text is readable */}
      <div className="hero-scrim" />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 2rem",
          width: "100%",
        }}
      >
        <div className="hero-text-wrap">
          {/* Label */}
          <p
            ref={labelRef}
            style={{
              marginBottom: "1.5rem",
              fontSize: "0.7rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
            }}
          >
            Portfolio · 2025
          </p>

          {/* Name — paddingBottom gives descenders room, marginBottom creates gap between lines */}
          <h1
            style={{
              lineHeight: 1.0,
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                display: "block",
                overflow: "hidden",
                paddingBottom: "0.12em",
                marginBottom: "0.01em",
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(3.5rem, 8.5vw, 7.5rem)",
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              <span ref={nameRef} style={{ display: "block" }}>
                Sayandeep
              </span>
            </span>
            <span
              style={{
                display: "block",
                overflow: "hidden",
                paddingBottom: "0.22em",
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(3.5rem, 8.5vw, 7.5rem)",
                fontWeight: 600,
                fontStyle: "italic",
                color: "var(--accent)",
              }}
            >
              <span ref={surnameRef} style={{ display: "block" }}>
                Giri.
              </span>
            </span>
          </h1>

          {/* Rule */}
          <div
            ref={lineRef}
            style={{
              height: 1,
              width: 100,
              backgroundColor: "var(--ink)",
              marginBottom: "1.5rem",
              transformOrigin: "left center",
            }}
          />

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            style={{
              fontSize: "1.05rem",
              fontWeight: 300,
              lineHeight: 1.85,
              color: "var(--muted)",
              marginBottom: "2.5rem",
              maxWidth: 420,
              fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
            }}
          >
            Engineer at Wells Fargo · CS graduate from Jadavpur University · Music producer · Creator.
          </p>

          {/* CTA */}
          <div ref={ctaRef} className="hero-cta">
            <a
              href="#about"
              className="hero-cta-primary"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--ink)";
                e.currentTarget.style.borderColor = "var(--ink)";
              }}
            >
              Learn More
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-secondary"
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              Resume ↗
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="hero-scroll"
      >
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 52,
            backgroundColor: "rgba(17,17,17,0.12)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="scroll-pip"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "45%",
              backgroundColor: "var(--accent)",
            }}
          />
        </div>
      </div>

      <style>{`
        /* Desktop layout */
        .hero-scrim {
          display: none;
        }
        .hero-3d {
          position: absolute;
          top: 0;
          right: -8%;
          width: 58vw;
          height: 100%;
          z-index: 1;
        }
        .hero-text-wrap {
          max-width: 600px;
        }
        .hero-cta {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }
        .hero-cta-primary {
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink);
          text-decoration: none;
          border-bottom: 1px solid var(--ink);
          padding-bottom: 2px;
          transition: color 0.2s, border-color 0.2s;
        }
        .hero-cta-secondary {
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
        }
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

        /* Mobile overrides */
        @media (max-width: 767px) {
          .hero-3d {
            right: 0;
            width: 100%;
            opacity: 0.22;
            z-index: 1;
          }
          /* Gradient scrim: opaque bg at top fading to transparent at bottom.
             Sits above the brain (z:1) but below the text content (z:2). */
          .hero-scrim {
            display: block;
            position: absolute;
            inset: 0;
            z-index: 2;
            pointer-events: none;
            background: linear-gradient(
              to bottom,
              #f5f4f0 0%,
              #f5f4f0 38%,
              rgba(245, 244, 240, 0.82) 58%,
              rgba(245, 244, 240, 0.3) 78%,
              transparent 100%
            );
          }
          .hero-text-wrap {
            max-width: 100%;
            padding-top: 6rem;
            padding-bottom: 7rem;
          }
          .hero-cta {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
          .hero-cta-primary,
          .hero-cta-secondary {
            font-size: 0.78rem;
          }
          .hero-scroll {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
