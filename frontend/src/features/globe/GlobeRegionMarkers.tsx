import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Region } from '../../types';

interface GlobeRegionMarkersProps {
  regions: Region[];
  selectedRegionId?: string | null;
  planetRadius: number;
  onSelectRegion?: (region: Region) => void;
}

/**
 * Spherical coordinate projection to 3D Cartesian space
 */
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/**
 * Extracts representative [lon, lat] centroid from GeoJSON footprint
 */
function extractCoordinates(footprint: Region['footprint']): [number, number] | null {
  if (!footprint || !footprint.coordinates) return null;

  try {
    if (footprint.type === 'Point') {
      const coords = footprint.coordinates as [number, number];
      return [coords[0], coords[1]];
    }

    if (footprint.type === 'Polygon') {
      const rings = footprint.coordinates as [number, number][][];
      if (rings && rings.length > 0 && rings[0].length > 0) {
        let sumLon = 0;
        let sumLat = 0;
        const ring = rings[0];
        for (let i = 0; i < ring.length; i++) {
          sumLon += ring[i][0];
          sumLat += ring[i][1];
        }
        return [sumLon / ring.length, sumLat / ring.length];
      }
    }
  } catch {
    return null;
  }
  return null;
}

export const GlobeRegionMarkers: React.FC<GlobeRegionMarkersProps> = ({
  regions,
  selectedRegionId,
  planetRadius,
  onSelectRegion,
}) => {
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  return (
    <group>
      {regions.map((region) => {
        const coords = extractCoordinates(region.footprint);
        if (!coords) return null;

        const [lon, lat] = coords;
        const markerPos = latLonToVector3(lat, lon, planetRadius * 1.02);
        const isSelected = selectedRegionId === region.id;
        const isHovered = hoveredRegionId === region.id;
        const active = isSelected || isHovered;

        // Calculate normal vector pointing out from planet center for orientation
        const normal = markerPos.clone().normalize();
        const lookTarget = markerPos.clone().add(normal);

        return (
          <group
            key={region.id}
            position={markerPos}
            onClick={(e) => {
              e.stopPropagation();
              onSelectRegion?.(region);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredRegionId(region.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredRegionId(null);
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Surface Pulse Ring */}
            <mesh
              rotation={new THREE.Euler(0, 0, 0)}
              onUpdate={(self) => self.lookAt(lookTarget)}
            >
              <ringGeometry args={[0.04, active ? 0.12 : 0.08, 24]} />
              <meshBasicMaterial
                color={isSelected ? '#38bdf8' : isHovered ? '#34d399' : '#0ea5e9'}
                transparent
                opacity={active ? 0.9 : 0.6}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing Beacon Pin */}
            <mesh position={[0, 0, 0.05]} onUpdate={(self) => self.lookAt(lookTarget)}>
              <sphereGeometry args={[active ? 0.045 : 0.03, 16, 16]} />
              <meshBasicMaterial
                color={isSelected ? '#ffffff' : isHovered ? '#6ee7b7' : '#38bdf8'}
              />
            </mesh>

            {/* Floating Scientific Name Label */}
            {active && (
              <Html
                position={[0, 0.12, 0]}
                center
                distanceFactor={7}
                className="pointer-events-none select-none transition-all duration-200"
              >
                <div
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono border backdrop-blur-md shadow-xl whitespace-nowrap ${
                    isSelected
                      ? 'bg-sky-950/95 text-sky-200 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                      : 'bg-space-950/90 text-slate-100 border-slate-600'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span>{region.name}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>CRS: {region.coordinate_reference_system}</span>
                    <span>|</span>
                    <span>Lat: {lat.toFixed(1)}° Lon: {lon.toFixed(1)}°</span>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
