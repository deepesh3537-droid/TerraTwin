import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { generateTerrainGeometry, ElevationStats } from './terrainData';

interface TerrainMeshProps {
  planet: string;
  regionId: string;
  wireframe: boolean;
  flatShading: boolean;
  elevationColormap: boolean;
  exaggeration: number;
  onStatsComputed?: (stats: ElevationStats) => void;
}

export const TerrainMesh: React.FC<TerrainMeshProps> = ({
  planet,
  regionId,
  wireframe,
  flatShading,
  elevationColormap,
  exaggeration,
  onStatsComputed,
}) => {
  const { geometry, stats } = useMemo(() => {
    return generateTerrainGeometry(planet, regionId, 64, exaggeration, elevationColormap);
  }, [planet, regionId, exaggeration, elevationColormap]);

  useEffect(() => {
    onStatsComputed?.(stats);
  }, [stats, onStatsComputed]);

  // Clean geometry disposal on unmount or update
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  const p = planet.toLowerCase();
  const gridColor = p === 'mars' ? '#ea580c' : p === 'moon' ? '#94a3b8' : '#0ea5e9';

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Terrain Heightmap Mesh */}
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          wireframe={wireframe}
          flatShading={flatShading}
          roughness={p === 'moon' ? 0.9 : 0.72}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Laboratory Specimen Grid Pedestal */}
      <gridHelper
        args={[10.2, 10, gridColor, '#1e293b']}
        position={[0, -2.2, 0]}
      />

      {/* Laboratory Specimen Bounding Box Wireframe */}
      <lineSegments position={[0, -0.6, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(10.2, 3.2, 10.2)]} />
        <lineBasicMaterial color={gridColor} transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
};
