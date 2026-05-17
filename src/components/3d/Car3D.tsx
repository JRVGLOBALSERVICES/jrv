"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

// ─── SIMPLE 3D CAR MODEL (procedural — proven to work) ──
function CarBody() {
  const group = useRef<THREE.Group>(null);

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#FF4500",
    metalness: 0.7,
    roughness: 0.3,
  }), []);

  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#1a1a1a",
    metalness: 0.2,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85,
    envMapIntensity: 1.5,
  }), []);

  const wheelMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#111111",
    metalness: 0.5,
    roughness: 0.8,
  }), []);

  const rimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#666666",
    metalness: 0.9,
    roughness: 0.2,
  }), []);

  return (
    <group ref={group}>
      {/* Main body */}
      <mesh position={[0, 0.35, 0]} material={bodyMat}>
        <boxGeometry args={[1.6, 0.4, 3.2]} />
      </mesh>
      {/* Crankcase / lower body */}
      <mesh position={[0, 0.15, 0]} material={bodyMat}>
        <boxGeometry args={[1.4, 0.2, 2.8]} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.7, -0.3]} material={glassMat}>
        <boxGeometry args={[1.4, 0.4, 1.6]} />
      </mesh>
      {/* Front windshield */}
      <mesh position={[0, 0.65, 0.55]} rotation={[0.3, 0, 0]} material={glassMat}>
        <planeGeometry args={[1.3, 0.45]} />
      </mesh>
      {/* Hood line */}
      <mesh position={[0, 0.4, 1.3]} material={bodyMat}>
        <boxGeometry args={[1.3, 0.05, 0.8]} />
      </mesh>
      {/* Trunk line */}
      <mesh position={[0, 0.42, -1.3]} material={bodyMat}>
        <boxGeometry args={[1.3, 0.05, 0.6]} />
      </mesh>
      {/* Spoiler */}
      <mesh position={[0, 0.65, -1.55]} material={bodyMat}>
        <boxGeometry args={[1.2, 0.04, 0.05]} />
      </mesh>
      {/* Headlights */}
      <mesh position={[0.35, 0.38, 1.62]} material={bodyMat}>
        <sphereGeometry args={[0.08, 8, 8]} />
      </mesh>
      <mesh position={[-0.35, 0.38, 1.62]} material={bodyMat}>
        <sphereGeometry args={[0.08, 8, 8]} />
      </mesh>
      {/* Taillights */}
      <mesh position={[0.45, 0.38, -1.62]}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.45, 0.38, -1.62]}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={0.3} />
      </mesh>
      {/* Wheels */}
      {[
        [0.85, 0.15, 0.9],
        [-0.85, 0.15, 0.9],
        [0.85, 0.15, -0.9],
        [-0.85, 0.15, -0.9],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={wheelMat}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} material={rimMat}>
            <cylinderGeometry args={[0.1, 0.1, 0.13, 8]} />
          </mesh>
        </group>
      ))}
      {/* Side mirrors */}
      <mesh position={[0.85, 0.55, 0.45]} material={bodyMat}>
        <boxGeometry args={[0.06, 0.08, 0.15]} />
      </mesh>
      <mesh position={[-0.85, 0.55, 0.45]} material={bodyMat}>
        <boxGeometry args={[0.06, 0.08, 0.15]} />
      </mesh>
    </group>
  );
}

// ─── CAMERA ─────────────────────────────────────────
function CameraManager() {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const isMobile = size.width < 600;
    cam.position.set(isMobile ? 3.5 : 2.5, isMobile ? 1.5 : 1.5, isMobile ? 5 : 3.5);
    cam.far = 100;
    cam.near = 0.05;
    cam.fov = isMobile ? 50 : 35;
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
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <directionalLight position={[-3, 5, -3]} intensity={0.5} color="#FF4500" />
      <pointLight position={[0, 3, 2]} intensity={0.5} color="#FF4500" />

      <group ref={mesh}>
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <CarBody />
        </Float>
      </group>

      <ContactShadows position={[0, -0.1, 0]} opacity={0.4} scale={5} blur={2} />
      <Environment preset="studio" />
    </>
  );
}

// ─── EXPORTED CANVAS ─────────────────────────────────
export default function Car3D({ progress = 0 }: { progress?: number }) {
  return (
    <div className="w-full h-full" style={{ minHeight: "100%" }}>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
        <Scene scrollProgress={progress} />
      </Canvas>
    </div>
  );
}
