"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const SmokeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const clock = new THREE.Clock();
    const scene = new THREE.Scene();

    // ✅ White background
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);

    mountRef.current.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.position.z = 1000;
    scene.add(camera);

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(-1, 0, 1);
    scene.add(light);

    // Smoke particles
    const textureLoader = new THREE.TextureLoader();
    const smokeParticles: THREE.Mesh[] = [];

    textureLoader.load(
      "https://rawgit.com/marcobiedermann/playground/master/three.js/smoke-particles/dist/assets/images/clouds.png",
      (texture) => {
        const smokeMaterial = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          map: texture,
          transparent: true,
          opacity: 0.3, // slightly lighter since we’ll add more particles
          depthWrite: false,
        });
        smokeMaterial.map!.minFilter = THREE.LinearFilter;

        const smokeGeometry = new THREE.PlaneGeometry(400, 400);
        const numParticles = 400; // ✅ increased density

        for (let i = 0; i < numParticles; i++) {
          const particle = new THREE.Mesh(smokeGeometry, smokeMaterial);
          particle.position.set(
            Math.random() * 1600 - 800, // wider spread
            Math.random() * 1000 - 500,
            Math.random() * 1200 - 600
          );
          particle.rotation.z = Math.random() * 360;
          smokeParticles.push(particle);
          scene.add(particle);
        }
      }
    );

    // Animation loop
    const animate = () => {
      const delta = clock.getDelta();

      // ✅ faster swirling movement
      smokeParticles.forEach((p) => {
        p.rotation.z += delta * 0.9;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        overflow: "hidden",
        position: "fixed",
        inset: 0, // fills top, right, bottom, left
        width: "100%",
        height: "100%",
        marginTop:"100px"
      }}
    />
  );
};

export default SmokeCanvas;
