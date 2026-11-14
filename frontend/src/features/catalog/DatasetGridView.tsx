import React from 'react';
import {
  ExternalLink,
  Check,
  Plus,
  Compass,
} from 'lucide-react';
import { Dataset } from '../../types';

interface DatasetGridViewProps {
  datasets: Dataset[];
  onSelectDataset: (dataset: Dataset) => void;
  selectedCompareIds: string[];
  onToggleCompare: (dataset: Dataset) => void;
}

export const DatasetGridView: React.FC<DatasetGridViewProps> = ({
  datasets,
  onSelectDataset,
  selectedCompareIds,
  onToggleCompare,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
      {datasets.map((dataset) => {
        const isSelected = selectedCompareIds.includes(dataset.id);
        const isMars = dataset.planet_id === 'mars';
        const isEarth = dataset.planet_id === 'earth';

        const planetBadge = isMars
          ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
          : isEarth
          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
          : 'bg-slate-300/10 text-slate-200 border-slate-400/30';

        const statusColor =
          dataset.ingestion_status === 'available'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

        return (
          <div
            key={dataset.id}
            className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between bg-space-900/80 hover:bg-space-900 hover:border-cyan-500/50 group relative ${
              isSelected
                ? 'border-cyan-400 ring-1 ring-cyan-400/40 shadow-lg shadow-cyan-500/10'
                : 'border-space-border/80'
            }`}
          >
            {/* Top Bar: Planet, Category, Demo Badge, and Compare Checkbox */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${planetBadge}`}>
                    {dataset.planet_id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] capitalize bg-space-950 text-slate-300 border border-space-border">
                    {dataset.category}
                  </span>
                  {dataset.is_demo && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Demo
                    </span>
                  )}
                </div>

                {/* Compare Checkbox Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCompare(dataset);
                  }}
                  className={`p-1 rounded-md border transition-colors ${
                    isSelected
                      ? 'bg-cyan-500 text-space-950 border-cyan-400 font-bold'
                      : 'bg-space-950 text-slate-500 border-space-border hover:text-slate-300'
                  }`}
                  title={isSelected ? 'Remove from comparison' : 'Select for comparison'}
                  aria-label="Select dataset for comparison"
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Title & Clickable Inspector Trigger */}
              <h3
                onClick={() => onSelectDataset(dataset)}
                className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors font-sans leading-snug cursor-pointer"
              >
                {dataset.name}
              </h3>

              {/* Description Preview */}
              <p className="text-[11px] text-slate-400 font-sans mt-1.5 line-clamp-2 leading-relaxed">
                {dataset.description || 'No description provided.'}
              </p>
            </div>

            {/* Scientific Specs Badges */}
            <div className="mt-4 pt-3 border-t border-space-border/70 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-1.5 rounded bg-[#02050c] border border-space-border">
                  <span className="text-slate-500 block text-[8px] uppercase">RESOLUTION</span>
                  <span className="text-slate-200 font-bold truncate block">
                    {dataset.native_resolution || '—'}
                  </span>
                </div>
                <div className="p-1.5 rounded bg-[#02050c] border border-space-border">
                  <span className="text-slate-500 block text-[8px] uppercase">FORMAT</span>
                  <span className="text-slate-200 font-bold truncate block">
                    {dataset.format || 'Raster'}
                  </span>
                </div>
              </div>

              {/* Provenance Agency & CRS */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span className="truncate max-w-[150px] text-slate-300">
                  {dataset.source_agency || 'NASA / PDS'}
                </span>
                <span className="font-mono text-cyan-400/90 text-[9px] shrink-0 flex items-center gap-0.5">
                  <Compass className="w-2.5 h-2.5" />
                  {dataset.coordinate_reference_system}
                </span>
              </div>

              {/* Bottom Footer: Status & Inspector Button */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-space-border/50 text-[10px]">
                <span className={`px-2 py-0.5 rounded capitalize font-mono text-[9px] border ${statusColor}`}>
                  {dataset.ingestion_status}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectDataset(dataset)}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
