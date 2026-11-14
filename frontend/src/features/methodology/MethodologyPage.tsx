import React from 'react';
import { ShieldCheck, AlertCircle, Compass } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Scientific Methodology & Integrity</h1>
        <p className="text-xs text-slate-400">
          Core principles governing planetary comparisons, coordinate systems, and ranking metrics.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-space-900 border border-space-border">
          <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">Similarity is a Ranking Metric, Not a Probability (ADR-011)</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Terrestrial analog evaluation compares physical parameters (slope, roughness, thermal inertia, mineralogy). Scores represent relative multi-criteria rankings, never probabilistic claims of habitability or identical conditions.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-space-900 border border-space-border">
          <Compass className="w-6 h-6 text-sky-400 mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">Explicit Planetary CRS Tracking (ADR-009)</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Lunar and Martian spatial coordinates must never be coerced into Earth reference frames (EPSG:4326). All raster and vector assets track dedicated IAU coordinate reference systems.
          </p>
        </div>
      </div>

      {/* Comparison Dimensions */}
      <div className="p-6 rounded-xl bg-space-900 border border-space-border space-y-4">
        <h3 className="text-sm font-semibold text-white">Analogy Evaluation Dimensions</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <li className="p-3 rounded-lg bg-space-950 border border-space-border">
            <strong className="text-white block mb-0.5">1. Geology & Mineralogy:</strong>
            Basaltic flows, anorthosite massifs, evaporites, regolith size distribution.
          </li>
          <li className="p-3 rounded-lg bg-space-950 border border-space-border">
            <strong className="text-white block mb-0.5">2. Topography & Elevation:</strong>
            Slope angles, crater morphology, macro-roughness, obstacle density.
          </li>
          <li className="p-3 rounded-lg bg-space-950 border border-space-border">
            <strong className="text-white block mb-0.5">3. Temperature & Illumination:</strong>
            Extreme diurnal swings, solar incidence angle, permanently shadowed regions.
          </li>
          <li className="p-3 rounded-lg bg-space-950 border border-space-border">
            <strong className="text-white block mb-0.5">4. Volatiles & Ice:</strong>
            Permafrost, subsurface ice sheets, cryogenic soil stability.
          </li>
        </ul>
      </div>

      {/* Integrity Disclosure */}
      <div className="p-5 rounded-xl border border-amber-900/40 bg-amber-950/10 text-xs text-slate-300 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-300 mb-1">No Fabricated Telemetry Guarantee (ADR-008)</h4>
          <p className="text-slate-400 leading-relaxed">
            The base version of TerraTwin serves as an engineering foundation. Missing data is represented as null/unavailable, never as zero. Placeholder records are clearly marked with <code className="text-amber-400">is_demo: true</code> and are not NASA observations.
          </p>
        </div>
      </div>
    </div>
  );
};
