import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Crosshair } from 'lucide-react';
import {
  RoverSimulationState,
  RoverControlInputs,
  createInitialRoverState,
  updateRoverKinematics,
} from './roverPhysics';
import { RoverModel } from './RoverModel';
import { RoverTerrain } from './RoverTerrain';
import { RoverCameraSystem, RoverCameraMode } from './RoverCameraSystem';
import { RoverControlsOverlay } from './RoverControlsOverlay';

interface RoverSimulationCanvasProps {
  planet: string;
  activeMode: 'geotech' | 'autonomy' | 'drill';
  onStateUpdate: (state: RoverSimulationState) => void;
}

/**
 * Child simulation loop running at 60fps inside the Three.js Canvas
 */
const SimulationLoop: React.FC<{
  inputs: RoverControlInputs;
  planet: string;
  stateRef: React.MutableRefObject<RoverSimulationState>;
  onStateUpdate: (state: RoverSimulationState) => void;
}> = ({ inputs, planet, stateRef, onStateUpdate }) => {
  useFrame((_, delta) => {
    const nextState = updateRoverKinematics(stateRef.current, inputs, planet, delta);
    stateRef.current = nextState;
    onStateUpdate(nextState);
  });

  return null;
};

export const RoverSimulationCanvas: React.FC<RoverSimulationCanvasProps> = ({
  planet,
  activeMode,
  onStateUpdate,
}) => {
  const [cameraMode, setCameraMode] = useState<RoverCameraMode>('follow');

  // Input states
  const [inputs, setInputs] = useState<RoverControlInputs>({
    forward: false,
    reverse: false,
    left: false,
    right: false,
    brake: false,
  });

  const stateRef = useRef<RoverSimulationState>(createInitialRoverState());
  const [liveState, setLiveState] = useState<RoverSimulationState>(stateRef.current);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef<boolean>(false);

  // Sync state update to parent and local live state
  const handleStateUpdate = useCallback(
    (newState: RoverSimulationState) => {
      setLiveState(newState);
      onStateUpdate(newState);
    },
    [onStateUpdate]
  );

  // Reset rover to origin
  const handleReset = () => {
    const fresh = createInitialRoverState();
    stateRef.current = fresh;
    setLiveState(fresh);
    onStateUpdate(fresh);
  };

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input or select
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        e.preventDefault();
        setInputs((prev) => ({ ...prev, forward: true }));
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        e.preventDefault();
        setInputs((prev) => ({ ...prev, reverse: true }));
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setInputs((prev) => ({ ...prev, left: true }));
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        e.preventDefault();
        setInputs((prev) => ({ ...prev, right: true }));
      } else if (e.code === 'Space') {
        e.preventDefault();
        setInputs((prev) => ({ ...prev, brake: true }));
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        setInputs((prev) => ({ ...prev, forward: false }));
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        setInputs((prev) => ({ ...prev, reverse: false }));
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        setInputs((prev) => ({ ...prev, left: false }));
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        setInputs((prev) => ({ ...prev, right: false }));
      } else if (e.code === 'Space') {
        setInputs((prev) => ({ ...prev, brake: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleSetInput = (key: keyof RoverControlInputs, value: boolean) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleTerrainClick = (clickX: number, clickZ: number) => {
    if (activeMode === 'autonomy') {
      stateRef.current = {
        ...stateRef.current,
        waypoint: { x: clickX, z: clickZ },
        isAutoNavigating: true,
      };
    }
  };

  const handleTriggerDrill = () => {
    if (activeMode === 'drill') {
      stateRef.current = {
        ...stateRef.current,
        drillActive: true,
        drillProgress: 0,
      };
    }
  };

  const isMars = planet.toLowerCase() === 'mars';

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      className="relative w-full h-[540px] rounded-2xl bg-[#02050c] border border-cyan-500/40 overflow-hidden shadow-2xl select-none"
    >
      {/* ========================================================================= */}
      {/* Top Camera Perspective Toolbar HUD                                       */}
      {/* ========================================================================= */}
      <div className="absolute top-3 inset-x-3 z-10 pointer-events-none flex items-center justify-between gap-3 flex-wrap">
        <div className="pointer-events-auto flex items-center gap-2 bg-space-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-space-border/80 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold text-white uppercase">{planet} SURFACE SIMULATOR</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300">INTERACTIVE 3D ROVER</span>
        </div>

        {/* Camera Selector Pills */}
        <div className="pointer-events-auto flex items-center gap-1 bg-space-950/85 backdrop-blur-md p-1 rounded-xl border border-space-border/80 text-[11px] font-mono">
          <span className="px-2 text-slate-400 uppercase text-[9px]">CAMERA:</span>
          {[
            { id: 'follow', label: 'Follow View' },
            { id: 'free', label: 'Free Orbit' },
            { id: 'topdown', label: 'Top-Down' },
            { id: 'mastcam', label: 'MastCam POV' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCameraMode(c.id as RoverCameraMode)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                cameraMode === c.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MastCam Crosshairs when in POV Mode                                      */}
      {/* ========================================================================= */}
      {cameraMode === 'mastcam' && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6">
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400/80 bg-space-950/60 p-2 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
            <span>[MASTCAM-Z HIGH-RES STEREO APERTURE]</span>
            <span>ZOOM: 3.4X · FOV: 42°</span>
            <span>SOLAR ZENITH: 38.2°</span>
          </div>

          <div className="relative self-center my-auto flex items-center justify-center pointer-events-none">
            <Crosshair className="w-16 h-16 text-cyan-400/40 stroke-[1]" />
            <div className="absolute w-2 h-2 rounded-full border border-cyan-400/60" />
          </div>

          <div className="text-[10px] font-mono text-slate-400/80 text-center">
            HazCam Collision Buffer Active · 10m Forward Horizon
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Three.js R3F Simulation Canvas                                            */}
      {/* ========================================================================= */}
      <div className="w-full h-full">
        <Canvas
          shadows
          camera={{ position: [0, 4, -8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#02050c']} />

          {/* Directional Sun & Atmospheric Illumination */}
          <directionalLight
            position={[14, 20, 10]}
            intensity={2.4}
            color="#fff8e7"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight
            position={[-12, 10, -10]}
            intensity={0.4}
            color={isMars ? '#ea580c' : '#38bdf8'}
          />
          <ambientLight intensity={0.22} color="#0f172a" />

          {/* Dynamic 60fps Kinematics Loop */}
          <SimulationLoop
            inputs={inputs}
            planet={planet}
            stateRef={stateRef}
            onStateUpdate={handleStateUpdate}
          />

          {/* Camera System */}
          <RoverCameraSystem cameraMode={cameraMode} state={liveState} />

          {/* Interactive Terrain Environment */}
          <RoverTerrain
            planet={planet}
            waypoint={liveState.waypoint}
            onTerrainClick={handleTerrainClick}
          />

          {/* Controllable 6-Wheel Planetary Rover Model */}
          <RoverModel state={liveState} activeMode={activeMode} />
        </Canvas>
      </div>

      {/* ========================================================================= */}
      {/* Bottom Controls Bar HUD (D-Pad, Shortcuts, Drill Trigger)                */}
      {/* ========================================================================= */}
      <div className="absolute bottom-3 inset-x-3 z-10 pointer-events-none">
        <RoverControlsOverlay
          inputs={inputs}
          onSetInput={handleSetInput}
          onReset={handleReset}
          onTriggerDrill={handleTriggerDrill}
          drillActive={liveState.drillActive}
          activeMode={activeMode}
          isAutoNavigating={liveState.isAutoNavigating}
          onCancelAutoNav={() => {
            stateRef.current.isAutoNavigating = false;
            stateRef.current.waypoint = null;
          }}
        />
      </div>
    </div>
  );
};
