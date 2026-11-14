import React from 'react';
import { Wrench, Navigation, Mountain } from 'lucide-react';
import { NotImplementedState } from '@/components/feedback/NotImplementedState';

export const RoverLabPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Rover Testing Lab</h1>
        <p className="text-xs text-slate-400">
          Discover terrestrial terrain analogues suited for qualification of planetary rover mobility, autonomy, and drill hardware.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-space-900 border border-space-border">
          <Mountain className="w-5 h-5 text-sky-400 mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">Regolith & Geotech</h3>
          <p className="text-xs text-slate-400">Simulating wheel sinkage, slip, and slope climbing in unconsolidated basaltic sands.</p>
        </div>

        <div className="p-4 rounded-xl bg-space-900 border border-space-border">
          <Navigation className="w-5 h-5 text-amber-400 mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">Optical Autonomy</h3>
          <p className="text-xs text-slate-400">Low-illumination stereo camera navigation in shadowed craters and high-contrast environments.</p>
        </div>

        <div className="p-4 rounded-xl bg-space-900 border border-space-border">
          <Wrench className="w-5 h-5 text-purple-400 mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">Drill Operations</h3>
          <p className="text-xs text-slate-400">Cryogenic ice-soil core extraction in permafrost analog environments.</p>
        </div>
      </div>

      <NotImplementedState
        moduleName="Rover Testbed Discovery Engine"
        description="The rover environment discovery pipeline is scaffolded in the API contract (POST /api/v1/analysis/rover-testing). Terrestrial qualification field locations will be matched once hardware capability matrices are finalized."
      />
    </div>
  );
};
