"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger, prefersReducedMotion, isTouch } from "@/lib/gsap";
import { brain, helix, staircase, knot, vinyl, globe, converge } from "./journeyShapes";

/**
 * The particle world.
 *
 * The previous JourneyCanvas morphed ONE cloud in place while the camera sat
 * still at a per-chapter dolly. This distributes seven installations through
 * real 3D space and flies the camera through them: near particles rush past,
 * far ones drift in, and structures occlude each other. Scroll drives distance
 * travelled along a spline, not a morph amount.
 *
 * Palette is locked to the site tokens (ink / cream / crimson) — the whole
 * point of doing this in real time rather than generated video is that the
 * colours are exact and every particle stays crisp.
 */

const INK = "#111111";
const CREAM = "#f5f4f0";
const ACCENT = "#c0392b";

/** Depth between consecutive installations, in world units. */
const SPACING = 17;

interface Installation {
  id: string;
  /** Section element id this structure sits beside. */
  anchor: string;
  build: (count: number) => Float32Array;
  /** Lateral placement so the flight weaves instead of running dead straight. */
  offset: [number, number];
  scale: number;
  /** Fraction of particles rendered in the accent colour. */
  accent: number;
  /** Idle tumble, radians/sec. */
  spin: [number, number, number];
}

const WORLD: Installation[] = [
  { id: "neural",  anchor: "hero",       build: brain,     offset: [ 0.0,  0.0], scale: 3.4, accent: 0.16, spin: [0.010, -0.024, 0.004] },
  { id: "helix",   anchor: "about",      build: helix,     offset: [ 4.6, -1.0], scale: 3.0, accent: 0.30, spin: [0.004,  0.030, 0.000] },
  { id: "climb",   anchor: "experience", build: staircase, offset: [-4.6,  1.4], scale: 3.1, accent: 0.22, spin: [0.006, -0.020, 0.008] },
  { id: "knot",    anchor: "projects",   build: knot,      offset: [ 3.8,  1.0], scale: 3.2, accent: 0.28, spin: [0.014,  0.018, 0.006] },
  { id: "vinyl",   anchor: "hobbies",    build: vinyl,     offset: [-3.8, -1.4], scale: 3.3, accent: 0.24, spin: [0.020, -0.010, 0.002] },
  { id: "globe",   anchor: "links",      build: globe,     offset: [ 2.6,  0.6], scale: 3.0, accent: 0.34, spin: [0.005,  0.026, 0.000] },
  { id: "core",    anchor: "contact",    build: converge,  offset: [ 0.0,  0.0], scale: 3.4, accent: 0.46, spin: [0.008,  0.014, 0.010] },
];

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  uniform float uAccentFrac;
  uniform float uDark;
  uniform float uOpacity;
  uniform float uMotion;
  uniform vec3  uInk;
  uniform vec3  uCream;
  uniform vec3  uAccent;

  attribute vec3 aRand;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Gentle per-particle drift so a structure never reads as a frozen mesh.
    float t = uTime * 0.35 + aRand.z * 6.2831;
    pos += uMotion * 0.035 * vec3(sin(t), cos(t * 1.13), sin(t * 0.87));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mv.z;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uScale * (0.55 + aRand.y * 0.9) / max(dist, 0.35);

    // Depth shaping. Two fades, and BOTH matter:
    //   far  — structures materialise out of the ground colour instead of
    //          popping in at the far plane.
    //   near — as the camera passes THROUGH a cloud, particles a few units away
    //          would otherwise blow up into screen-filling discs. Fading them
    //          out is what makes flying through feel like passing through mist
    //          rather than smearing the screen.
    float far  = 1.0 - smoothstep(34.0, 62.0, dist);
    float near = smoothstep(0.4, 4.5, dist);

    vec3 base = mix(uInk, uCream, uDark);
    vColor = mix(base, uAccent, step(aRand.x, uAccentFrac));
    vAlpha = uOpacity * far * near * (0.45 + aRand.y * 0.55);
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.1, d));
  }
`;

export default function WorldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const backdrop = backdropRef.current;
    if (!canvas || !backdrop) return;

    const reduced = prefersReducedMotion();
    const touch = isTouch();
    // Density is what separates "a mesh" from "scattered dust". These structures
    // are seen from the inside as the camera passes through, so they need far
    // more points than the old orbit-at-a-distance canvas did.
    const COUNT = touch ? 3200 : 7600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 200);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !touch,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);

    // ── Build the installations ────────────────────────────────────────────
    const inkC = new THREE.Color(INK);
    const creamC = new THREE.Color(CREAM);
    const accentC = new THREE.Color(ACCENT);

    const groups: THREE.Group[] = [];
    const materials: THREE.ShaderMaterial[] = [];
    const centers: THREE.Vector3[] = [];

    WORLD.forEach((inst, i) => {
      const pos = inst.build(COUNT);
      const rand = new Float32Array(COUNT * 3);
      for (let k = 0; k < COUNT * 3; k++) rand[k] = Math.random();

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 3));
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);

      const mat = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: touch ? 0.052 : 0.042 },
          uScale: { value: 800 },
          uAccentFrac: { value: inst.accent },
          uDark: { value: 0 },
          uOpacity: { value: 0.95 },
          uMotion: { value: reduced ? 0 : 1 },
          uInk: { value: inkC.clone() },
          uCream: { value: creamC.clone() },
          uAccent: { value: accentC.clone() },
        },
      });
      materials.push(mat);

      const g = new THREE.Group();
      g.add(new THREE.Points(geo, mat));
      g.scale.setScalar(inst.scale);
      const c = new THREE.Vector3(inst.offset[0], inst.offset[1], -i * SPACING);
      g.position.copy(c);
      centers.push(c);
      scene.add(g);
      groups.push(g);
    });

    // ── The flight path ────────────────────────────────────────────────────
    // Waypoints are offset from each structure's centre rather than sitting on
    // it: grazing through the outer shell reads as flight, while a dead-centre
    // pass just fills the screen. The finale is the exception — the camera
    // flies into the core of `converge`.
    const grazes: [number, number][] = [
      [1.3, 0.7], [-1.5, 0.6], [1.6, -0.7], [-1.3, 0.8], [1.5, 0.5], [-1.4, -0.6],
    ];
    const points: THREE.Vector3[] = [new THREE.Vector3(0, 0.6, 11)];
    // Every structure except the last is a fly-through.
    for (let i = 0; i < centers.length - 1; i++) {
      points.push(
        new THREE.Vector3(centers[i].x + grazes[i][0], centers[i].y + grazes[i][1], centers[i].z)
      );
    }
    // The finale ARRIVES at the core rather than passing through it. Ending the
    // path beyond `converge` left the camera looking into empty space at t=1,
    // so the contact scene rendered nothing at all.
    const core = centers[centers.length - 1];
    points.push(new THREE.Vector3(core.x, core.y + 0.4, core.z + 13));
    points.push(new THREE.Vector3(core.x, core.y, core.z + 6.5));

    const path = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.4);

    // ── Scroll wiring ──────────────────────────────────────────────────────
    // One trigger per adjacent section pair, anchored to the real elements so
    // the camera stays locked to the copy however tall a section grows.
    // Progress is summed rather than tweened: a scrubbed tween per segment
    // would have every segment writing the same variable, and the last one
    // rendered would win.
    const segments: ScrollTrigger[] = [];
    for (let i = 0; i < WORLD.length - 1; i++) {
      const from = document.getElementById(WORLD[i].anchor);
      const to = document.getElementById(WORLD[i + 1].anchor);
      if (!from || !to) continue;
      segments.push(
        ScrollTrigger.create({
          trigger: from,
          start: "center center",
          endTrigger: to,
          end: "center center",
        })
      );
    }

    const contact = document.getElementById("contact");
    const darkTrigger = contact
      ? ScrollTrigger.create({ trigger: contact, start: "top 78%", end: "top 30%" })
      : null;

    const segCount = Math.max(1, WORLD.length - 1);
    const targetT = () =>
      segments.reduce((sum, st) => sum + st.progress, 0) / segCount;

    const state = { t: targetT(), dark: darkTrigger?.progress ?? 0 };

    // ── Pointer parallax ───────────────────────────────────────────────────
    let tmx = 0, tmy = 0, mx = 0, my = 0;
    const onMove = (e: PointerEvent) => {
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!touch && !reduced) window.addEventListener("pointermove", onMove);

    let dpr = 1;
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio, touch ? 2 : 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      materials.forEach((m) => (m.uniforms.uScale.value = h * dpr * 0.5));
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Render loop ────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const look = new THREE.Vector3();
    const eye = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const time = clock.getElapsedTime();

      // Ease toward scroll so flicks glide instead of snapping.
      state.t += (targetT() - state.t) * 0.075;
      state.dark += ((darkTrigger?.progress ?? 0) - state.dark) * 0.08;
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;

      const t = Math.max(0, Math.min(1, state.t));
      path.getPointAt(t, eye);
      // Aim along the path TANGENT rather than at a point further along it.
      // Sampling t+0.035 degenerates at the end of the curve — both samples
      // collapse to the same point and lookAt() has no direction to use.
      path.getTangentAt(t, tangent);
      look.copy(eye).addScaledVector(tangent, 7);

      camera.position.set(eye.x + mx * 0.9, eye.y - my * 0.6, eye.z);
      camera.lookAt(look.x + mx * 0.5, look.y - my * 0.35, look.z);

      groups.forEach((g, i) => {
        const s = WORLD[i].spin;
        if (!reduced) {
          g.rotation.x += s[0] * 0.016;
          g.rotation.y += s[1] * 0.016;
          g.rotation.z += s[2] * 0.016;
        }
      });

      materials.forEach((m) => {
        m.uniforms.uTime.value = time;
        m.uniforms.uDark.value = state.dark;
      });

      // Page ground colour follows the flip so copy stays legible.
      const bg = creamC.clone().lerp(inkC, state.dark);
      backdrop.style.backgroundColor = `#${bg.getHexString()}`;
      document.documentElement.dataset.journeyDark = state.dark > 0.5 ? "1" : "0";

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      segments.forEach((s) => s.kill());
      darkTrigger?.kill();
      groups.forEach((g) =>
        g.traverse((o) => {
          if (o instanceof THREE.Points) o.geometry.dispose();
        })
      );
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      delete document.documentElement.dataset.journeyDark;
    };
  }, []);

  return (
    <>
      <div ref={backdropRef} className="journey-backdrop" aria-hidden />
      <canvas ref={canvasRef} className="journey-canvas" aria-hidden />
    </>
  );
}
