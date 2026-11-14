import React from 'react';
import { MapPin, Globe } from 'lucide-react';
import { Region } from '../../types';
import { PlanetaryMap } from '../../map';

interface CandidateMapProps {
  candidates: Region[];
  selectedCandidate: Region | null;
  onSelectCandidate: (candidate: Region) => void;
}

export const CandidateMap: React.FC<CandidateMapProps> = ({
  candidates,
  selectedCandidate,
  onSelectCandidate,
}) => {
  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#02050c] shadow-xl flex flex-col">
      {/* Top Map HUD */}
      <div className="absolute top-3 inset-x-3 z-10 pointer-events-none flex items-center justify-between">
        <div className="pointer-events-auto bg-space-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-space-border/80 flex items-center gap-2 text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold text-white">TERRESTRIAL ANALOG CANDIDATE MAP</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-300">EPSG:4326 · WGS84</span>
        </div>

        <div className="pointer-events-auto bg-space-950/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-space-border/80 text-[10px] font-mono text-slate-300">
          <span>{candidates.length} Candidate Locations</span>
        </div>
      </div>

      {/* MapLibre GIS Map Canvas */}
      <div className="flex-1 w-full h-full relative">
        <PlanetaryMap
          planet="earth"
          selectedRegion={selectedCandidate}
          activeLayers={[]}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Candidate Pin Bar Overlay */}
      <div className="absolute bottom-3 inset-x-3 z-10 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto p-1.5 rounded-xl bg-space-950/90 backdrop-blur-md border border-space-border/80 shadow-2xl">
          <span className="text-[10px] font-mono text-slate-400 uppercase px-2 shrink-0">
            Candidates:
          </span>
          {candidates.map((c, index) => {
            const isSelected = selectedCandidate?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCandidate(c)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-850 border border-transparent'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isSelected ? 'bg-emerald-400 text-[#030712]' : 'bg-space-800 text-slate-400'
                  }`}
                >
                  #{index + 1}
                </div>
                <span className="truncate max-w-[120px]">{c.name}</span>
                <MapPin className={`w-3 h-3 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
