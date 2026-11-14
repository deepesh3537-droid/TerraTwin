import React from 'react';
import {
  X,
  Layers,
  Trash2,
} from 'lucide-react';
import { Dataset } from '../../types';

interface DatasetComparisonModalProps {
  selectedDatasets: Dataset[];
  onClose: () => void;
  onRemoveDataset: (id: string) => void;
  onClearAll: () => void;
}

export const DatasetComparisonModal: React.FC<DatasetComparisonModalProps> = ({
  selectedDatasets,
  onClose,
  onRemoveDataset,
  onClearAll,
}) => {
  if (selectedDatasets.length === 0) return null;

  const comparisonFields = [
    { label: 'PLANETARY BODY', key: 'planet_id', isBadge: true },
    { label: 'CATEGORY', key: 'category' },
    { label: 'VARIABLE', key: 'variable' },
    { label: 'SPATIAL RESOLUTION', key: 'native_resolution' },
    { label: 'COORDINATE SYSTEM (CRS)', key: 'coordinate_reference_system', isMono: true },
    { label: 'SOURCE AGENCY', key: 'source_agency' },
    { label: 'MISSION / PROGRAM', key: 'mission' },
    { label: 'INSTRUMENT / SENSOR', key: 'instrument' },
    { label: 'DATA FORMAT', key: 'format' },
    { label: 'PROCESSING LEVEL', key: 'processing_level' },
    { label: 'TEMPORAL RANGE', key: 'temporal_start', isTemporal: true },
    { label: 'INGESTION STATUS', key: 'ingestion_status', isStatus: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="bg-space-950 border border-space-border/90 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col font-mono text-xs">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-space-950/95 backdrop-blur-md p-5 border-b border-space-border/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight font-sans">
                Multi-Dataset Comparison Matrix
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Comparing {selectedDatasets.length} scientific datasets for analog mission compatibility
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 rounded-lg text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-900 border border-space-border transition-colors"
              aria-label="Close Comparison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content Comparison Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-space-border/80">
                <th className="py-3 px-3 text-[10px] text-slate-400 uppercase tracking-wider w-44 bg-space-900/60 rounded-tl-xl">
                  ATTRIBUTE
                </th>
                {selectedDatasets.map((ds) => (
                  <th key={ds.id} className="py-3 px-4 min-w-[200px] bg-space-900/40">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-sans font-bold text-white text-xs leading-snug line-clamp-2">
                        {ds.name}
                      </span>
                      <button
                        onClick={() => onRemoveDataset(ds.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-space-850 shrink-0"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-space-border/50 text-slate-200">
              {comparisonFields.map((field) => (
                <tr key={field.label} className="hover:bg-space-900/30 transition-colors">
                  {/* Field Label Column */}
                  <td className="py-2.5 px-3 text-[10px] text-slate-400 uppercase font-bold bg-space-900/40 whitespace-nowrap">
                    {field.label}
                  </td>

                  {/* Dataset Columns */}
                  {selectedDatasets.map((ds) => {
                    const rawVal = (ds as unknown as Record<string, unknown>)[field.key];
                    const val = rawVal !== undefined && rawVal !== null ? String(rawVal) : null;

                    return (
                      <td key={ds.id} className="py-2.5 px-4 text-xs font-sans">
                        {field.isBadge && val ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold border ${
                              val === 'mars'
                                ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                                : val === 'earth'
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                                : 'bg-slate-300/10 text-slate-200 border-slate-400/30'
                            }`}
                          >
                            {val}
                          </span>
                        ) : field.isStatus && val ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] capitalize font-mono border ${
                              val === 'available'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {val}
                          </span>
                        ) : field.isTemporal ? (
                          <span className="font-mono text-slate-300 text-[11px]">
                            {ds.temporal_start || ds.temporal_end
                              ? `${ds.temporal_start || 'Start'} to ${ds.temporal_end || 'Present'}`
                              : 'Static Observation'}
                          </span>
                        ) : val ? (
                          <span
                            className={
                              field.isMono
                                ? 'font-mono text-cyan-300 text-[11px]'
                                : 'text-slate-200'
                            }
                          >
                            {val}
                          </span>
                        ) : (
                          <span className="text-slate-600 font-mono text-[11px]">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 z-10 bg-space-950/95 backdrop-blur-md p-4 border-t border-space-border/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-sans">
            Researchers can inspect individual provenance records or launch comparison analyses.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-space-900 hover:bg-space-850 text-slate-200 border border-space-border text-xs transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
