"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// 4×3 chip node grid
function buildAssembled(): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      pts.push(
        new THREE.Vector3(
          (col - 1.5) * 0.48,
          (1 - row) * 0.48,
          ((row * 4 + col) % 3 === 0 ? 0.06 : ((row + col) % 2 === 0 ? -0.04 : 0))
        )
      );
    }
  }
  return pts;
}

// L-shaped PCB trace: A → corner → B
function lTrace(
  a: THREE.Vector3,
  b: THREE.Vector3
): [THREE.Vector3, THREE.Vector3, THREE.Vector3] {
  const corner = new THREE.Vector3(a.x, b.y, (a.z + b.z) / 2);
  return [a.clone(), corner, b.clone()];
}

// Indices of "hub" nodes (brighter, larger)
const HUB = new Set([0, 3, 4, 7, 8, 11]);

const EDGES: [number, number][] = [
  [0,1],[1,2],[2,3],         // row 0
  [4,5],[5,6],[6,7],         // row 1
  [8,9],[9,10],[10,11],      // row 2
  [0,4],[4,8],               // col 0
  [1,5],[5,9],               // col 1
  [2,6],[6,10],              // col 2
  [3,7],[7,11],              // col 3
  [1,6],[2,5],[5,10],[6,9],  // diagonals
];

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 3.5;

    // Lighting
    scene.add(new THREE.AmbientLight(0xf5f4f0, 0.9));
    const dl = new THREE.DirectionalLight(0xffffff, 1.8);
    dl.position.set(3, 4, 5);
    scene.add(dl);
    const rl = new THREE.PointLight(0xc0392b, 2.5, 6);
    rl.position.set(-0.5, 0, 2);
    scene.add(rl);

    const assembled = buildAssembled();

    // Scatter vectors — outward from center with Z chaos
    const scatter = assembled.map((p) => {
      const len = Math.sqrt(p.x * p.x + p.y * p.y) || 0.1;
      const dist = 3.0 + Math.random() * 2.0;
      return new THREE.Vector3(
        (p.x / len) * dist + (Math.random() - 0.5) * 0.6,
        (p.y / len) * dist + (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 4.0
      );
    });

    // ── Chip substrate (flat box behind nodes) ──
    const substrateGeo = new THREE.BoxGeometry(1.7, 1.1, 0.03);
    const substrateEdges = new THREE.EdgesGeometry(substrateGeo);
    const substrateMat = new THREE.LineBasicMaterial({
      color: 0x999999,
      transparent: true,
      opacity: 0.25,
    });
    const substrate = new THREE.LineSegments(substrateEdges, substrateMat);
    substrate.position.z = -0.08;

    // ── Nodes ──
    const nodes: THREE.Mesh[] = assembled.map((pos, i) => {
      const isHub = HUB.has(i);
      const geo = new THREE.IcosahedronGeometry(isHub ? 0.07 : 0.042, 2);
      const mat = new THREE.MeshStandardMaterial({
        color: isHub ? 0xc0392b : 0x1a1a1a,
        metalness: 0.9,
        roughness: 0.15,
        emissive: isHub ? new THREE.Color(0xc0392b) : new THREE.Color(0),
        emissiveIntensity: isHub ? 0.5 : 0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      return mesh;
    });

    // ── L-shaped PCB traces ──
    const allTracePoints: number[] = [];
    EDGES.forEach(([a, b]) => {
      const [p0, pm, p1] = lTrace(assembled[a], assembled[b]);
      allTracePoints.push(p0.x, p0.y, p0.z, pm.x, pm.y, pm.z);
      allTracePoints.push(pm.x, pm.y, pm.z, p1.x, p1.y, p1.z);
    });
    const traceGeo = new THREE.BufferGeometry();
    traceGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(allTracePoints), 3)
    );
    const traceMat = new THREE.LineBasicMaterial({
      color: 0x555555,
      transparent: true,
      opacity: 0.5,
    });
    const traces = new THREE.LineSegments(traceGeo, traceMat);

    // ── Floating components ──
    interface Comp {
      mesh: THREE.Mesh;
      bp: THREE.Vector3;
      sv: THREE.Vector3;
      axis: THREE.Vector3;
      speed: number;
    }

    const compDefs = [
      { geo: new THREE.CylinderGeometry(0.042, 0.042, 0.22, 12), color: 0x1e1e1e, pos: [-1.15, 0.55, 0.35] as [number,number,number] },
      { geo: new THREE.BoxGeometry(0.24, 0.16, 0.04), color: 0x0f0f0f, pos: [1.15, 0.4, 0.2] as [number,number,number] },
      { geo: new THREE.ConeGeometry(0.05, 0.18, 7), color: 0x2a2a2a, pos: [-0.9, -0.65, 0.4] as [number,number,number] },
      { geo: new THREE.SphereGeometry(0.055, 12, 12), color: 0xc0392b, pos: [1.0, -0.6, 0.15] as [number,number,number] },
    ];

    const comps: Comp[] = compDefs.map(({ geo, color, pos }) => {
      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.85,
        roughness: 0.2,
        emissive: color === 0xc0392b ? new THREE.Color(0xc0392b) : new THREE.Color(0),
        emissiveIntensity: color === 0xc0392b ? 0.6 : 0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      const bp = new THREE.Vector3(...pos);
      const sv = new THREE.Vector3(
        (pos[0] >= 0 ? 1 : -1) * (2.2 + Math.random()),
        (pos[1] >= 0 ? 1 : -1) * (2.0 + Math.random()),
        (Math.random() - 0.5) * 4
      );
      return {
        mesh,
        bp,
        sv,
        axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
        speed: 0.007 + Math.random() * 0.008,
      };
    });

    // Group everything so mouse-rotation works uniformly
    const group = new THREE.Group();
    group.add(substrate);
    nodes.forEach((n) => group.add(n));
    group.add(traces);
    comps.forEach((c) => group.add(c.mesh));
    scene.add(group);

    // Mouse
    let mx = 0, my = 0, trx = 0, try_ = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Scroll progress (0→1 over first viewport height)
      const sp = Math.min(window.scrollY / window.innerHeight, 1);
      // ease-out
      const eased = 1 - (1 - sp) * (1 - sp);

      // Mouse rotation
      trx += (mx * 0.13 - trx) * 0.04;
      try_ += (-my * 0.08 - try_) * 0.04;
      group.rotation.y = trx;
      group.rotation.x = try_;

      // Scatter nodes
      nodes.forEach((node, i) => {
        const a = assembled[i];
        const s = scatter[i];
        const idle = Math.sin(t * 0.6 + i * 0.55) * 0.007 * (1 - eased);
        node.position.x = a.x + s.x * eased;
        node.position.y = a.y + s.y * eased + idle;
        node.position.z = a.z + s.z * eased;
        if (HUB.has(i)) {
          node.scale.setScalar(1 + Math.sin(t * 2.2 + i) * 0.13 * (1 - eased));
        }
      });

      // Update L-traces to follow nodes
      const pa = traceGeo.attributes.position.array as Float32Array;
      let offset = 0;
      EDGES.forEach(([a, b]) => {
        const [p0, pm, p1] = lTrace(nodes[a].position, nodes[b].position);
        pa[offset++] = p0.x; pa[offset++] = p0.y; pa[offset++] = p0.z;
        pa[offset++] = pm.x; pa[offset++] = pm.y; pa[offset++] = pm.z;
        pa[offset++] = pm.x; pa[offset++] = pm.y; pa[offset++] = pm.z;
        pa[offset++] = p1.x; pa[offset++] = p1.y; pa[offset++] = p1.z;
      });
      traceGeo.attributes.position.needsUpdate = true;
      traceMat.opacity = Math.max(0, 0.5 * (1 - eased * 3));
      substrateMat.opacity = Math.max(0, 0.25 * (1 - eased * 2));

      // Floating components scatter + rotate
      comps.forEach((c) => {
        c.mesh.position.x = c.bp.x + c.sv.x * eased;
        c.mesh.position.y = c.bp.y + c.sv.y * eased;
        c.mesh.position.z = c.bp.z + c.sv.z * eased;
        c.mesh.rotateOnAxis(c.axis, c.speed * (1 + eased * 4));
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
