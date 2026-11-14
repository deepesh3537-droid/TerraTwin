import React, { useState } from 'react';
import {
  Wrench,
  Navigation,
  Mountain,
  Send,
  Cpu,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { identifyRoverTestbeds, formatApiError } from '../../services';
import { NotImplementedState, ErrorState } from '../../components/feedback';
import {
  RoverSimulationState,
  createInitialRoverState,
} from './roverPhysics';
import { RoverSimulationCanvas } from './RoverSimulationCanvas';
import { RoverTelemetryHUD } from './RoverTelemetryHUD';
import { RoverTestingScenarios, RoverScenarioMode } from './RoverTestingScenarios';

export const RoverLabPage: React.FC = () => {
  // Target environment selection
  const [targetEnvironment, setTargetEnvironment] = useState('lunar_polar_regolith');

  // Active testing scenario: 'geotech' | 'autonomy' | 'drill'
  const [activeScenario, setActiveScenario] = useState<RoverScenarioMode>('geotech');

  // Live simulation telemetry state
  const [simState, setSimState] = useState<RoverSimulationState>(createInitialRoverState());

  // Backend testbed capabilities checkboxes
  const [capabilities, setCapabilities] = useState<string[]>([
    'mobility_traction',
    'autonomous_navigation',
  ]);

  // Backend API query states
  const [loading, setLoading] = useState(false);
  const [notImplementedInfo, setNotImplementedInfo] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Derive target planet from environment string
  const isMarsEnv =
    targetEnvironment.includes('martian') || targetEnvironment.includes('subsurface');
  const planet = isMarsEnv ? 'Mars' : 'Moon';

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
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* ========================================================================= */}
      {/* 1. Page Header & Mission Context                                          */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-space-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase tracking-wider font-bold">
              PLANETARY ROBOTICS SIMULATION WORKSTATION
            </span>
            <span className="text-slate-600 font-mono text-xs">•</span>
            <span className="text-slate-400 text-xs font-mono">
              6-WHEEL ROCKER-BOGIE SIMULATOR
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Rover Simulation & Testing Lab
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl mt-1 leading-relaxed">
            Drive an interactive 3D planetary rover across simulated lunar regolith and Martian
            dunes, evaluate terramechanics slip and autonomy pathfinding, and query qualified Earth
            analog qualification testbeds.
          </p>
        </div>

        {/* Quick Surface Environment Selector Switcher */}
        <div className="shrink-0 flex items-center gap-2 bg-space-950/80 p-2 rounded-xl border border-space-border/90">
          <label htmlFor="target-env-select" className="text-[11px] font-mono text-slate-400 uppercase">
            TARGET SURFACE:
          </label>
          <select
            id="target-env-select"
            aria-label="Target Planetary Surface Environment"
            value={targetEnvironment}
            onChange={(e) => setTargetEnvironment(e.target.value)}
            className="bg-[#02050c] border border-cyan-500/40 text-xs rounded-lg px-3 py-1.5 text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="lunar_polar_regolith">Moon — South Pole Regolith</option>
            <option value="martian_basalt_dunes">Mars — Basaltic Dunes & Ripples</option>
            <option value="subsurface_cryo_ice">Mars — Subsurface Cryo-Permafrost</option>
            <option value="crater_rim_steep_scree">Moon — High-Slope Crater Scree</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Interactive 3D Rover Simulation Workspace                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main 3D Simulation Canvas Container (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <RoverSimulationCanvas
            planet={planet}
            activeMode={activeScenario}
            onStateUpdate={setSimState}
          />

          {/* Quick Simulation Help Banner */}
          <div className="p-3 rounded-xl bg-space-950/60 border border-space-border/80 flex items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Controls: <strong className="text-slate-200">W / S</strong> (Drive),{' '}
                <strong className="text-slate-200">A / D</strong> (Steer),{' '}
                <strong className="text-slate-200">SPACE</strong> (Brake),{' '}
                <strong className="text-slate-200">R</strong> (Reset)
              </span>
            </div>
            <span className="text-slate-500 hidden sm:inline">
              Autonomy: Click anywhere on terrain to set target waypoint
            </span>
          </div>
        </div>

        {/* Live Telemetry & Mission Telematics HUD (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-space-900/90 border border-space-border/90 backdrop-blur-md shadow-xl space-y-4">
          <RoverTelemetryHUD
            state={simState}
            planet={planet}
            activeMode={activeScenario}
          />

          {/* Surface Environment Quick Facts */}
          <div className="pt-3 border-t border-space-border/80 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>ENVIRONMENT PROFILE</span>
              <span className="text-cyan-400 font-bold">{planet.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-2 rounded-lg bg-[#02050c] border border-space-border">
                <span className="text-slate-500 block">GRAVITY</span>
                <span className="text-white font-bold">
                  {planet === 'Mars' ? '3.72 m/s² (0.38g)' : '1.62 m/s² (0.16g)'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#02050c] border border-space-border">
                <span className="text-slate-500 block">ATMOSPHERE</span>
                <span className="text-white font-bold">
                  {planet === 'Mars' ? '610 Pa (CO₂)' : 'Vacuum (<10⁻¹⁰ Pa)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. Testing Scenarios Strip (Geotech / Autonomy / Drill)                    */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-space-900/70 border border-space-border/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              Interactive Rover Testing Scenarios
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Select a mode to alter testing parameters and robotic arm / autonomous actions
          </span>
        </div>

        <RoverTestingScenarios
          activeMode={activeScenario}
          onSelectMode={setActiveScenario}
          planet={planet}
        />
      </div>

      {/* ========================================================================= */}
      {/* 4. Rover Hardware Qualification & API Discovery Section                   */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-space-900 border border-space-border space-y-5">
        <div className="border-b border-space-border/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Rover Hardware Qualification Objectives
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select specific mission qualification requirements to identify verified terrestrial
              analog testbeds on Earth.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-space-950 text-cyan-400 border border-cyan-500/30">
            ENDPOINT: POST /api/v1/analysis/rover-testing
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              {
                id: 'mobility_traction',
                title: 'Traction & Terramechanics',
                desc: 'Wheel sinkage, soil shear strength, and slip in low-gravity analog regolith',
                icon: <Mountain className="w-4 h-4 text-sky-400 shrink-0" />,
              },
              {
                id: 'autonomous_navigation',
                title: 'Perception & Autonomy',
                desc: 'Hazard avoidance across boulder fields and steep shadow boundaries',
                icon: <Navigation className="w-4 h-4 text-amber-400 shrink-0" />,
              },
              {
                id: 'drill_sampling',
                title: 'Sample Acquisition / Coring',
                desc: 'Subsurface drill penetration resistance, core extraction, and caching',
                icon: <Wrench className="w-4 h-4 text-purple-400 shrink-0" />,
              },
              {
                id: 'payload_operations',
                title: 'Extreme Instrument Deployment',
                desc: 'Robotic arm articulation, spectrometer placement, and dust mitigation',
                icon: <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />,
              },
            ].map((obj) => {
              const active = capabilities.includes(obj.id);
              return (
                <button
                  type="button"
                  key={obj.id}
                  onClick={() => handleToggleCapability(obj.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    active
                      ? 'bg-sky-950/20 border-sky-500/50 text-slate-200 shadow-md ring-1 ring-sky-500/20'
                      : 'bg-space-950 text-slate-400 border-space-border hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <input
                      type="checkbox"
                      checked={active}
                      readOnly
                      className="rounded border-space-border text-sky-500 focus:ring-0"
                    />
                    {obj.icon}
                    <span className="font-semibold text-xs text-white">{obj.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-6 leading-tight">{obj.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-slate-400 font-mono">
              Selected Capabilities: <span className="text-cyan-300 font-bold">{capabilities.length}</span> / 4
            </div>

            <button
              type="submit"
              disabled={loading || capabilities.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-[#030712] font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};
