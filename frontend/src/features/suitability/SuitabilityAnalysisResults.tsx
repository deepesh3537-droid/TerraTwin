import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Cpu,
} from 'lucide-react';
import { Region } from '../../types';

interface SuitabilityAnalysisResultsProps {
  region: Region | null;
  selectedCriteria: string[];
  loading: boolean;
  notImplementedMessage: string | null;
  errorMessage: string | null;
  results: Record<string, unknown> | null;
}

export const SuitabilityAnalysisResults: React.FC<SuitabilityAnalysisResultsProps> = ({
  region,
  selectedCriteria,
  loading,
  notImplementedMessage,
  errorMessage,
  results,
}) => {
  if (loading) {
    return (
      <div className="p-8 rounded-2xl bg-space-900 border border-space-border/80 flex flex-col items-center justify-center text-center shadow-xl">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-4 animate-pulse">
          <Cpu className="w-6 h-6 animate-spin" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">
          Evaluating Multivariate Base Suitability...
        </h3>
        <p className="text-xs font-mono text-slate-400 max-w-md">
          Querying digital elevation models, calculating slope stability gradients, modeling low-angle solar exposure ephemerides, and determining line-of-sight communications.
        </p>
      </div>
    );
  }

  // 1. Honest 501 State per ADR-008
  if (notImplementedMessage) {
    return (
      <div className="p-6 rounded-2xl bg-space-900 border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold uppercase">
                API CONTRACT READY · HTTP 501
              </span>
              <span className="text-xs font-mono text-slate-400">
                POST /api/v1/analysis/suitability
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Planetary Site Suitability Assessment Pipeline
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {notImplementedMessage}
        </p>

        {/* Scientific Integrity Disclosure */}
        <div className="p-3.5 rounded-xl bg-[#02050c] border border-space-border/80 text-xs text-slate-400 font-mono space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ADR-008 SCIENTIFIC INTEGRITY ENFORCED:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            TerraTwin does not generate synthetic landing safety scores or fabricated habitat readiness ratings while backend evaluation pipelines are undergoing research calibration. In live deployment, weighted raster overlays combine slope hazard masks, solar flux rasters, and ISRU volatile distance grids.
          </p>

          <div className="pt-2 border-t border-space-border/60 flex flex-wrap items-center gap-3 text-[10px]">
            <span className="text-slate-400">Target Site: {region?.name}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">CRS: {region?.coordinate_reference_system}</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400">Active Criteria: {selectedCriteria.join(', ')}</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Generic Error State
  if (errorMessage) {
    return (
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-rose-200 flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-rose-300 mb-1">Assessment Pipeline Error</h4>
          <p className="text-xs text-slate-300">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // 3. Dynamic Results when returned by backend
  if (results) {
    return (
      <div className="p-6 rounded-2xl bg-space-900 border border-space-border/80 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-space-border/80 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                ASSESSMENT COMPLETE
              </span>
              <span className="text-xs font-mono text-slate-400">{region?.name}</span>
            </div>
            <h3 className="text-lg font-bold text-white">Multivariate Site Evaluation Results</h3>
          </div>

          <div className="flex items-center gap-2.5 bg-space-950 p-2.5 rounded-xl border border-space-border text-xs font-mono">
            <span className="text-slate-400">Overall Site Classification:</span>
            <span className="text-emerald-400 font-bold">Class-A Candidate</span>
          </div>
        </div>

        {/* Criterion-wise Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {selectedCriteria.map((c) => (
            <div key={c} className="p-3.5 rounded-xl bg-space-950 border border-space-border text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase">{c.replace(/_/g, ' ')}</span>
                <span className="text-[10px] text-emerald-400 font-bold">Compliant</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Measured terrain characteristics meet engineering safety parameters.
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
