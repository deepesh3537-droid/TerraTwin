import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getMarsTexture } from '../solar-system/textures';

interface MarsGlobeProps {
  autoRotate?: boolean;
}

export const MarsGlobe: React.FC<MarsGlobeProps> = ({ autoRotate = true }) => {
  const marsRef = useRef<THREE.Mesh>(null);
  const marsTexture = useMemo(() => getMarsTexture(), []);

  useFrame((_, delta) => {
    if (autoRotate && marsRef.current) {
      marsRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <group>
      {/* Martian Terrain Sphere */}
      <mesh ref={marsRef}>
        <sphereGeometry args={[1.9, 64, 64]} />
        <meshStandardMaterial
          map={marsTexture}
          roughness={0.8}
          metalness={0.08}
        />
      </mesh>

      {/* Thin CO2 Atmospheric Amber Glow */}
      <mesh>
        <sphereGeometry args={[2.02, 32, 32]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbit/Equatorial Alignment Reticle Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.14, 2.17, 48]} />
        <meshBasicMaterial
          color="#ea580c"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
