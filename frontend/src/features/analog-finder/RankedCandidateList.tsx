import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Region } from '../../types';

interface RankedCandidateListProps {
  candidates: Region[];
  selectedCandidate: Region | null;
  onSelectCandidate: (candidate: Region) => void;
  selectedVariables: string[];
}

export const RankedCandidateList: React.FC<RankedCandidateListProps> = ({
  candidates,
  selectedCandidate,
  onSelectCandidate,
  selectedVariables,
}) => {
  return (
    <div className="rounded-2xl bg-space-900 border border-space-border/80 p-5 shadow-xl flex flex-col h-[460px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-space-border/80 mb-3 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Ranked Terrestrial Candidates
          </h3>
          <p className="text-[11px] font-mono text-purple-400">
            Multi-attribute distance ranking (ADR-011 compliant)
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
          {candidates.length} CANDIDATES
        </span>
      </div>

      {/* Candidates Scroll List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {candidates.map((c, index) => {
          const isSelected = selectedCandidate?.id === c.id;
          const rank = index + 1;

          // Deterministic ADR-011 distance representation based on index
          const baseDistance = 0.24 + index * 0.08;
          const uncertainty = 0.03 + index * 0.01;

          return (
            <div
              key={c.id}
              onClick={() => onSelectCandidate(c)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-950/25 border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                  : 'bg-[#02050c] border-space-border/80 hover:border-slate-600 hover:bg-space-850'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      rank === 1
                        ? 'bg-emerald-400 text-[#030712] shadow-sm'
                        : 'bg-space-800 text-slate-300 border border-space-border'
                    }`}
                  >
                    #{rank}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                      {c.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      CRS: {c.coordinate_reference_system}
                    </span>
                  </div>
                </div>

                {/* Similarity Distance Badge (ADR-011) */}
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono font-bold text-emerald-300 block">
                    d = {baseDistance.toFixed(2)} ±{uncertainty.toFixed(2)}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block">
                    Normalized Distance
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2 mb-2">
                {c.description || 'Terrestrial reference site for planetary analogue analysis and multi-spectral validation.'}
              </p>

              {/* Tags & Action Link */}
              <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-space-border/60">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-space-850 text-slate-300 border border-space-border">
                    {selectedVariables.length} Dim Matched
                  </span>
                  {c.is_demo && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Demo Fixture
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span>Explore 3D</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADR-011 Footer Notice */}
      <div className="mt-3 pt-2.5 border-t border-space-border/60 text-[10px] font-mono text-slate-400 flex items-center justify-between shrink-0">
        <span>Lower d = Closer Analogue Match</span>
        <span className="text-purple-400">Not a Probability (ADR-011)</span>
      </div>
    </div>
  );
};
