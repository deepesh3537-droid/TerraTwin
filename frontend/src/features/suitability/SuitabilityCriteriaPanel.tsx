import React from 'react';
import {
  Sliders,
  Sun,
  Droplets,
  Radio,
  Check,
  Target,
} from 'lucide-react';

export interface CriteriaDefinition {
  id: string;
  title: string;
  description: string;
  constraintThreshold: string;
  icon: React.ComponentType<{ className?: string }>;
  dataStatus: string;
}

export const CRITERIA_DEFINITIONS: CriteriaDefinition[] = [
  {
    id: 'slope_safety',
    title: 'Slope & Landing Safety',
    description: 'Terrain slope declivity and crater density thresholds for stable lander touchdown',
    constraintThreshold: 'Slope < 5° (touchdown limit)',
    icon: Sliders,
    dataStatus: 'Altimetry Ready',
  },
  {
    id: 'solar_illumination',
    title: 'Solar Illumination & Power',
    description: 'Continuous solar exposure windows for photovoltaic power generation and thermal control',
    constraintThreshold: 'Illumination > 65% annual window',
    icon: Sun,
    dataStatus: 'Ephemeris Modeled',
  },
  {
    id: 'resource_proximity',
    title: 'In-Situ Resources (ISRU)',
    description: 'Proximity to cold-trap volatile deposits, polar crater water ice, and mineral resources',
    constraintThreshold: 'Proximity < 10 km to PSR trap',
    icon: Droplets,
    dataStatus: 'Spectral Inferred',
  },
  {
    id: 'comms_line_of_sight',
    title: 'Direct-to-Earth Comms',
    description: 'Unobstructed geometric line-of-sight elevation angles for high-bandwidth telemetry links',
    constraintThreshold: 'Elevation angle > 1.5° to Earth',
    icon: Radio,
    dataStatus: 'Line-of-Sight Modeled',
  },
];

interface SuitabilityCriteriaPanelProps {
  selectedCriteria: string[];
  onToggleCriteria: (id: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  disabled: boolean;
}

export const SuitabilityCriteriaPanel: React.FC<SuitabilityCriteriaPanelProps> = ({
  selectedCriteria,
  onToggleCriteria,
  onSubmit,
  loading,
  disabled,
}) => {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-space-900 border border-space-border/80 p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-space-border/80 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Mission Evaluation Criteria & Environmental Constraints
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Configure multivariate parameters for landing site and base suitability
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-300 bg-space-950 px-2.5 py-1 rounded-xl border border-space-border">
          {selectedCriteria.length} of {CRITERIA_DEFINITIONS.length} Criteria Selected
        </span>
      </div>

      {/* Criteria Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CRITERIA_DEFINITIONS.map((crit) => {
          const isSelected = selectedCriteria.includes(crit.id);
          const Icon = crit.icon;

          return (
            <button
              key={crit.id}
              type="button"
              onClick={() => onToggleCriteria(crit.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'bg-[#02050c] border-space-border/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-cyan-400/20 text-cyan-300' : 'bg-space-900 text-slate-500'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-xs font-bold font-mono ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {crit.title}
                  </span>
                </div>

                <div
                  className={`w-4 h-4 rounded flex items-center justify-center text-[10px] shrink-0 ${
                    isSelected
                      ? 'bg-cyan-400 text-[#030712] font-bold'
                      : 'border border-space-border text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans mb-3">
                {crit.description}
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-space-border/60">
                <span className="text-cyan-400 font-semibold">{crit.constraintThreshold}</span>
                <span className="text-slate-500 bg-space-950 px-1.5 py-0.5 rounded border border-space-border">
                  {crit.dataStatus}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Row */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-space-border/60">
        <span className="text-[10px] font-mono text-slate-400">
          Endpoint: <code className="text-cyan-300">POST /api/v1/analysis/suitability</code>
        </span>

        <button
          type="submit"
          disabled={disabled || loading || selectedCriteria.length === 0}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-[#030712] bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]"
        >
          <Target className="w-4 h-4" />
          <span>{loading ? 'Evaluating Multivariate Suitability...' : 'Evaluate Site Suitability'}</span>
        </button>
      </div>
    </form>
  );
};
