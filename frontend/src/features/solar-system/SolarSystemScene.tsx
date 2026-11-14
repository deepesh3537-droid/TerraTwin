import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { PlanetaryOrbit } from './PlanetaryOrbit';
import { StarField } from './StarField';
import { CameraRig } from './CameraRig';
import { getEarthTexture, getMarsTexture } from './textures';

interface SolarSystemSceneProps {
  selectedPlanetId: string;
  hoveredPlanetId: string | null;
  targetPlanetPosition: THREE.Vector3 | null;
  isTransitioning: boolean;
  onSelectPlanet: (id: string, worldPos: THREE.Vector3) => void;
  onHoverPlanet: (id: string | null) => void;
  onTransitionComplete: () => void;
}

export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({
  selectedPlanetId,
  hoveredPlanetId,
  targetPlanetPosition,
  isTransitioning,
  onSelectPlanet,
  onHoverPlanet,
  onTransitionComplete,
}) => {
  // Pre-generate textures
  const earthTexture = useMemo(() => getEarthTexture(), []);
  const marsTexture = useMemo(() => getMarsTexture(), []);

  // Simple procedural textures for contextual planets (Mercury, Venus, Jupiter)
  const mercuryTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 64;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(0, 0, 128, 64);
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = '#6b7280';
      ctx.fillRect(Math.random() * 128, Math.random() * 64, 3, 3);
    }
    return new THREE.CanvasTexture(c);
  }, []);

  const venusTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 64;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, 128, 64);
    ctx.fillStyle = '#fde68a';
    for (let y = 0; y < 64; y += 4) {
      ctx.fillRect(0, y, 128, 2);
    }
    return new THREE.CanvasTexture(c);
  }, []);

  const jupiterTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, 256, 128);
    // Gas giant bands
    for (let y = 0; y < 128; y += 6) {
      ctx.fillStyle = y % 12 === 0 ? '#fde68a' : '#92400e';
      ctx.fillRect(0, y, 256, 4);
    }
    // Great red spot
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(160, 80, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(c);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#030712] overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 16, 36], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#02040a']} />

        {/* Cinematic Starfield & Nebulae */}
        <StarField />

        {/* Central Luminous Sun */}
        <Sun />

        {/* Orbits */}
        <PlanetaryOrbit radius={5.8} color="#94a3b8" />
        <PlanetaryOrbit radius={9.0} color="#f59e0b" />
        <PlanetaryOrbit
          radius={13.0}
          color="#38bdf8"
          highlighted={selectedPlanetId === 'earth' || hoveredPlanetId === 'earth' || selectedPlanetId === 'moon'}
        />
        <PlanetaryOrbit
          radius={18.0}
          color="#f97316"
          highlighted={selectedPlanetId === 'mars' || hoveredPlanetId === 'mars'}
        />
        <PlanetaryOrbit radius={24.5} color="#eab308" />

        {/* Mercury */}
        <Planet
          id="mercury"
          name="Mercury"
          radius={0.36}
          orbitRadius={5.8}
          orbitSpeed={1.5}
          initialAngle={1.2}
          texture={mercuryTexture}
          onHover={onHoverPlanet}
        />

        {/* Venus */}
        <Planet
          id="venus"
          name="Venus"
          radius={0.68}
          orbitRadius={9.0}
          orbitSpeed={1.15}
          initialAngle={3.8}
          texture={venusTexture}
          glowColor="#fef08a"
          onHover={onHoverPlanet}
        />

        {/* Earth (Target Destination & Terrestrial Reference) */}
        <Planet
          id="earth"
          name="Earth"
          radius={0.92}
          orbitRadius={13.0}
          orbitSpeed={0.9}
          initialAngle={0.6}
          texture={earthTexture}
          glowColor="#38bdf8"
          isTarget
          isSelected={selectedPlanetId === 'earth'}
          isHovered={hoveredPlanetId === 'earth'}
          onSelect={onSelectPlanet}
          onHover={onHoverPlanet}
        />

        {/* Mars (Target Destination) */}
        <Planet
          id="mars"
          name="Mars"
          radius={0.62}
          orbitRadius={18.0}
          orbitSpeed={0.7}
          initialAngle={4.5}
          texture={marsTexture}
          glowColor="#ea580c"
          isTarget
          isSelected={selectedPlanetId === 'mars'}
          isHovered={hoveredPlanetId === 'mars'}
          onSelect={onSelectPlanet}
          onHover={onHoverPlanet}
        />

        {/* Jupiter */}
        <Planet
          id="jupiter"
          name="Jupiter"
          radius={1.65}
          orbitRadius={24.5}
          orbitSpeed={0.4}
          initialAngle={2.1}
          texture={jupiterTexture}
          glowColor="#fed7aa"
          onHover={onHoverPlanet}
        />

        {/* Camera Director Rig */}
        <CameraRig
          targetPlanetPosition={targetPlanetPosition}
          isTransitioning={isTransitioning}
          onTransitionComplete={onTransitionComplete}
        />
      </Canvas>
    </div>
  );
};
