import React from 'react';
import {
  Mountain,
  Sliders,
  Activity,
  Flame,
  Sparkles,
  Droplets,
  Check,
  Send,
  Globe,
  Cpu,
} from 'lucide-react';

export interface AnalogDimensionDef {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  unit: string;
}

export const ANALOG_DIMENSIONS: AnalogDimensionDef[] = [
  {
    id: 'elevation',
    name: 'Elevation Profile',
    icon: Mountain,
    description: 'Digital elevation model relief variance and hypsometric altitude distribution',
    unit: 'meters (m)',
  },
  {
    id: 'slope',
    name: 'Slope & Gradient',
    icon: Sliders,
    description: 'Topographic incline, scarp steepness and surface declivity variance',
    unit: 'degrees (°)',
  },
  {
    id: 'roughness',
    name: 'Terrain Roughness',
    icon: Activity,
    description: 'RMS height variance, boulder frequency and surface obstacle index',
    unit: 'RMS rugosity (m)',
  },
  {
    id: 'temperature',
    name: 'Thermal Range',
    icon: Flame,
    description: 'Diurnal heat retention, thermal inertia and extreme temperature amplitude',
    unit: 'Kelvin (K)',
  },
  {
    id: 'mineralogy',
    name: 'Mineral Composition',
    icon: Sparkles,
    description: 'Multi-spectral mineral reflectance, pyroxene/olivine and basaltic spectral bands',
    unit: 'reflectance index',
  },
  {
    id: 'volatiles',
    name: 'Volatiles / Moisture',
    icon: Droplets,
    description: 'Subsurface permafrost, hydrated phyllosilicates and volatile concentration',
    unit: 'wt% hydration',
  },
];

interface AnalogSearchConfigurationProps {
  selectedVariables: string[];
  onToggleVariable: (variableId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  disabled: boolean;
}

export const AnalogSearchConfiguration: React.FC<AnalogSearchConfigurationProps> = ({
  selectedVariables,
  onToggleVariable,
  onSubmit,
  loading,
  disabled,
}) => {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-space-900 border border-space-border/80 p-5 shadow-xl space-y-4">
      {/* Header & Target Candidate Reference Body */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-space-border/80 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Analog Search Parameters & Multi-Attribute Dimensions
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Configure comparison vectors for candidate Earth ranking (ADR-011 compliant)
            </p>
          </div>
        </div>

        {/* Candidate Reference Body Tag (Locked to Earth) */}
        <div className="flex items-center gap-2 bg-[#02050c] px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Candidate Pool:</span>
          <span className="text-emerald-300 font-bold">Earth (EPSG:4326)</span>
        </div>
      </div>

      {/* Dimension Chips */}
      <div>
        <div className="flex items-center justify-between mb-2 text-xs font-mono">
          <span className="text-slate-300 font-semibold uppercase tracking-wider">
            Comparison Dimensions ({selectedVariables.length} of {ANALOG_DIMENSIONS.length} Active)
          </span>
          <span className="text-[10px] text-purple-400">
            {selectedVariables.length === 0 ? '⚠️ Select at least 1 dimension' : 'Multi-Dimensional Vector Ready'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {ANALOG_DIMENSIONS.map((dim) => {
            const isSelected = selectedVariables.includes(dim.id);
            const Icon = dim.icon;

            return (
              <button
                key={dim.id}
                type="button"
                onClick={() => onToggleVariable(dim.id)}
                title={`${dim.description} (${dim.unit})`}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-500/15 border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'bg-[#02050c] border-space-border/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-purple-400/20 text-purple-300' : 'bg-space-900 text-slate-500'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                      isSelected
                        ? 'bg-purple-400 text-[#030712] font-bold'
                        : 'border border-space-border text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <div>
                  <span
                    className={`text-xs font-bold font-mono block leading-tight ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {dim.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                    {dim.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-space-border/60">
        <span className="text-[10px] font-mono text-slate-400">
          Endpoint: <code className="text-purple-300">POST /api/v1/analysis/similarity</code>
        </span>

        <button
          type="submit"
          disabled={disabled || loading || selectedVariables.length === 0}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-[#030712] bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 hover:from-purple-300 hover:to-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? 'Querying Similarity Pipeline...' : 'Execute Analog Search'}</span>
        </button>
      </div>
    </form>
  );
};
