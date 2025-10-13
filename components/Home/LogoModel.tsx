"use client";
import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, DirectionalLight } from "three";

function Logo() {
  const gltf = useLoader(GLTFLoader, "/Model/CA_Logo1.glb");
  const modelRef = useRef<Mesh>(null!);
  const lightRef = useRef<DirectionalLight>(null!);

  // Store mouse position
  const mouse = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);


  useFrame(() => {
    if (modelRef.current) {
      // Smooth Y rotation
      modelRef.current.rotation.y +=
        (mouse.current.x * 0.2 - modelRef.current.rotation.y) * 0.02;

      // Smooth X rotation (with clamping between 1.05 and 1.35)
      const targetX = mouse.current.y * 0.5;
      const nextX =
        modelRef.current.rotation.x +
        (targetX - modelRef.current.rotation.x) * 0.05;

      modelRef.current.rotation.x = Math.min(1.35, Math.max(1.05, nextX));
    }

    if (lightRef.current) {
      // Move light with cursor (smooth lerp)
      const targetX = mouse.current.x * 2; // spread on X
      const targetY = mouse.current.y * 10 + 10; // keep above
      const targetZ = 15; // depth

      lightRef.current.position.x += (targetX - lightRef.current.position.x) * 0.05;
      lightRef.current.position.y += (targetY - lightRef.current.position.y) * 0.05;
      lightRef.current.position.z += (targetZ - lightRef.current.position.z) * 0.05;
    }
  });

  return (
    <>
      <primitive ref={modelRef} object={gltf.scene} scale={1} />
      <directionalLight ref={lightRef} intensity={3} position={[5, 25, 15]} />
    </>
  );
}

const LogoModel = () => {
  return (
    <div className="w-full h-[50dvh] z-40 pointer-events-none touch-none">
      <Canvas camera={{ position: [0, 0, 5], fov:60 }} style={{
          pointerEvents: "none", 
          touchAction: "none",
        }}>
        <ambientLight intensity={1.2} />
        <Logo />
        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
};

export default LogoModel;
