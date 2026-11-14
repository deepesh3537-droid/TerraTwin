import React, { useState, Suspense } from 'react';
import * as THREE from 'three';
import { Compass, Sparkles, ArrowRight, Globe, Shield, Orbit } from 'lucide-react';
import { SolarSystemScene } from './SolarSystemScene';
import { usePlanetaryContext } from '../../app/planetaryContext';

interface PlanetaryEntryScreenProps {
  onEnter: () => void;
}

export const PlanetaryEntryScreen: React.FC<PlanetaryEntryScreenProps> = ({ onEnter }) => {
  const { selectedPlanet, setSelectedPlanet } = usePlanetaryContext();
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3 | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const handleSelectPlanet = (planetId: string, worldPos?: THREE.Vector3) => {
    setSelectedPlanet(planetId);
    if (worldPos) {
      setTargetPosition(worldPos);
    }
  };

  const handleEnterExplorer = () => {
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    onEnter();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#02040a] font-sans text-slate-100 select-none">
      {/* 3D Cinematic Solar System Canvas */}
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-[#02040a] text-xs font-mono text-cyan-400">
            <Orbit className="w-6 h-6 animate-spin mr-2" />
            Initializing Cinematic Solar System...
          </div>
        }
      >
        <SolarSystemScene
          selectedPlanetId={selectedPlanet}
          hoveredPlanetId={hoveredPlanet}
          targetPlanetPosition={targetPosition}
          isTransitioning={isTransitioning}
          onSelectPlanet={(id, pos) => handleSelectPlanet(id, pos)}
          onHoverPlanet={setHoveredPlanet}
          onTransitionComplete={handleTransitionComplete}
        />
      </Suspense>

      {/* Atmospheric Vignette & Screen Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#02040a]/80" />
      <div
        className={`pointer-events-none absolute inset-0 bg-[#030712] transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top Header Branding */}
      <header className="absolute top-6 left-6 sm:top-8 sm:left-10 z-20 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-wider text-white">TERRATWIN</span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30">
                PLANETARY ANALOGS
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 tracking-wider">
              NASA SPACE APPS CHALLENGE · MISSION CONTROL
            </p>
          </div>
        </div>
      </header>

      {/* Top Right Live Telemetry Badge */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-10 z-20 hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-400 bg-space-950/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-space-border/60">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-slate-300">SOLAR SYSTEM EPHEMERIS</span>
        <span className="text-slate-600">|</span>
        <span className="text-sky-400">J2000.0 REFERENCE</span>
      </div>

      {/* Main Cinematic Hero Text & Primary Action Button */}
      <div className="absolute left-6 bottom-16 sm:left-12 sm:bottom-20 z-20 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Terrestrial Analog Atlas & Characterization</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          Explore Beyond Earth. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300">
            Discover Our Terrestrial Analogues.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-lg">
          Explore planetary environments and discover Earth's closest geological and environmental analogues for future lunar and Martian exploration.
        </p>

        {/* Primary CTA: ENTER EXPLORER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            onClick={handleEnterExplorer}
            disabled={isTransitioning}
            className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-xl font-bold text-sm text-[#030712] bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.7)] hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50"
          >
            <span className="tracking-wide">ENTER EXPLORER</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <div className="absolute -inset-0.5 rounded-xl bg-cyan-400/40 blur-sm -z-10 group-hover:blur-md transition-all" />
          </button>

          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Open Source Planetary Science Platform
          </span>
        </div>
      </div>

      {/* Bottom Right: Interactive Planetary Body Selector */}
      <div className="absolute right-6 bottom-8 sm:right-10 sm:bottom-10 z-20 flex flex-col items-end gap-2">
        <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase mb-1">
          Select Planetary Destination
        </span>

        <div className="flex items-center gap-2 bg-space-950/80 backdrop-blur-md p-1.5 rounded-xl border border-space-border/80 shadow-2xl">
          {[
            { id: 'earth', name: 'Earth', desc: '1.0 AU · Terrestrial Ref', tag: 'REF' },
            { id: 'moon', name: 'Moon', desc: '384k km · Target Analog', tag: 'TARGET' },
            { id: 'mars', name: 'Mars', desc: '1.52 AU · Target Analog', tag: 'TARGET' },
          ].map((item) => {
            const isSelected = selectedPlanet.toLowerCase() === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectPlanet(item.id)}
                className={`flex flex-col text-left px-3.5 py-2 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-sky-500/20 text-white border border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Globe className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold font-mono uppercase">{item.name}</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-0.5">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orbit Interaction Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <span className="text-[11px] font-mono text-slate-500/80 tracking-widest uppercase">
          ✦ Click planets to focus · Real-time Keplerian orbits
        </span>
      </div>
    </div>
  );
};
