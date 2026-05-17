"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

// ─── MODEL LOADER ────────────────────────────────────
function X50Model() {
  const { scene } = useGLTF("/models/proton-x50.glb");

  // Modify materials synchronously during render phase
  useMemo(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;

      const mat = child.material as THREE.MeshStandardMaterial;
      if (!mat || !mat.color) return;

      if (mat.name === "00 - BODY") {
        mat.color.set("#FF4500");
        mat.metalness = 0.6;
        mat.roughness = 0.3;
      }
    });
  }, [scene]);

  return (
    <Center>
      <primitive object={scene} scale={0.6} position={[0, -0.1, 0]} />
    </Center>
  );
}

// ─── CAMERA MANAGER ─────────────────────────────────
function CameraManager() {
  const { camera, size } = useThree();

  useEffect(() => {
    const isMobile = size.width < 600;
    const cam = camera as THREE.PerspectiveCamera;

    if (isMobile) {
      cam.position.set(4, 1.8, 7);
      cam.fov = 45;
    } else {
      cam.position.set(4.5, 2.5, 6);
      cam.fov = 40;
    }
    cam.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

// ─── SCROLL + MOUSE REACTIVE SCENE ──────────────────
function Scene({ scrollProgress }: { scrollProgress: number }) {
  const mesh = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ rotY: 0, tiltX: 0, tiltY: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouse.current.x = (cx / window.innerWidth) * 2 - 1;
      mouse.current.y = -(cy / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  useFrame((_, delta) => {
    if (!mesh.current) return;

    const scrollRotY = scrollProgress * Math.PI * 2;
    const mouseTiltX = mouse.current.y * 0.15;
    const mouseTiltY = mouse.current.x * 0.2;

    const speed = 1 - Math.pow(0.02, delta);
    target.current.rotY += (scrollRotY - target.current.rotY) * speed;
    target.current.tiltX += (mouseTiltX - target.current.tiltX) * speed;
    target.current.tiltY += (mouseTiltY - target.current.tiltY) * speed;

    mesh.current.rotation.x = target.current.tiltX;
    mesh.current.rotation.y = target.current.rotY + target.current.tiltY;
    mesh.current.rotation.z = Math.sin(scrollProgress * Math.PI) * 0.04;
  });

  return (
    <>
      <CameraManager />
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
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
        <Scene scrollProgress={progress} />
      </Canvas>
    </div>
  );
}
