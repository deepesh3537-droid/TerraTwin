import React from 'react';
import {
  Globe,
  Filter,
  Tag,
  Search,
  LayoutGrid,
  List,
  RotateCcw,
  Layers,
  FileCode,
  X,
} from 'lucide-react';

interface CatalogFilterBarProps {
  selectedPlanet: string;
  onSelectPlanet: (planet: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  selectedFormat: string;
  onSelectFormat: (format: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'grid' | 'list';
  onToggleViewMode: (mode: 'grid' | 'list') => void;
  selectedCount: number;
  onOpenComparison: () => void;
  onResetFilters: () => void;
}

export const CatalogFilterBar: React.FC<CatalogFilterBarProps> = ({
  selectedPlanet,
  onSelectPlanet,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  selectedFormat,
  onSelectFormat,
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleViewMode,
  selectedCount,
  onOpenComparison,
  onResetFilters,
}) => {
  const planetButtons = [
    { id: 'all', label: 'All Bodies' },
    { id: 'earth', label: 'Earth' },
    { id: 'moon', label: 'Moon' },
    { id: 'mars', label: 'Mars' },
  ];

  const hasActiveFilters =
    selectedPlanet !== 'all' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    selectedFormat !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <div className="p-4 rounded-xl bg-space-900 border border-space-border/90 space-y-3 font-mono text-xs">
      {/* Top Filter Controls: Planet Selector & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Planet Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 flex items-center gap-1 text-[11px] mr-1">
            <Globe className="w-3.5 h-3.5 text-cyan-400" /> BODY:
          </span>
          {planetButtons.map((b) => {
            const active = selectedPlanet === b.id;
            return (
              <button
                key={b.id}
                onClick={() => onSelectPlanet(b.id)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                  active
                    ? b.id === 'earth'
                      ? 'bg-sky-500/25 text-sky-300 border border-sky-400 font-bold'
                      : b.id === 'moon'
                      ? 'bg-slate-300/20 text-slate-100 border border-slate-300 font-bold'
                      : b.id === 'mars'
                      ? 'bg-orange-500/25 text-orange-300 border border-orange-400 font-bold'
                      : 'bg-cyan-500/25 text-cyan-300 border border-cyan-400 font-bold'
                    : 'bg-space-950 text-slate-400 hover:text-slate-200 border border-space-border/80'
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {/* Search Input with Clear Button */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search datasets, mission, sensor..."
            className="w-full bg-[#02050c] border border-space-border text-xs rounded-lg pl-9 pr-8 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Dropdowns & View Switching Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-space-border/70">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              aria-label="Filter by Category"
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="bg-[#02050c] border border-space-border text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Categories</option>
              <option value="elevation">Elevation / DEM</option>
              <option value="imagery">Satellite Imagery</option>
              <option value="thermal">Thermal Radiometry</option>
              <option value="composition">Mineralogy / Composition</option>
              <option value="geology">Geology & Geomorphology</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <select
              aria-label="Filter by Ingestion Status"
              value={selectedStatus}
              onChange={(e) => onSelectStatus(e.target.value)}
              className="bg-[#02050c] border border-space-border text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available (Verified)</option>
              <option value="registered">Registered</option>
              <option value="pending">Ingestion Pending</option>
              <option value="prototype">Prototype</option>
            </select>
          </div>

          {/* Format Dropdown */}
          <div className="flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <select
              aria-label="Filter by Data Format"
              value={selectedFormat}
              onChange={(e) => onSelectFormat(e.target.value)}
              className="bg-[#02050c] border border-space-border text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Formats</option>
              <option value="GeoTIFF">GeoTIFF / COG</option>
              <option value="PDS">PDS3 / PDS4</option>
              <option value="NetCDF">NetCDF / HDF</option>
              <option value="JPEG2000">JPEG2000</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-space-850 transition-colors"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* View Mode & Dataset Comparison Controls */}
        <div className="flex items-center gap-2">
          {/* Comparison Modal Launcher */}
          {selectedCount > 0 && (
            <button
              onClick={onOpenComparison}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-bold transition-all animate-pulse"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare ({selectedCount})</span>
            </button>
          )}

          {/* Grid vs List View Mode Switcher */}
          <div className="flex items-center bg-[#02050c] p-0.5 rounded-lg border border-space-border">
            <button
              onClick={() => onToggleViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid View (Scientific Cards)"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="List View (Scientific Table)"
              aria-label="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
