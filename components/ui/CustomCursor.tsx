"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hide cursor entirely on touch/mobile devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      dot.style.display = "none";
      ring.style.display = "none";
      return;
    }

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const onMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "none" });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.3, ease: "power2.out" });
    };

    const grow = () => gsap.to(ring, { scale: 2.2, opacity: 0.4, duration: 0.25 });
    const shrink = () => gsap.to(ring, { scale: 1, opacity: 1, duration: 0.25 });
    const hide = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const show = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", hide);
    window.addEventListener("mouseenter", show);

    const addHover = () => {
      document.querySelectorAll("a, button").forEach((el) => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    };

    // Wait for DOM to be ready
    const timeout = setTimeout(addHover, 500);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", hide);
      window.removeEventListener("mouseenter", show);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "var(--accent)",
          pointerEvents: "none",
          zIndex: 99999,
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid var(--ink)",
          pointerEvents: "none",
          zIndex: 99998,
        }}
      />
    </>
  );
}
