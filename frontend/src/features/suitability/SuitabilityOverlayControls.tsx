import React from 'react';
import {
  Layers,
  Mountain,
  Sliders,
  AlertTriangle,
  Sun,
  Droplets,
  Radio,
  Target,
} from 'lucide-react';
import { SuitabilityOverlayMode } from './SuitabilityTerrainMesh';

interface SuitabilityOverlayControlsProps {
  activeOverlay: SuitabilityOverlayMode;
  onSelectOverlay: (mode: SuitabilityOverlayMode) => void;
}

export interface OverlayDefinition {
  id: SuitabilityOverlayMode;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  legend: { color: string; label: string }[];
}

export const OVERLAY_DEFINITIONS: OverlayDefinition[] = [
  {
    id: 'none',
    name: 'Natural Surface',
    icon: Mountain,
    description: 'Realistic planetary albedo and physical surface composition',
    legend: [
      { color: 'bg-slate-400', label: 'Planetary Regolith / Rock' },
      { color: 'bg-slate-700', label: 'Shadowed Crater Floor' },
    ],
  },
  {
    id: 'elevation',
    name: 'Elevation Altimetry',
    icon: Layers,
    description: 'USGS/NASA false-color topographic hypsometric relief map',
    legend: [
      { color: 'bg-blue-500', label: 'Lowest Depressions' },
      { color: 'bg-emerald-400', label: 'Mid-Elevation Plains' },
      { color: 'bg-amber-400', label: 'Highland Scarps' },
      { color: 'bg-rose-400', label: 'Peak Rim Crests' },
    ],
  },
  {
    id: 'slope',
    name: 'Slope Safety',
    icon: Sliders,
    description: 'Topographic gradient inclination relative to lander stability thresholds',
    legend: [
      { color: 'bg-emerald-400', label: '< 5° (Favorable Landing)' },
      { color: 'bg-amber-400', label: '5° - 15° (Moderate Incline)' },
      { color: 'bg-rose-500', label: '≥ 15° (Severe Hazard / Tip Risk)' },
    ],
  },
  {
    id: 'hazards',
    name: 'Landing Hazards',
    icon: AlertTriangle,
    description: 'Crater rims, boulder fields, and steep escarpment buffer zones',
    legend: [
      { color: 'bg-emerald-400', label: 'Safe Touchdown Corridors' },
      { color: 'bg-amber-400', label: 'Cautionary Hazard Buffer' },
      { color: 'bg-rose-500', label: 'Unfavorable Hazard Zone' },
    ],
  },
  {
    id: 'illumination',
    name: 'Solar Illumination',
    icon: Sun,
    description: 'Low-angle sun exposure for photovoltaic power and thermal stability',
    legend: [
      { color: 'bg-amber-300', label: 'Sunlit Ridge / Power Zone' },
      { color: 'bg-amber-600', label: 'Intermittent Penumbra' },
      { color: 'bg-indigo-900', label: 'Permanently Shadowed (PSR)' },
    ],
  },
  {
    id: 'isru',
    name: 'ISRU Volatiles & Ice',
    icon: Droplets,
    description: 'Proximity to cold-trap water ice deposits and volatile traps',
    legend: [
      { color: 'bg-cyan-400', label: 'Cold-Trap Volatile Deposit' },
      { color: 'bg-sky-700', label: 'Hydrated Regolith Mantle' },
      { color: 'bg-slate-600', label: 'Dry Desiccated Highland' },
    ],
  },
  {
    id: 'comms',
    name: 'Direct Comms Visibility',
    icon: Radio,
    description: 'Unobstructed geometric line-of-sight elevation angles for ground relays',
    legend: [
      { color: 'bg-sky-400', label: 'Continuous Line-of-Sight' },
      { color: 'bg-slate-500', label: 'Relay-Dependent Window' },
      { color: 'bg-slate-800', label: 'Comms Occlusion Shadow' },
    ],
  },
  {
    id: 'composite',
    name: 'Composite Suitability',
    icon: Target,
    description: 'Weighted multivariate zoning combining slope, power, and comms',
    legend: [
      { color: 'bg-emerald-400', label: 'Optimal Base / Habitat Zone' },
      { color: 'bg-amber-400', label: 'Secondary Transition Zone' },
      { color: 'bg-rose-500', label: 'Restricted / Unsuitable Area' },
    ],
  },
];

export const SuitabilityOverlayControls: React.FC<SuitabilityOverlayControlsProps> = ({
  activeOverlay,
  onSelectOverlay,
}) => {
  const currentDef = OVERLAY_DEFINITIONS.find((o) => o.id === activeOverlay) || OVERLAY_DEFINITIONS[0];

  return (
    <div className="space-y-3">
      {/* Layer Selection Chips */}
      <div>
        <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
          <span className="text-slate-300 font-semibold uppercase tracking-wider">
            Scientific Visualization Overlays
          </span>
          <span className="text-[10px] text-cyan-400">
            Active: <strong className="text-white">{currentDef.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
          {OVERLAY_DEFINITIONS.map((def) => {
            const isSelected = activeOverlay === def.id;
            const Icon = def.icon;

            return (
              <button
                key={def.id}
                type="button"
                onClick={() => onSelectOverlay(def.id)}
                title={def.description}
                className={`p-2 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400/60 text-white shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                    : 'bg-[#02050c] border-space-border/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-cyan-400 animate-pulse' : 'bg-transparent'
                    }`}
                  />
                </div>
                <span className="text-[11px] font-mono font-bold truncate block">{def.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Layer Scientific Legend */}
      <div className="p-3 rounded-xl bg-[#02050c] border border-space-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">LEGEND:</span>
          <div className="flex items-center gap-3 flex-wrap">
            {currentDef.legend.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                <span className="text-slate-300 text-[11px]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <span className="text-[10px] text-slate-400 font-sans italic hidden lg:inline">
          {currentDef.description}
        </span>
      </div>
    </div>
  );
};
