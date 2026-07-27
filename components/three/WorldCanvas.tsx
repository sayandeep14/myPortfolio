"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger, prefersReducedMotion, isTouch } from "@/lib/gsap";
import { brain, helix, staircase, knot, vinyl, globe, converge } from "./journeyShapes";

/**
 * The particle world.
 *
 * Seven installations distributed through 3D space with the camera flying a
 * spline through them. Scroll drives distance travelled, not a morph amount.
 *
 * The thing that makes it read as depth rather than as a flat collage is the
 * fog: structures are effectively invisible until the camera is close, so you
 * are never looking at four objects at once. Everything else here — the
 * assembly, the dust, the banking, the dwell — exists to sell travel through
 * space rather than a slideshow of shapes.
 *
 * Palette is locked to the site tokens. That exactness is the whole reason
 * this is real-time rather than generated video.
 */

const INK = "#111111";
const CREAM = "#f5f4f0";
const ACCENT = "#c0392b";

/** Depth between consecutive installations, in world units. */
const SPACING = 22;

interface Installation {
  id: string;
  anchor: string;
  build: (count: number) => Float32Array;
  offset: [number, number];
  scale: number;
  accent: number;
  spin: [number, number, number];
}

const WORLD: Installation[] = [
  { id: "neural",  anchor: "hero",       build: brain,     offset: [-3.2,  0.0], scale: 3.4, accent: 0.16, spin: [0.010, -0.024, 0.004] },
  { id: "helix",   anchor: "about",      build: helix,     offset: [ 5.4, -1.2], scale: 3.0, accent: 0.30, spin: [0.004,  0.030, 0.000] },
  { id: "climb",   anchor: "experience", build: staircase, offset: [-5.6,  1.8], scale: 3.1, accent: 0.22, spin: [0.006, -0.020, 0.008] },
  { id: "knot",    anchor: "projects",   build: knot,      offset: [ 4.8,  1.2], scale: 3.2, accent: 0.28, spin: [0.014,  0.018, 0.006] },
  { id: "vinyl",   anchor: "hobbies",    build: vinyl,     offset: [-4.8, -1.8], scale: 3.3, accent: 0.24, spin: [0.020, -0.010, 0.002] },
  { id: "globe",   anchor: "links",      build: globe,     offset: [ 3.4,  0.8], scale: 3.0, accent: 0.34, spin: [0.005,  0.026, 0.000] },
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
  uniform float uAssemble;   // 0 = scattered chaos, 1 = the actual shape
  uniform float uBurst;      // scroll speed -> outward push
  uniform float uFog;
  uniform vec3  uInk;
  uniform vec3  uCream;
  uniform vec3  uAccent;

  attribute vec3 aRand;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Assembly. Far away a structure is an unresolved cloud; as the camera
    // closes, particles converge into the actual form. Each one snaps at a
    // slightly different moment (aRand.z) so it gathers in a wave instead of
    // all arriving on the same frame.
    float a = clamp((uAssemble - aRand.z * 0.45) / 0.55, 0.0, 1.0);
    a = a * a * (3.0 - 2.0 * a);

    vec3 scattered = position * 2.6 + (aRand - 0.5) * 15.0;
    vec3 pos = mix(scattered, position, a);

    // Gentle drift so a formed structure never reads as a frozen mesh.
    float t = uTime * 0.35 + aRand.z * 6.2831;
    pos += uMotion * 0.035 * vec3(sin(t), cos(t * 1.13), sin(t * 0.87));

    // Fast scrolling blows the cloud outward slightly — the structure reacts
    // to being flown through rather than sitting inert.
    pos += normalize(pos + 0.001) * uBurst * (0.4 + aRand.y);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mv.z;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uScale * (0.55 + aRand.y * 0.9) / max(dist, 0.35);

    // ── Depth ──
    // Exponential fog, tuned hard. At one installation's spacing the next is
    // only a few percent visible and the one beyond it is gone entirely, so
    // the eye reads a corridor rather than a pile of overlapping objects.
    float fog = exp(-pow(dist * uFog, 2.2));

    // Near fade: passing THROUGH a cloud would otherwise blow nearby particles
    // into screen-filling discs.
    float near = smoothstep(0.4, 4.5, dist);

    vec3 base = mix(uInk, uCream, uDark);
    vColor = mix(base, uAccent, step(aRand.x, uAccentFrac));
    vAlpha = uOpacity * fog * near * (0.45 + aRand.y * 0.55);
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

/** Fog density. Higher = tighter corridor, less visible ahead. */
const FOG = 0.068;

export default function WorldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const backdrop = backdropRef.current;
    if (!canvas || !backdrop) return;

    const reduced = prefersReducedMotion();
    const touch = isTouch();
    const COUNT = touch ? 3200 : 7600;
    const DUST = touch ? 2200 : 5200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 200);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !touch,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);

    const inkC = new THREE.Color(INK);
    const creamC = new THREE.Color(CREAM);
    const accentC = new THREE.Color(ACCENT);

    const makeMaterial = (accent: number, size: number, opacity: number) =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: size },
          uScale: { value: 800 },
          uAccentFrac: { value: accent },
          uDark: { value: 0 },
          uOpacity: { value: opacity },
          uMotion: { value: reduced ? 0 : 1 },
          uAssemble: { value: 1 },
          uBurst: { value: 0 },
          uFog: { value: FOG },
          uInk: { value: inkC.clone() },
          uCream: { value: creamC.clone() },
          uAccent: { value: accentC.clone() },
        },
      });

    // ── Installations ──────────────────────────────────────────────────────
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
      // Particles travel far outside their source bounds while scattered.
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 16);

      const mat = makeMaterial(inst.accent, touch ? 0.052 : 0.042, 0.95);
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

    // ── Ambient dust ───────────────────────────────────────────────────────
    // Without this the space between installations is a void, and a void gives
    // the eye nothing to measure motion against — the camera reads as static
    // and the structures appear to scale rather than approach. Streaming motes
    // are what make the flight legible as flight.
    const zFar = -(WORLD.length - 1) * SPACING - 20;
    const dustPos = new Float32Array(DUST * 3);
    const dustRand = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 34;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      dustPos[i * 3 + 2] = 14 + Math.random() * (zFar - 14);
      dustRand[i * 3] = Math.random();
      dustRand[i * 3 + 1] = Math.random();
      dustRand[i * 3 + 2] = Math.random();
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("aRand", new THREE.BufferAttribute(dustRand, 3));
    dustGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, zFar / 2), Math.abs(zFar));
    const dustMat = makeMaterial(0.07, touch ? 0.03 : 0.024, 0.5);
    dustMat.uniforms.uAssemble.value = 1; // dust never assembles
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);
    materials.push(dustMat);

    // ── Flight path ────────────────────────────────────────────────────────
    // The first graze is widened to match the brain's leftward offset, keeping
    // its waypoint near x=0. Without that the camera simply follows the
    // structure left and re-centres it on screen, cancelling the shift.
    const grazes: [number, number][] = [
      [3.4, 0.9], [-1.8, 0.7], [1.9, -0.9], [-1.6, 1.0], [1.8, 0.6], [-1.7, -0.8],
    ];
    const points: THREE.Vector3[] = [new THREE.Vector3(0, 0.6, 12)];
    for (let i = 0; i < centers.length - 1; i++) {
      points.push(
        new THREE.Vector3(centers[i].x + grazes[i][0], centers[i].y + grazes[i][1], centers[i].z)
      );
    }
    // The finale arrives at the core rather than overshooting it.
    const core = centers[centers.length - 1];
    points.push(new THREE.Vector3(core.x, core.y + 0.4, core.z + 15));
    points.push(new THREE.Vector3(core.x, core.y, core.z + 7));

    const path = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.4);

    // ── Scroll wiring ──────────────────────────────────────────────────────
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

    const M = Math.max(1, WORLD.length - 1);
    const targetT = () => segments.reduce((sum, st) => sum + st.progress, 0) / M;

    /**
     * Dwell pacing. Linear scroll→distance makes every structure arrive at the
     * same speed, which flattens the journey. This slows the camera as it
     * reaches each installation and lets it run between them: the derivative is
     * 1 - A·cos(2πMt), minimum at each installation, maximum mid-flight.
     * Endpoints are untouched, so scroll extremes still map to path extremes.
     */
    const DWELL = 0.55;
    const pace = (t: number) => t - (DWELL / (2 * Math.PI * M)) * Math.sin(2 * Math.PI * M * t);

    const state = { t: targetT(), dark: darkTrigger?.progress ?? 0, vel: 0 };

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
    const eye = new THREE.Vector3();
    const look = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const tangent2 = new THREE.Vector3();
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const time = clock.getElapsedTime();

      const prev = state.t;
      state.t += (targetT() - state.t) * 0.075;
      state.dark += ((darkTrigger?.progress ?? 0) - state.dark) * 0.08;
      // Smoothed scroll speed, used for the burst reaction.
      state.vel += (Math.abs(state.t - prev) * 60 - state.vel) * 0.12;
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;

      const t = pace(Math.max(0, Math.min(1, state.t)));

      path.getPointAt(t, eye);
      // Aim along the TANGENT: sampling a point further along the curve
      // degenerates at the end, leaving lookAt() with no direction.
      path.getTangentAt(t, tangent);
      look.copy(eye).addScaledVector(tangent, 7);

      camera.position.set(eye.x + mx * 0.9, eye.y - my * 0.6, eye.z);
      camera.lookAt(look.x + mx * 0.5, look.y - my * 0.35, look.z);

      // Bank into the turns. Roll from the rate of lateral tangent change —
      // the camera leans the way it is actually curving, which is most of what
      // separates "flying" from "sliding".
      if (!reduced) {
        path.getTangentAt(Math.min(1, t + 0.02), tangent2);
        const roll = THREE.MathUtils.clamp((tangent2.x - tangent.x) * -9, -0.5, 0.5);
        camera.rotateZ(roll);
      }

      const burst = reduced ? 0 : Math.min(state.vel * 0.9, 0.6);

      groups.forEach((g, i) => {
        const s = WORLD[i].spin;
        if (!reduced) {
          g.rotation.x += s[0] * 0.016;
          g.rotation.y += s[1] * 0.016;
          g.rotation.z += s[2] * 0.016;
        }

        // Assemble on approach, and skip drawing anything the fog has already
        // swallowed — with this falloff a distant group contributes nothing but
        // vertex work.
        const d = camera.position.distanceTo(centers[i]);
        g.visible = d < 46;
        const m = materials[i];
        m.uniforms.uAssemble.value = 1 - THREE.MathUtils.smoothstep(d, 12, 34);
        m.uniforms.uBurst.value = burst;
      });

      materials.forEach((m) => {
        m.uniforms.uTime.value = time;
        m.uniforms.uDark.value = state.dark;
      });
      dustMat.uniforms.uBurst.value = 0;

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
      dustGeo.dispose();
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
