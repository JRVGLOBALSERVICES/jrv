"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

function CarView({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.4;
  });

  const cloneRef = useRef<THREE.Group | null>(null);
  if (!cloneRef.current) {
    cloneRef.current = scene.clone() as THREE.Group;
    const box = new THREE.Box3().setFromObject(cloneRef.current);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? 2.5 / maxDim : 1;
    cloneRef.current.scale.setScalar(s);
    cloneRef.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }

  return (
    <Center>
      <group ref={group}>
        <primitive object={cloneRef.current} />
      </group>
    </Center>
  );
}

export default function Fleet3DView({ modelPath }: { modelPath: string }) {
  useGLTF.preload(modelPath);
  return (
    <Canvas camera={{ position: [2.5, 1.5, 3.5], fov: 35 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={2} />
      <directionalLight position={[-3, 5, -3]} intensity={0.5} />
      <CarView path={modelPath} />
      <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={5} blur={2} far={1} />
      <Environment preset="studio" />
    </Canvas>
  );
}
