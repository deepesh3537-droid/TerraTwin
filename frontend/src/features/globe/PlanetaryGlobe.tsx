import React, { useState, useRef, Suspense } from 'react';
import { PlanetaryGlobeScene, PlanetaryGlobeRef } from './PlanetaryGlobeScene';
import { GlobeMissionHUD } from './GlobeMissionHUD';
import { PlanetaryMap } from '../../map';
import { Region, Layer } from '../../types';
import { Orbit } from 'lucide-react';

interface PlanetaryGlobeProps {
  planet: string;
  regions?: Region[];
  selectedRegion?: Region | null;
  activeLayers?: Layer[];
  className?: string;
  onSelectRegion?: (region: Region) => void;
}

export const PlanetaryGlobe: React.FC<PlanetaryGlobeProps> = ({
  planet,
  regions = [],
  selectedRegion,
  activeLayers = [],
  className = '',
  onSelectRegion,
}) => {
  const [viewMode, setViewMode] = useState<'globe' | 'gis'>('globe');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const sceneRef = useRef<PlanetaryGlobeRef>(null);

  const handleResetCamera = () => {
    sceneRef.current?.resetCamera();
  };

  return (
    <div className={`relative w-full h-full min-h-[480px] rounded-xl overflow-hidden border border-space-border bg-[#020409] ${className}`}>
      {/* 3D Mission Globe or 2D GIS Canvas */}
      {viewMode === 'globe' ? (
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-[#020409] text-xs font-mono text-cyan-400">
              <Orbit className="w-6 h-6 animate-spin mr-2" />
              Initializing 3D Planetary Globe...
            </div>
          }
        >
          <PlanetaryGlobeScene
            ref={sceneRef}
            planet={planet}
            regions={regions}
            selectedRegionId={selectedRegion?.id}
            autoRotate={autoRotate}
            onSelectRegion={onSelectRegion}
          />
        </Suspense>
      ) : (
        <PlanetaryMap
          planet={planet}
          selectedRegion={selectedRegion}
          activeLayers={activeLayers}
        />
      )}

      {/* OrbitTrack-inspired Mission Control HUD */}
      <GlobeMissionHUD
        planet={planet}
        viewMode={viewMode}
        autoRotate={autoRotate}
        regionCount={regions.length}
        onToggleViewMode={setViewMode}
        onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
        onResetCamera={handleResetCamera}
      />
    </div>
  );
};
