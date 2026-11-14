import React from 'react';
import { Mountain, Navigation, Wrench, ShieldCheck, ChevronRight } from 'lucide-react';

export type RoverScenarioMode = 'geotech' | 'autonomy' | 'drill';

interface RoverTestingScenariosProps {
  activeMode: RoverScenarioMode;
  onSelectMode: (mode: RoverScenarioMode) => void;
  planet: string;
}

export const RoverTestingScenarios: React.FC<RoverTestingScenariosProps> = ({
  activeMode,
  onSelectMode,
  planet,
}) => {
  const isMars = planet.toLowerCase() === 'mars';

  const scenarios: Array<{
    id: RoverScenarioMode;
    title: string;
    tagline: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    activeBg: string;
    badgeText: string;
    details: {
      metrics: string[];
      operationalGoal: string;
      simActionTip: string;
    };
  }> = [
    {
      id: 'geotech',
      title: 'Regolith & Geotech',
      tagline: 'Terramechanics & Wheel Sinkage',
      icon: <Mountain className="w-5 h-5 text-sky-400" />,
      color: 'text-sky-400',
      borderColor: 'border-sky-500/50',
      activeBg: 'bg-sky-950/20',
      badgeText: 'TERRAMECHANICS',
      details: {
        metrics: [
          'Soil Shear Modulus: 18.4 kPa',
          'Internal Friction Angle: 36.2°',
          'Wheel Sinkage Limit: 4.8 cm',
        ],
        operationalGoal:
          'Evaluate 6-wheel rocker-bogie traction, wheel slip, and slope climbing capacity across unconsolidated planetary regolith.',
        simActionTip:
          'Drive up the terrain mounds using W/S/A/D to monitor live wheel slip telemetry and slope gradient changes.',
      },
    },
    {
      id: 'autonomy',
      title: 'Optical Autonomy',
      tagline: 'Stereo Vision & Pathfinding',
      icon: <Navigation className="w-5 h-5 text-amber-400" />,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/50',
      activeBg: 'bg-amber-950/20',
      badgeText: 'AUTONAV ACTIVE',
      details: {
        metrics: [
          'Stereo Baseline: 42.4 cm',
          'Hazard Disparity Range: 1.2 - 15 m',
          'Pathfinding Frequency: 20 Hz',
        ],
        operationalGoal:
          'Test autonomous navigation, terrain mesh obstacle detection, and steering guidance around boulder hazard perimeters.',
        simActionTip:
          'Click anywhere on the 3D terrain to plant a target beacon pin — the rover will autonomously steer and drive to it.',
      },
    },
    {
      id: 'drill',
      title: 'Drill Operations',
      tagline: 'Sample Caching & Arm Deployment',
      icon: <Wrench className="w-5 h-5 text-purple-400" />,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/50',
      activeBg: 'bg-purple-950/20',
      badgeText: 'CORING READY',
      details: {
        metrics: [
          'Percussive Frequency: 28 Hz',
          'Max Coring Torque: 45 N·m',
          'Target Core Depth: 50.0 mm',
        ],
        operationalGoal:
          'Simulate robotic arm articulation, rotary-percussive rock coring, and hermetic volatile sample tube acquisition.',
        simActionTip:
          'Stop the rover near a terrain feature and press "Deploy Robotic Coring Arm" to execute the automated coring cycle.',
      },
    },
  ];

  const activeScenario = scenarios.find((s) => s.id === activeMode) || scenarios[0];

  return (
    <div className="space-y-4 font-mono select-none">
      {/* 3 Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map((scenario) => {
          const isActive = scenario.id === activeMode;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelectMode(scenario.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 relative overflow-hidden group ${
                isActive
                  ? `${scenario.activeBg} ${scenario.borderColor} shadow-lg ring-1 ring-cyan-500/30`
                  : 'bg-space-900/80 border-space-border/80 hover:border-slate-600 hover:bg-space-900'
              }`}
            >
              {/* Active Indicator Top Accent Bar */}
              {isActive && (
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500" />
              )}

              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-space-950 border border-space-border/60">
                  {scenario.icon}
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-space-950 text-slate-500 border border-space-border/40'
                  }`}
                >
                  {scenario.badgeText}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white tracking-wide">{scenario.title}</h4>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-snug">
                {scenario.tagline}
              </p>

              <div className="mt-3 flex items-center text-[10px] text-cyan-400/80 group-hover:text-cyan-300 font-sans">
                <span>{isActive ? 'Active Test Scenario' : 'Switch Scenario'}</span>
                <ChevronRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Details Strip */}
      <div className="p-4 rounded-xl bg-space-950/70 border border-space-border/90 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs font-sans">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white font-mono text-xs uppercase tracking-wide">
              {activeScenario.title} Test Protocol ({isMars ? 'Mars Surface' : 'Lunar Surface'})
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeScenario.details.operationalGoal}
          </p>
          <div className="text-[11px] text-cyan-300/90 font-mono flex items-center gap-1.5 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Interactive Simulator Tip: {activeScenario.details.simActionTip}</span>
          </div>
        </div>

        {/* Live Simulation Benchmark Specs */}
        <div className="shrink-0 flex flex-wrap lg:flex-col gap-2 font-mono text-[10px]">
          {activeScenario.details.metrics.map((m, idx) => (
            <div
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-space-900 border border-space-border text-slate-300"
            >
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
