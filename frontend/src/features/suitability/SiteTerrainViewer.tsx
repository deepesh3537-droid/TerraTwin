import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  RotateCcw,
  Grid,
  Mountain,
  Globe,
  Map as MapIcon,
  Sparkles,
} from 'lucide-react';
import { Region } from '../../types';
import { SuitabilityTerrainMesh, SuitabilityOverlayMode } from './SuitabilityTerrainMesh';
import { ElevationStats, getElevationStats } from '../comparison/terrainData';
import { PlanetaryMap } from '../../map';

interface SiteTerrainViewerProps {
  planet: string;
  region: Region | null;
  overlayMode: SuitabilityOverlayMode;
}

export const SiteTerrainViewer: React.FC<SiteTerrainViewerProps> = ({
  planet,
  region,
  overlayMode,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [flatShading, setFlatShading] = useState<boolean>(false);
  const [exaggeration, setExaggeration] = useState<number>(1.5);
  const [stats, setStats] = useState<ElevationStats>(() => getElevationStats(planet));

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const isMars = planet.toLowerCase() === 'mars';
  const accentBorder = isMars ? 'border-amber-500/40' : 'border-cyan-500/40';
  const accentText = isMars ? 'text-amber-400' : 'text-cyan-400';
  const accentBg = isMars ? 'bg-amber-500/10' : 'bg-cyan-500/10';

  return (
    <div className={`relative flex flex-col h-[520px] rounded-2xl bg-[#02050c] border ${accentBorder} overflow-hidden shadow-2xl select-none`}>
      {/* ========================================================================= */}
      {/* Top Header HUD                                                           */}
      {/* ========================================================================= */}
      <div className="absolute top-0 inset-x-0 z-10 p-3 sm:p-4 flex items-start justify-between gap-3 pointer-events-none bg-gradient-to-b from-[#02050c]/90 via-[#02050c]/60 to-transparent">
        <div>
          <div className="flex items-center gap-2 mb-1 pointer-events-auto">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${accentBg} ${accentText} border ${accentBorder}`}>
              PLANETARY TARGET SITE
            </span>
            <span className="text-[11px] font-mono text-slate-400">[{planet.toUpperCase()}]</span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-wide truncate max-w-sm pointer-events-auto">
            {region ? region.name : `Selected ${planet} Site`}
          </h3>
          <p className="text-[10px] font-mono text-slate-400 pointer-events-auto">
            CRS: {region ? region.coordinate_reference_system : 'IAU2000'} · {stats.classification}
          </p>
        </div>

        {/* Top Right Tool Bar & 2D/3D Toggle */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-space-950/85 backdrop-blur-md p-1 rounded-xl border border-space-border/80 shadow-lg">
          {/* 3D vs 2D Mode Switch */}
          <div className="flex items-center bg-[#02050c] p-0.5 rounded-lg border border-space-border mr-1">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                viewMode === '3d'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>3D Surface</span>
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                viewMode === '2d'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapIcon className="w-3 h-3" />
              <span>2D GIS</span>
            </button>
          </div>

          {viewMode === '3d' && (
            <>
              {/* Wireframe Toggle */}
              <button
                onClick={() => setWireframe((prev) => !prev)}
                title="Toggle Wireframe Mesh"
                className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
                  wireframe
                    ? `${accentBg} ${accentText} border ${accentBorder}`
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>

              {/* Shading Toggle */}
              <button
                onClick={() => setFlatShading((prev) => !prev)}
                title="Toggle Flat / Smooth Shading"
                className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
                  flatShading
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
              </button>

              {/* Reset Camera */}
              <button
                onClick={resetCamera}
                title="Reset Camera View"
                className="p-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Main Canvas / Map View                                                    */}
      {/* ========================================================================= */}
      <div className="flex-1 w-full h-full relative">
        {viewMode === '3d' ? (
          <Canvas
            camera={{ position: [0, 8.5, 11], fov: 42 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          >
            <color attach="background" args={['#02050c']} />

            {/* Directional Sunlight & Fill Light */}
            <directionalLight position={[12, 16, 9]} intensity={2.2} color="#fff8e7" />
            <directionalLight position={[-10, 8, -8]} intensity={0.35} color={isMars ? '#ea580c' : '#38bdf8'} />
            <ambientLight intensity={0.25} color="#0f172a" />

            <OrbitControls
              ref={controlsRef}
              enableDamping
              dampingFactor={0.06}
              minDistance={4}
              maxDistance={25}
              rotateSpeed={0.7}
              zoomSpeed={0.85}
            />

            <SuitabilityTerrainMesh
              planet={planet}
              regionId={region ? region.id : 'default'}
              overlayMode={overlayMode}
              wireframe={wireframe}
              flatShading={flatShading}
              exaggeration={exaggeration}
              onStatsComputed={setStats}
            />
          </Canvas>
        ) : (
          <PlanetaryMap
            planet={planet}
            selectedRegion={region}
            activeLayers={[]}
            className="w-full h-full"
          />
        )}
      </div>

      {/* ========================================================================= */}
      {/* Bottom HUD: Elevation Legend, Exaggeration & ADR-008 Badge                */}
      {/* ========================================================================= */}
      {viewMode === '3d' && (
        <div className="absolute bottom-0 inset-x-0 z-10 p-3 sm:p-4 bg-gradient-to-t from-[#02050c]/95 via-[#02050c]/70 to-transparent pointer-events-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Elevation Bar & Range Legend */}
            <div className="pointer-events-auto flex items-center gap-3 bg-space-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-space-border/80 text-[11px] font-mono text-slate-300">
              <span className="text-[9px] text-slate-400 uppercase">ELEVATION RANGE:</span>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-semibold">{stats.minElevation}m</span>
                <div className="w-16 h-2 rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 to-rose-400" />
                <span className="text-emerald-400 font-semibold">+{stats.maxElevation}m</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                Mean: {stats.meanElevation}m
              </span>
            </div>

            {/* Vertical Exaggeration Pills & Illustrative Badge */}
            <div className="pointer-events-auto flex items-center gap-2">
              <div className="flex items-center gap-1 bg-space-950/85 backdrop-blur-md p-1 rounded-xl border border-space-border/80 text-[10px] font-mono">
                <span className="px-1.5 text-slate-400">VERT:</span>
                {[1.0, 1.5, 2.0, 2.5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setExaggeration(val)}
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      exaggeration === val
                        ? `${accentBg} ${accentText} font-bold border ${accentBorder}`
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {val.toFixed(1)}x
                  </button>
                ))}
              </div>

              <div
                title="Illustrative 3D terrain surface generated from planetary classification and coordinate footprint. Formal DEM raster ingestion pending."
                className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-xl bg-space-950/85 backdrop-blur-md border border-amber-500/30 text-[9px] font-mono text-amber-300"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>ILLUSTRATIVE 3D</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
