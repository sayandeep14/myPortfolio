"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger);

const HobbiesScene = dynamic(() => import("@/components/three/HobbiesScene"), { ssr: false });

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
    const ctx = gsap.context(() => {
      sectionRef.current?.querySelectorAll(".hobby-card").forEach((card, i) => {
        // Cards slide in from alternating sides
        gsap.fromTo(
          card,
          { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 86%" },
            delay: i * 0.1,
          }
        );
      });

      // Heading drifts right on scroll
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

  return (
    <section
      ref={sectionRef}
      id="hobbies"
      style={{
        position: "relative",
        padding: "9rem 0",
        backgroundColor: "#eeedea",
        borderTop: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* Full-section Three.js canvas — vinyl, plant, bowl */}
      <div
        className="hobbies-bg"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.55,
        }}
      >
        <HobbiesScene />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
        <p
          style={{
            marginBottom: "1rem",
            fontSize: "0.7rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          04 — Beyond Code
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "5rem",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <h2
            className="hobbies-heading"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 500,
              lineHeight: 1.18,
              color: "var(--ink)",
            }}
          >
            Things I do when
            <br />
            I&apos;m not <em style={{ color: "var(--accent)" }}>engineering.</em>
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: 300,
              color: "var(--muted)",
              maxWidth: 280,
              lineHeight: 1.8,
            }}
          >
            The creative and contemplative pursuits that shape how I think and build.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 0,
            outline: "1px solid var(--border)",
          }}
          className="hobbies-grid"
        >
          {hobbies.map((hobby, i) => (
            <div
              key={i}
              className="hobby-card"
              style={{
                padding: "3rem",
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                backgroundColor: "rgba(238,237,234,0.82)",
                backdropFilter: "blur(4px)",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(245,244,240,0.92)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(238,237,234,0.82)")
              }
            >
              <div
                style={{
                  fontSize: "1.8rem",
                  color: "var(--accent)",
                  marginBottom: "2rem",
                  fontFamily: "Georgia, serif",
                  lineHeight: 1,
                }}
              >
                {hobby.glyph}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "1.2rem",
                  fontWeight: 500,
                  color: "var(--ink)",
                  marginBottom: "1rem",
                }}
              >
                {hobby.title}
              </h3>

              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 300,
                  lineHeight: 1.85,
                  color: "var(--muted)",
                  marginBottom: "2rem",
                }}
              >
                {hobby.description}
              </p>

              <p
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  borderTop: "1px solid var(--border)",
                  paddingTop: "1.25rem",
                }}
              >
                {hobby.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .hobbies-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 767px) {
          #hobbies { padding: 5rem 0 !important; }
          .hobby-card { padding: 2rem !important; }
          /* Reduce 3D scene opacity more on mobile for readability */
          .hobbies-bg { opacity: 0.3 !important; }
        }
      `}</style>
    </section>
  );
}
