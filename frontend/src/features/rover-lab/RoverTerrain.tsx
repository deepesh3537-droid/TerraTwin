import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getTerrainHeight, SIMULATION_BOULDERS } from './roverPhysics';

interface RoverTerrainProps {
  planet: string;
  waypoint: { x: number; z: number } | null;
  onTerrainClick?: (x: number, z: number) => void;
}

export const RoverTerrain: React.FC<RoverTerrainProps> = ({
  planet,
  waypoint,
  onTerrainClick,
}) => {
  const isMars = planet.toLowerCase() === 'mars';

  // Construct continuous terrain geometry using shared heightmap function
  const terrainGeometry = useMemo(() => {
    const size = 32;
    const segments = 80;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const count = pos.count;
    const colors = new Float32Array(count * 3);

    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      const vy = getTerrainHeight(vx, vz, planet);
      pos.setY(i, vy);

      if (vy < minY) minY = vy;
      if (vy > maxY) maxY = vy;
    }

    geo.computeVertexNormals();

    const rangeY = maxY - minY || 1;

    for (let i = 0; i < count; i++) {
      const vy = pos.getY(i);
      const t = (vy - minY) / rangeY;

      if (isMars) {
        // Martian rusty ferric oxide & basalt
        const r = 0.48 + t * 0.42;
        const g = 0.20 + t * 0.28;
        const b = 0.12 + t * 0.18;
        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
      } else {
        // Lunar titanium regolith & anorthosite
        const v = 0.18 + t * 0.62;
        colors[i * 3] = v;
        colors[i * 3 + 1] = v;
        colors[i * 3 + 2] = v + 0.02;
      }
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [planet, isMars]);

  const boulderColor = isMars ? '#3f1f14' : '#1e293b';

  return (
    <group>
      {/* Planetary Terrain Surface */}
      <mesh
        geometry={terrainGeometry}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          if (onTerrainClick) {
            onTerrainClick(e.point.x, e.point.z);
          }
        }}
      >
        <meshStandardMaterial
          vertexColors
          roughness={isMars ? 0.85 : 0.95}
          metalness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Scattered Obstacle Boulders */}
      {SIMULATION_BOULDERS.map((b) => {
        const bY = getTerrainHeight(b.x, b.z, planet);
        return (
          <group key={b.id} position={[b.x, bY + b.height * 0.35, b.z]}>
            <mesh castShadow receiveShadow rotation={[b.id * 0.4, b.id * 0.7, 0]}>
              <dodecahedronGeometry args={[b.radius, 1]} />
              <meshStandardMaterial
                color={boulderColor}
                roughness={0.92}
                metalness={0.12}
                flatShading
              />
            </mesh>
          </group>
        );
      })}

      {/* Autonomous Navigation Waypoint Pin */}
      {waypoint && (
        <group position={[waypoint.x, getTerrainHeight(waypoint.x, waypoint.z, planet) + 0.1, waypoint.z]}>
          {/* Pulsing Beacon Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.45, 32]} />
            <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
          </mesh>

          {/* Vertical Target Beacon Pole */}
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* Glowing Beacon Orb */}
          <mesh position={[0, 1.8, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#7dd3fc" />
          </mesh>
          <pointLight position={[0, 1.8, 0]} intensity={2.0} distance={4} color="#38bdf8" />
        </group>
      )}

      {/* Simulation Field Circular Perimeter Boundary */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[14.4, 14.6, 64]} />
        <meshBasicMaterial
          color={isMars ? '#ea580c' : '#38bdf8'}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
