"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAPS_URL = "https://www.google.com/maps/dir/?api=1&destination=51%2C%20Jalan%20S2%20B18%2C%20Seremban%202%2C%20Negeri%20Sembilan";

// ─── EARTH TEXTURE ──────────────────────────────────
function createEarthTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0a1628";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = "#1a2a4a";
  const continents: [number, number][][] = [
    [[0.52,0.35],[0.55,0.38],[0.58,0.42],[0.57,0.48],[0.55,0.52],[0.53,0.55],[0.5,0.58],[0.48,0.56],[0.46,0.52],[0.45,0.48],[0.46,0.42],[0.48,0.38],[0.5,0.35]],
    [[0.5,0.2],[0.55,0.18],[0.6,0.2],[0.62,0.25],[0.6,0.28],[0.55,0.3],[0.52,0.28],[0.5,0.25]],
    [[0.6,0.15],[0.7,0.1],[0.85,0.12],[0.95,0.18],[0.95,0.28],[0.9,0.35],[0.85,0.38],[0.8,0.35],[0.75,0.3],[0.7,0.28],[0.65,0.25],[0.62,0.2]],
    [[0.05,0.15],[0.15,0.08],[0.28,0.1],[0.32,0.15],[0.3,0.22],[0.25,0.28],[0.18,0.3],[0.1,0.28],[0.05,0.22]],
    [[0.2,0.3],[0.28,0.32],[0.3,0.38],[0.28,0.45],[0.22,0.52],[0.18,0.55],[0.15,0.52],[0.15,0.45],[0.18,0.38]],
    [[0.85,0.55],[0.9,0.52],[0.95,0.55],[0.93,0.6],[0.88,0.62],[0.85,0.6]],
    [[0.78,0.38],[0.82,0.36],[0.84,0.38],[0.83,0.42],[0.8,0.42]],
    [[0.78,0.42],[0.85,0.4],[0.92,0.42],[0.9,0.48],[0.82,0.48],[0.78,0.45]],
  ];
  continents.forEach((poly) => {
    ctx.beginPath();
    const [sx, sy] = poly[0];
    ctx.moveTo(sx * c.width, sy * c.height);
    for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0] * c.width, poly[i][1] * c.height);
    ctx.closePath();
    ctx.fill();
  });

  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 18; i++) { ctx.beginPath(); ctx.arc(c.width/2, c.height/2, (i/18)*c.width*0.5, 0, Math.PI*2); ctx.stroke(); }
  for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo((i/12)*c.width, 0); ctx.lineTo((i/12)*c.width, c.height); ctx.stroke(); }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ─── MALAYSIA PIN ───────────────────────────────────
function MalaysiaPin({ spinning }: { spinning: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => {
    const lat = THREE.MathUtils.degToRad(2.7);
    const lng = THREE.MathUtils.degToRad(101.9);
    const r = 1.02;
    return new THREE.Vector3(r*Math.cos(lat)*Math.sin(lng), r*Math.sin(lat), r*Math.cos(lat)*Math.cos(lng));
  }, []);

  useFrame(({ clock }) => {
    if (mesh.current) {
      const speed = spinning ? 5 : 2;
      mesh.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * speed) * 0.3);
    }
  });

  return (
    <group position={pos}>
      <mesh><circleGeometry args={[0.08, 16]} /><meshBasicMaterial color="#FF4500" transparent opacity={0.4} depthWrite={false} /></mesh>
      <mesh ref={mesh}><ringGeometry args={[0.03, 0.06, 16]} /><meshBasicMaterial color="#FF4500" transparent opacity={0.8} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      <mesh><circleGeometry args={[0.015, 8]} /><meshBasicMaterial color="#FF4500" depthWrite={false} /></mesh>
    </group>
  );
}

// ─── SCENE ──────────────────────────────────────────
function Scene({ spinning, onSpinDone }: { spinning: boolean; onSpinDone: () => void }) {
  const group = useRef<THREE.Group>(null);
  const earthTex = useMemo(() => createEarthTexture(), []);
  const spinSpeed = useRef(0.15);
  const spinAccum = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    if (spinning) {
      spinSpeed.current = 15; // Fast spin
      spinAccum.current += delta;
      if (spinAccum.current > 1.5) {
        onSpinDone();
        spinSpeed.current = 0.15;
        spinAccum.current = 0;
      }
    }
    group.current.rotation.y += delta * spinSpeed.current;
  });

  const handleClick = useCallback(() => {
    if (!spinning) {
      onSpinDone(); // This triggers the parent to open maps
    }
  }, [spinning, onSpinDone]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <directionalLight position={[-3, -1, -3]} intensity={0.5} />

      <group ref={group} onClick={handleClick}>
        <mesh><sphereGeometry args={[1, 48, 32]} /><meshStandardMaterial map={earthTex} metalness={0.3} roughness={0.7} /></mesh>
        <mesh><sphereGeometry args={[1.03, 32, 24]} /><meshBasicMaterial color="#FF4500" transparent opacity={0.06} side={THREE.BackSide} /></mesh>
        <mesh><sphereGeometry args={[1.01, 24, 16]} /><meshBasicMaterial color="rgba(255,69,0,0.08)" transparent wireframe /></mesh>
        <MalaysiaPin spinning={spinning} />
      </group>
    </>
  );
}

// ─── EXPORTED ───────────────────────────────────────
export default function Globe() {
  const [spinning, setSpinning] = useState(false);

  const handleSpinDone = useCallback(() => {
    window.open(MAPS_URL, "_blank");
    setSpinning(false);
  }, []);

  return (
    <div
      className="w-full h-full cursor-pointer select-none"
      onClick={() => {
        if (!spinning) {
          setSpinning(true);
        }
      }}
    >
      <Canvas camera={{ position: [0, 0.5, 5], fov: 30 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
        <Scene spinning={spinning} onSpinDone={handleSpinDone} />
      </Canvas>
    </div>
  );
}
