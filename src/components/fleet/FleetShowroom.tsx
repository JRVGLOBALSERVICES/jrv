"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

// ─── FLEET DATA ─────────────────────────────────────
type FleetCar = {
  name: string;
  price: string;
  type: string;
  model: string | null; // GLB path or null (falls back to image)
};

const FLEET: FleetCar[] = [
  { name: "Perodua Axia G1", price: "RM 110", type: "Hatchback", model: "/models/renault-clio.glb" },
  { name: "Perodua Axia G2", price: "RM 120", type: "Hatchback", model: "/models/car-low-poly.glb" },
  { name: "Proton Exora",    price: "RM 170", type: "MPV · 7 seats", model: "/models/car-low-poly.glb" },
  { name: "Proton X50",      price: "RM 250", type: "SUV",           model: "/models/proton-x50.glb" },
  { name: "Toyota Vios",     price: "RM 170", type: "Sedan",         model: "/models/audi-sedan.glb" },
  { name: "Toyota Yaris",    price: "RM 161", type: "Hatchback",     model: "/models/bmw-m3.glb" },
  { name: "Honda City RS",   price: "RM 170", type: "Hybrid",        model: "/models/volvo-sedan.glb" },
  { name: "Mitsubishi Xpander", price: "RM 350", type: "MPV",        model: "/models/car-low-poly.glb" },
  { name: "Toyota Alphard",  price: "RM 700", type: "Luxury",        model: "/models/audi-sedan.glb" },
];

// Preload all models
FLEET.forEach((c) => { if (c.model) useGLTF.preload(c.model); });

// ─── SINGLE CAR 3D VIEW ─────────────────────────────
function CarView({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  const group = useRef<THREE.Group>(null);
  const scaleRef = useRef(1);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.5;
  });

  // Clone once and compute auto-scale
  const cloneRef = useRef<THREE.Group | null>(null);
  if (!cloneRef.current) {
    cloneRef.current = scene.clone() as THREE.Group;
    cloneRef.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });
    // Compute scale so longest axis = 2.5 units
    const box = new THREE.Box3().setFromObject(cloneRef.current);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    scaleRef.current = maxDim > 0 ? 2.0 / maxDim : 1;
  }

  return (
    <Center>
      <group ref={group}>
        <primitive object={cloneRef.current} scale={scaleRef.current} />
      </group>
    </Center>
  );
}

// ─── SCENE ──────────────────────────────────────────
function Scene({ modelPath }: { modelPath: string }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={2} />
      <directionalLight position={[-3, 5, -3]} intensity={0.5} />
      <CarView modelPath={modelPath} />
      <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={6} blur={2} far={1} />
      <Environment preset="studio" />
    </>
  );
}

// ─── EXPORTED COMPONENT ─────────────────────────────
export default function FleetShowroom({ onBook }: { onBook?: (car: string) => void }) {
  const [index, setIndex] = useState(0);
  const car = FLEET[index];

  const prev = () => setIndex((i) => (i === 0 ? FLEET.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === FLEET.length - 1 ? 0 : i + 1));

  return (
    <section className="relative z-10 py-20 bg-black/60">
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-white">3D Showroom</h2>
          <p className="text-white/40 text-sm mt-1">Browse our fleet in 3D</p>
        </div>

        <div className="relative">
          {/* 3D Canvas */}
          <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-b from-black/80 to-black/40 border border-white/10">
            {car.model ? (
              <Canvas camera={{ position: [2.5, 1.5, 3.5], fov: 35 }} dpr={[1, 1.5]}>
                <Scene modelPath={car.model} />
              </Canvas>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white/20">3D model coming soon</p>
              </div>
            )}
          </div>

          {/* Overlay Info */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">{car.name}</h3>
              <p className="text-white/40 text-xs">{car.type}</p>
            </div>
            <div className="text-right">
              <span className="text-[#FF4500] font-bold text-xl">{car.price}<span className="text-white/20 text-xs">/day</span></span>
              <button
                onClick={() => onBook?.(car.name)}
                className="block mt-1 text-[10px] text-white/50 hover:text-[#FF4500] font-bold uppercase tracking-wider transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Nav Arrows */}
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        </div>

        {/* Dot navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {FLEET.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-[#FF4500] w-6' : 'bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
