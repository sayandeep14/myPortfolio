/** Types for the vanilla scroll-world scrub engine in `scrub-engine.js`. */

export interface ScrollWorldSection {
  id: string;
  label: string;
  /** Poster / reduced-motion fallback. Must be the clip's own first frame. */
  still: string;
  stillMobile?: string;
  clip: string;
  clipMobile?: string;
  accent?: string;
  /** Viewport-heights of scroll spent in this scene (overrides diveScroll). */
  scroll?: number;
  /** 0–1. Remaps time so the camera settles mid-scene. Keep <= 0.6. */
  linger?: number;
  eyebrow?: string;
  title?: string;
  body?: string;
  tags?: string[];
  cta?: {
    primary?: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
}

export interface ScrollWorldConfig {
  brand?: { name: string; href?: string };
  diveScroll?: number;
  connScroll?: number;
  crossfade?: number;
  hint?: string;
  nav?: boolean;
  atmosphere?: boolean;
  sections: ScrollWorldSection[];
  /** Architecture A (continuous forward take) has none — the legs are the journey. */
  connectors?: (string | null)[];
  connectorsMobile?: (string | null)[];
}

export function mountScrollWorld(
  container: HTMLElement,
  config: ScrollWorldConfig
): void;
