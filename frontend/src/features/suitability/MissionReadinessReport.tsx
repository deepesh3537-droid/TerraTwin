import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sun,
  Droplets,
  Layers,
} from 'lucide-react';
import { Region } from '../../types';

interface MissionReadinessReportProps {
  planet: string;
  region: Region | null;
  selectedCriteria: string[];
}

export const MissionReadinessReport: React.FC<MissionReadinessReportProps> = ({
  planet,
  region,
  selectedCriteria,
}) => {
  return (
    <div className="rounded-2xl bg-space-900 border border-space-border/80 p-6 shadow-xl space-y-5 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-space-border/80 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Site Assessment & Mission Readiness Synthesis
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Scientific feasibility summary for permanent planetary habitat and operational deployment
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-space-950 text-slate-400 border border-space-border">
          {region ? `${region.name} (${planet.toUpperCase()}) · ${selectedCriteria.length} Criteria Evaluated` : 'J2000.0 Reference Framework'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs font-mono">
        {/* 1. Landing & Touchdown Safety */}
        <div className="p-3.5 rounded-xl bg-[#02050c] border border-space-border/80 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span className="uppercase text-[11px]">Landing Considerations</span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Central floor basin exhibits localized slope variance below 5°, providing favorable touchdown safety margins. Rim crest scarps exceed 18° and must be designated as restricted flight exclusion zones.
          </p>
        </div>

        {/* 2. Solar Illumination & Energy */}
        <div className="p-3.5 rounded-xl bg-[#02050c] border border-space-border/80 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Sun className="w-4 h-4" />
            <span className="uppercase text-[11px]">Solar & Thermal Regime</span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Highland rim elevations maintain peak sunlight exposure windows for photovoltaic arrays. Deep basin interiors experience extended illumination eclipses requiring supplementary power storage.
          </p>
        </div>

        {/* 3. In-Situ Resources (ISRU) */}
        <div className="p-3.5 rounded-xl bg-[#02050c] border border-space-border/80 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Droplets className="w-4 h-4" />
            <span className="uppercase text-[11px]">ISRU Volatiles</span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Permanently shadowed regions within crater depressions function as cryogenic cold traps with high probability of volatile water ice retention, accessible within nominal rover traverse range.
          </p>
        </div>

        {/* 4. Communications Visibility */}
        <div className="p-3.5 rounded-xl bg-[#02050c] border border-space-border/80 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <Radio className="w-4 h-4" />
            <span className="uppercase text-[11px]">Communications Link</span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Direct-to-Earth line-of-sight is unobstructed along elevated rim stations with elevation angles exceeding 2.0°. Crater floor habitats will require local relay or orbital satellite comms passes.
          </p>
        </div>

        {/* 5. Major Operational Constraints */}
        <div className="p-3.5 rounded-xl bg-[#02050c] border border-space-border/80 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span className="uppercase text-[11px]">Operational Constraints</span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            High terrain roughness in ejecta blankets poses trafficability risks for wheeled mobility. Thermal swings between sunlit ridges and shadow traps present extreme engineering fatigue limits.
          </p>
        </div>

        {/* 6. Remaining Uncertainties & Missing Data */}
        <div className="p-3.5 rounded-xl bg-[#02050c] border border-space-border/80 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <Layers className="w-4 h-4" />
            <span className="uppercase text-[11px]">Remaining Uncertainties</span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Formal sub-meter DEM altimetry and in-situ volatile core drill sampling pending. Scientific mission suitability relies on current multi-spectral orbital proxies.
          </p>
        </div>
      </div>
    </div>
  );
};
