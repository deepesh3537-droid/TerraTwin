import React from 'react';
import { ExternalLink, Check, Plus, Compass } from 'lucide-react';
import { Dataset } from '../../types';

interface DatasetListViewProps {
  datasets: Dataset[];
  onSelectDataset: (dataset: Dataset) => void;
  selectedCompareIds: string[];
  onToggleCompare: (dataset: Dataset) => void;
}

export const DatasetListView: React.FC<DatasetListViewProps> = ({
  datasets,
  onSelectDataset,
  selectedCompareIds,
  onToggleCompare,
}) => {
  return (
    <div className="rounded-xl border border-space-border/90 bg-space-900/80 overflow-hidden shadow-xl font-mono text-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-space-950/90 border-b border-space-border text-slate-400 text-[10px] uppercase tracking-wider">
              <th className="py-3 px-3 w-10 text-center">SEL</th>
              <th className="py-3 px-4">DATASET NAME</th>
              <th className="py-3 px-3">BODY</th>
              <th className="py-3 px-3">CATEGORY</th>
              <th className="py-3 px-3">SOURCE / SENSOR</th>
              <th className="py-3 px-3">RESOLUTION</th>
              <th className="py-3 px-3">CRS</th>
              <th className="py-3 px-3">STATUS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-space-border/50 text-slate-200">
            {datasets.map((ds) => {
              const isSelected = selectedCompareIds.includes(ds.id);
              const isMars = ds.planet_id === 'mars';
              const isEarth = ds.planet_id === 'earth';

              const planetBadge = isMars
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                : isEarth
                ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                : 'bg-slate-300/10 text-slate-200 border-slate-400/30';

              const statusColor =
                ds.ingestion_status === 'available'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

              return (
                <tr
                  key={ds.id}
                  className={`hover:bg-space-850/60 transition-colors ${
                    isSelected ? 'bg-cyan-500/5' : ''
                  }`}
                >
                  {/* Compare Selection Checkbox */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleCompare(ds)}
                      className={`w-5 h-5 rounded border mx-auto flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-cyan-500 text-space-950 border-cyan-400 font-bold'
                          : 'bg-[#02050c] text-transparent border-space-border hover:border-slate-500'
                      }`}
                      title={isSelected ? 'Deselect for comparison' : 'Select for comparison'}
                      aria-label="Toggle dataset comparison"
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  {/* Dataset Name */}
                  <td className="py-3 px-4 font-sans font-medium text-white max-w-xs">
                    <div
                      onClick={() => onSelectDataset(ds)}
                      className="cursor-pointer hover:text-cyan-300 transition-colors truncate font-semibold"
                      title={ds.name}
                    >
                      {ds.name}
                    </div>
                    {ds.is_demo && (
                      <span className="inline-block mt-0.5 text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
                        Demo Record
                      </span>
                    )}
                  </td>

                  {/* Body */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${planetBadge}`}>
                      {ds.planet_id}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 whitespace-nowrap capitalize text-slate-300">
                    {ds.category}
                  </td>

                  {/* Source Agency & Instrument */}
                  <td className="py-3 px-3 max-w-[180px] truncate text-slate-400" title={`${ds.source_agency || ''} · ${ds.instrument || ''}`}>
                    <span className="text-slate-200">{ds.source_agency || '—'}</span>
                    {ds.instrument && <span className="text-slate-500 block text-[10px] truncate">{ds.instrument}</span>}
                  </td>

                  {/* Resolution */}
                  <td className="py-3 px-3 whitespace-nowrap text-slate-300">
                    {ds.native_resolution || '—'}
                  </td>

                  {/* CRS */}
                  <td className="py-3 px-3 whitespace-nowrap text-cyan-400 font-mono text-[10px]">
                    <div className="flex items-center gap-1">
                      <Compass className="w-3 h-3 text-cyan-500 shrink-0" />
                      <span>{ds.coordinate_reference_system}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] capitalize border ${statusColor}`}>
                      {ds.ingestion_status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectDataset(ds)}
                      className="px-2.5 py-1 rounded-lg bg-space-950 border border-space-border hover:border-cyan-500/40 text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 text-[11px] font-bold transition-all"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
