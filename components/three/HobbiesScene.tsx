"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HobbiesScene() {
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
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 4;

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dl = new THREE.DirectionalLight(0xffffff, 1.4);
    dl.position.set(3, 5, 4);
    scene.add(dl);
    const rl = new THREE.PointLight(0xc0392b, 1.0, 10);
    rl.position.set(0, 0, 3);
    scene.add(rl);

    // ── VINYL RECORD (left third — Music) ──────────────────────────────────
    const vinylGroup = new THREE.Group();
    vinylGroup.position.set(-2.2, 0, 0);
    vinylGroup.rotation.x = -0.28;

    const discGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.04, 64);
    const discMat = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, metalness: 0.25, roughness: 0.75 });
    const disc = new THREE.Mesh(discGeo, discMat);
    vinylGroup.add(disc);

    // Grooves
    for (let r = 0.22; r < 0.85; r += 0.05) {
      const rg = new THREE.TorusGeometry(r, 0.003, 4, 80);
      const rm = new THREE.MeshBasicMaterial({ color: 0x1c1c1c, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(rg, rm);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.022;
      vinylGroup.add(ring);
    }

    const labelGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.045, 32);
    const labelMat = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.5, emissive: new THREE.Color(0xc0392b), emissiveIntensity: 0.2 });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = 0.002;
    vinylGroup.add(label);

    const holeGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.06, 16);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    vinylGroup.add(new THREE.Mesh(holeGeo, holeMat));

    scene.add(vinylGroup);

    // ── SPIRAL PLANT (center — Gardening) ──────────────────────────────────
    const plantGroup = new THREE.Group();
    plantGroup.position.set(0, -0.3, 0);

    const PLANT_STEPS = 120;
    const helixPts = Array.from({ length: PLANT_STEPS }, (_, i) => {
      const t = i / (PLANT_STEPS - 1);
      return new THREE.Vector3(
        Math.cos(t * Math.PI * 5) * (0.3 * (1 - t * 0.4)),
        t * 2.0 - 1.0,
        Math.sin(t * Math.PI * 5) * (0.3 * (1 - t * 0.4))
      );
    });
    const curve = new THREE.CatmullRomCurve3(helixPts);
    const tubeGeo = new THREE.TubeGeometry(curve, PLANT_STEPS, 0.018, 7, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.6 });
    const stem = new THREE.Mesh(tubeGeo, tubeMat);
    // Start with 0 draw range — grows in via scroll
    stem.geometry.setDrawRange(0, 0);
    plantGroup.add(stem);

    // Small sphere buds at intervals
    const budGeo = new THREE.SphereGeometry(0.038, 8, 8);
    const budMat = new THREE.MeshStandardMaterial({ color: 0xc0392b, emissive: new THREE.Color(0xc0392b), emissiveIntensity: 0.4 });
    [0.2, 0.45, 0.65, 0.85].forEach((t) => {
      const pt = curve.getPoint(t);
      const bud = new THREE.Mesh(budGeo, budMat);
      bud.position.copy(pt);
      bud.scale.setScalar(0.01); // start invisible, grow in
      bud.userData.growT = t;
      plantGroup.add(bud);
    });

    scene.add(plantGroup);

    // ── BOWL (right third — Cooking) ────────────────────────────────────────
    const bowlGroup = new THREE.Group();
    bowlGroup.position.set(2.2, 0, 0);

    // Bowl shell: half-sphere using lathe geometry
    const lathePoints: THREE.Vector2[] = [];
    for (let i = 0; i <= 16; i++) {
      const angle = (i / 16) * (Math.PI / 2);
      lathePoints.push(new THREE.Vector2(Math.sin(angle) * 0.65, -Math.cos(angle) * 0.4));
    }
    const bowlGeo = new THREE.LatheGeometry(lathePoints, 40);
    const bowlMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.85, roughness: 0.15, side: THREE.DoubleSide });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.rotation.x = 0.15;
    bowlGroup.add(bowl);

    // Rim ring
    const rimGeo = new THREE.TorusGeometry(0.65, 0.022, 10, 60);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2 + 0.15;
    bowlGroup.add(rim);

    // Floating "ingredient" spheres above bowl
    const ingredientGeo = new THREE.IcosahedronGeometry(0.055, 1);
    [
      { color: 0xc0392b, offset: [-0.15, 0.3, 0.1] as [number,number,number] },
      { color: 0x1a1a1a, offset: [0.2, 0.45, -0.05] as [number,number,number] },
      { color: 0x555555, offset: [-0.05, 0.55, 0.2] as [number,number,number] },
    ].forEach(({ color, offset }) => {
      const m = new THREE.MeshStandardMaterial({ color, metalness: 0.5, roughness: 0.4, emissive: color === 0xc0392b ? new THREE.Color(0xc0392b) : new THREE.Color(0), emissiveIntensity: 0.3 });
      const sphere = new THREE.Mesh(ingredientGeo, m);
      sphere.position.set(...offset);
      sphere.userData.baseY = offset[1];
      bowlGroup.add(sphere);
    });

    scene.add(bowlGroup);

    // ── Scroll and mouse state ──────────────────────────────────────────────
    let mx = 0, my = 0;
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

    let raf: number;
    const clock = new THREE.Clock();
    let plantProgress = 0; // 0→1 as gardening card scrolls into view

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Section scroll progress
      const el = document.getElementById("hobbies");
      let sectionProgress = 0;
      if (el) {
        const rect = el.getBoundingClientRect();
        sectionProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight + 1)));
        // Plant grows as section comes into view
        const inView = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
        plantProgress += (inView - plantProgress) * 0.04;
      }

      // ── Vinyl spin + drift ──
      disc.rotation.y = t * 1.6;
      label.rotation.y = t * 1.6;
      vinylGroup.rotation.y += (mx * 0.25 - vinylGroup.rotation.y) * 0.04;
      vinylGroup.position.y = Math.sin(t * 0.5) * 0.08;
      // Horizontal parallax: drift left as you scroll
      vinylGroup.position.x = -2.2 - sectionProgress * 0.5;

      // ── Plant growth via drawRange ──
      const totalIdx = tubeGeo.index ? tubeGeo.index.count : tubeGeo.attributes.position.count;
      stem.geometry.setDrawRange(0, Math.floor(totalIdx * plantProgress));
      // Buds appear when their t is reached
      plantGroup.children.forEach((child) => {
        if (child.userData.growT !== undefined) {
          const bud = child as THREE.Mesh;
          const target = plantProgress > bud.userData.growT ? 1 : 0;
          const cur = bud.scale.x;
          bud.scale.setScalar(cur + (target - cur) * 0.06);
        }
      });
      plantGroup.rotation.y = t * 0.2 + mx * 0.15;
      // Scroll: plant drifts up
      plantGroup.position.y = -0.3 + sectionProgress * 0.4;

      // ── Bowl rotation + ingredient float ──
      bowlGroup.rotation.y = t * 0.25 + mx * 0.2;
      bowlGroup.rotation.x = my * 0.08;
      bowlGroup.position.y = Math.sin(t * 0.4) * 0.06;
      // Horizontal parallax: drift right as you scroll
      bowlGroup.position.x = 2.2 + sectionProgress * 0.5;
      bowlGroup.children.forEach((child) => {
        if ((child as THREE.Mesh).userData.baseY !== undefined) {
          (child as THREE.Mesh).position.y =
            (child as THREE.Mesh).userData.baseY + Math.sin(t * 1.2 + (child as THREE.Mesh).position.x * 5) * 0.05;
        }
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
