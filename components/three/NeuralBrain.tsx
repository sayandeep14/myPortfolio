"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COLOR_DEFAULT = new THREE.Color("#2a2a2a");
const COLOR_HUB = new THREE.Color("#c0392b");
const COLOR_PULSE = new THREE.Color("#e74c3c");
const COLOR_EDGE = new THREE.Color("#333333");

const SPRING_K = 0.09;
const DAMPING = 0.86;
const REP_R = 0.52;
const REP_F = 0.032;
const N_NODES = 280;
const N_PULSE_SLOTS = 60;
const KNN_R = 0.28;
const KNN_K = 5;
const STEPS = 8;

const HUB_LABELS = [
  "Systems", "Neural Nets", "Algorithms", "IoT", "Music",
  "Finance", "Distributed", "React", "Python", "Design",
];

function sampleBrain(n: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  while (pts.length < n) {
    const x = (Math.random() - 0.5) * 1.6;
    const y = (Math.random() - 0.5) * 1.3;
    const z = (Math.random() - 0.5) * 1.0;
    const ox = Math.abs(x) - 0.18;
    const dist = (ox * ox) / (0.55 * 0.55) + (y * y) / (0.58 * 0.58) + (z * z) / (0.44 * 0.44);
    if (dist > 1.0) continue;
    const innerDist = (ox * ox) / (0.35 * 0.35) + (y * y) / (0.38 * 0.38) + (z * z) / (0.28 * 0.28);
    if (innerDist < 1.0 && Math.random() < 0.55) continue;
    pts.push(new THREE.Vector3(x, y, z));
  }
  return pts;
}

function buildEdges(pts: THREE.Vector3[]): [number, number][] {
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  for (let i = 0; i < pts.length; i++) {
    const dists: [number, number][] = [];
    for (let j = 0; j < pts.length; j++) {
      if (i === j) continue;
      const d = pts[i].distanceTo(pts[j]);
      if (d < KNN_R) dists.push([d, j]);
    }
    dists.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < Math.min(KNN_K, dists.length); k++) {
      const j = dists[k][1];
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) { seen.add(key); edges.push([i, j]); }
    }
  }
  return edges;
}

export default function NeuralBrain() {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const W = container.clientWidth || window.innerWidth * 0.58;
    const H = container.clientHeight || window.innerHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Allow the canvas to receive pointer events
    renderer.domElement.style.pointerEvents = "auto";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    const group = new THREE.Group();
    scene.add(group);

    // Brain geometry
    const basePts = sampleBrain(N_NODES);
    const edges = buildEdges(basePts);

    // Degree / hub detection
    const degree = new Array(N_NODES).fill(0);
    for (const [a, b] of edges) { degree[a]++; degree[b]++; }
    const sortedByDegree = degree.map((d, i) => [d, i] as [number, number]).sort((a, b) => b[0] - a[0]);
    const hubSet = new Set(sortedByDegree.slice(0, 10).map(([, i]) => i));
    const hubIndices = sortedByDegree.slice(0, 10).map(([, i]) => i);

    // Nodes — InstancedMesh
    const nodeGeo = new THREE.SphereGeometry(0.013, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ vertexColors: true });
    const nodeInst = new THREE.InstancedMesh(nodeGeo, nodeMat, N_NODES);
    nodeInst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const nodeColors = new Float32Array(N_NODES * 3);
    const flashTimer = new Float32Array(N_NODES); // flash countdown per node
    const dummy = new THREE.Object3D();

    const pos = basePts.map((p) => p.clone());
    const vel = basePts.map(() => new THREE.Vector3());

    for (let i = 0; i < N_NODES; i++) {
      dummy.position.copy(pos[i]);
      dummy.scale.setScalar(hubSet.has(i) ? 2.0 : 1.0);
      dummy.updateMatrix();
      nodeInst.setMatrixAt(i, dummy.matrix);
      const c = hubSet.has(i) ? COLOR_HUB : COLOR_DEFAULT;
      nodeColors[i * 3] = c.r; nodeColors[i * 3 + 1] = c.g; nodeColors[i * 3 + 2] = c.b;
    }
    nodeInst.instanceColor = new THREE.InstancedBufferAttribute(nodeColors, 3);
    nodeInst.instanceColor.setUsage(THREE.DynamicDrawUsage);
    group.add(nodeInst);

    // Edges — bezier LineSegments
    const edgePositions: number[] = [];
    const edgeCtrl: THREE.Vector3[] = [];
    const _tmp = new THREE.Vector3();
    const _ctrl = new THREE.Vector3();

    for (const [a, b] of edges) {
      const p0 = basePts[a], p1 = basePts[b];
      _ctrl.set((p0.x + p1.x) / 2, (p0.y + p1.y) / 2, (p0.z + p1.z) / 2);
      _ctrl.addScaledVector(_ctrl.clone().normalize(), 0.04 + Math.random() * 0.08);
      edgeCtrl.push(_ctrl.clone());
      for (let s = 0; s <= STEPS; s++) {
        const t = s / STEPS, mt = 1 - t;
        _tmp.set(
          mt*mt*p0.x + 2*mt*t*_ctrl.x + t*t*p1.x,
          mt*mt*p0.y + 2*mt*t*_ctrl.y + t*t*p1.y,
          mt*mt*p0.z + 2*mt*t*_ctrl.z + t*t*p1.z,
        );
        edgePositions.push(_tmp.x, _tmp.y, _tmp.z);
      }
    }

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(edgePositions), 3).setUsage(THREE.DynamicDrawUsage));
    const edgeIdx: number[] = [];
    for (let e = 0; e < edges.length; e++) {
      const base = e * (STEPS + 1);
      for (let s = 0; s < STEPS; s++) edgeIdx.push(base + s, base + s + 1);
    }
    edgeGeo.setIndex(edgeIdx);
    const edgeMat = new THREE.LineBasicMaterial({ color: COLOR_EDGE, transparent: true, opacity: 0.18 });
    group.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // Pulses — InstancedMesh
    const pulseGeo = new THREE.SphereGeometry(0.02, 6, 6);
    const pulseMat = new THREE.MeshBasicMaterial({ color: COLOR_PULSE });
    const pulseInst = new THREE.InstancedMesh(pulseGeo, pulseMat, N_PULSE_SLOTS);
    pulseInst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(pulseInst);
    const hiddenMat = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < N_PULSE_SLOTS; i++) pulseInst.setMatrixAt(i, hiddenMat);
    pulseInst.instanceMatrix.needsUpdate = true;

    interface Pulse { edgeIdx: number; t: number; speed: number; slot: number; active: boolean }
    const pulses: Pulse[] = Array.from({ length: N_PULSE_SLOTS }, (_, i) => ({ edgeIdx: 0, t: 0, speed: 0, slot: i, active: false }));
    const freeSlots: number[] = Array.from({ length: N_PULSE_SLOTS }, (_, i) => i);

    const hubEdges: number[] = [];
    for (let e = 0; e < edges.length; e++) {
      const [a, b] = edges[e];
      if (hubSet.has(a) || hubSet.has(b)) hubEdges.push(e);
    }

    // Precompute outgoing edges per node for fast chain-propagation
    const outgoingEdges: number[][] = Array.from({ length: N_NODES }, () => []);
    for (let e = 0; e < edges.length; e++) {
      const [a, b] = edges[e];
      outgoingEdges[a].push(e);
      outgoingEdges[b].push(e);
    }

    function spawnPulse(eIdx: number) {
      if (freeSlots.length === 0) return;
      const slot = freeSlots.pop()!;
      pulses[slot] = { edgeIdx: eIdx, t: 0, speed: 0.007 + Math.random() * 0.008, slot, active: true };
    }

    // Seed initial pulses
    for (let k = 0; k < Math.min(22, hubEdges.length); k++) {
      const e = hubEdges[Math.floor(Math.random() * hubEdges.length)];
      spawnPulse(e);
      if (pulses[freeSlots.length] && pulses[freeSlots.length].active) {
        pulses[freeSlots.length].t = Math.random();
      }
    }

    let lastSpawn = 0;

    // Mouse — listen on window so pointer-events:none parent doesn't swallow events
    const mouse = new THREE.Vector2(9999, 9999);  // NDC
    const mouseScreen = new THREE.Vector2(9999, 9999); // screen px
    const mouseWorld = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const brainPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // z=0 plane

    function updateMouse(e: MouseEvent) {
      const rect = container.getBoundingClientRect();
      mouseScreen.set(e.clientX - rect.left, e.clientY - rect.top);
      mouse.set(
        (mouseScreen.x / rect.width) * 2 - 1,
        -(mouseScreen.y / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(mouse, camera);
      // Intersect with the z=0 plane where the brain lives
      raycaster.ray.intersectPlane(brainPlane, mouseWorld);
    }

    // Scroll dissolve
    let scrollProgress = 0;
    const dissolveOffset = basePts.map(() => new THREE.Vector3(
      (Math.random() - 0.5) * 3.5,
      (Math.random() - 0.5) * 3.5,
      (Math.random() - 0.5) * 3.5,
    ));

    function onScroll() {
      scrollProgress = Math.min(1, window.scrollY / window.innerHeight);
    }

    // Click ripple
    interface Ripple { center: THREE.Vector3; radius: number; active: boolean }
    const ripples: Ripple[] = [];

    function onClick(e: MouseEvent) {
      updateMouse(e);
      // Transform world click into brain local space
      const invQ = group.quaternion.clone().invert();
      const localClick = mouseWorld.clone().applyQuaternion(invQ);
      ripples.push({ center: localClick, radius: 0, active: true });
    }

    function onMouseMove(e: MouseEvent) {
      updateMouse(e);
    }

    // Use window events so pointer-events:none on the Hero wrapper doesn't block them
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    function onResize() {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    }
    window.addEventListener("resize", onResize);

    const _force = new THREE.Vector3();
    const _diff = new THREE.Vector3();
    const _invQ = new THREE.Quaternion();
    const _worldPos = new THREE.Vector3();

    let autoRotY = 0;
    let hoveredHub = -1;
    let prevTime = performance.now();

    function animate() {
      const now = performance.now();
      const dt = Math.min((now - prevTime) / 1000, 0.1);
      const elapsed = now / 1000;
      prevTime = now;

      // Gentle auto-rotate
      autoRotY += dt * 0.12;
      group.rotation.y = autoRotY;
      group.rotation.x = Math.sin(elapsed * 0.18) * 0.08;

      // Get local-space mouse for repulsion (inverse-transform world mouse into brain space)
      _invQ.copy(group.quaternion).invert();
      const localMouse = mouseWorld.clone().applyQuaternion(_invQ);

      // Expand ripples
      for (const r of ripples) {
        if (!r.active) continue;
        r.radius += dt * 1.4;
        if (r.radius > 2.2) r.active = false;
      }

      // Node spring + repulsion + ripple
      let newHoveredHub = -1;
      const cW = container.clientWidth;
      const cH = container.clientHeight;

      for (let i = 0; i < N_NODES; i++) {
        const base = basePts[i];
        const p = pos[i];
        const v = vel[i];

        // Scroll dissolve target
        const normY = (base.y + 0.7) / 1.4;
        const dStart = 0.18 + normY * 0.42;
        let tx = base.x, ty = base.y, tz = base.z;
        if (scrollProgress > dStart) {
          const blend = Math.min(1, (scrollProgress - dStart) / 0.25);
          const off = dissolveOffset[i];
          tx = base.x + off.x * blend;
          ty = base.y + off.y * blend;
          tz = base.z + off.z * blend;
        }

        // Spring toward target
        _force.set((tx - p.x) * SPRING_K, (ty - p.y) * SPRING_K, (tz - p.z) * SPRING_K);
        v.add(_force);
        v.multiplyScalar(DAMPING);

        // Cursor repulsion — localMouse is in brain local space, same as p
        _diff.set(p.x - localMouse.x, p.y - localMouse.y, p.z - localMouse.z);
        const dCursor = _diff.length();
        if (dCursor < REP_R && dCursor > 0.001) {
          const strength = (1 - dCursor / REP_R) * REP_F;
          v.addScaledVector(_diff.normalize(), strength);
        }

        // Ripple impulse + flash
        for (const r of ripples) {
          if (!r.active) continue;
          _diff.set(p.x - r.center.x, p.y - r.center.y, p.z - r.center.z);
          const dr = _diff.length();
          const waveDist = Math.abs(dr - r.radius);
          if (waveDist < 0.14) {
            const impulse = (1 - waveDist / 0.14) * 0.09;
            v.addScaledVector(_diff.normalize(), impulse);
            flashTimer[i] = 0.35; // flash red for 0.35s
          }
        }

        p.x += v.x; p.y += v.y; p.z += v.z;

        dummy.position.set(p.x, p.y, p.z);
        const isHub = hubSet.has(i);
        dummy.scale.setScalar(isHub ? 2.0 : 1.0);
        dummy.updateMatrix();
        nodeInst.setMatrixAt(i, dummy.matrix);

        // Color: flash > hub > default
        let col: THREE.Color;
        if (flashTimer[i] > 0) {
          flashTimer[i] -= dt;
          col = COLOR_PULSE;
        } else if (isHub) {
          col = COLOR_HUB;
        } else {
          col = COLOR_DEFAULT;
        }
        nodeColors[i * 3] = col.r; nodeColors[i * 3 + 1] = col.g; nodeColors[i * 3 + 2] = col.b;

        // Hub hover: project to screen pixels and compare with mouse screen pos
        if (isHub) {
          _worldPos.set(p.x, p.y, p.z).applyQuaternion(group.quaternion).add(group.position);
          _worldPos.project(camera);
          const sx = (_worldPos.x + 1) / 2 * cW;
          const sy = (-_worldPos.y + 1) / 2 * cH;
          const dx = sx - mouseScreen.x;
          const dy = sy - mouseScreen.y;
          if (dx * dx + dy * dy < 28 * 28) { // 28px radius
            newHoveredHub = i;
          }
        }
      }

      nodeInst.instanceMatrix.needsUpdate = true;
      nodeInst.instanceColor!.needsUpdate = true;

      // Label — update every frame (brain rotates so position changes)
      hoveredHub = newHoveredHub;
      if (labelRef.current) {
        if (hoveredHub >= 0) {
          const hubOrder = hubIndices.indexOf(hoveredHub);
          const label = HUB_LABELS[hubOrder] ?? "";
          _worldPos.copy(pos[hoveredHub]).applyQuaternion(group.quaternion);
          _worldPos.project(camera);
          const lx = (_worldPos.x + 1) / 2 * cW;
          const ly = (-_worldPos.y + 1) / 2 * cH;
          labelRef.current.style.left = `${lx + 16}px`;
          labelRef.current.style.top = `${ly - 12}px`;
          labelRef.current.textContent = label;
          labelRef.current.style.opacity = "1";
        } else {
          labelRef.current.style.opacity = "0";
        }
      }

      // Update edge bezier geometry to follow displaced node positions
      const edgePosArr = (edgeGeo.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
      for (let e = 0; e < edges.length; e++) {
        const [a, b] = edges[e];
        const p0 = pos[a], p1 = pos[b], c = edgeCtrl[e];
        const base = e * (STEPS + 1) * 3;
        for (let s = 0; s <= STEPS; s++) {
          const t = s / STEPS, mt = 1 - t;
          edgePosArr[base + s * 3]     = mt*mt*p0.x + 2*mt*t*c.x + t*t*p1.x;
          edgePosArr[base + s * 3 + 1] = mt*mt*p0.y + 2*mt*t*c.y + t*t*p1.y;
          edgePosArr[base + s * 3 + 2] = mt*mt*p0.z + 2*mt*t*c.z + t*t*p1.z;
        }
      }
      (edgeGeo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;

      // Auto-spawn pulses
      if (elapsed - lastSpawn > 0.16 && freeSlots.length > 0 && hubEdges.length > 0) {
        spawnPulse(hubEdges[Math.floor(Math.random() * hubEdges.length)]);
        lastSpawn = elapsed;
      }

      // Advance pulses
      for (const pulse of pulses) {
        if (!pulse.active) continue;
        pulse.t += pulse.speed;
        if (pulse.t >= 1) {
          pulse.active = false;
          pulseInst.setMatrixAt(pulse.slot, hiddenMat);
          freeSlots.push(pulse.slot);
          // Chain propagate from endpoint
          const endNode = edges[pulse.edgeIdx][1];
          const outs = outgoingEdges[endNode];
          if (outs.length > 0 && Math.random() < 0.65) {
            spawnPulse(outs[Math.floor(Math.random() * outs.length)]);
          }
          continue;
        }
        const [a, b] = edges[pulse.edgeIdx];
        const p0 = pos[a], p1 = pos[b], c = edgeCtrl[pulse.edgeIdx];
        const t = pulse.t, mt = 1 - t;
        dummy.position.set(
          mt*mt*p0.x + 2*mt*t*c.x + t*t*p1.x,
          mt*mt*p0.y + 2*mt*t*c.y + t*t*p1.y,
          mt*mt*p0.z + 2*mt*t*c.z + t*t*p1.z,
        );
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        pulseInst.setMatrixAt(pulse.slot, dummy.matrix);
      }
      pulseInst.instanceMatrix.needsUpdate = true;

      edgeMat.opacity = Math.max(0, 0.18 - scrollProgress * 0.28);

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      <div
        ref={labelRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.15s",
          fontSize: "0.58rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--accent)",
          fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
          background: "rgba(245,244,240,0.88)",
          padding: "0.22rem 0.6rem",
          border: "1px solid rgba(192,57,43,0.5)",
          whiteSpace: "nowrap",
        }}
      />
    </div>
  );
}
