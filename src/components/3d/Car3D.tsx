"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

// ─── MODEL LOADER ────────────────────────────────────
function X50Model({ onLoad }: { onLoad?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/proton-x50.glb");

  useEffect(() => {
    if (scene) {
      // Traverse and apply materials
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Apply orange tint to body materials
          if (child.material && "color" in child.material) {
            const mat = child.material as THREE.MeshStandardMaterial;
            // Only tint non-black, non-glass materials
            if (
              mat.color &&
              mat.color.getHex() !== 0x000000 &&
              mat.color.getHex() !== 0x111111
            ) {
              mat.color.set("#FF4500");
            }
          }
        }
      });
      onLoad?.();
    }
  }, [scene, onLoad]);

  // Auto-compute bounding box for scaling
  const box = useRef(new THREE.Box3());

  return (
    <group ref={group}>
      <Center>
        <primitive
          object={scene.clone()}
          scale={1.8}
          position={[0, -0.3, 0]}
        />
      </Center>
    </group>
  );
}

// ─── SCROLL-REACTIVE SCENE ──────────────────────────
function Scene({ scrollProgress }: { scrollProgress: number }) {
  const mesh = useRef<THREE.Group>(null);
  const [loaded, setLoaded] = useState(false);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    // Rotate based on scroll (full 360° through section)
    mesh.current.rotation.y = scrollProgress * Math.PI * 2;
    // Slight tilt for dynamic feel
    mesh.current.rotation.x = Math.sin(scrollProgress * Math.PI) * 0.08;
  });

  return (
    <>
      {/* Environment & Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-3, 5, -3]}
        intensity={0.6}
        color="#FF4500"
      />
      <pointLight position={[0, 3, 2]} intensity={0.4} color="#FF4500" />

      <group ref={mesh}>
        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.2}>
          <X50Model onLoad={() => setLoaded(true)} />
        </Float>
      </group>

      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.5}
        scale={8}
        blur={2.5}
        far={1}
      />
      <Environment preset="studio" />
    </>
  );
}

// ─── PRELOAD ──────────────────────────────────────────
useGLTF.preload("/models/proton-x50.glb");

// ─── EXPORTED CANVAS ─────────────────────────────────
export default function Car3D({ progress = 0 }: { progress?: number }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [3.5, 1.8, 4], fov: 30 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene scrollProgress={progress} />
      </Canvas>
    </div>
  );
}
