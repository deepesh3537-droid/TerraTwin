import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getEarthTexture, getEarthCloudTexture } from '../solar-system/textures';

interface EarthGlobeProps {
  autoRotate?: boolean;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({ autoRotate = true }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const earthTexture = useMemo(() => getEarthTexture(), []);
  const cloudsTexture = useMemo(() => getEarthCloudTexture(), []);

  useFrame((_, delta) => {
    if (autoRotate) {
      if (earthRef.current) {
        earthRef.current.rotation.y += delta * 0.04;
      }
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += delta * 0.055; // Clouds drift relative to surface
      }
    }
  });

  return (
    <group>
      {/* Earth Surface Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.28, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>

      {/* Cloud Atmospheric Shell */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.30, 48, 48]} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Atmospheric Rayleigh Scattering Rim Glow */}
      <mesh>
        <sphereGeometry args={[1.37, 32, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
