"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { globe } from "./journeyShapes";
import { prefersReducedMotion, isTouch } from "@/lib/gsap";

/**
 * The one genuinely real-time chapter of the journey.
 *
 * The rest of the page is a pre-rendered camera flight — beautiful, but on
 * rails. This scene is live WebGL: the constellation responds to the pointer,
 * nothing is baked, and every node is a real destination.
 *
 * Deliberately split responsibilities:
 *   - WebGL draws the ambient particle globe (reusing `globe()` and the same
 *     ink/cream/accent shader language as JourneyCanvas, so it reads as the
 *     same hand).
 *   - Plain <a> elements, positioned each frame by projecting their 3D anchor
 *     to screen space, are the nodes. Real anchors mean real hit-testing,
 *     keyboard focus, middle-click, and "copy link address" all work — none of
 *     which you get from raycasting a GL sprite.
 */

type Link = { label: string; href: string; group: "social" | "tech" };

// From details.yaml.
const LINKS: Link[] = [
  { label: "GitHub", href: "https://github.com/sayandeep14", group: "tech" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shreekalpo/", group: "social" },
  { label: "Behance", href: "https://www.behance.net/sayandeepgiri1", group: "social" },
  { label: "Dribbble", href: "https://dribbble.com/sayandeep-giri", group: "social" },
  { label: "Vimeo", href: "https://vimeo.com/shreekalpo", group: "social" },
  { label: "Instagram", href: "https://www.instagram.com/shreekalpo/", group: "social" },
  { label: "X", href: "https://x.com/shreekalpo_/", group: "social" },
  { label: "Pinterest", href: "https://www.pinterest.com/shreekalpo/", group: "social" },
  { label: "Reddit", href: "https://www.reddit.com/user/Actual-Ad4212/", group: "social" },
  { label: "Facebook", href: "https://www.facebook.com/shreekalpo1/", group: "social" },
  { label: "Stack Overflow", href: "https://stackoverflow.com/users/32794709/sayandeep-giri", group: "tech" },
  { label: "LeetCode", href: "https://leetcode.com/u/neel-ju14/", group: "tech" },
  { label: "Codeforces", href: "https://codeforces.com/profile/shreekalpo.js", group: "tech" },
  { label: "CodePen", href: "https://codepen.io/Sayandeep-Giri", group: "tech" },
  { label: "Hashnode", href: "https://hashnode.com/@shreekalpo", group: "tech" },
  { label: "Medium", href: "https://medium.com/@shreekalpo", group: "tech" },
  { label: "Dev.to", href: "https://dev.to/shreekalpo", group: "tech" },
  { label: "Substack", href: "https://shreekalpo.substack.com/", group: "tech" },
];

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  uniform float uReveal;
  attribute vec3 aRand;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Slow breathing so the field never looks frozen between pointer moves.
    float w = sin(uTime * 0.5 + aRand.z * 6.2831) * 0.02;
    pos *= 1.0 + w;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uScale * (1.0 / -mv.z) * (0.6 + aRand.y * 0.8);

    // Particles arrive in a staggered wave rather than all at once.
    float r = clamp((uReveal - aRand.z * 0.4) / 0.6, 0.0, 1.0);
    vAlpha = r * (0.25 + aRand.y * 0.55);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, vAlpha * smoothstep(0.5, 0.12, d));
  }
`;

/** Evenly distributed anchors via the Fibonacci sphere — no pole clustering. */
function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = phi * i;
    pts.push(
      new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r).multiplyScalar(radius)
    );
  }
  return pts;
}

export default function LinksConstellation({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const nodeHost = nodesRef.current;
    if (!canvas || !nodeHost) return;

    const reduced = prefersReducedMotion();
    const touch = isTouch();
    const COUNT = touch ? 1800 : 4200;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !touch,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    // ── Ambient particle globe ──────────────────────────────────────────────
    const positions = globe(COUNT);
    const rand = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT * 3; i++) rand[i] = Math.random();

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 3));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: touch ? 0.03 : 0.022 },
        uScale: { value: 800 },
        uReveal: { value: 0 },
        uColor: { value: new THREE.Color("#f5f4f0") },
      },
    });

    const points = new THREE.Points(geo, mat);
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    // ── Link nodes ──────────────────────────────────────────────────────────
    const anchors = fibonacciSphere(LINKS.length, 1.42);
    const els: HTMLAnchorElement[] = LINKS.map((l, i) => {
      const a = document.createElement("a");
      a.className = "lc-node" + (l.group === "tech" ? " lc-node--tech" : "");
      a.href = l.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = `<i></i><span>${l.label}</span>`;
      a.style.setProperty("--i", String(i));
      nodeHost.appendChild(a);
      return a;
    });

    // ── Pointer → target rotation ───────────────────────────────────────────
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      target.y = ((e.clientX - r.left) / r.width - 0.5) * 1.1;
      target.x = ((e.clientY - r.top) / r.height - 0.5) * 0.65;
    };
    if (!touch && !reduced) window.addEventListener("pointermove", onMove);

    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      mat.uniforms.uScale.value = h;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Loop ────────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const projected = new THREE.Vector3();
    let raf = 0;
    let reveal = 0;
    let visible = false;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Ease reveal toward whether this chapter is on screen.
      reveal += ((visible ? 1 : 0) - reveal) * 0.06;
      mat.uniforms.uTime.value = t;
      mat.uniforms.uReveal.value = reveal;

      // Idle drift keeps it alive; pointer adds the live response on top.
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;
      group.rotation.x = current.x;
      group.rotation.y = current.y + (reduced ? 0 : t * 0.045);

      // Project each anchor to screen space and place its <a>.
      const w = renderer.domElement.clientWidth;
      const h = renderer.domElement.clientHeight;
      for (let i = 0; i < els.length; i++) {
        projected.copy(anchors[i]).applyEuler(group.rotation).project(camera);
        const x = (projected.x * 0.5 + 0.5) * w;
        const y = (-projected.y * 0.5 + 0.5) * h;
        // z > 0 after projection means behind the camera-facing hemisphere —
        // fade those so the back of the sphere doesn't compete for clicks.
        const depth = 1 - (projected.z - 0.94) / 0.06;
        const o = Math.max(0, Math.min(1, depth)) * reveal;
        const e = els[i];
        e.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        e.style.opacity = String(o);
        e.style.pointerEvents = o > 0.55 ? "auto" : "none";
      }

      renderer.render(scene, camera);
    };
    tick();
    setReady(true);

    // Expose a setter the outer effect can drive without re-creating the scene.
    const host = canvas.parentElement as HTMLElement & { __setVisible?: (v: boolean) => void };
    host.__setVisible = (v: boolean) => { visible = v; };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      els.forEach((e) => e.remove());
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  // Drive visibility without tearing down the GL context.
  useEffect(() => {
    const host = canvasRef.current?.parentElement as
      | (HTMLElement & { __setVisible?: (v: boolean) => void })
      | undefined;
    host?.__setVisible?.(active);
  }, [active, ready]);

  return (
    <div className={"lc-root" + (active ? " is-active" : "")} aria-hidden={!active}>
      <canvas ref={canvasRef} className="lc-canvas" />
      <div ref={nodesRef} className="lc-nodes" />
    </div>
  );
}
