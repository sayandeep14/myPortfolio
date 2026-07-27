"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, ScrollSmoother, prefersReducedMotion } from "@/lib/gsap";

/**
 * Wraps the page in ScrollSmoother's required wrapper/content structure and
 * gives the whole site inertial scrolling.
 *
 * Anything `position: fixed` must be rendered OUTSIDE this component — the
 * content element is transformed, which would make fixed children scroll away.
 *
 * The home page is exempt: the scroll-world engine maps raw scroll position to
 * video `currentTime` itself. ScrollSmoother's transformed content element and
 * its own rAF loop would fight that mapping and desync the film from the scrollbar.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isWorld = pathname === "/";

  useLayoutEffect(() => {
    if (prefersReducedMotion() || isWorld) return;

    const ctx = gsap.context(() => {
      const smoother = ScrollSmoother.create({
        wrapper: wrapper.current!,
        content: content.current!,
        smooth: 1.15,
        effects: true,        // enables data-speed / data-lag parallax attributes
        normalizeScroll: true,
        ignoreMobileResize: true,
        smoothTouch: 0,       // native momentum feels better on touch devices
      });

      // Sections mount (and register their ScrollTriggers) before this effect
      // runs, so positions must be recalculated now that the smoother owns
      // scrolling. Fonts landing later shift layout again.
      requestAnimationFrame(() => ScrollTrigger.refresh());
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      // Hash links must go through the smoother, not native anchor jumping.
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement)?.closest?.("a");
        if (!a) return;
        const href = a.getAttribute("href");
        if (!href) return;

        const hash = href.startsWith("#")
          ? href
          : href.startsWith("/#") && window.location.pathname === "/"
            ? href.slice(1)
            : null;
        if (!hash || hash === "#") return;

        const target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();
        smoother.scrollTo(target as HTMLElement, true, "top 64px");
        history.pushState(null, "", hash);
      };

      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    });

    return () => ctx.revert();
  }, [isWorld]);

  // No wrapper/content divs on the home page — the engine wants a plain
  // document scroll to read from.
  if (isWorld) return <>{children}</>;

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {children}
      </div>
    </div>
  );
}
