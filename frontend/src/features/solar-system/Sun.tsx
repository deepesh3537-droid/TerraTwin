import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSunTexture } from './textures';

export const Sun: React.FC = () => {
  const sunMeshRef = useRef<THREE.Mesh>(null);
  const coronaMeshRef = useRef<THREE.Mesh>(null);
  const sunTexture = React.useMemo(() => getSunTexture(), []);

  useFrame((_, delta) => {
    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y += delta * 0.05;
    }
    if (coronaMeshRef.current) {
      coronaMeshRef.current.rotation.y -= delta * 0.02;
      coronaMeshRef.current.rotation.z += delta * 0.01;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Omnidirectional Solar Illuminator */}
      <pointLight
        color="#fff4e0"
        intensity={2.8}
        distance={150}
        decay={1.2}
      />
      <ambientLight color="#1e293b" intensity={0.25} />

      {/* Sun Core Sphere */}
      <mesh ref={sunMeshRef}>
        <sphereGeometry args={[2.5, 48, 48]} />
        <meshBasicMaterial
          map={sunTexture}
          color="#ffcc66"
        />
      </mesh>

      {/* Outer Luminous Atmospheric Corona */}
      <mesh ref={coronaMeshRef}>
        <sphereGeometry args={[2.9, 32, 32]} />
        <meshBasicMaterial
          color="#ff9900"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Subtle Distant Corona Halo */}
      <mesh>
        <sphereGeometry args={[3.4, 24, 24]} />
        <meshBasicMaterial
          color="#ff5500"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
