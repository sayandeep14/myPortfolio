"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger);

const LiveCodeEditor = dynamic(() => import("@/components/ui/LiveCodeEditor"), { ssr: false });

const stats = [
  { value: "22", label: "Years old" },
  { value: "BE", label: "CSE, Jadavpur" },
  { value: "3+", label: "Years at WF" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const helixRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text slides in from left
      gsap.fromTo(
        textRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );

      // Helix slides in from right
      gsap.fromTo(
        helixRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );

      // Stats stagger
      gsap.fromTo(
        statsRef.current?.children ?? [],
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        padding: "9rem 0",
        backgroundColor: "var(--bg)",
        borderTop: "1px solid var(--border)",
        overflow: "hidden",
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
          01 — About
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "4rem",
            alignItems: "center",
          }}
          className="about-grid"
        >
          {/* Text */}
          <div ref={textRef} style={{ maxWidth: 520 }}>
            <h2
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 500,
                lineHeight: 1.18,
                color: "var(--ink)",
                marginBottom: "2rem",
              }}
            >
              Engineer by degree,{" "}
              <em style={{ color: "var(--accent)" }}>creator</em> by nature.
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                fontSize: "0.95rem",
                fontWeight: 300,
                lineHeight: 1.9,
                color: "var(--muted)",
                fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
              }}
            >
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

            <div
              ref={statsRef}
              style={{
                marginTop: "2.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    paddingRight: i < stats.length - 1 ? "1.5rem" : 0,
                    borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
                    paddingLeft: i > 0 ? "1.5rem" : 0,
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      fontSize: "2rem",
                      fontWeight: 600,
                      color: "var(--ink)",
                      lineHeight: 1,
                      marginBottom: "0.4rem",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Live code editor */}
          <div
            ref={helixRef}
            className="about-helix"
            style={{ position: "relative", aspectRatio: "4/5", maxWidth: 420, margin: "0 auto", width: "100%" }}
          >
            {/* Decorative offset border */}
            <div
              style={{
                position: "absolute",
                top: 16,
                right: -16,
                bottom: -16,
                left: 16,
                border: "1px solid rgba(17,17,17,0.18)",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                zIndex: 1,
                boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
              }}
            >
              <LiveCodeEditor />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .about-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 767px) {
          #about { padding: 5rem 0 !important; }
          .about-stats { flex-direction: row; flex-wrap: wrap; gap: 1.5rem !important; }
          .about-helix { max-width: 280px !important; aspect-ratio: 1/1 !important; }
        }
      `}</style>
    </section>
  );
}
