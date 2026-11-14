import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Layers,
  Database,
  FileText,
  ShieldCheck,
  Calendar,
  Layers3,
  Copy,
  Check,
  Plus,
  Minus,
} from 'lucide-react';
import { Dataset, Layer } from '../../types';
import { getDatasetLayers } from '../../services';
import { GeospatialDataPreview } from './GeospatialDataPreview';

interface DatasetDetailDrawerProps {
  dataset: Dataset | null;
  onClose: () => void;
  isSelectedForCompare: boolean;
  onToggleCompare: (dataset: Dataset) => void;
}

export const DatasetDetailDrawer: React.FC<DatasetDetailDrawerProps> = ({
  dataset,
  onClose,
  isSelectedForCompare,
  onToggleCompare,
}) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [loadingLayers, setLoadingLayers] = useState<boolean>(false);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  useEffect(() => {
    if (!dataset) {
      setLayers([]);
      return;
    }

    let isMounted = true;
    setLoadingLayers(true);

    getDatasetLayers(dataset.id)
      .then((data) => {
        if (isMounted) setLayers(data || []);
      })
      .catch(() => {
        if (isMounted) setLayers([]);
      })
      .finally(() => {
        if (isMounted) setLoadingLayers(false);
      });

    return () => {
      isMounted = false;
    };
  }, [dataset]);

  if (!dataset) return null;

  const isEarth = dataset.planet_id === 'earth';
  const isMars = dataset.planet_id === 'mars';

  const planetBadgeColor = isMars
    ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    : isEarth
    ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
    : 'bg-slate-300/10 text-slate-200 border-slate-400/30';

  const handleCopyCitation = () => {
    const text = dataset.citation || `${dataset.name} (${dataset.source_agency || 'Unknown Agency'}). ${dataset.source_url || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      {/* Slide-Over Drawer Container */}
      <div className="relative w-full max-w-2xl bg-space-950 border-l border-space-border/90 h-full flex flex-col shadow-2xl overflow-y-auto font-mono text-xs">
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 bg-space-950/95 backdrop-blur-md p-5 border-b border-space-border/80 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap text-[10px]">
              <span className={`px-2 py-0.5 rounded uppercase font-bold border ${planetBadgeColor}`}>
                {dataset.planet_id}
              </span>
              <span className="px-2 py-0.5 rounded capitalize bg-space-900 text-slate-300 border border-space-border">
                {dataset.category}
              </span>
              {dataset.is_demo ? (
                <span className="px-2 py-0.5 rounded uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                  Demo Fixture
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                  Verified Ingestion
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-space-900 text-slate-400 border border-space-border">
                {dataset.ingestion_status}
              </span>
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight leading-snug font-sans">
              {dataset.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Compare Toggle Button */}
            <button
              onClick={() => onToggleCompare(dataset)}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isSelectedForCompare
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-space-900 text-slate-400 border-space-border hover:text-white'
              }`}
              title={isSelectedForCompare ? 'Remove from comparison' : 'Add to dataset comparison'}
            >
              {isSelectedForCompare ? (
                <span className="flex items-center gap-1">
                  <Minus className="w-3.5 h-3.5" /> Selected
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Compare
                </span>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-space-900 border border-space-border transition-colors"
              aria-label="Close dataset drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body Contents */}
        <div className="p-6 space-y-6">
          {/* ========================================================================= */}
          {/* 1. Overview & Scientific Purpose                                         */}
          {/* ========================================================================= */}
          <div className="space-y-2 font-sans">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Dataset Overview & Purpose
            </h4>
            <div className="p-3.5 rounded-xl bg-space-900/80 border border-space-border/80 text-xs text-slate-200 leading-relaxed space-y-2">
              <p>{dataset.description || 'No description provided for this dataset.'}</p>
              {dataset.quality_notes && (
                <p className="text-[11px] text-amber-300/90 font-mono pt-1 border-t border-space-border/60">
                  Integrity Note: {dataset.quality_notes}
                </p>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. Geospatial Spatial Coverage Preview                                    */}
          {/* ========================================================================= */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
              <Layers3 className="w-3.5 h-3.5 text-cyan-400" /> Geospatial Coverage & Bounding Box
            </h4>
            <GeospatialDataPreview dataset={dataset} />
          </div>

          {/* ========================================================================= */}
          {/* 3. Scientific Metadata Grid                                               */}
          {/* ========================================================================= */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
              <Database className="w-3.5 h-3.5 text-cyan-400" /> Scientific Metadata & Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-space-900/80 border border-space-border/80">
              <div className="p-2 rounded-lg bg-[#02050c] border border-space-border">
                <span className="text-slate-500 block text-[9px]">VARIABLE</span>
                <span className="text-cyan-300 font-bold">{dataset.variable}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#02050c] border border-space-border">
                <span className="text-slate-500 block text-[9px]">CRS (DATUM)</span>
                <span className="text-white font-bold">{dataset.coordinate_reference_system}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#02050c] border border-space-border">
                <span className="text-slate-500 block text-[9px]">SPATIAL RESOLUTION</span>
                <span className="text-white font-bold">{dataset.native_resolution || '—'}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#02050c] border border-space-border">
                <span className="text-slate-500 block text-[9px]">FORMAT</span>
                <span className="text-slate-300">{dataset.format || '—'}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#02050c] border border-space-border">
                <span className="text-slate-500 block text-[9px]">UNIT</span>
                <span className="text-slate-300">{dataset.unit || '—'}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#02050c] border border-space-border">
                <span className="text-slate-500 block text-[9px]">PROCESSING LEVEL</span>
                <span className="text-slate-300">{dataset.processing_level || 'Level 2 / 3'}</span>
              </div>
              <div className="col-span-2 sm:col-span-3 p-2 rounded-lg bg-[#02050c] border border-space-border flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[9px]">TEMPORAL COVERAGE</span>
                  <span className="text-slate-300">
                    {dataset.temporal_start || dataset.temporal_end
                      ? `${dataset.temporal_start || 'Start'} to ${dataset.temporal_end || 'Present'}`
                      : 'Static Global Observation'}
                  </span>
                </div>
                <Calendar className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. Scientific Provenance & Attributions                                  */}
          {/* ========================================================================= */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Scientific Provenance & Attribution
            </h4>
            <div className="p-3.5 rounded-xl bg-space-900/80 border border-space-border/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[9px]">SOURCE AGENCY / SPONSOR</span>
                  <span className="text-white font-medium">{dataset.source_agency || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">SPACE MISSION / PROGRAM</span>
                  <span className="text-white font-medium">{dataset.mission || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">INSTRUMENT / SENSOR</span>
                  <span className="text-white font-medium">{dataset.instrument || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px]">DATA LICENSE</span>
                  <span className="text-white font-medium">{dataset.license || 'Open Access'}</span>
                </div>
              </div>

              {/* Source Documentation URL */}
              {dataset.source_url && (
                <div className="pt-2 border-t border-space-border/70 flex items-center justify-between gap-2">
                  <span className="text-slate-400 text-[10px]">Documentation Link:</span>
                  <a
                    href={dataset.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>Official Product Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Citation & Copy Citation Button */}
              {dataset.citation && (
                <div className="p-2.5 rounded-lg bg-[#02050c] border border-space-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] font-bold">RECOMMENDED CITATION:</span>
                    <button
                      onClick={handleCopyCitation}
                      className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300"
                    >
                      {copiedCitation ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Citation</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans italic leading-relaxed">
                    {dataset.citation}
                  </p>
                </div>
              )}

              {/* Local Storage Relative Path */}
              <div className="text-[10px] text-slate-500 break-all">
                Relative Archive Path: <code className="text-slate-400">{dataset.local_path || 'data/raw/...'}</code>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 5. Associated Map Layers View                                            */}
          {/* ========================================================================= */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Associated Map Rendering Layers
            </h4>
            {loadingLayers ? (
              <p className="text-slate-500 italic p-3 rounded-lg bg-space-900 border border-space-border">
                Querying derived layer views...
              </p>
            ) : layers.length === 0 ? (
              <div className="p-3 rounded-lg bg-space-900/60 border border-space-border text-slate-500 text-[11px]">
                No derived rendering layers registered for this dataset yet. Raw data can be visualized
                via the 3D Terrain Comparison Lab.
              </div>
            ) : (
              <div className="space-y-2">
                {layers.map((l) => (
                  <div
                    key={l.id}
                    className="p-3 rounded-lg bg-space-900 border border-space-border flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{l.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-space-950 text-slate-400 uppercase">
                          {l.rendering_type}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5 font-sans">
                        {l.description || 'Layer specification'}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        l.available
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {l.available ? 'Ready' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="sticky bottom-0 z-20 bg-space-950/95 backdrop-blur-md p-4 border-t border-space-border/80 flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleCompare(dataset)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isSelectedForCompare
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
          >
            {isSelectedForCompare ? 'Remove from Comparison' : 'Add to Multi-Dataset Comparison'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-space-900 hover:bg-space-850 text-slate-300 border border-space-border text-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
