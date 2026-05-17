"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows, Center } from "@react-three/drei";
import * as THREE from "three";

// Module-level cache — loaded once outside React/Canvas
let cachedScene: THREE.Group | null = null;
let loadingStarted = false;

function startLoading() {
  if (loadingStarted || cachedScene) return;
  loadingStarted = true;
  import("three").then((THREE) =>
    import("three/addons/loaders/GLTFLoader.js").then(({ GLTFLoader }) => {
      const loader = new GLTFLoader();
      loader.load(
        "/models/proton-x50.glb",
        (gltf) => {
          gltf.scene.traverse((child: any) => {
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
          cachedScene = gltf.scene;
        },
        undefined,
        (err: any) => console.error("X50 load failed:", err)
      );
    })
  );
}

// Start loading immediately (outside component lifecycle)
if (typeof window !== "undefined") startLoading();

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

// ─── MODEL ──────────────────────────────────────────
function X50Model() {
  const cloneRef = useRef<THREE.Group | null>(null);

  if (!cachedScene) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#FF4500" />
      </mesh>
    );
  }

  if (!cloneRef.current) {
    cloneRef.current = cachedScene.clone() as THREE.Group;
  }

  return (
    <Center>
      <primitive object={cloneRef.current} scale={0.6} position={[0, -0.1, 0]} />
    </Center>
  );
}

// ─── SCENE ──────────────────────────────────────────
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
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 5]} intensity={3} />
      <directionalLight position={[-3, 5, -3]} intensity={0.8} color="#FF4500" />
      <pointLight position={[0, 3, 2]} intensity={0.6} color="#FF4500" />

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

// ─── EXPORT ─────────────────────────────────────────
export default function Car3D({ progress = 0 }: { progress?: number }) {
  return (
    <div className="w-full h-full" style={{ minHeight: "100%" }}>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
        <Scene scrollProgress={progress} />
      </Canvas>
    </div>
  );
}
