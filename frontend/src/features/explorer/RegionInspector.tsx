import React, { useEffect, useState } from 'react';
import { Eye, MapPin, Tag, Database, X, AlertCircle } from 'lucide-react';
import { Dataset, Region } from '../../types';
import { getRegionDatasets } from '../../services';

interface RegionInspectorProps {
  region: Region | null;
  onClose: () => void;
}

export const RegionInspector: React.FC<RegionInspectorProps> = ({ region, onClose }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loadingDatasets, setLoadingDatasets] = useState(false);

  useEffect(() => {
    if (!region) {
      setDatasets([]);
      return;
    }

    let isMounted = true;
    setLoadingDatasets(true);

    getRegionDatasets(region.id)
      .then((data) => {
        if (isMounted) setDatasets(data || []);
      })
      .catch(() => {
        if (isMounted) setDatasets([]);
      })
      .finally(() => {
        if (isMounted) setLoadingDatasets(false);
      });

    return () => {
      isMounted = false;
    };
  }, [region]);

  if (!region) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
        <MapPin className="w-10 h-10 mb-2 opacity-30 text-sky-400" />
        <h3 className="font-medium text-slate-400 mb-1">No Region Selected</h3>
        <p className="max-w-xs">
          Select a region from the list or map to inspect terrain characteristics, spatial footprint, and scientific provenance.
        </p>
      </div>
    );
  }

  const characteristicsKeys = region.characteristics ? Object.keys(region.characteristics) : [];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto space-y-4 pr-1 text-xs">
      {/* Title & Close */}
      <div className="flex items-start justify-between gap-2 border-b border-space-border pb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30">
              {region.planet_id}
            </span>
            {region.is_demo && (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Demo Fixture
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-white">{region.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-space-800"
          aria-label="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      {region.description && (
        <p className="text-slate-300 bg-space-950 p-2.5 rounded-lg border border-space-border leading-relaxed">
          {region.description}
        </p>
      )}

      {/* Spatial Reference / CRS */}
      <div className="p-2.5 rounded-lg bg-space-950 border border-space-border font-mono text-[11px] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">CRS Identifier:</span>
          <span className="text-sky-400 font-semibold">{region.coordinate_reference_system}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Geometry Type:</span>
          <span className="text-slate-300">{region.footprint?.type || 'No footprint'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Provenance:</span>
          <span className="text-slate-300 truncate max-w-[140px]">{region.source_provenance || '—'}</span>
        </div>
      </div>

      {/* Tags */}
      {region.tags && region.tags.length > 0 && (
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-mono block mb-1.5 flex items-center gap-1">
            <Tag className="w-3 h-3 text-sky-400" /> Morphological Tags
          </span>
          <div className="flex flex-wrap gap-1">
            {region.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md bg-space-800 text-slate-300 text-[11px] border border-space-border"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Terrain Characteristics (Honest empty state per FE-08, FE-16) */}
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-mono block mb-1.5 flex items-center gap-1">
          <Eye className="w-3 h-3 text-sky-400" /> Terrain Characteristics
        </span>
        {characteristicsKeys.length === 0 ? (
          <div className="p-3 rounded-lg bg-space-950 border border-space-border text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400/90 font-medium text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Not yet computed</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Quantitative terrain elevation, roughness, slope, and composition indices are awaiting execution of the geospatial extraction pipeline. Per scientific integrity rules, values are kept null and never rendered as zero.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 bg-space-950 p-2.5 rounded-lg border border-space-border font-mono text-[11px]">
            {characteristicsKeys.map((k) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-slate-500 capitalize">{k.replace(/_/g, ' ')}:</span>
                <span className="text-slate-200">
                  {region.characteristics?.[k] !== null && region.characteristics?.[k] !== undefined
                    ? String(region.characteristics[k])
                    : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Intersecting Datasets */}
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-mono block mb-1.5 flex items-center gap-1">
          <Database className="w-3 h-3 text-sky-400" /> Intersecting Datasets
        </span>
        {loadingDatasets ? (
          <p className="text-slate-500 italic text-[11px]">Loading datasets...</p>
        ) : datasets.length === 0 ? (
          <p className="text-slate-500 text-[11px] bg-space-950 p-2 rounded border border-space-border">
            No datasets currently associated with this region.
          </p>
        ) : (
          <div className="space-y-1.5">
            {datasets.map((d) => (
              <div key={d.id} className="p-2 rounded bg-space-950 border border-space-border text-[11px]">
                <div className="font-medium text-slate-200">{d.name}</div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono mt-0.5">
                  <span>{d.category}</span>
                  <span>{d.coordinate_reference_system}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
