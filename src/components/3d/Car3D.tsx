"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

// ─── MODEL LOADER ────────────────────────────────────
function X50Model({ onLoad }: { onLoad?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/proton-x50.glb");

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;

      const mat = child.material as THREE.MeshStandardMaterial;
      if (!mat || !mat.color) return;

      // Material "00 - BODY" is the body paint → JRV orange
      if (mat.name === "00 - BODY") {
        mat.color.set("#FF4500");
        mat.metalness = 0.6;
        mat.roughness = 0.3;
      }
    });

    onLoad?.();
  }, [scene, onLoad]);

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene.clone()} scale={0.6} position={[0, -0.1, 0]} />
      </Center>
    </group>
  );
}

// ─── SCROLL-REACTIVE SCENE ──────────────────────────
function Scene({ scrollProgress }: { scrollProgress: number }) {
  const mesh = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.rotation.y = scrollProgress * Math.PI * 2;
    mesh.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.08;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-3, 5, -3]} intensity={0.6} color="#FF4500" />
      <pointLight position={[0, 3, 2]} intensity={0.4} color="#FF4500" />

      <group ref={mesh}>
        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.2}>
          <X50Model />
        </Float>
      </group>

      <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={8} blur={2.5} far={1} />
      <Environment preset="studio" />
    </>
  );
}

useGLTF.preload("/models/proton-x50.glb");

// ─── EXPORTED CANVAS ─────────────────────────────────
export default function Car3D({ progress = 0 }: { progress?: number }) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [4.5, 2.5, 6], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
        <Scene scrollProgress={progress} />
      </Canvas>
    </div>
  );
}
