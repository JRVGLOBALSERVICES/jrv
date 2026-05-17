"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

// ─── MODEL LOADER ────────────────────────────────────
function X50Model() {
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
  }, [scene]);

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene.clone()} scale={0.6} position={[0, -0.1, 0]} />
      </Center>
    </group>
  );
}

// ─── SCROLL + MOUSE REACTIVE SCENE ──────────────────
function Scene({ scrollProgress }: { scrollProgress: number }) {
  const mesh = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ rotY: 0, rotX: 0, tiltX: 0, tiltY: 0 });

  // Track mouse position on the document
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!mesh.current) return;

    // Base rotation from scroll
    const scrollRotY = scrollProgress * Math.PI * 2;
    // Mouse tilt offsets (subtle)
    const mouseTiltX = mouse.current.y * 0.15;
    const mouseTiltY = mouse.current.x * 0.2;

    // Smooth interpolation toward targets
    const speed = 1 - Math.pow(0.02, delta);
    target.current.rotY += (scrollRotY - target.current.rotY) * speed;
    target.current.tiltX += (mouseTiltX - target.current.tiltX) * speed;
    target.current.tiltY += (mouseTiltY - target.current.tiltY) * speed;

    // Apply: scroll rotation + mouse tilt
    mesh.current.rotation.x = target.current.tiltX;
    mesh.current.rotation.y = target.current.rotY + target.current.tiltY;

    // Slight body roll for dynamism
    mesh.current.rotation.z = Math.sin(scrollProgress * Math.PI) * 0.04;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[-3, 5, -3]} intensity={0.6} color="#FF4500" />
      <pointLight position={[0, 3, 2]} intensity={0.4} color="#FF4500" />

      <group ref={mesh}>
        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
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
