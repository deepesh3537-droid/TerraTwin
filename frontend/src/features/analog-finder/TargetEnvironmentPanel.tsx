import React from 'react';
import { Radio } from 'lucide-react';
import { Region } from '../../types';
import { TerrainViewer, CameraSyncState } from '../comparison/TerrainViewer';

interface TargetEnvironmentPanelProps {
  selectedPlanet: string;
  onSelectPlanet: (planet: string) => void;
  regions: Region[];
  targetRegion: Region | null;
  onSelectRegion: (regionId: string) => void;
  syncEnabled: boolean;
  syncedCameraState: CameraSyncState | null;
  onCameraUpdate?: (source: string, position: [number, number, number], target: [number, number, number]) => void;
}

export const TargetEnvironmentPanel: React.FC<TargetEnvironmentPanelProps> = ({
  selectedPlanet,
  onSelectPlanet,
  regions,
  targetRegion,
  onSelectRegion,
  syncEnabled,
  syncedCameraState,
  onCameraUpdate,
}) => {
  const isMars = selectedPlanet.toLowerCase() === 'mars';

  return (
    <div className="rounded-2xl bg-space-900 border border-space-border/80 p-5 shadow-xl space-y-4">
      {/* Top Header & Planet Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-space-border/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Target Planetary Environment
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Select exploration destination and target reference site
            </p>
          </div>
        </div>

        {/* Target Body Selector Pills (Moon / Mars) */}
        <div className="flex items-center gap-2 bg-[#02050c] p-1 rounded-xl border border-space-border">
          <button
            type="button"
            onClick={() => onSelectPlanet('moon')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              !isMars
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>MOON (384k km)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPlanet('mars')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              isMars
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>MARS (1.52 AU)</span>
          </button>
        </div>
      </div>

      {/* Target Region Dropdown */}
      <div>
        <label className="block text-[11px] font-mono text-cyan-400 uppercase font-semibold mb-1.5">
          Select Target Area of Interest:
        </label>
        <select
          aria-label="Select Target Planetary Region"
          value={targetRegion?.id || ''}
          onChange={(e) => onSelectRegion(e.target.value)}
          className="w-full bg-[#02050c] border border-cyan-500/30 text-xs rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400/60 transition-colors cursor-pointer"
        >
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              [{r.planet_id.toUpperCase()}] {r.name} — CRS: {r.coordinate_reference_system}
            </option>
          ))}
        </select>
      </div>

      {/* 3D Interactive Target Terrain Viewer */}
      <div className="w-full">
        <TerrainViewer
          viewerId="target-preview"
          title={`${selectedPlanet.toUpperCase()} Target Terrain Preview`}
          badgeTag="TARGET PREVIEW"
          badgeColor="cyan"
          planet={selectedPlanet}
          region={targetRegion}
          syncEnabled={syncEnabled}
          syncedCameraState={syncedCameraState}
          onCameraUpdate={onCameraUpdate}
        />
      </div>

      {/* Geodetic Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-[#02050c] border border-space-border/80">
          <span className="text-[9px] text-slate-400 uppercase block">SPATIAL CRS</span>
          <span className="text-cyan-300 font-bold truncate block">
            {targetRegion?.coordinate_reference_system || (isMars ? 'IAU2000:49900' : 'IAU2000:30100')}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#02050c] border border-space-border/80">
          <span className="text-[9px] text-slate-400 uppercase block">TARGET BODY</span>
          <span className="text-white font-bold uppercase block">{selectedPlanet}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#02050c] border border-space-border/80">
          <span className="text-[9px] text-slate-400 uppercase block">GEOMORPHOLOGY</span>
          <span className="text-slate-300 truncate block">
            {isMars ? 'Volcanic / Rift' : 'Impact Crater Basin'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#02050c] border border-space-border/80">
          <span className="text-[9px] text-slate-400 uppercase block">DATA STATUS</span>
          <span className="text-amber-400 font-semibold truncate block">Footprint Registered</span>
        </div>
      </div>
    </div>
  );
};
