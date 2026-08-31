"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene / Camera / Renderer ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06050f);

    const camera = new THREE.PerspectiveCamera(
      70,
      mount.clientWidth / mount.clientHeight,
      0.5,
      100
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // ── Geometries pool ──
    const geometries = [
      new THREE.ConeGeometry(0.9, 1.8, 7),
      new THREE.BoxGeometry(1.6, 1.6, 1.6),
      new THREE.SphereGeometry(0.9, 14, 8),
      new THREE.OctahedronGeometry(1.0),
      new THREE.TetrahedronGeometry(1.1),
    ];

    // ── Color palette — purple / indigo / fuchsia vibes ──
    const palette = [
      0x7c3aed, // violet-600
      0xa855f7, // purple-500
      0xc026d3, // fuchsia-600
      0x6366f1, // indigo-500
      0x2563eb, // blue-600
      0x0891b2, // cyan-600
      0x7e22ce, // purple-800
      0xdb2777, // pink-600
    ];

    // ── Create batch of meshes ──
    const COUNT = 160;
    const meshes: { mesh: THREE.Mesh; vx: number; vy: number; vz: number; rx: number; ry: number; rz: number }[] = [];

    for (let i = 0; i < COUNT; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = new THREE.MeshBasicMaterial({
        color: palette[Math.floor(Math.random() * palette.length)],
        transparent: true,
        opacity: 0.55 + Math.random() * 0.35,
        wireframe: Math.random() > 0.5,
      });

      const m = new THREE.Mesh(geo, mat);
      const spread = 40;
      m.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
      );
      const s = 0.3 + Math.random() * 0.7;
      m.scale.setScalar(s);

      meshes.push({
        mesh: m,
        vx: (Math.random() - 0.5) * 0.025,
        vy: (Math.random() - 0.5) * 0.025,
        vz: (Math.random() - 0.5) * 0.015,
        rx: Math.random() * 0.008,
        ry: Math.random() * 0.008,
        rz: Math.random() * 0.006,
      });
      scene.add(m);
    }

    // ── Ambient glow fog ──
    scene.fog = new THREE.FogExp2(0x06050f, 0.032);

    // ── Animation loop ──
    let frameId: number;
    const BOUND = 22;

    function animate() {
      frameId = requestAnimationFrame(animate);

      for (const obj of meshes) {
        obj.mesh.position.x += obj.vx;
        obj.mesh.position.y += obj.vy;
        obj.mesh.position.z += obj.vz;

        // bounce within bounds
        if (Math.abs(obj.mesh.position.x) > BOUND) obj.vx *= -1;
        if (Math.abs(obj.mesh.position.y) > BOUND) obj.vy *= -1;
        if (Math.abs(obj.mesh.position.z) > BOUND) obj.vz *= -1;

        obj.mesh.rotation.x += obj.rx;
        obj.mesh.rotation.y += obj.ry;
        obj.mesh.rotation.z += obj.rz;
      }

      // very slow auto-camera orbit
      const t = Date.now() * 0.0003;
      camera.position.x = Math.sin(t) * 3;
      camera.position.y = Math.cos(t * 0.7) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();

    // ── Resize handler ──
    function onResize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      geometries.forEach((g) => g.dispose());
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
