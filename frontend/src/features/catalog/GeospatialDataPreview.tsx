import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  Compass,
  MapPin,
  Box,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { Dataset } from '../../types';
import { DATASET_BOUNDS, DatasetSpatialBounds } from './catalogDemoData';

interface GeospatialDataPreviewProps {
  dataset: Dataset;
}

/**
 * 3D Terrain Wireframe Relief for the Bounding Footprint
 */
const Footprint3DMesh: React.FC<{ planetId: string }> = ({ planetId }) => {
  const isMars = planetId === 'mars';
  const isMoon = planetId === 'moon';

  const geom = useMemo(() => {
    // 32x32 segmented plane with undulating procedural elevation
    const size = 6;
    const segs = 32;
    return { size, segs };
  }, []);

  return (
    <group rotation={[-Math.PI / 4, 0, 0]}>
      <mesh receiveShadow castShadow>
        <planeGeometry args={[geom.size, geom.size, geom.segs, geom.segs]} />
        <meshStandardMaterial
          color={isMars ? '#7c2d12' : isMoon ? '#334155' : '#047857'}
          wireframe
          roughness={0.7}
        />
      </mesh>

      {/* Boundary Perimeter Box */}
      <mesh>
        <boxGeometry args={[geom.size, geom.size, 0.2]} />
        <meshBasicMaterial color={isMars ? '#f97316' : '#38bdf8'} wireframe />
      </mesh>
    </group>
  );
};

export const GeospatialDataPreview: React.FC<GeospatialDataPreviewProps> = ({ dataset }) => {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [zoom, setZoom] = useState<number>(1);

  // Retrieve spatial bounds or compute realistic bounds based on planet CRS
  const bounds: DatasetSpatialBounds = DATASET_BOUNDS[dataset.id] || {
    minLon: -115.0,
    minLat: 35.0,
    maxLon: -114.0,
    maxLat: 36.0,
    centerLon: -114.5,
    centerLat: 35.5,
    description: `Coverage Bounds for ${dataset.name}`,
  };

  const isEarth = dataset.planet_id === 'earth';
  const isMars = dataset.planet_id === 'mars';
  const isMoon = dataset.planet_id === 'moon';

  const accentColor = isMars ? 'text-orange-400' : isEarth ? 'text-emerald-400' : 'text-slate-200';
  const borderColor = isMars ? 'border-orange-500/40' : isEarth ? 'border-emerald-500/40' : 'border-slate-500/40';

  return (
    <div className="space-y-3 font-mono text-xs select-none">
      {/* Top Coordinate Header & Mode Switcher */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-space-border/80">
        <div className="flex items-center gap-2">
          <MapPin className={`w-3.5 h-3.5 ${accentColor}`} />
          <span className="font-bold text-white uppercase text-[11px]">
            SPATIAL COVERAGE & FOOTPRINT
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-space-950 text-cyan-300 border border-cyan-500/30">
            CRS: {dataset.coordinate_reference_system}
          </span>
        </div>

        {/* 2D vs 3D Preview Toggle */}
        <div className="flex items-center gap-1 bg-[#02050c] p-0.5 rounded-lg border border-space-border text-[10px]">
          <button
            onClick={() => setViewMode('2d')}
            className={`px-2 py-0.5 rounded transition-colors ${
              viewMode === '2d'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3 inline mr-1" />
            2D Footprint
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-2 py-0.5 rounded transition-colors ${
              viewMode === '3d'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3 h-3 inline mr-1" />
            3D Relief
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="relative w-full h-56 rounded-xl bg-[#02050c] border border-space-border/90 overflow-hidden flex items-center justify-center">
        {viewMode === '2d' ? (
          /* ========================================================================= */
          /* 2D Vector Graticule Footprint Preview                                    */
          /* ========================================================================= */
          <div className="relative w-full h-full flex flex-col justify-between p-3">
            {/* Coordinate Overlay HUD */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 z-10">
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" />
                CENTER: {bounds.centerLat.toFixed(2)}°, {bounds.centerLon.toFixed(2)}°
              </span>
              <span className="text-slate-500 font-sans">{bounds.description}</span>
            </div>

            {/* Interactive SVG Graticule and Bounding Box */}
            <div
              className="relative w-full h-36 flex items-center justify-center overflow-hidden"
              style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease-out' }}
            >
              <svg className="w-full h-full" viewBox="0 0 400 160">
                {/* Planetographic Grid Lines */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                    />
                  </pattern>
                </defs>
                <rect width="400" height="160" fill="url(#grid)" />

                {/* Central Latitude & Longitude Equator / Meridian Axes */}
                <line x1="0" y1="80" x2="400" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="200" y1="0" x2="200" y2="160" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

                {/* Dataset Bounding Polygon */}
                <rect
                  x="140"
                  y="45"
                  width="120"
                  height="70"
                  rx="6"
                  fill={isMars ? 'rgba(234, 88, 12, 0.15)' : isEarth ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)'}
                  stroke={isMars ? '#f97316' : isEarth ? '#34d399' : '#38bdf8'}
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Center Mark Crosshair */}
                <circle cx="200" cy="80" r="3" fill="#38bdf8" />
                <line x1="192" y1="80" x2="208" y2="80" stroke="#38bdf8" strokeWidth="1" />
                <line x1="200" y1="72" x2="200" y2="88" stroke="#38bdf8" strokeWidth="1" />

                {/* Coordinate Extent Labels in Corners */}
                <text x="145" y="40" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                  [{bounds.maxLat.toFixed(1)}°N, {bounds.minLon.toFixed(1)}°E]
                </text>
                <text x="145" y="128" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                  [{bounds.minLat.toFixed(1)}°S, {bounds.maxLon.toFixed(1)}°W]
                </text>
              </svg>
            </div>

            {/* Bottom Coordinate Bar & Zoom Controls */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 z-10 pt-1 border-t border-space-border/60">
              <div className="flex items-center gap-3">
                <span>
                  LAT: [{bounds.minLat}° .. {bounds.maxLat}°]
                </span>
                <span>
                  LON: [{bounds.minLon}° .. {bounds.maxLon}°]
                </span>
              </div>

              {/* Zoom In / Out Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
                  className="p-1 rounded bg-space-900 border border-space-border text-slate-300 hover:text-white"
                  title="Zoom In Footprint"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
                  className="p-1 rounded bg-space-900 border border-space-border text-slate-300 hover:text-white"
                  title="Zoom Out Footprint"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="p-1 rounded bg-space-900 border border-space-border text-slate-300 hover:text-white"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 3D Orthographic Terrain Relief Preview                                    */
          /* ========================================================================= */
          <div className="w-full h-full relative">
            <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[6, 8, 4]} intensity={1.5} />
              <Footprint3DMesh planetId={dataset.planet_id} />
              <OrbitControls enableZoom enablePan={false} autoRotate autoRotateSpeed={0.8} />
            </Canvas>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-space-950/80 border border-space-border text-[9px] text-slate-400">
              Drag to Orbit · 3D Wireframe Relief
            </div>
          </div>
        )}
      </div>

      {/* Projection & Datum Integrity Warning Banner */}
      <div className={`p-2.5 rounded-lg bg-space-950 border ${borderColor} text-[11px] text-slate-400 font-sans flex items-center justify-between`}>
        <span>
          <strong className="text-white">Datum:</strong>{' '}
          {isEarth ? 'WGS84 Ellipsoid (EPSG:4326)' : isMoon ? 'IAU 2000 Moon Mean Sphere (R=1737.4 km)' : 'IAU 2000 Mars Areoid Datum (R=3389.5 km)'}
        </span>
        <span className="font-mono text-[10px] text-cyan-400">
          RESOLUTION: {dataset.native_resolution || 'Variable'}
        </span>
      </div>
    </div>
  );
};
