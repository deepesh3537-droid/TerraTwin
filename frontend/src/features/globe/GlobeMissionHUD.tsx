import React from 'react';
import { RotateCcw, Play, Pause, Globe, Map as MapIcon, Compass } from 'lucide-react';

interface GlobeMissionHUDProps {
  planet: string;
  viewMode: 'globe' | 'gis';
  autoRotate: boolean;
  regionCount: number;
  onToggleViewMode: (mode: 'globe' | 'gis') => void;
  onToggleAutoRotate: () => void;
  onResetCamera: () => void;
}

const planetEphemeris: Record<
  string,
  {
    radius: string;
    gravity: string;
    dayLength: string;
    temp: string;
    crs: string;
    velocity: string;
  }
> = {
  earth: {
    radius: '6,371.0 km',
    gravity: '9.81 m/s²',
    dayLength: '24h 00m',
    temp: '288 K (15°C)',
    crs: 'EPSG:4326',
    velocity: '29.78 km/s',
  },
  moon: {
    radius: '1,737.4 km',
    gravity: '1.62 m/s²',
    dayLength: '708h 44m',
    temp: '220 K (-53°C)',
    crs: 'IAU2000:30100',
    velocity: '1.02 km/s',
  },
  mars: {
    radius: '3,389.5 km',
    gravity: '3.72 m/s²',
    dayLength: '24h 39m (Sol)',
    temp: '210 K (-63°C)',
    crs: 'IAU2000:49900',
    velocity: '24.07 km/s',
  },
};

export const GlobeMissionHUD: React.FC<GlobeMissionHUDProps> = ({
  planet,
  viewMode,
  autoRotate,
  regionCount,
  onToggleViewMode,
  onToggleAutoRotate,
  onResetCamera,
}) => {
  const ephemeris = planetEphemeris[planet.toLowerCase()] || planetEphemeris.earth;
  const planetName = planet.toUpperCase();

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-4 text-xs font-mono">
      {/* Top Bar HUD */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        {/* Left: Planetary Mission Status */}
        <div className="pointer-events-auto bg-space-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-space-border/80 shadow-lg flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-bold text-white tracking-wider">{planetName}</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-cyan-300">{ephemeris.crs}</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-[11px] text-slate-400">
            {planet === 'earth' ? 'TERRESTRIAL ANALOG BASE' : 'ANALOG TARGET BODY'}
          </span>
        </div>

        {/* Right: View Mode Toggle (3D Globe vs 2D GIS Map) */}
        <div className="pointer-events-auto bg-space-950/90 backdrop-blur-md p-1 rounded-xl border border-space-border/80 shadow-lg flex items-center gap-1">
          <button
            onClick={() => onToggleViewMode('globe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              viewMode === 'globe'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Mission Globe</span>
          </button>
          <button
            onClick={() => onToggleViewMode('gis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              viewMode === 'gis'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>2D GIS Canvas</span>
          </button>
        </div>
      </div>

      {/* Bottom Bar HUD */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        {/* Left: Scientific Ephemeris Constants */}
        <div className="pointer-events-auto hidden md:flex items-center gap-4 bg-space-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-space-border/80 shadow-lg text-[11px]">
          <div>
            <span className="text-slate-500 block text-[9px]">RADIUS</span>
            <span className="text-slate-200">{ephemeris.radius}</span>
          </div>
          <div className="border-l border-space-border/60 pl-3">
            <span className="text-slate-500 block text-[9px]">GRAVITY</span>
            <span className="text-slate-200">{ephemeris.gravity}</span>
          </div>
          <div className="border-l border-space-border/60 pl-3">
            <span className="text-slate-500 block text-[9px]">ROTATION</span>
            <span className="text-slate-200">{ephemeris.dayLength}</span>
          </div>
          <div className="border-l border-space-border/60 pl-3">
            <span className="text-slate-500 block text-[9px]">ORBITAL VEL</span>
            <span className="text-slate-200">{ephemeris.velocity}</span>
          </div>
        </div>

        {/* Right: Camera & Rotation Controls */}
        <div className="pointer-events-auto flex items-center gap-2 bg-space-950/90 backdrop-blur-md p-1.5 rounded-xl border border-space-border/80 shadow-lg">
          {viewMode === 'globe' && (
            <>
              <button
                onClick={onToggleAutoRotate}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition-colors"
                title={autoRotate ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
                aria-label={autoRotate ? 'Pause Rotation' : 'Start Rotation'}
              >
                {autoRotate ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={onResetCamera}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition-colors"
                title="Reset Camera Orientation"
                aria-label="Reset Camera"
              >
                <RotateCcw className="w-4 h-4 text-slate-300" />
              </button>
              <span className="text-slate-600">|</span>
            </>
          )}

          <div className="flex items-center gap-1.5 px-2 text-[11px] text-slate-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{regionCount} {regionCount === 1 ? 'Region' : 'Regions'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
