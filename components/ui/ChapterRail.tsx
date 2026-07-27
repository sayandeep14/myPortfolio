"use client";

import { useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const CHAPTERS = [
  { id: "hero", label: "Origin" },
  { id: "about", label: "About" },
  { id: "experience", label: "Path" },
  { id: "projects", label: "Work" },
  { id: "hobbies", label: "Beyond" },
  { id: "links", label: "Elsewhere" },
  { id: "contact", label: "Contact" },
];

/** Fixed rail marking progress through the seven chapters of the page. */
export default function ChapterRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const triggers = CHAPTERS.map((c, i) => {
        const el = document.getElementById(c.id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });

      gsap.fromTo(
        ".rail-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: { start: 0, end: "max", scrub: 0.5 },
        }
      );

      return () => triggers.forEach((t) => t?.kill());
    });

    return () => ctx.revert();
  }, []);

  return (
    <nav className="chapter-rail" aria-label="Page sections">
      <span className="rail-index">{String(active).padStart(2, "0")}</span>

      <div className="rail-track">
        <div className="rail-fill" />
      </div>

      <ul>
        {CHAPTERS.map((c, i) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              className={i === active ? "is-active" : undefined}
              aria-current={i === active ? "true" : undefined}
            >
              <span className="rail-dot" />
              <span className="rail-label">{c.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
