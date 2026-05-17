"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows, Center } from "@react-three/drei";
import * as THREE from "three";

// ─── PROPS ──────────────────────────────────────────
interface Car3DProps {
  progress?: number;
  scene?: THREE.Group | null;
}

// ─── CAMERA ─────────────────────────────────────────
function CameraManager() {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const isMobile = size.width < 600;
    cam.position.set(isMobile ? 6 : 4.5, isMobile ? 2.5 : 2.5, isMobile ? 10 : 6);
    cam.far = 100;
    cam.near = 0.05;
    cam.fov = isMobile ? 55 : 40;
    cam.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

// ─── MODEL (receives pre-loaded scene) ──────────────
function X50Model({ scene }: { scene: THREE.Group }) {
  // Clone to avoid shared mutations
  const clone = useRef<THREE.Group | null>(null);

  if (!clone.current) {
    clone.current = scene.clone() as THREE.Group;
    clone.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const mat = child.material as THREE.MeshStandardMaterial;
      if (mat && mat.name === "00 - BODY") {
        mat.color.set("#FF4500");
        mat.metalness = 0.6;
        mat.roughness = 0.3;
      }
    });
  }

  return (
    <Center>
      <primitive object={clone.current} scale={0.6} position={[0, -0.1, 0]} />
    </Center>
  );
}

// ─── SCENE ──────────────────────────────────────────
function Scene({ scrollProgress, scene }: { scrollProgress: number; scene: THREE.Group | null }) {
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
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 8, 5]} intensity={2.5} />
      <directionalLight position={[-3, 5, -3]} intensity={0.8} color="#FF4500" />
      <pointLight position={[0, 3, 2]} intensity={0.6} color="#FF4500" />

      <group ref={mesh}>
        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
          {scene ? (
            <X50Model scene={scene} />
          ) : (
            // Fallback: orange box so it's never blank
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color="#FF4500" />
            </mesh>
          )}
        </Float>
      </group>

      <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={8} blur={2.5} far={1} />
      <Environment preset="studio" />
    </>
  );
}

// ─── LOADER (outside Canvas) ─────────────────────────
function ModelLoader({ onReady }: { onReady: (s: THREE.Group) => void }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    import("three").then((THREE) => {
      import("three/addons/loaders/GLTFLoader.js").then(({ GLTFLoader }) => {
        const loader = new GLTFLoader();
        loader.load(
          "/models/proton-x50.glb",
          (gltf) => {
            if (!cancelled) {
              onReady(gltf.scene);
              setLoading(false);
            }
          },
          undefined,
          (err) => {
            console.error("GLTF load failed:", err);
            setLoading(false);
          }
        );
      });
    });

    return () => { cancelled = true; };
  }, [onReady]);

  return null;
}

// ─── EXPORTED COMPONENT ─────────────────────────────
export default function Car3D({ progress = 0, scene }: Car3DProps) {
  const [myScene, setMyScene] = useState<THREE.Group | null>(scene || null);

  useEffect(() => {
    if (scene) setMyScene(scene);
  }, [scene]);

  const handleReady = (s: THREE.Group) => {
    s.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat && mat.name === "00 - BODY") {
          mat.color.set("#FF4500");
          mat.metalness = 0.6;
          mat.roughness = 0.3;
        }
      }
    });
    setMyScene(s);
  };

  return (
    <div className="w-full h-full" style={{ minHeight: '100%' }}>
      <ModelLoader onReady={handleReady} />
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
        <Scene scrollProgress={progress} scene={myScene} />
      </Canvas>
    </div>
  );
}
