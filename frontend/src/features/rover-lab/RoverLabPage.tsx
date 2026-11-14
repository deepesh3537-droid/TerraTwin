import React, { useState } from 'react';
import { Wrench, Navigation, Mountain, Send } from 'lucide-react';
import { identifyRoverTestbeds, formatApiError } from '../../services';
import { NotImplementedState, ErrorState } from '../../components/feedback';

export const RoverLabPage: React.FC = () => {
  const [targetEnvironment, setTargetEnvironment] = useState('lunar_polar_regolith');
  const [capabilities, setCapabilities] = useState<string[]>([
    'mobility_traction',
    'autonomous_navigation',
  ]);

  const [loading, setLoading] = useState(false);
  const [notImplementedInfo, setNotImplementedInfo] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleToggleCapability = (cap: string) => {
    setCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((x) => x !== cap) : [...prev, cap]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setNotImplementedInfo(null);
    setApiError(null);

    try {
      await identifyRoverTestbeds({
        target_environment: targetEnvironment,
        test_capabilities: capabilities,
      });
    } catch (err: unknown) {
      const formatted = formatApiError(err);
      setNotImplementedInfo(formatted);
    } finally {
      setLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-space-900 border border-space-border space-y-5">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Target Planetary Surface Environment
          </label>
          <select
            aria-label="Target Planetary Surface Environment"
            value={targetEnvironment}
            onChange={(e) => setTargetEnvironment(e.target.value)}
            className="w-full bg-space-950 border border-space-border text-xs rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500/50"
          >
            <option value="lunar_polar_regolith">Lunar South Pole Permanently Shadowed Regolith</option>
            <option value="martian_basalt_dunes">Martian Equatorial Basaltic Dunes & Ripples</option>
            <option value="subsurface_cryo_ice">Extraterrestrial Cryogenic Subsurface Permafrost</option>
            <option value="crater_rim_steep_scree">High-Slope Impact Crater Rim Scree</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Rover Hardware Qualification Objectives
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { id: 'mobility_traction', title: 'Traction & Terramechanics', desc: 'Wheel sinkage, soil shear strength, and slip in low gravity analogues' },
              { id: 'autonomous_navigation', title: 'Perception & Autonomy', desc: 'Hazard avoidance across boulder fields and steep shadow boundaries' },
              { id: 'drill_sampling', title: 'Sample Acquisition / Coring', desc: 'Subsurface drill penetration resistance and thermal dissipation' },
              { id: 'payload_operations', title: 'Extreme Instrument Deployment', desc: 'Robotic arm deployment and optical sensor calibration' },
            ].map((obj) => {
              const active = capabilities.includes(obj.id);
              return (
                <button
                  type="button"
                  key={obj.id}
                  onClick={() => handleToggleCapability(obj.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    active
                      ? 'bg-sky-950/20 border-sky-500/40 text-slate-200 shadow-sm'
                      : 'bg-space-950 text-slate-400 border-space-border hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={active}
                      readOnly
                      className="rounded border-space-border text-sky-500 focus:ring-0"
                    />
                    <span className="font-semibold text-xs">{obj.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-6 leading-tight">{obj.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading || capabilities.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-space-950 font-semibold text-xs transition-colors shadow-lg shadow-sky-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            {loading ? 'Submitting to Rover Lab API...' : 'Discover Qualification Testbeds (POST /api/v1/analysis/rover-testing)'}
          </button>
        </div>
      </form>

      {/* Honest 501 State from API envelope (FE-10, FE-11) */}
      {notImplementedInfo && (
        <NotImplementedState
          moduleName="Rover Testbed Discovery Engine (POST /api/v1/analysis/rover-testing)"
          description={notImplementedInfo}
        />
      )}

      {apiError && (
        <ErrorState
          title="Rover Lab API Error"
          message={apiError}
        />
      )}
    </div>
  );
};
