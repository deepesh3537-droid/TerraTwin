import React, { useMemo } from 'react';
import * as THREE from 'three';

interface PlanetaryOrbitProps {
  radius: number;
  highlighted?: boolean;
  color?: string;
}

export const PlanetaryOrbit: React.FC<PlanetaryOrbitProps> = ({
  radius,
  highlighted = false,
  color = '#38bdf8',
}) => {
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [radius]);

  return (
    <lineLoop geometry={lineGeometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={highlighted ? 0.65 : 0.18}
        blending={THREE.AdditiveBlending}
        linewidth={highlighted ? 2 : 1}
      />
    </lineLoop>
  );
};
