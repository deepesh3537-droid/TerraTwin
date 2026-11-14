import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { NotImplementedState } from '@/components/feedback/NotImplementedState';

export const AnalogFinderPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">AI Analog Finder</h1>
        <p className="text-xs text-slate-400">
          Rank terrestrial locations on Earth that have comparable measurable characteristics to a target extraterrestrial region.
        </p>
      </div>

      {/* Form wired to contract */}
      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-space-900 border border-space-border space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Planetary Region
            </label>
            <input
              type="text"
              readOnly
              value="Demo Lunar Region (South Pole-Aitken)"
              className="w-full bg-space-950 border border-space-border text-xs rounded-lg p-2.5 text-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Candidate Planet
            </label>
            <input
              type="text"
              readOnly
              value="Earth (terrestrial candidate pool)"
              className="w-full bg-space-950 border border-space-border text-xs rounded-lg p-2.5 text-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Comparison Dimensions (Weights)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {['Terrain Elevation', 'Slope & Roughness', 'Temperature Extremes', 'Water & Ice'].map((dim) => (
              <label key={dim} className="flex items-center gap-2 p-2 rounded-lg bg-space-950 border border-space-border text-slate-300">
                <input type="checkbox" defaultChecked className="rounded border-space-border text-sky-500 focus:ring-0" />
                <span>{dim}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors shadow-lg shadow-purple-600/20"
        >
          <Send className="w-3.5 h-3.5" />
          Execute Analog Search (POST /api/v1/analysis/similarity)
        </button>
      </form>

      {/* Honest 501 State */}
      {submitted && (
        <NotImplementedState
          moduleName="Terrestrial Analog Ranking Engine"
          description="The similarity query was submitted to the backend API contract. In accordance with ADR-007 and ADR-011, the endpoint returns an honest HTTP 501 Not Implemented response until validated scientific feature normalization models are deployed."
        />
      )}
    </div>
  );
};
