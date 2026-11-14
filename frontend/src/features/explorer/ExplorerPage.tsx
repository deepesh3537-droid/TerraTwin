import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Layers, MapPin, Eye, Compass } from 'lucide-react';
import { NotConfiguredState } from '@/components/feedback/NotConfiguredState';

interface OutletContextType {
  selectedPlanet: string;
  setSelectedPlanet: (planet: string) => void;
}

export const ExplorerPage: React.FC = () => {
  const { selectedPlanet } = useOutletContext<OutletContextType>();
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const isExtraterrestrial = selectedPlanet === 'moon' || selectedPlanet === 'mars';

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
      {/* Left: Layer Controls & Region Selector */}
      <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
        {/* Layer Panel Card */}
        <div className="p-4 rounded-xl bg-space-900 border border-space-border flex-1 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-space-border mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-white">Planetary Layers</h2>
            </div>
            <span className="text-[10px] font-mono uppercase text-slate-400 bg-space-950 px-2 py-0.5 rounded border border-space-border">
              {selectedPlanet}
            </span>
          </div>

          <div className="text-xs text-slate-400 space-y-2 flex-1 overflow-y-auto">
            <div className="p-3 rounded-lg bg-space-950 border border-space-border">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-300">Terrain Elevation</span>
                <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">Metadata</span>
              </div>
              <p className="text-[11px] text-slate-500">Global DEM elevation grid</p>
            </div>
            <div className="p-3 rounded-lg bg-space-950/60 border border-space-border opacity-60">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-400">Slope & Roughness</span>
                <span className="text-[10px] text-slate-500 bg-space-800 px-1.5 py-0.5 rounded">Unavailable</span>
              </div>
              <p className="text-[11px] text-slate-500">Derived terrain roughness index</p>
            </div>
          </div>
        </div>

        {/* Quick Regions Card */}
        <div className="p-4 rounded-xl bg-space-900 border border-space-border h-48 flex flex-col">
          <div className="flex items-center gap-2 pb-2 border-b border-space-border mb-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-semibold text-white">Regions of Interest</h3>
          </div>
          <div className="space-y-1.5 overflow-y-auto flex-1">
            <button
              onClick={() => setSelectedRegionId('demo-1')}
              className={`w-full text-left p-2 rounded text-xs transition-colors ${
                selectedRegionId === 'demo-1'
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                  : 'text-slate-300 hover:bg-space-800'
              }`}
            >
              Demo Sample Region
            </button>
          </div>
        </div>
      </div>

      {/* Center: Map Canvas Workspace */}
      <div className="flex-1 rounded-xl bg-space-900 border border-space-border relative overflow-hidden flex flex-col">
        {isExtraterrestrial ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-space-950/60">
            <NotConfiguredState
              title={`${selectedPlanet.toUpperCase()} Imagery Not Configured`}
              message={`Map tile imagery is not configured for ${selectedPlanet}.`}
              technicalDetails={`${selectedPlanet.toUpperCase()} uses IAU planetary reference frames rather than Earth EPSG:4326. In accordance with ADR-006, invalid or Earth-projected imagery is never rendered.`}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-space-900 to-space-950">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
              <Compass className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Earth Interactive Workspace</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              PlanetaryMap component boundary. Ready for MapLibre GL adapter integration in Phase 5.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 bg-space-950 px-3 py-1.5 rounded border border-space-border">
              <span>Projection: EPSG:4326 / Web Mercator</span>
            </div>
          </div>
        )}
      </div>

      {/* Right: Region Inspector Panel */}
      <div className="w-full lg:w-80 p-4 rounded-xl bg-space-900 border border-space-border shrink-0 flex flex-col">
        <div className="flex items-center gap-2 pb-3 border-b border-space-border mb-3">
          <Eye className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-semibold text-white">Region Inspector</h2>
        </div>
        {selectedRegionId ? (
          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono">Region Name</span>
              <p className="font-semibold text-white">Demo Sample Region</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono">CRS Identifier</span>
              <p className="font-mono text-sky-400">EPSG:4326</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono">Computed Characteristics</span>
              <p className="text-slate-400 italic">Not yet computed (Phase 5/6)</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500 text-xs">
            <MapPin className="w-8 h-8 mb-2 opacity-40" />
            <p>Select a region on the map to inspect terrain characteristics and provenance.</p>
          </div>
        )}
      </div>
    </div>
  );
};
