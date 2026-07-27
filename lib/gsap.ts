"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

// Register once. Plugin modules are import-safe on the server; registration is
// only meaningful in the browser.
if (typeof window !== "undefined" && !(gsap as unknown as { _sgRegistered?: boolean })._sgRegistered) {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, CustomEase);
  (gsap as unknown as { _sgRegistered?: boolean })._sgRegistered = true;

  // Signature eases for the whole site — a long, confident settle.
  CustomEase.create("journey", "0.16, 1, 0.3, 1");
  CustomEase.create("swoop", "0.6, 0.01, 0.05, 1");
}

/** Respect the user's motion preference. Every orchestration checks this. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Coarse pointers (phones/tablets) get lighter geometry and no smoothing. */
export function isTouch(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, CustomEase };
