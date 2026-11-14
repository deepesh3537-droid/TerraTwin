import React from 'react';
import { NotImplementedState } from '@/components/feedback/NotImplementedState';

export const SuitabilityPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Base Suitability Analysis</h1>
        <p className="text-xs text-slate-400">
          Multivariate site evaluation for lunar and Martian permanent habitats, landing sites, and resource operations.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-space-900 border border-space-border space-y-4">
        <h3 className="text-sm font-semibold text-white">Planned Evaluation Dimensions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-space-950 border border-space-border">
            <span className="font-semibold text-slate-200 block mb-1">Slope & Landing Safety</span>
            <span className="text-slate-400">Terrain slopes &lt; 5° and crater density thresholds for lander touchdown.</span>
          </div>
          <div className="p-3 rounded-lg bg-space-950 border border-space-border">
            <span className="font-semibold text-slate-200 block mb-1">Solar Illumination</span>
            <span className="text-slate-400">Continuous solar exposure duration for solar arrays and thermal stability.</span>
          </div>
          <div className="p-3 rounded-lg bg-space-950 border border-space-border">
            <span className="font-semibold text-slate-200 block mb-1">In-Situ Resources</span>
            <span className="text-slate-400">Proximity to volatile deposits (permanently shadowed crater water ice).</span>
          </div>
          <div className="p-3 rounded-lg bg-space-950 border border-space-border">
            <span className="font-semibold text-slate-200 block mb-1">Direct-to-Earth Comms</span>
            <span className="text-slate-400">Line-of-sight visibility windows for direct communication links.</span>
          </div>
        </div>
      </div>

      <NotImplementedState
        moduleName="Suitability Evaluation Pipeline"
        description="The suitability calculation engine is scaffolded in the API contract (POST /api/v1/analysis/suitability). When GIS raster overlay weights are calibrated by mission planners, composite suitability assessments will render here."
      />
    </div>
  );
};
