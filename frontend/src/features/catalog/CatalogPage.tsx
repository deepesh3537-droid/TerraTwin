import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Data Catalog</h1>
          <p className="text-xs text-slate-400">
            Open planetary and Earth observation datasets registered with complete scientific provenance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-space-900 border border-space-border px-3 py-1.5 rounded-lg">
            API: /api/v1/datasets
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-space-900 border border-space-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" /> Body:
          </span>
          {['all', 'earth', 'moon', 'mars'].map((b) => (
            <button
              key={b}
              onClick={() => setSelectedPlanet(b)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-colors ${
                selectedPlanet === b
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 bg-space-950'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search datasets..."
            className="w-full bg-space-950 border border-space-border text-xs rounded-lg pl-9 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
          />
        </div>
      </div>

      {/* Dataset List Card Demo Placeholder */}
      <div className="space-y-3">
        <div className="p-5 rounded-xl bg-space-900 border border-space-border hover:border-space-border-light transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  Earth
                </span>
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Demo Fixture
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">Demo Earth Topography Dataset</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">EPSG:4326</span>
          </div>

          <p className="text-xs text-slate-300 mb-4 max-w-3xl">
            Demonstration elevation grid fixture conforming to the TerraTwin catalog specification.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 pt-3 border-t border-space-border">
            <div><span className="text-slate-500">Agency:</span> Demo Agency</div>
            <div><span className="text-slate-500">Sensor:</span> Demo Sensor</div>
            <div><span className="text-slate-500">Format:</span> GeoTIFF</div>
            <div><span className="text-slate-500">Resolution:</span> 30m</div>
          </div>
        </div>
      </div>
    </div>
  );
};
