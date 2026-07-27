/**
 * Shape generators for the persistent particle "journey".
 *
 * Every generator fills the SAME particle budget so any shape can morph into
 * any other — particle i in `brain()` becomes particle i in `helix()`. Order
 * matters: keeping related particles at nearby indices makes the morph read as
 * a transformation rather than a random reshuffle.
 *
 * All randomness is seeded so the cloud is identical on every load.
 */

export type Shape = Float32Array;

/** mulberry32 — small, fast, deterministic. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Uniform point on a unit sphere (avoids the pole clustering of naive lat/long). */
function onSphere(r: () => number): [number, number, number] {
  const u = r() * 2 - 1;
  const theta = r() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(theta), u, s * Math.sin(theta)];
}

/** 00 — Neural brain. Two lobed hemispheres with a central fissure and folds. */
export function brain(count: number): Shape {
  const p = new Float32Array(count * 3);
  const r = rng(1201);
  for (let i = 0; i < count; i++) {
    let [x, y, z] = onSphere(r);

    // Cortical folding — high-frequency radial noise over the sphere.
    const fold =
      1 +
      0.07 * Math.sin(7.0 * Math.atan2(z, x)) * Math.cos(5.0 * Math.asin(y)) +
      0.04 * Math.sin(11.0 * y);

    // Shell with thickness; bias density toward the surface.
    const depth = 0.80 + 0.20 * Math.pow(r(), 0.45);
    const R = 1.05 * fold * depth;

    x *= R;
    y *= R * 0.86; // flatten slightly — brains are wider than they are tall
    z *= R * 0.94;

    // Split into hemispheres by pushing away from the x = 0 plane.
    const side = x >= 0 ? 1 : -1;
    x += side * 0.09;

    // Brain stem for the last few percent of particles.
    if (i > count * 0.96) {
      const t = r();
      x = (r() - 0.5) * 0.12;
      y = -0.9 - t * 0.5;
      z = (r() - 0.5) * 0.12;
    }

    p[i * 3] = x;
    p[i * 3 + 1] = y;
    p[i * 3 + 2] = z;
  }
  return p;
}

/** 01 — DNA double helix. Two strands plus connecting base pairs. */
export function helix(count: number): Shape {
  const p = new Float32Array(count * 3);
  const r = rng(2202);
  const turns = 3.2;
  const height = 2.9;
  const radius = 0.46;

  for (let i = 0; i < count; i++) {
    const isRung = i % 5 === 0; // every 5th particle bridges the strands
    const t = r();
    const angle = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * height;

    if (isRung) {
      // Interpolate across the base pair, quantized into discrete rungs.
      const step = Math.floor(t * 26) / 26;
      const a = step * Math.PI * 2 * turns;
      const yy = (step - 0.5) * height;
      const k = r();
      p[i * 3] = Math.cos(a) * radius * (1 - 2 * k);
      p[i * 3 + 1] = yy;
      p[i * 3 + 2] = Math.sin(a) * radius * (1 - 2 * k);
    } else {
      const strand = i % 2 === 0 ? 0 : Math.PI;
      const jitter = 0.035;
      p[i * 3] = Math.cos(angle + strand) * radius + (r() - 0.5) * jitter;
      p[i * 3 + 1] = y + (r() - 0.5) * jitter;
      p[i * 3 + 2] = Math.sin(angle + strand) * radius + (r() - 0.5) * jitter;
    }
  }
  return p;
}

/** 02 — Ascending spiral staircase. The career timeline, climbing. */
export function staircase(count: number): Shape {
  const p = new Float32Array(count * 3);
  const r = rng(3303);
  const steps = 4; // one per timeline entry
  const turns = 2.4;

  for (let i = 0; i < count; i++) {
    const t = r();
    // Quantize into landings so the climb reads as discrete stages.
    const stage = Math.floor(t * steps);
    const local = t * steps - stage;

    const angle = t * Math.PI * 2 * turns;
    const radius = 0.55 + t * 0.75;
    const y = -1.35 + t * 2.7;

    if (i % 4 === 0) {
      // Tread plates — flat discs at each landing.
      const a = (stage / steps) * Math.PI * 2 * turns + local * 0.9;
      const rad = 0.55 + (stage / steps) * 0.75 + r() * 0.42;
      p[i * 3] = Math.cos(a) * rad;
      p[i * 3 + 1] = -1.35 + (stage / steps) * 2.7 + (r() - 0.5) * 0.05;
      p[i * 3 + 2] = Math.sin(a) * rad;
    } else {
      // The rail itself.
      p[i * 3] = Math.cos(angle) * radius + (r() - 0.5) * 0.07;
      p[i * 3 + 1] = y + (r() - 0.5) * 0.07;
      p[i * 3 + 2] = Math.sin(angle) * radius + (r() - 0.5) * 0.07;
    }
  }
  return p;
}

/** 03 — (2,3) torus knot. Intricate, interlocking — the "selected work". */
export function knot(count: number): Shape {
  const p = new Float32Array(count * 3);
  const r = rng(4404);
  const scale = 0.42;
  const tube = 0.13;

  for (let i = 0; i < count; i++) {
    const t = r() * Math.PI * 2;

    // Curve point.
    const cx = Math.sin(t) + 2 * Math.sin(2 * t);
    const cy = Math.cos(t) - 2 * Math.cos(2 * t);
    const cz = -Math.sin(3 * t);

    // Tangent, used to build a frame for the tube cross-section.
    const rawTx = Math.cos(t) + 4 * Math.cos(2 * t);
    const rawTy = -Math.sin(t) + 4 * Math.sin(2 * t);
    const rawTz = -3 * Math.cos(3 * t);
    const tl = Math.hypot(rawTx, rawTy, rawTz) || 1;
    const tx = rawTx / tl, ty = rawTy / tl, tz = rawTz / tl;

    // Normal = normalize(T × up), with up = (0, 0, 1).
    let nx = ty, ny = -tx, nz = 0;
    const nl = Math.hypot(nx, ny, nz) || 1;
    nx /= nl; ny /= nl; nz /= nl;

    // Binormal = T × N (already unit length, since T ⟂ N and both are unit).
    const bx = ty * nz - tz * ny;
    const by = tz * nx - tx * nz;
    const bz = tx * ny - ty * nx;

    const a = r() * Math.PI * 2;
    const rad = tube * Math.sqrt(r());
    const ox = Math.cos(a) * rad;
    const oy = Math.sin(a) * rad;

    p[i * 3] = (cx + nx * ox + bx * oy) * scale;
    p[i * 3 + 1] = (cy + ny * ox + by * oy) * scale;
    p[i * 3 + 2] = (cz + nz * ox + bz * oy) * scale;
  }
  return p;
}

/** 04 — Vinyl record. Grooved disc with a labelled centre. */
export function vinyl(count: number): Shape {
  const p = new Float32Array(count * 3);
  const r = rng(5505);
  const grooves = 46;

  for (let i = 0; i < count; i++) {
    const angle = r() * Math.PI * 2;
    let rad: number;

    if (i % 11 === 0) {
      // Centre label.
      rad = 0.1 + r() * 0.26;
    } else {
      // Quantize radius into concentric grooves.
      const g = Math.floor(r() * grooves) / grooves;
      rad = 0.42 + g * 0.92 + (r() - 0.5) * 0.008;
    }

    p[i * 3] = Math.cos(angle) * rad;
    p[i * 3 + 1] = (r() - 0.5) * 0.035; // record thickness
    p[i * 3 + 2] = Math.sin(angle) * rad;
  }
  return p;
}

/** 05 — Globe. Latitude/longitude wireframe over a scattered shell. */
export function globe(count: number): Shape {
  const p = new Float32Array(count * 3);
  const r = rng(6606);
  const R = 1.22;
  const lats = 14;
  const longs = 20;

  for (let i = 0; i < count; i++) {
    const mode = i % 8;
    let phi: number, theta: number;

    if (mode <= 2) {
      // On a latitude ring.
      phi = (Math.floor(r() * lats) / (lats - 1)) * Math.PI;
      theta = r() * Math.PI * 2;
    } else if (mode <= 6) {
      // On a longitude meridian. Meridians converge at the poles, so bias phi
      // away from them to keep the lines evenly weighted.
      phi = Math.acos(1 - 2 * r());
      theta = (Math.floor(r() * longs) / longs) * Math.PI * 2;
    } else {
      // A little free scatter so it isn't purely wireframe (1 in 8).
      phi = Math.acos(1 - 2 * r());
      theta = r() * Math.PI * 2;
    }

    const rr = R * (0.99 + r() * 0.02);
    p[i * 3] = rr * Math.sin(phi) * Math.cos(theta);
    p[i * 3 + 1] = rr * Math.cos(phi);
    p[i * 3 + 2] = rr * Math.sin(phi) * Math.sin(theta);
  }
  return p;
}

/** 06 — Convergence. Everything funnels into a bright core with a comet tail. */
export function converge(count: number): Shape {
  const p = new Float32Array(count * 3);
  const r = rng(7707);

  for (let i = 0; i < count; i++) {
    if (i % 3 === 0) {
      // The tail — a spiral streaming into the core.
      const t = Math.pow(r(), 0.6);
      const angle = t * Math.PI * 7;
      const rad = t * 1.9;
      p[i * 3] = Math.cos(angle) * rad;
      p[i * 3 + 1] = (r() - 0.5) * 0.5 * t + t * 0.7;
      p[i * 3 + 2] = Math.sin(angle) * rad;
    } else {
      // Dense core.
      const [x, y, z] = onSphere(r);
      const rad = 0.34 * Math.pow(r(), 0.65);
      p[i * 3] = x * rad;
      p[i * 3 + 1] = y * rad;
      p[i * 3 + 2] = z * rad;
    }
  }
  return p;
}

/** Chapter definitions: geometry + how the camera and colour treat each one. */
export interface Chapter {
  id: string;
  /** Section element id this shape is anchored to. */
  anchor: string;
  build: (count: number) => Shape;
  /** Fraction of particles rendered in the accent colour. */
  accent: number;
  /** Group scale. */
  scale: number;
  /** Camera distance — lower is closer/larger. */
  dolly: number;
  /** Horizontal placement in viewport widths, so it dodges the text column. */
  offsetX: number;
  offsetY: number;
  /** Resting orientation, radians. Scroll and idle motion add to this. */
  tilt: [number, number, number];
  /** 0 = ink on cream, 1 = cream on ink. */
  dark: number;
  opacity: number;
  /** Page backdrop colour while this chapter is centred. */
  bg: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "neural",
    anchor: "hero",
    build: brain,
    accent: 0.16,
    scale: 0.88,
    dolly: 3.5,
    offsetX: 0.26,
    offsetY: 0,
    tilt: [0.18, -0.4, 0.05],
    dark: 0,
    opacity: 0.85,
    bg: "#f5f4f0",
  },
  {
    id: "helix",
    anchor: "about",
    build: helix,
    accent: 0.3,
    scale: 0.86,
    dolly: 3.2,
    offsetX: -0.40,
    offsetY: 0,
    tilt: [0.1, 0.6, -0.12],
    dark: 0,
    opacity: 0.40,
    bg: "#f5f4f0",
  },
  {
    id: "climb",
    anchor: "experience",
    build: staircase,
    accent: 0.22,
    scale: 0.86,
    dolly: 3.6,
    offsetX: 0.34,
    offsetY: 0,
    tilt: [0.42, -0.3, 0.06],
    dark: 0,
    opacity: 0.34,
    bg: "#f2f1ec",
  },
  {
    id: "knot",
    anchor: "projects",
    build: knot,
    accent: 0.34,
    scale: 0.88,
    dolly: 3.1,
    offsetX: -0.36,
    offsetY: 0.04,
    tilt: [0.5, 0.9, 0.3],
    dark: 0,
    opacity: 0.36,
    bg: "#efeee9",
  },
  {
    id: "vinyl",
    anchor: "hobbies",
    build: vinyl,
    accent: 0.2,
    scale: 0.92,
    dolly: 3.0,
    offsetX: 0.36,
    offsetY: 0.02,
    tilt: [1.05, 0.2, 0.15],
    dark: 0,
    opacity: 0.34,
    bg: "#eeedea",
  },
  {
    id: "globe",
    anchor: "links",
    build: globe,
    accent: 0.26,
    scale: 0.82,
    dolly: 3.3,
    offsetX: 0,
    offsetY: 0,
    tilt: [0.24, 0.4, 0.1],
    dark: 0,
    opacity: 0.28,
    bg: "#f5f4f0",
  },
  {
    id: "converge",
    anchor: "contact",
    build: converge,
    accent: 0.5,
    scale: 1.0,
    dolly: 3.2,
    offsetX: 0.30,
    offsetY: -0.05,
    tilt: [0.3, -0.6, 0.2],
    dark: 1,
    opacity: 0.80,
    // Stays light here: the flip to ink is driven separately, keyed tightly to
    // the contact section, so the Links grid never sits on a darkening page.
    bg: "#f5f4f0",
  },
];
