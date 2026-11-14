import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Hand,
  Keyboard,
  Target,
} from 'lucide-react';
import { RoverControlInputs } from './roverPhysics';

interface RoverControlsOverlayProps {
  inputs: RoverControlInputs;
  onSetInput: (key: keyof RoverControlInputs, value: boolean) => void;
  onReset: () => void;
  onTriggerDrill?: () => void;
  drillActive: boolean;
  activeMode: 'geotech' | 'autonomy' | 'drill';
  isAutoNavigating: boolean;
  onCancelAutoNav: () => void;
}

export const RoverControlsOverlay: React.FC<RoverControlsOverlayProps> = ({
  inputs,
  onSetInput,
  onReset,
  onTriggerDrill,
  drillActive,
  activeMode,
  isAutoNavigating,
  onCancelAutoNav,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 text-xs font-mono pointer-events-none select-none">
      {/* Keyboard Shortcuts Hint Bar */}
      <div className="pointer-events-auto hidden md:flex items-center gap-3 bg-space-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-space-border/80 text-[10px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-white">DRIVE:</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-space-850 border border-space-border text-slate-200">W</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-space-850 border border-space-border text-slate-200">A</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-space-850 border border-space-border text-slate-200">S</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-space-850 border border-space-border text-slate-200">D</kbd>
          <span className="text-slate-400">/ Arrows</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-0.5 rounded bg-space-850 border border-space-border text-slate-200">SPACE</kbd>
          <span className="text-slate-400">Brake</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-space-850 border border-space-border text-slate-200">R</kbd>
          <span className="text-slate-400">Reset</span>
        </div>
      </div>

      {/* Autonomous Navigation Status Indicator */}
      {isAutoNavigating && (
        <div className="pointer-events-auto bg-space-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-sky-400/50 flex items-center gap-2.5 shadow-xl animate-pulse">
          <Target className="w-4 h-4 text-sky-400 animate-spin" />
          <span className="text-[11px] font-bold text-sky-300">AUTONOMOUS STEERING TO WAYPOINT</span>
          <button
            onClick={onCancelAutoNav}
            className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] hover:bg-rose-500/30"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Drill Trigger in Mode 3 */}
      {activeMode === 'drill' && (
        <button
          onClick={onTriggerDrill}
          disabled={drillActive}
          className="pointer-events-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-[#030712] font-bold text-xs hover:from-cyan-300 hover:to-sky-300 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/25"
        >
          {drillActive ? 'Coring Drill Penetrating Soil...' : 'Deploy Robotic Coring Arm'}
        </button>
      )}

      {/* On-Screen D-Pad Click / Touch Controls */}
      <div className="pointer-events-auto flex items-center gap-2 bg-space-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-space-border/80 shadow-2xl">
        {/* Left Arrow */}
        <button
          onMouseDown={() => onSetInput('left', true)}
          onMouseUp={() => onSetInput('left', false)}
          onTouchStart={() => onSetInput('left', true)}
          onTouchEnd={() => onSetInput('left', false)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
            inputs.left
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 scale-95'
              : 'bg-[#02050c] border-space-border text-slate-300 hover:text-white'
          }`}
          title="Steer Left (A / Left Arrow)"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Center Vertical Stack (Forward / Reverse) */}
        <div className="flex flex-col gap-1.5">
          {/* Forward Arrow */}
          <button
            onMouseDown={() => onSetInput('forward', true)}
            onMouseUp={() => onSetInput('forward', false)}
            onTouchStart={() => onSetInput('forward', true)}
            onTouchEnd={() => onSetInput('forward', false)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              inputs.forward
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 scale-95'
                : 'bg-[#02050c] border-space-border text-slate-300 hover:text-white'
            }`}
            title="Accelerate Forward (W / Up Arrow)"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          {/* Reverse Arrow */}
          <button
            onMouseDown={() => onSetInput('reverse', true)}
            onMouseUp={() => onSetInput('reverse', false)}
            onTouchStart={() => onSetInput('reverse', true)}
            onTouchEnd={() => onSetInput('reverse', false)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              inputs.reverse
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 scale-95'
                : 'bg-[#02050c] border-space-border text-slate-300 hover:text-white'
            }`}
            title="Reverse (S / Down Arrow)"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* Right Arrow */}
        <button
          onMouseDown={() => onSetInput('right', true)}
          onMouseUp={() => onSetInput('right', false)}
          onTouchStart={() => onSetInput('right', true)}
          onTouchEnd={() => onSetInput('right', false)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
            inputs.right
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 scale-95'
              : 'bg-[#02050c] border-space-border text-slate-300 hover:text-white'
          }`}
          title="Steer Right (D / Right Arrow)"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Mechanical Brake Button */}
        <button
          onMouseDown={() => onSetInput('brake', true)}
          onMouseUp={() => onSetInput('brake', false)}
          onTouchStart={() => onSetInput('brake', true)}
          onTouchEnd={() => onSetInput('brake', false)}
          className={`px-2.5 h-9 rounded-xl font-bold text-[10px] flex items-center justify-center border transition-all ${
            inputs.brake
              ? 'bg-rose-500/30 border-rose-400 text-rose-300 scale-95'
              : 'bg-[#02050c] border-space-border text-rose-400/80 hover:text-rose-300'
          }`}
          title="Brake (Spacebar)"
        >
          <Hand className="w-3.5 h-3.5 mr-1" />
          <span>STOP</span>
        </button>

        {/* Reset Position Button */}
        <button
          onClick={onReset}
          className="w-9 h-9 rounded-xl bg-[#02050c] border border-space-border text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
          title="Reset Rover to Origin (R)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
