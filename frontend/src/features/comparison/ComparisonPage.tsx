import React from 'react';
import { NotImplementedState } from '@/components/feedback/NotImplementedState';

export const ComparisonPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Region Comparison</h1>
        <p className="text-xs text-slate-400">
          Pairwise terrain parameter comparison between extraterrestrial targets and terrestrial candidates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Target Selector Card */}
        <div className="p-5 rounded-xl bg-space-900 border border-space-border">
          <span className="text-xs font-mono uppercase text-sky-400 mb-1 block">Reference Target</span>
          <h3 className="text-sm font-semibold text-white mb-3">Moon / Mars Region</h3>
          <select
            disabled
            className="w-full bg-space-950 border border-space-border text-xs rounded-lg p-2.5 text-slate-500 cursor-not-allowed"
          >
            <option>Demo Lunar Polar Crater (IAU2000:30100)</option>
          </select>
        </div>

        {/* Terrestrial Candidate Selector Card */}
        <div className="p-5 rounded-xl bg-space-900 border border-space-border">
          <span className="text-xs font-mono uppercase text-emerald-400 mb-1 block">Candidate Analog</span>
          <h3 className="text-sm font-semibold text-white mb-3">Earth Terrestrial Region</h3>
          <select
            disabled
            className="w-full bg-space-950 border border-space-border text-xs rounded-lg p-2.5 text-slate-500 cursor-not-allowed"
          >
            <option>Demo Terrestrial Basalt Basin (EPSG:4326)</option>
          </select>
        </div>
      </div>

      <NotImplementedState
        moduleName="Pairwise Region Comparison Pipeline"
        description="The mathematical comparison engine is scaffolded in the API contract (POST /api/v1/analysis/compare returning HTTP 501). Once the scientific team defines dimension normalization and uncertainty weights, comparative profiles will render here."
      />
    </div>
  );
};
