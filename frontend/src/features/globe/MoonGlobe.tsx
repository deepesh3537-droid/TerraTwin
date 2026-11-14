import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getMoonTexture } from '../solar-system/textures';

interface MoonGlobeProps {
  autoRotate?: boolean;
}

export const MoonGlobe: React.FC<MoonGlobeProps> = ({ autoRotate = true }) => {
  const moonRef = useRef<THREE.Mesh>(null);
  const moonTexture = useMemo(() => getMoonTexture(), []);

  useFrame((_, delta) => {
    if (autoRotate && moonRef.current) {
      moonRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group>
      {/* Airless Lunar Surface Sphere */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[1.85, 64, 64]} />
        <meshStandardMaterial
          map={moonTexture}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Orbit/Equatorial Alignment Reticle Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.08, 2.11, 48]} />
        <meshBasicMaterial
          color="#94a3b8"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
