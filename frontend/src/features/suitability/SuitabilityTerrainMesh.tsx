import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { generateTerrainGeometry, ElevationStats } from '../comparison/terrainData';

export type SuitabilityOverlayMode =
  | 'none'
  | 'elevation'
  | 'slope'
  | 'hazards'
  | 'illumination'
  | 'isru'
  | 'comms'
  | 'composite';

interface SuitabilityTerrainMeshProps {
  planet: string;
  regionId: string;
  overlayMode: SuitabilityOverlayMode;
  wireframe: boolean;
  flatShading: boolean;
  exaggeration: number;
  onStatsComputed?: (stats: ElevationStats) => void;
}

export const SuitabilityTerrainMesh: React.FC<SuitabilityTerrainMeshProps> = ({
  planet,
  regionId,
  overlayMode,
  wireframe,
  flatShading,
  exaggeration,
  onStatsComputed,
}) => {
  // Generate base 3D terrain geometry
  const { geometry, stats } = useMemo(() => {
    return generateTerrainGeometry(
      planet,
      regionId,
      64,
      exaggeration,
      overlayMode === 'elevation'
    );
  }, [planet, regionId, exaggeration, overlayMode]);

  useEffect(() => {
    onStatsComputed?.(stats);
  }, [stats, onStatsComputed]);

  // Compute specialized scientific overlay vertex colors based on physical surface normals & altimetry
  const overlayGeometry = useMemo(() => {
    const geo = geometry.clone();
    if (overlayMode === 'none' || overlayMode === 'elevation') {
      return geo;
    }

    const posAttr = geo.attributes.position;
    const normAttr = geo.attributes.normal;
    const count = posAttr.count;
    const colors = new Float32Array(count * 3);

    // Compute min and max Y for relative elevation calculations
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i);
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const rangeY = maxY - minY || 1;
    const meanY = (minY + maxY) / 2;

    // Simulated low-angle planetary solar illumination vector
    const sunVector = new THREE.Vector3(0.65, 0.35, 0.68).normalize();

    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i);
      const nx = normAttr.getX(i);
      const ny = normAttr.getY(i);
      const nz = normAttr.getZ(i);

      const normal = new THREE.Vector3(nx, ny, nz).normalize();

      // Slope angle relative to horizontal plane in degrees: theta = acos(normal.y)
      const cosSlope = Math.max(0, Math.min(1, normal.y));
      const slopeDeg = Math.acos(cosSlope) * (180 / Math.PI);

      // Solar exposure dot product
      const solarExposure = Math.max(0, normal.dot(sunVector));

      // Elevation ratio [0, 1]
      const relY = (y - minY) / rangeY;

      let c = new THREE.Color();

      if (overlayMode === 'slope') {
        // Green: < 5° (favorable landing slope)
        // Yellow: 5° - 15° (moderate incline)
        // Red: >= 15° (steep / hazardous terrain)
        if (slopeDeg < 5) {
          c.setRGB(0.12, 0.78, 0.36); // Green favorable
        } else if (slopeDeg < 15) {
          const t = (slopeDeg - 5) / 10;
          c.setRGB(0.92, 0.72 - t * 0.2, 0.15); // Yellow/Amber moderate
        } else {
          c.setRGB(0.94, 0.22, 0.22); // Red hazard
        }
      } else if (overlayMode === 'hazards') {
        // Landing Hazards: steep scarps or crater rim crests
        if (slopeDeg >= 14 || (relY > 0.85 && slopeDeg > 10)) {
          c.setRGB(0.94, 0.22, 0.22); // Unfavorable hazard zone (red)
        } else if (slopeDeg > 7) {
          c.setRGB(0.92, 0.68, 0.15); // Moderate cautionary buffer (amber)
        } else {
          c.setRGB(0.12, 0.78, 0.36); // Safe touchdown corridor (green)
        }
      } else if (overlayMode === 'illumination') {
        // Solar Exposure: direct sunlight vs penumbra vs permanently shadowed regions (PSRs)
        if (solarExposure > 0.35) {
          // Sunlit peak / ridge (gold/amber)
          c.setRGB(0.98, 0.82, 0.28);
        } else if (solarExposure > 0.1) {
          // Penumbra / intermittent exposure
          c.setRGB(0.65, 0.52, 0.22);
        } else {
          // Permanently Shadowed Region (PSR / cold trap - dark indigo)
          c.setRGB(0.12, 0.14, 0.32);
        }
      } else if (overlayMode === 'isru') {
        // In-Situ Resources (ISRU): Cold trap volatiles & polar water ice indicators in deep depression shadowed basins
        if (y < meanY - 0.15 * rangeY && solarExposure < 0.18) {
          // High-concentration volatile ice trap (electric cyan-blue)
          c.setRGB(0.15, 0.75, 0.98);
        } else if (y < meanY && solarExposure < 0.3) {
          // Secondary permafrost/regolith hydration
          c.setRGB(0.12, 0.45, 0.65);
        } else {
          // Dry desiccated highland regolith (slate grey)
          c.setRGB(0.32, 0.35, 0.38);
        }
      } else if (overlayMode === 'comms') {
        // Direct-to-Earth Line of Sight: High elevation vantage points with unobstructed line of sight
        if (y > meanY + 0.15 * rangeY && slopeDeg < 18) {
          // Continuous direct communication line of sight (bright electric blue)
          c.setRGB(0.22, 0.72, 0.98);
        } else if (y >= meanY - 0.1 * rangeY) {
          // Relay-dependent communication zone
          c.setRGB(0.42, 0.48, 0.58);
        } else {
          // Comms shadow / topographic occlusion (dark slate)
          c.setRGB(0.20, 0.22, 0.26);
        }
      } else if (overlayMode === 'composite') {
        // Multi-Criteria Suitability Zoning:
        // Safe slope (< 8°) + adequate solar illumination (> 0.15) + comms visibility
        const isSafeSlope = slopeDeg < 8;
        const hasSun = solarExposure > 0.15;
        const hasComms = y > meanY - 0.1 * rangeY;

        if (isSafeSlope && hasSun && hasComms) {
          // Prime Habitat & Landing Site (optimal green)
          c.setRGB(0.12, 0.78, 0.36);
        } else if (slopeDeg < 15 && (hasSun || hasComms)) {
          // Secondary Suitability Zone (transition amber)
          c.setRGB(0.92, 0.68, 0.15);
        } else {
          // Restricted / Unsuitable Area (hazard red)
          c.setRGB(0.92, 0.22, 0.22);
        }
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [geometry, overlayMode]);

  // Clean disposal
  useEffect(() => {
    return () => {
      overlayGeometry.dispose();
      geometry.dispose();
    };
  }, [overlayGeometry, geometry]);

  const p = planet.toLowerCase();
  const gridColor = p === 'mars' ? '#ea580c' : p === 'moon' ? '#94a3b8' : '#0ea5e9';

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Terrain Heightmap with Dynamic Scientific Overlay */}
      <mesh geometry={overlayGeometry} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          wireframe={wireframe}
          flatShading={flatShading}
          roughness={overlayMode === 'none' ? 0.75 : 0.65}
          metalness={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Laboratory Specimen Grid Pedestal */}
      <gridHelper args={[10.2, 10, gridColor, '#1e293b']} position={[0, -2.2, 0]} />

      {/* Specimen Boundary Box Wireframe */}
      <lineSegments position={[0, -0.6, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(10.2, 3.2, 10.2)]} />
        <lineBasicMaterial color={gridColor} transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
};
