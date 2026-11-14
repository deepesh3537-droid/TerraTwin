import React from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { RoverSimulationState } from './roverPhysics';

interface RoverTelemetryHUDProps {
  state: RoverSimulationState;
  planet: string;
  activeMode: 'geotech' | 'autonomy' | 'drill';
}

export const RoverTelemetryHUD: React.FC<RoverTelemetryHUDProps> = ({
  state,
  planet,
  activeMode,
}) => {
  const {
    velocity,
    steeringAngle,
    heading,
    x,
    y,
    z,
    slopeDeg,
    wheelSlip,
    drillActive,
    drillProgress,
    drillDeployed,
    obstacleWarning,
  } = state;

  // Heading degrees in [0, 360)
  const headingDeg = Math.round(((heading * (180 / Math.PI)) % 360 + 360) % 360);
  const steeringDeg = Math.round(steeringAngle * (180 / Math.PI));

  // Compass cardinal direction
  const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const cardinal = cardinals[Math.round(headingDeg / 45) % 8];

  return (
    <div className="space-y-3 font-mono text-xs select-none">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between pb-2 border-b border-space-border/80">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white tracking-wide uppercase text-[11px]">
            {planet} Telemetry (Sim Mode)
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>KINEMATICS: 60 FPS</span>
        </div>
      </div>

      {/* Proximity / Collision Hazard Alert */}
      {obstacleWarning && (
        <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-300 text-[11px] flex items-center gap-2 animate-pulse">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">{obstacleWarning}</span>
        </div>
      )}

      {/* Core Telemetry Cards Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Speed & Direction */}
        <div className="p-2.5 rounded-xl bg-[#02050c] border border-space-border/80">
          <span className="text-[9px] text-slate-400 uppercase block">VELOCITY</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold text-cyan-300">
              {Math.abs(velocity).toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400">m/s</span>
            <span className="text-[9px] text-slate-400 ml-auto">
              {velocity > 0.05 ? 'FWD' : velocity < -0.05 ? 'REV' : 'IDLE'}
            </span>
          </div>
        </div>

        {/* Heading & Compass */}
        <div className="p-2.5 rounded-xl bg-[#02050c] border border-space-border/80">
          <span className="text-[9px] text-slate-400 uppercase block">HEADING</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold text-white">{headingDeg}°</span>
            <span className="text-cyan-400 font-bold ml-auto">{cardinal}</span>
          </div>
        </div>

        {/* Steering Angle */}
        <div className="p-2.5 rounded-xl bg-[#02050c] border border-space-border/80">
          <span className="text-[9px] text-slate-400 uppercase block">STEERING</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold text-amber-300">
              {steeringDeg > 0 ? `+${steeringDeg}°` : `${steeringDeg}°`}
            </span>
            <span className="text-[9px] text-slate-400 ml-auto">
              {steeringDeg > 2 ? 'RIGHT' : steeringDeg < -2 ? 'LEFT' : 'CTR'}
            </span>
          </div>
        </div>

        {/* Terrain Slope */}
        <div className="p-2.5 rounded-xl bg-[#02050c] border border-space-border/80">
          <span className="text-[9px] text-slate-400 uppercase block">LOCAL SLOPE</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span
              className={`text-lg font-bold ${
                slopeDeg < 6 ? 'text-emerald-400' : slopeDeg < 14 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {slopeDeg.toFixed(1)}°
            </span>
            <span className="text-[9px] text-slate-400 ml-auto">
              {slopeDeg < 6 ? 'SAFE' : slopeDeg < 14 ? 'MOD' : 'HAZARD'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Coordinates & Wheel Slip */}
      <div className="p-2.5 rounded-xl bg-[#02050c] border border-space-border/80 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-slate-400 text-[10px]">
          <span>SIMULATION GRID (X, Y, Z):</span>
          <span className="text-slate-300 font-bold">
            [{x.toFixed(1)}, {y.toFixed(1)}, {z.toFixed(1)}]
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-400 text-[10px]">
          <span>WHEEL SLIP INDEX:</span>
          <span
            className={`font-bold ${
              wheelSlip < 8 ? 'text-emerald-400' : wheelSlip < 20 ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {wheelSlip.toFixed(1)}% {wheelSlip > 15 ? '(Loose Regolith)' : '(Good Traction)'}
          </span>
        </div>
        <div className="w-full bg-space-850 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              wheelSlip < 8 ? 'bg-emerald-400' : wheelSlip < 20 ? 'bg-amber-400' : 'bg-rose-400'
            }`}
            style={{ width: `${Math.min(100, (wheelSlip / 35) * 100)}%` }}
          />
        </div>
      </div>

      {/* Drill Operations Status (Mode 3) */}
      {activeMode === 'drill' && (
        <div className="p-2.5 rounded-xl bg-[#02050c] border border-cyan-500/30 text-[11px] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold">CORING DRILL STATUS:</span>
            <span className="text-slate-300 font-bold">
              {drillActive ? 'CORING DRILL ACTIVE' : drillDeployed ? 'SAMPLE ACQUIRED' : 'STOWED'}
            </span>
          </div>
          {drillActive && (
            <div className="w-full bg-space-850 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-100"
                style={{ width: `${drillProgress * 100}%` }}
              />
            </div>
          )}
          {drillDeployed && (
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Sample core #01 sealed (Depth: 12cm)
            </span>
          )}
        </div>
      )}

      {/* Educational Notice */}
      <div className="text-[9px] text-slate-400 pt-1 text-right">
        <span>Kinematic Physics Engine · Not Physical Hardware Telemetry</span>
      </div>
    </div>
  );
};
