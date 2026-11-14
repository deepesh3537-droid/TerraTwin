import React, { useMemo } from 'react';
import * as THREE from 'three';

export const StarField: React.FC = () => {
  const { positions, colors } = useMemo(() => {
    const count = 2200;
    const posArray = new Float32Array(count * 3);
    const colArray = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#e0f2fe'), // Pale cyan
      new THREE.Color('#bae6fd'), // Light blue
      new THREE.Color('#fef3c7'), // Pale gold
      new THREE.Color('#fbcfe8'), // Pale violet
    ];

    for (let i = 0; i < count; i++) {
      // Uniform distribution on outer sphere shell
      const radius = 100 + Math.random() * 80;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);

      posArray[i * 3] = radius * sinPhi * Math.cos(theta);
      posArray[i * 3 + 1] = radius * sinPhi * Math.sin(theta);
      posArray[i * 3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colArray[i * 3] = color.r;
      colArray[i * 3 + 1] = color.g;
      colArray[i * 3 + 2] = color.b;
    }

    return { positions: posArray, colors: colArray };
  }, []);

  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.7}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>

      {/* Subtle Distant Nebula Glow Dust */}
      <mesh position={[40, -15, -70]}>
        <sphereGeometry args={[45, 16, 16]} />
        <meshBasicMaterial
          color="#1e1b4b"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[-50, 20, -60]}>
        <sphereGeometry args={[40, 16, 16]} />
        <meshBasicMaterial
          color="#064e3b"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
