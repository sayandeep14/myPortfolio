"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function DNAHelix() {
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
    camera.position.z = 3.2;

    scene.add(new THREE.AmbientLight(0xf5f4f0, 0.8));
    const dl = new THREE.DirectionalLight(0xffffff, 1.4);
    dl.position.set(2, 3, 4);
    scene.add(dl);
    const rl = new THREE.PointLight(0xc0392b, 1.2, 8);
    rl.position.set(1, 0, 2);
    scene.add(rl);

    const group = new THREE.Group();
    scene.add(group);

    const N = 36; // steps per strand
    const R = 0.5; // helix radius
    const H = 2.6; // total height

    const geoA = new THREE.SphereGeometry(0.055, 10, 10);
    const geoB = new THREE.SphereGeometry(0.055, 10, 10);
    const matA = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
    const matB = new THREE.MeshStandardMaterial({
      color: 0xc0392b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(0xc0392b),
      emissiveIntensity: 0.35,
    });

    const barGeo = new THREE.CylinderGeometry(0.014, 0.014, 1, 6);
    const barMat = new THREE.MeshStandardMaterial({ color: 0x444444, transparent: true, opacity: 0.65 });

    for (let i = 0; i < N; i++) {
      const t = i / N;
      const angle = t * Math.PI * 4; // two full rotations
      const y = (t - 0.5) * H;

      const ax = Math.cos(angle) * R;
      const az = Math.sin(angle) * R;
      const bx = Math.cos(angle + Math.PI) * R;
      const bz = Math.sin(angle + Math.PI) * R;

      const sa = new THREE.Mesh(geoA, matA);
      sa.position.set(ax, y, az);
      group.add(sa);

      const sb = new THREE.Mesh(geoB, matB);
      sb.position.set(bx, y, bz);
      group.add(sb);

      // Rungs every 4 steps
      if (i % 4 === 0) {
        const bar = new THREE.Mesh(barGeo, barMat);
        bar.position.set((ax + bx) / 2, y, (az + bz) / 2);
        const dist = Math.sqrt((bx - ax) ** 2 + (bz - az) ** 2);
        bar.scale.y = dist;
        bar.lookAt(new THREE.Vector3(ax, y, az));
        bar.rotateX(Math.PI / 2);
        group.add(bar);
      }
    }

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

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Slow idle spin
      group.rotation.y = t * 0.35 + mx * 0.4;
      group.rotation.x = my * 0.15;

      // Scroll: helix drifts upward and to the left as you scroll About section
      const el = document.getElementById("about");
      if (el) {
        const rect = el.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
        group.position.y = progress * 0.8;
        group.position.x = -progress * 0.4;
      }

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
