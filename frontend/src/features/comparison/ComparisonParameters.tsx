import React from 'react';
import {
  Mountain,
  Sliders,
  Sparkles,
  Flame,
  Activity,
  Check,
} from 'lucide-react';

export interface ComparisonVariableDef {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  unit: string;
}

export const COMPARISON_VARIABLES: ComparisonVariableDef[] = [
  {
    id: 'elevation',
    name: 'Elevation & Topography',
    icon: Mountain,
    description: 'Digital Elevation Model variance, regional altimetry and relief amplitude',
    unit: 'meters (m)',
  },
  {
    id: 'slope',
    name: 'Slope Gradient',
    icon: Sliders,
    description: 'Terrain slope inclination, escarpment steepness and declivity distribution',
    unit: 'degrees (°)',
  },
  {
    id: 'roughness',
    name: 'Surface Roughness',
    icon: Activity,
    description: 'Root-mean-square height variance, micro-relief and boulder dispersal index',
    unit: 'RMS rugosity (m)',
  },
  {
    id: 'composition',
    name: 'Geochemical Composition',
    icon: Sparkles,
    description: 'Multi-band spectral reflection, mineralogical matching and silica/basalt ratios',
    unit: 'spectral similarity index',
  },
  {
    id: 'thermal_inertia',
    name: 'Thermal Inertia',
    icon: Flame,
    description: 'Diurnal thermal response, heat storage capacity and regolith particle density',
    unit: 'J m⁻² K⁻¹ s⁻¹/²',
  },
];

interface ComparisonParametersProps {
  selectedVariables: string[];
  onToggleVariable: (variableId: string) => void;
}

export const ComparisonParameters: React.FC<ComparisonParametersProps> = ({
  selectedVariables,
  onToggleVariable,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-300 font-semibold uppercase tracking-wider">
          Scientific Comparison Dimensions ({selectedVariables.length} Selected)
        </span>
        <span className="text-slate-400 text-[10px]">Multi-Attribute Pairwise Vector</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {COMPARISON_VARIABLES.map((v) => {
          const isSelected = selectedVariables.includes(v.id);
          const Icon = v.icon;

          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onToggleVariable(v.id)}
              title={`${v.description} (${v.unit})`}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-500/15 border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                  : 'bg-space-950/80 border-space-border/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? 'bg-sky-400/20 text-sky-300'
                      : 'bg-space-900 text-slate-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                    isSelected
                      ? 'bg-sky-400 text-[#030712] font-bold'
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
                  {v.name}
                </span>
                <span className="text-[10px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                  {v.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
