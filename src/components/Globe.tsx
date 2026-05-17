"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── GENERATE EARTH TEXTURE (canvas) ───────────────
function createEarthTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d")!;

  // Ocean
  ctx.fillStyle = "#0a1628";
  ctx.fillRect(0, 0, c.width, c.height);

  // Continents (simplified)
  const landColor = "#1a2a4a";
  ctx.fillStyle = landColor;

  // Simplified continent polygons (normalized to 0-1, mapped to canvas)
  const continents: [number, number][][] = [
    // Africa
    [[0.52,0.35],[0.55,0.38],[0.58,0.42],[0.57,0.48],[0.55,0.52],[0.53,0.55],[0.5,0.58],[0.48,0.56],[0.46,0.52],[0.45,0.48],[0.46,0.42],[0.48,0.38],[0.5,0.35]],
    // Europe
    [[0.5,0.2],[0.55,0.18],[0.6,0.2],[0.62,0.25],[0.6,0.28],[0.55,0.3],[0.52,0.28],[0.5,0.25]],
    // Asia
    [[0.6,0.15],[0.7,0.1],[0.85,0.12],[0.95,0.18],[0.95,0.28],[0.9,0.35],[0.85,0.38],[0.8,0.35],[0.75,0.3],[0.7,0.28],[0.65,0.25],[0.62,0.2]],
    // North America
    [[0.05,0.15],[0.15,0.08],[0.28,0.1],[0.32,0.15],[0.3,0.22],[0.25,0.28],[0.18,0.3],[0.1,0.28],[0.05,0.22]],
    // South America
    [[0.2,0.3],[0.28,0.32],[0.3,0.38],[0.28,0.45],[0.22,0.52],[0.18,0.55],[0.15,0.52],[0.15,0.45],[0.18,0.38]],
    // Australia
    [[0.85,0.55],[0.9,0.52],[0.95,0.55],[0.93,0.6],[0.88,0.62],[0.85,0.6]],
    // Malaysia / SE Asia
    [[0.78,0.38],[0.82,0.36],[0.84,0.38],[0.83,0.42],[0.8,0.42]],
    // Indonesia
    [[0.78,0.42],[0.85,0.4],[0.92,0.42],[0.9,0.48],[0.82,0.48],[0.78,0.45]],
  ];

  continents.forEach((poly) => {
    ctx.beginPath();
    const [sx, sy] = poly[0];
    ctx.moveTo(sx * c.width, sy * c.height);
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(poly[i][0] * c.width, poly[i][1] * c.height);
    }
    ctx.closePath();
    ctx.fill();
  });

  // Grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    ctx.arc(c.width / 2, c.height / 2, (i / 18) * c.width * 0.5, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.moveTo((i / 12) * c.width, 0);
    ctx.lineTo((i / 12) * c.width, c.height);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ─── PIN ON MALAYSIA ────────────────────────────────
function MalaysiaPin() {
  const mesh = useRef<THREE.Mesh>(null);

  // Convert lat/lng (Seremban: 2.7248°N, 101.9376°E) to 3D position on sphere
  const pos = useMemo(() => {
    const lat = THREE.MathUtils.degToRad(2.7);
    const lng = THREE.MathUtils.degToRad(101.9);
    const r = 1.02; // slightly above surface
    return new THREE.Vector3(
      r * Math.cos(lat) * Math.sin(lng),
      r * Math.sin(lat),
      r * Math.cos(lat) * Math.cos(lng)
    );
  }, []);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 2) * 0.3);
    }
  });

  return (
    <group position={pos}>
      {/* Outer glow */}
      <mesh>
        <circleGeometry args={[0.08, 16]} />
        <meshBasicMaterial color="#FF4500" transparent opacity={0.4} depthWrite={false} />
      </mesh>
      {/* Pulse ring */}
      <mesh ref={mesh}>
        <ringGeometry args={[0.03, 0.06, 16]} />
        <meshBasicMaterial color="#FF4500" transparent opacity={0.8} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* Center dot */}
      <mesh>
        <circleGeometry args={[0.015, 8]} />
        <meshBasicMaterial color="#FF4500" depthWrite={false} />
      </mesh>
    </group>
  );
}

// ─── SCENE ──────────────────────────────────────────
function Scene() {
  const group = useRef<THREE.Group>(null);
  const earthTex = useMemo(() => createEarthTexture(), []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <directionalLight position={[-3, -1, -3]} intensity={0.5} />

      <group ref={group}>
        {/* Earth */}
        <mesh>
          <sphereGeometry args={[1, 48, 32]} />
          <meshStandardMaterial
            map={earthTex}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Atmosphere glow */}
        <mesh>
          <sphereGeometry args={[1.03, 32, 24]} />
          <meshBasicMaterial
            color="#FF4500"
            transparent
            opacity={0.06}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh>
          <sphereGeometry args={[1.01, 24, 16]} />
          <meshBasicMaterial
            wireframe
            color="rgba(255,69,0,0.08)"
            transparent
          />
        </mesh>

        <MalaysiaPin />
      </group>
    </>
  );
}

// ─── EXPORTED ───────────────────────────────────────
export default function Globe() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0.5, 3.5], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
        <Scene />
      </Canvas>
    </div>
  );
}
