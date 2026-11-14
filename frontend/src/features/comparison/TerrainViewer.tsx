import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  RotateCcw,
  Grid,
  Sparkles,
  Mountain,
  Layers,
} from 'lucide-react';
import { TerrainMesh } from './TerrainMesh';
import { ElevationStats, getElevationStats } from './terrainData';
import { Region } from '../../types';

export interface CameraSyncState {
  source: string;
  position: [number, number, number];
  target: [number, number, number];
}

interface SyncedOrbitControlsProps {
  viewerId: string;
  syncEnabled: boolean;
  syncedCameraState: CameraSyncState | null;
  onCameraUpdate?: (source: string, position: [number, number, number], target: [number, number, number]) => void;
  controlsRef: React.RefObject<OrbitControlsImpl>;
}

const SyncedOrbitControls: React.FC<SyncedOrbitControlsProps> = ({
  viewerId,
  syncEnabled,
  syncedCameraState,
  onCameraUpdate,
  controlsRef,
}) => {
  const { camera } = useThree();
  const isSyncingRef = useRef(false);

  const handleChange = () => {
    if (isSyncingRef.current || !syncEnabled || !onCameraUpdate) return;
    const ctrl = controlsRef.current;
    if (!ctrl) return;

    onCameraUpdate(
      viewerId,
      [camera.position.x, camera.position.y, camera.position.z],
      [ctrl.target.x, ctrl.target.y, ctrl.target.z]
    );
  };

  useEffect(() => {
    if (!syncEnabled || !syncedCameraState || syncedCameraState.source === viewerId) return;
    const ctrl = controlsRef.current;
    if (!ctrl) return;

    isSyncingRef.current = true;
    camera.position.set(...syncedCameraState.position);
    ctrl.target.set(...syncedCameraState.target);
    ctrl.update();
    isSyncingRef.current = false;
  }, [syncedCameraState, syncEnabled, viewerId, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={4}
      maxDistance={25}
      rotateSpeed={0.7}
      zoomSpeed={0.85}
      onChange={handleChange}
    />
  );
};

interface TerrainViewerProps {
  viewerId: string;
  title: string;
  badgeTag: string;
  badgeColor: 'cyan' | 'emerald';
  planet: string;
  region?: Region | null;
  syncEnabled: boolean;
  syncedCameraState: CameraSyncState | null;
  onCameraUpdate?: (source: string, position: [number, number, number], target: [number, number, number]) => void;
}

export const TerrainViewer: React.FC<TerrainViewerProps> = ({
  viewerId,
  title,
  badgeTag,
  badgeColor,
  planet,
  region,
  syncEnabled,
  syncedCameraState,
  onCameraUpdate,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Viewer rendering toggles
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [flatShading, setFlatShading] = useState<boolean>(false);
  const [elevationColormap, setElevationColormap] = useState<boolean>(false);
  const [exaggeration, setExaggeration] = useState<number>(1.5);
  const [stats, setStats] = useState<ElevationStats>(() => getElevationStats(planet));

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const isCyan = badgeColor === 'cyan';
  const accentBorder = isCyan ? 'border-cyan-500/30' : 'border-emerald-500/30';
  const accentText = isCyan ? 'text-cyan-400' : 'text-emerald-400';
  const accentBg = isCyan ? 'bg-cyan-500/10' : 'bg-emerald-500/10';

  return (
    <div className={`relative flex flex-col h-[520px] rounded-2xl bg-[#02050c] border ${accentBorder} overflow-hidden shadow-2xl select-none`}>
      {/* ========================================================================= */}
      {/* Top Header HUD                                                           */}
      {/* ========================================================================= */}
      <div className="absolute top-0 inset-x-0 z-10 p-3 sm:p-4 flex items-start justify-between gap-3 pointer-events-none bg-gradient-to-b from-[#02050c]/90 via-[#02050c]/60 to-transparent">
        <div>
          <div className="flex items-center gap-2 mb-1 pointer-events-auto">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${accentBg} ${accentText} border ${accentBorder}`}>
              {badgeTag}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              [{planet.toUpperCase()}] · {title}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-wide truncate max-w-xs pointer-events-auto">
            {region ? region.name : `Selected ${planet} Region`}
          </h3>
          <p className="text-[10px] font-mono text-slate-400 pointer-events-auto">
            CRS: {region ? region.coordinate_reference_system : 'EPSG:4326'} · {stats.classification}
          </p>
        </div>

        {/* Top Right Tool Bar */}
        <div className="pointer-events-auto flex items-center gap-1 bg-space-950/80 backdrop-blur-md p-1 rounded-xl border border-space-border/80 shadow-lg">
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

          {/* Elevation Colormap Toggle */}
          <button
            onClick={() => setElevationColormap((prev) => !prev)}
            title="Toggle USGS/NASA False-Color Elevation Map"
            className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
              elevationColormap
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
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
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3D Three.js Terrain Canvas                                               */}
      {/* ========================================================================= */}
      <div className="flex-1 w-full h-full relative">
        <Canvas
          camera={{ position: [0, 8.5, 11], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#02050c']} />

          {/* Directional Sun & Ambient Lighting */}
          <directionalLight position={[12, 16, 9]} intensity={2.2} color="#fff8e7" />
          <directionalLight position={[-10, 8, -8]} intensity={0.35} color={isCyan ? '#38bdf8' : '#34d399'} />
          <ambientLight intensity={0.25} color="#0f172a" />

          {/* Interactive Orbit Controls with Sync */}
          <SyncedOrbitControls
            viewerId={viewerId}
            syncEnabled={syncEnabled}
            syncedCameraState={syncedCameraState}
            onCameraUpdate={onCameraUpdate}
            controlsRef={controlsRef}
          />

          {/* 3D Terrain Heightmap Mesh */}
          <TerrainMesh
            planet={planet}
            regionId={region ? region.id : 'default'}
            wireframe={wireframe}
            flatShading={flatShading}
            elevationColormap={elevationColormap}
            exaggeration={exaggeration}
            onStatsComputed={setStats}
          />
        </Canvas>
      </div>

      {/* ========================================================================= */}
      {/* Bottom HUD: Elevation Legend, Exaggeration & Scientific Status           */}
      {/* ========================================================================= */}
      <div className="absolute bottom-0 inset-x-0 z-10 p-3 sm:p-4 bg-gradient-to-t from-[#02050c]/95 via-[#02050c]/70 to-transparent pointer-events-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Elevation Bar & Range Legend */}
          <div className="pointer-events-auto flex items-center gap-3 bg-space-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-space-border/80 text-[11px] font-mono text-slate-300">
            <span className="text-[9px] text-slate-400 uppercase">ELEVATION:</span>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-semibold">{stats.minElevation}m</span>
              <div
                className={`w-16 h-2 rounded-full ${
                  elevationColormap
                    ? 'bg-gradient-to-r from-blue-500 via-emerald-400 via-amber-400 to-rose-400'
                    : isCyan
                    ? 'bg-gradient-to-r from-slate-800 via-slate-500 to-slate-200'
                    : 'bg-gradient-to-r from-emerald-900 via-amber-700 to-slate-200'
                }`}
              />
              <span className="text-emerald-400 font-semibold">+{stats.maxElevation}m</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              Mean: {stats.meanElevation}m
            </span>
          </div>

          {/* Vertical Exaggeration Pills & Illustrative Badge */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Exaggeration Pills */}
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

            {/* Scientific Integrity Indicator (ADR-008) */}
            <div
              title="Illustrative 3D terrain geomorphology derived from planetary classification and coordinate footprint. Formal DEM raster ingestion pending."
              className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-xl bg-space-950/85 backdrop-blur-md border border-amber-500/30 text-[9px] font-mono text-amber-300"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>ILLUSTRATIVE 3D</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
