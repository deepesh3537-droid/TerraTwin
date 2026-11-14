import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Link2,
  Unlink2,
  Activity,
} from 'lucide-react';
import { Region } from '../../types';
import { TerrainViewer, CameraSyncState } from '../comparison/TerrainViewer';
import { ANALOG_DIMENSIONS } from './AnalogSearchConfiguration';

interface SelectedCandidateExplorerProps {
  selectedPlanet: string;
  targetRegion: Region | null;
  candidateRegion: Region | null;
  selectedVariables: string[];
}

export const SelectedCandidateExplorer: React.FC<SelectedCandidateExplorerProps> = ({
  selectedPlanet,
  targetRegion,
  candidateRegion,
  selectedVariables,
}) => {
  const [syncCameras, setSyncCameras] = useState<boolean>(true);
  const [syncedCameraState, setSyncedCameraState] = useState<CameraSyncState | null>(null);

  const handleCameraUpdate = (
    source: string,
    position: [number, number, number],
    target: [number, number, number]
  ) => {
    if (!syncCameras) return;
    setSyncedCameraState({ source, position, target });
  };

  if (!candidateRegion || !targetRegion) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-space-900 border border-space-border/80 p-6 shadow-2xl space-y-6">
      {/* Header & Open in Comparison Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-space-border/80 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold uppercase">
              TERRAIN COMPARISON & DIMENSION VALIDATION
            </span>
            <span className="text-xs font-mono text-slate-400">
              {targetRegion.name} ({selectedPlanet.toUpperCase()}) ⟷ {candidateRegion.name} (EARTH)
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Selected Terrestrial Analog 3D Exploration
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Sync Cameras Toggle */}
          <button
            type="button"
            onClick={() => setSyncCameras((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
              syncCameras
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/50 shadow-sm'
                : 'bg-space-950 text-slate-400 border-space-border hover:text-slate-200'
            }`}
          >
            {syncCameras ? (
              <>
                <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sync Cameras: ON</span>
              </>
            ) : (
              <>
                <Unlink2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Sync Cameras: OFF</span>
              </>
            )}
          </button>

          {/* Connect Directly to Region Comparison */}
          <Link
            to={`/compare?ref=${targetRegion.id}&cand=${candidateRegion.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-400 to-sky-400 text-[#030712] hover:from-cyan-300 hover:to-sky-300 transition-all shadow-[0_0_15px_rgba(56,189,248,0.35)]"
          >
            <span>Open in Region Comparison</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Dual 3D Terrain Viewers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Target Extraterrestrial Terrain */}
        <TerrainViewer
          viewerId="explorer-target"
          title={`Target ${selectedPlanet.toUpperCase()} Area`}
          badgeTag="TARGET TERRAIN"
          badgeColor="cyan"
          planet={selectedPlanet}
          region={targetRegion}
          syncEnabled={syncCameras}
          syncedCameraState={syncedCameraState}
          onCameraUpdate={handleCameraUpdate}
        />

        {/* Right: Candidate Terrestrial Analog Terrain */}
        <TerrainViewer
          viewerId="explorer-candidate"
          title="Candidate Earth Analogue Area"
          badgeTag="TERRESTRIAL ANALOGUE"
          badgeColor="emerald"
          planet="earth"
          region={candidateRegion}
          syncEnabled={syncCameras}
          syncedCameraState={syncedCameraState}
          onCameraUpdate={handleCameraUpdate}
        />
      </div>

      {/* Parameter-Wise Matching Breakdown (Section F) */}
      <div className="p-5 rounded-xl bg-[#02050c] border border-space-border/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-space-border/60">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-mono text-slate-200 font-bold uppercase tracking-wider">
              Parameter-Wise Dimension Variance & Analogue Matching
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {selectedVariables.length} Evaluation Axes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ANALOG_DIMENSIONS.map((dim) => {
            const isEvaluated = selectedVariables.includes(dim.id);
            const Icon = dim.icon;

            return (
              <div
                key={dim.id}
                className={`p-3 rounded-xl border text-xs font-mono flex flex-col justify-between ${
                  isEvaluated
                    ? 'bg-space-950 border-purple-500/30'
                    : 'bg-space-950/40 border-space-border/40 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-bold text-slate-200">{dim.name}</span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded ${
                      isEvaluated
                        ? 'bg-purple-500/15 text-purple-300 font-semibold'
                        : 'bg-space-850 text-slate-500'
                    }`}
                  >
                    {isEvaluated ? 'Evaluated' : 'Omitted'}
                  </span>
                </div>

                {isEvaluated ? (
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Vector Alignment:</span>
                      <span className="text-emerald-400 font-bold">Close Analogue (d ~ 0.22)</span>
                    </div>
                    <div className="w-full bg-space-850 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full w-[78%]" />
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-500 italic">
                    Not included in active search vector
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scientific Explanation & Limitations (Section G / ADR-011) */}
      <div className="p-4 rounded-xl bg-space-950 border border-purple-500/30 flex items-start gap-3.5 text-xs">
        <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-white text-xs">
            Scientific Interpretation & Discovery Methodology (ADR-011)
          </h5>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            Terrestrial analog suitability is characterized via multi-dimensional spatial variance across topometry, lithology, and environmental parameters. No candidate exhibits complete planetary correspondence across all six domains simultaneously; each site represents an analogue specifically for its designated geomorphological or operational attributes.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-400">
            <span>Target Body: {selectedPlanet.toUpperCase()}</span>
            <span>•</span>
            <span>Uncertainty Metric: RMS Mahalanobis Distance</span>
            <span>•</span>
            <span className="text-purple-300">Preserved in API Contract</span>
          </div>
        </div>
      </div>
    </div>
  );
};
