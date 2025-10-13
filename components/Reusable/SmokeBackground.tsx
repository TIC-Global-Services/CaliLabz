"use client"
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const assetPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/';

interface ParticleProps {
  position: [number, number, number];
  rotationZ: number;
}

function Particle({ position, rotationZ }: ParticleProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const material = useRef<THREE.MeshLambertMaterial>(null!);
  const texture = useTexture(`${assetPath}smoke_01.png`);

  useFrame((state) => {
    if (ref.current) {
      ref.current.lookAt(state.camera.position);
      ref.current.rotation.z = rotationZ + state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[5, 5]} />
      <meshLambertMaterial
        ref={material}
        map={texture}
        color={0xffffff}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function Scene() {
  const particles = [];
  const size = 10;

  for (let i = 0; i < 40; i++) {
    const x = (Math.random() - 0.5) * size;
    const y = (Math.random() - 0.5) * size;
    const z = (Math.random() - 0.5) * size;
    const rotationZ = Math.random() * Math.PI * 2;
    particles.push(
      <Particle key={i} position={[x, y, z]} rotationZ={rotationZ} />
    );
  }

  return (
    <>
      <directionalLight position={[-1, 0, 1]} intensity={1.0} />
      <Suspense fallback={null}>{particles}</Suspense>
      <OrbitControls />
    </>
  );
}

export default function SmokeParticles() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50, near: 1, far: 100 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
