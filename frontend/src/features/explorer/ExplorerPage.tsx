import React, { useState, useEffect, useCallback } from 'react';
import { Layers, MapPin, Eye, Search, RefreshCw } from 'lucide-react';
import { Layer, Region } from '../../types';
import { getLayers, getRegions } from '../../services';
import { PlanetaryGlobe } from '../globe';
import { RegionInspector } from './RegionInspector';
import { usePlanetaryContext } from '../../app/planetaryContext';

export const ExplorerPage: React.FC = () => {
  const { selectedPlanet } = usePlanetaryContext();

  // Layers state
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerIds, setActiveLayerIds] = useState<Set<string>>(new Set());
  const [loadingLayers, setLoadingLayers] = useState(false);
  const [layersError, setLayersError] = useState<string | null>(null);

  // Regions state
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [regionSearch, setRegionSearch] = useState('');
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [regionsError, setRegionsError] = useState<string | null>(null);

  // Fetch Layers
  const loadLayers = useCallback(async () => {
    setLoadingLayers(true);
    setLayersError(null);
    try {
      const data = await getLayers({ planet: selectedPlanet });
      setLayers(data || []);
      // Clear active layers when planet switches
      setActiveLayerIds(new Set());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load layers.';
      setLayersError(msg);
    } finally {
      setLoadingLayers(false);
    }
  }, [selectedPlanet]);

  // Fetch Regions
  const loadRegions = useCallback(async () => {
    setLoadingRegions(true);
    setRegionsError(null);
    try {
      const data = await getRegions({ planet: selectedPlanet });
      setRegions(data.items || []);
      setSelectedRegion(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load regions.';
      setRegionsError(msg);
    } finally {
      setLoadingRegions(false);
    }
  }, [selectedPlanet]);

  useEffect(() => {
    loadLayers();
    loadRegions();
  }, [loadLayers, loadRegions]);

  const toggleLayer = (layer: Layer) => {
    if (!layer.available) return;
    setActiveLayerIds((prev) => {
      const next = new Set(prev);
      if (next.has(layer.id)) {
        next.delete(layer.id);
      } else {
        next.add(layer.id);
      }
      return next;
    });
  };

  const filteredRegions = regions.filter((r) => {
    if (!regionSearch.trim()) return true;
    const q = regionSearch.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const activeLayers = layers.filter((l) => activeLayerIds.has(l.id));

  return (
    <div className="h-auto lg:h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
      {/* Left Column: Layers and Regions */}
      <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
        {/* Layer Panel Card (TASK-044) */}
        <div className="p-4 rounded-xl bg-space-900 border border-space-border flex-1 flex flex-col max-h-[340px]">
          <div className="flex items-center justify-between pb-3 border-b border-space-border mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-white">Planetary Layers</h2>
            </div>
            <span className="text-[10px] font-mono uppercase text-slate-400 bg-space-950 px-2 py-0.5 rounded border border-space-border">
              {selectedPlanet}
            </span>
          </div>

          <div className="text-xs text-slate-400 space-y-2 flex-1 overflow-y-auto pr-1">
            {loadingLayers ? (
              <p className="text-slate-500 italic p-3 text-center">Loading layers...</p>
            ) : layersError ? (
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30 text-rose-300 text-[11px] flex items-center justify-between">
                <span>{layersError}</span>
                <button onClick={loadLayers} className="p-1 hover:text-white" title="Retry">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : layers.length === 0 ? (
              <p className="text-slate-500 italic p-3 text-center">No layers registered for {selectedPlanet}.</p>
            ) : (
              layers.map((layer) => {
                const isActive = activeLayerIds.has(layer.id);
                return (
                  <div
                    key={layer.id}
                    onClick={() => layer.available && toggleLayer(layer)}
                    className={`p-3 rounded-lg border transition-all ${
                      !layer.available
                        ? 'bg-space-950/40 border-space-border/60 opacity-60 cursor-not-allowed'
                        : isActive
                        ? 'bg-sky-950/20 border-sky-500/40 cursor-pointer shadow-sm'
                        : 'bg-space-950 border-space-border hover:border-slate-700 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isActive}
                          disabled={!layer.available}
                          onChange={() => {}} // Handled by div click
                          className="rounded border-space-border text-sky-500 focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className={`font-medium ${isActive ? 'text-sky-300' : 'text-slate-200'}`}>
                          {layer.name}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          layer.available
                            ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
                            : 'text-slate-500 bg-space-800'
                        }`}
                      >
                        {layer.available ? 'Ready' : 'Not Renderable'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-6 leading-tight">
                      {layer.description || `${layer.variable} layer (${layer.rendering_type})`}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Regions Card (TASK-045) */}
        <div className="p-4 rounded-xl bg-space-900 border border-space-border flex-1 flex flex-col max-h-[340px]">
          <div className="flex items-center justify-between pb-2 border-b border-space-border mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-semibold text-white">Regions of Interest</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">{filteredRegions.length} available</span>
          </div>

          {/* Region Search */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={regionSearch}
              onChange={(e) => setRegionSearch(e.target.value)}
              placeholder="Search regions..."
              className="w-full bg-space-950 border border-space-border text-[11px] rounded-md pl-8 pr-2.5 py-1 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          {/* Region List */}
          <div className="space-y-1 overflow-y-auto flex-1 pr-1">
            {loadingRegions ? (
              <p className="text-slate-500 italic p-2 text-center text-xs">Loading regions...</p>
            ) : regionsError ? (
              <div className="p-2 rounded bg-rose-950/20 border border-rose-900/30 text-rose-300 text-[11px] flex items-center justify-between">
                <span>{regionsError}</span>
                <button onClick={loadRegions} className="p-1 hover:text-white" title="Retry">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : filteredRegions.length === 0 ? (
              <p className="text-slate-500 italic p-3 text-center text-xs">No regions found for {selectedPlanet}.</p>
            ) : (
              filteredRegions.map((region) => {
                const isSelected = selectedRegion?.id === region.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                        : 'text-slate-300 hover:bg-space-800 border border-transparent'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-medium truncate">{region.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        {region.coordinate_reference_system}
                      </div>
                    </div>
                    {region.is_demo && (
                      <span className="text-[9px] font-mono uppercase px-1 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                        Demo
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Center: Planetary 3D Mission Globe & GIS Workspace */}
      <div className="flex-1 min-h-[480px] flex flex-col">
        <PlanetaryGlobe
          planet={selectedPlanet}
          regions={filteredRegions}
          selectedRegion={selectedRegion}
          activeLayers={activeLayers}
          onSelectRegion={(reg) => setSelectedRegion(reg)}
        />
      </div>

      {/* Right Column: Region Inspector Panel (TASK-045) */}
      <div className="w-full lg:w-80 p-4 rounded-xl bg-space-900 border border-space-border shrink-0 flex flex-col">
        <div className="flex items-center gap-2 pb-3 border-b border-space-border mb-3">
          <Eye className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-semibold text-white">Region Inspector</h2>
        </div>

        <RegionInspector
          region={selectedRegion}
          onClose={() => setSelectedRegion(null)}
        />
      </div>
    </div>
  );
};
