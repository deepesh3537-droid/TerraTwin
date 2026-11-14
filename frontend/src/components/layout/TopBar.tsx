import React from 'react';
import { Menu, Search, ExternalLink, Shield } from 'lucide-react';
import { usePlanetaryContext } from '../../app/planetaryContext';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { selectedPlanet, setSelectedPlanet, planets } = usePlanetaryContext();

  return (
    <header className="h-16 bg-space-900 border-b border-space-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-space-800 lg:hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Placeholder (disabled per DESIGN.md §4) */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            disabled
            placeholder="Global spatial search (available in future phase)..."
            className="w-full bg-space-950/60 border border-space-border text-xs rounded-lg pl-9 pr-4 py-2 text-slate-500 cursor-not-allowed focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Planetary Body Selector Pill */}
        <div className="flex items-center bg-space-950 p-1 rounded-lg border border-space-border text-xs" role="group" aria-label="Target Planetary Body Selector">
          {planets.map((planet) => {
            const isSelected = selectedPlanet.toLowerCase() === planet.id.toLowerCase();
            return (
              <button
                key={planet.id}
                type="button"
                onClick={() => setSelectedPlanet(planet.id)}
                aria-pressed={isSelected}
                className={`px-3 py-1 rounded-md font-medium capitalize transition-all ${
                  isSelected
                    ? planet.id === 'earth'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                      : planet.id === 'moon'
                      ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40 shadow-sm'
                      : 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {planet.name}
              </button>
            );
          })}
        </div>

        {/* OpenAPI Link */}
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-space-800 hover:bg-space-700 border border-space-border transition-colors"
        >
          <Shield className="w-3.5 h-3.5 text-sky-400" />
          <span>API Docs</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </header>
  );
};
