"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import ChapterRail from "./ChapterRail";

// WebGL has no server rendering to do, and keeping three.js out of the initial
// bundle matters more than a first-paint canvas.
const JourneyCanvas = dynamic(() => import("@/components/three/JourneyCanvas"), {
  ssr: false,
});

/**
 * The fixed, full-viewport layer behind the portfolio: the morphing particle
 * journey plus its chapter rail. Only the home page has the seven anchor
 * sections these are bound to.
 */
export default function HomeStage() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <>
      <JourneyCanvas />
      <ChapterRail />
    </>
  );
}
