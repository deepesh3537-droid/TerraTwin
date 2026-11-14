import { useRef, useImperativeHandle, forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { EarthGlobe } from './EarthGlobe';
import { MoonGlobe } from './MoonGlobe';
import { MarsGlobe } from './MarsGlobe';
import { GlobeRegionMarkers } from './GlobeRegionMarkers';
import { StarField } from '../solar-system/StarField';
import { Region } from '../../types';

export interface PlanetaryGlobeRef {
  resetCamera: () => void;
}

interface PlanetaryGlobeSceneProps {
  planet: string;
  regions?: Region[];
  selectedRegionId?: string | null;
  autoRotate?: boolean;
  onSelectRegion?: (region: Region) => void;
}

export const PlanetaryGlobeScene = forwardRef<PlanetaryGlobeRef, PlanetaryGlobeSceneProps>(
  ({ planet, regions = [], selectedRegionId, autoRotate = true, onSelectRegion }, ref) => {
    const controlsRef = useRef<OrbitControlsImpl>(null);

    useImperativeHandle(ref, () => ({
      resetCamera: () => {
        if (controlsRef.current) {
          controlsRef.current.reset();
        }
      },
    }));

    const planetRadius = planet === 'earth' ? 2.0 : planet === 'moon' ? 1.85 : 1.9;

    return (
      <div className="w-full h-full min-h-[460px] bg-[#020409] relative select-none overflow-hidden">
        <Canvas
          camera={{ position: [0, 1.2, 4.6], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#020409']} />

          {/* Deep Space Starfield & Subtle Nebulae */}
          <StarField />

          {/* Orbit Controls with Damping for Smooth Physical Rotation */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={2.4}
            maxDistance={8.5}
            rotateSpeed={0.65}
            zoomSpeed={0.8}
          />

          {/* Natural Directional Sunlight (Creating crisp terminator line) */}
          <directionalLight position={[6, 3, 5]} intensity={2.4} color="#fff6e5" />
          <ambientLight intensity={0.2} color="#0f172a" />
          <directionalLight position={[-6, -2, -4]} intensity={0.15} color="#38bdf8" />

          {/* 3D Planet Mesh based on Active Target Body */}
          {planet === 'earth' && <EarthGlobe autoRotate={autoRotate} />}
          {planet === 'moon' && <MoonGlobe autoRotate={autoRotate} />}
          {planet === 'mars' && <MarsGlobe autoRotate={autoRotate} />}

          {/* 3D Region Markers on Planet Surface */}
          <GlobeRegionMarkers
            regions={regions}
            selectedRegionId={selectedRegionId}
            planetRadius={planetRadius}
            onSelectRegion={onSelectRegion}
          />
        </Canvas>
      </div>
    );
  }
);

PlanetaryGlobeScene.displayName = 'PlanetaryGlobeScene';
