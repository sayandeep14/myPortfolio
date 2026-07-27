"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger, prefersReducedMotion, isTouch } from "@/lib/gsap";
import { CHAPTERS } from "./journeyShapes";

const VERTEX = /* glsl */ `
  uniform float uMorph;
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  uniform float uDisperse;
  uniform float uAccentA;
  uniform float uAccentB;
  uniform float uDark;
  uniform float uOpacity;
  uniform float uMotion;
  uniform vec3  uInk;
  uniform vec3  uCream;
  uniform vec3  uAccent;

  attribute vec3 aPosA;
  attribute vec3 aPosB;
  attribute vec3 aRand;

  varying vec3  vColor;
  varying float vAlpha;

  const float PI = 3.14159265359;

  void main() {
    // Per-particle stagger — the cloud dissolves and reforms in waves rather
    // than every point moving in lockstep.
    const float stagger = 0.35;
    float m = clamp((uMorph - aRand.z * stagger) / (1.0 - stagger), 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);

    vec3 pos = mix(aPosA, aPosB, m);

    // Mid-morph burst: peaks at m = 0.5, zero at both ends, so shapes are
    // always crisp when a chapter is centred.
    float burst = sin(m * PI);
    vec3 dir = normalize(vec3(
      sin(aRand.x * 43.7 + 1.3),
      cos(aRand.y * 71.3 + 2.7),
      sin(aRand.z * 27.1 + 5.1)
    ));
    vec3 swirl = normalize(vec3(-pos.z, 0.45, pos.x) + 0.0001);
    pos += (dir * 0.55 + swirl * 0.75) * burst * uDisperse * (0.5 + aRand.y);

    // Idle drift so the cloud is never perfectly static.
    pos += dir * sin(uTime * (0.5 + aRand.y * 0.8) + aRand.x * 12.0) * 0.013 * uMotion;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.45 + aRand.y * 0.85) * (1.0 + burst * 0.6);
    gl_PointSize = clamp(size * uScale / max(-mv.z, 0.1), 1.0, 14.0);

    float accentFrac = mix(uAccentA, uAccentB, m);
    float isAccent = step(aRand.x, accentFrac);
    vec3 base = mix(uInk, uCream, uDark);
    vColor = mix(base, uAccent, isAccent);

    vAlpha = uOpacity * (0.35 + aRand.y * 0.65) * (1.0 - burst * 0.25);
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.12, d);
    gl_FragColor = vec4(vColor, vAlpha * a);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const INK = hexToRgb("#111111");

export default function JourneyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const backdrop = backdropRef.current;
    if (!canvas || !backdrop) return;

    const reduced = prefersReducedMotion();
    const touch = isTouch();
    const COUNT = touch ? 2600 : 6200;
    const N = CHAPTERS.length;

    // ── Geometry ──────────────────────────────────────────────────────────
    const shapes = CHAPTERS.map((c) => c.build(COUNT));
    const bgRgb = CHAPTERS.map((c) => hexToRgb(c.bg));

    const geometry = new THREE.BufferGeometry();
    const posA = new Float32Array(shapes[0]);
    const posB = new Float32Array(shapes[1]);
    const rand = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      rand[i * 3] = Math.random();     // accent selector
      rand[i * 3 + 1] = Math.random(); // size / alpha variation
      rand[i * 3 + 2] = Math.random(); // morph stagger
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(posA, 3)); // frustum-culling reference
    geometry.setAttribute("aPosA", new THREE.BufferAttribute(posA, 3));
    geometry.setAttribute("aPosB", new THREE.BufferAttribute(posB, 3));
    geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 3));
    // Particles move well outside their source bounds during a burst.
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: touch ? 0.03 : 0.024 },
        uScale: { value: 800 },
        uDisperse: { value: 0.8 },
        uAccentA: { value: CHAPTERS[0].accent },
        uAccentB: { value: CHAPTERS[1].accent },
        uDark: { value: 0 },
        uOpacity: { value: CHAPTERS[0].opacity },
        uMotion: { value: reduced ? 0 : 1 },
        uInk: { value: new THREE.Color("#111111") },
        uCream: { value: new THREE.Color("#f5f4f0") },
        uAccent: { value: new THREE.Color("#c0392b") },
      },
    });

    const points = new THREE.Points(geometry, material);

    // Three nested groups give a compound, precessing tumble that no single
    // Euler rotation can produce.
    const inner = new THREE.Group();
    inner.add(points);
    const outer = new THREE.Group();
    outer.add(inner);
    const root = new THREE.Group();
    root.add(outer);

    const scene = new THREE.Scene();
    scene.add(root);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = CHAPTERS[0].dolly;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !touch,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);

    let dpr = 1;
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio, touch ? 2 : 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      material.uniforms.uScale.value = h * dpr * 0.5;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Scroll wiring ─────────────────────────────────────────────────────
    // One trigger per chapter pair, anchored to the actual section elements, so
    // the morph stays locked to the content no matter how tall sections are.
    //
    // These deliberately drive nothing themselves — the journey position is the
    // SUM of their progresses, read in the render loop. A scrubbed tween per
    // segment would not work: each would write the same shared variable, and
    // whichever rendered last would win (before any scrolling that is the last
    // segment, which pins the page to the final chapter).
    const triggers: ScrollTrigger[] = [];
    const segments: ScrollTrigger[] = [];

    for (let i = 0; i < N - 1; i++) {
      const from = document.getElementById(CHAPTERS[i].anchor);
      const to = document.getElementById(CHAPTERS[i + 1].anchor);
      if (!from || !to) continue;

      const st = ScrollTrigger.create({
        trigger: from,
        start: "center center",
        endTrigger: to,
        end: "center center",
      });
      segments.push(st);
      triggers.push(st);
    }

    // The light→ink flip is keyed tightly to the contact section, so the page
    // only goes dark once dark-on-light content has left the viewport.
    const contact = document.getElementById("contact");
    const darkTrigger = contact
      ? ScrollTrigger.create({ trigger: contact, start: "top 78%", end: "top 28%" })
      : null;
    if (darkTrigger) triggers.push(darkTrigger);

    // Progress is 0 before a segment, 1 after it, and 0…1 inside — so the sum
    // is exactly the piecewise-linear position along the journey.
    const targetP = () => segments.reduce((sum, st) => sum + st.progress, 0);

    const state = { p: targetP(), dark: darkTrigger?.progress ?? 0 };

    // ── Pointer parallax ──────────────────────────────────────────────────
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = (e: PointerEvent) => {
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!touch && !reduced) window.addEventListener("pointermove", onMove, { passive: true });

    // ── Render loop ───────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const motion = reduced ? 0 : 1;
    let curSeg = -1;
    let prevP = 0;
    let vel = 0;
    let raf = 0;
    let visible = true;
    let darkFlag = -1;

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) clock.getDelta(); // discard the gap
    };
    document.addEventListener("visibilitychange", onVisibility);

    const render = () => {
      raf = requestAnimationFrame(render);
      if (!visible) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      // Frame-rate independent easing toward the scroll-derived targets.
      // ScrollSmoother already smooths the scroll itself; this just takes the
      // edge off segment hand-offs.
      const k = reduced ? 1 : 1 - Math.exp(-dt * 9);
      state.p += (targetP() - state.p) * k;
      state.dark += ((darkTrigger?.progress ?? 0) - state.dark) * k;

      const p = Math.min(Math.max(state.p, 0), N - 1);
      const i = Math.min(Math.floor(p), N - 2);
      const f = p - i;
      const e = f * f * (3 - 2 * f); // smoothstep for parameter blending

      // Swap morph source/target buffers only when crossing a chapter boundary.
      if (i !== curSeg) {
        (geometry.attributes.aPosA.array as Float32Array).set(shapes[i]);
        (geometry.attributes.aPosB.array as Float32Array).set(shapes[i + 1]);
        geometry.attributes.aPosA.needsUpdate = true;
        geometry.attributes.aPosB.needsUpdate = true;
        curSeg = i;
      }

      const A = CHAPTERS[i];
      const B = CHAPTERS[i + 1];

      // Scroll speed feeds the burst, so fast scrolling scatters the cloud.
      const dp = Math.abs(p - prevP) / Math.max(dt, 0.001);
      prevP = p;
      vel += (Math.min(dp, 6) - vel) * 0.12;

      material.uniforms.uMorph.value = f;
      material.uniforms.uTime.value = t;
      material.uniforms.uAccentA.value = A.accent;
      material.uniforms.uAccentB.value = B.accent;
      material.uniforms.uDark.value = state.dark;
      // Touch layouts put the cloud directly behind the text rather than beside
      // it, so it has to sit further back to keep copy legible.
      material.uniforms.uOpacity.value = lerp(A.opacity, B.opacity, e) * (touch ? 0.4 : 1);
      material.uniforms.uDisperse.value = 0.65 + vel * 0.22 * motion;

      // Camera dolly + world-space placement, expressed as a fraction of the
      // visible frustum so the cloud sits beside the text at any viewport size.
      camera.position.z = lerp(A.dolly, B.dolly, e);
      const worldH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      const worldW = worldH * camera.aspect;

      // On narrow screens the cloud centres behind the text instead of dodging it.
      const offX = touch ? 0 : lerp(A.offsetX, B.offsetX, e);
      root.position.x = offX * worldW;
      root.position.y = lerp(A.offsetY, B.offsetY, e) * worldH;

      // Portrait viewports have a much narrower frustum, so a shape sized for
      // desktop spans the whole width. Shrink it to match the actual aspect.
      const fit = Math.min(1, camera.aspect / 0.85);
      root.scale.setScalar(lerp(A.scale, B.scale, e) * (touch ? 0.72 : 1) * fit);

      mx += (tmx - mx) * 0.045;
      my += (tmy - my) * 0.045;

      // Compound rotation: resting tilt + scroll-driven spin + slow precession
      // on a second axis + pointer parallax.
      outer.rotation.set(
        lerp(A.tilt[0], B.tilt[0], e) + Math.sin(t * 0.13) * 0.1 * motion + my * 0.18,
        lerp(A.tilt[1], B.tilt[1], e) + p * 0.55 + t * 0.045 * motion + mx * 0.3,
        lerp(A.tilt[2], B.tilt[2], e) + Math.sin(t * 0.09) * 0.07 * motion
      );
      inner.rotation.set(
        Math.sin(t * 0.21) * 0.14 * motion,
        p * 0.38 + t * 0.075 * motion,
        Math.cos(t * 0.17) * 0.11 * motion
      );

      // Page backdrop: chapter-to-chapter tint, then blended toward ink.
      const ca = bgRgb[i];
      const cb = bgRgb[i + 1];
      const d = state.dark;
      const ch = (k: number) => Math.round(lerp(lerp(ca[k], cb[k], e), INK[k], d));
      backdrop.style.backgroundColor = `rgb(${ch(0)},${ch(1)},${ch(2)})`;

      // Publish the light/dark state so fixed chrome (nav, chapter rail) can
      // invert with the page. Only written on change, not every frame.
      const flag = d > 0.5 ? 1 : 0;
      if (flag !== darkFlag) {
        darkFlag = flag;
        document.documentElement.dataset.journeyDark = String(flag);
      }

      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      triggers.forEach((tr) => tr.kill());
      delete document.documentElement.dataset.journeyDark;
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={backdropRef} className="journey-backdrop" aria-hidden />
      <canvas ref={canvasRef} className="journey-canvas" aria-hidden />
    </>
  );
}
