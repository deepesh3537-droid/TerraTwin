import React, { useEffect, useState, useCallback } from 'react';
import {
  Filter,
  Search,
  ExternalLink,
  Layers,
  Database,
  Globe,
  Tag,
  FileText,
  X,
} from 'lucide-react';
import { Dataset, Layer } from '../../types';
import { getDatasets, getDatasetLayers } from '../../services';
import { LoadingState, EmptyState, ErrorState } from '../../components/feedback';
import { usePlanetaryContext } from '../../app/planetaryContext';

export const CatalogPage: React.FC = () => {
  const { selectedPlanet: globalPlanet } = usePlanetaryContext();
  const [selectedPlanet, setSelectedPlanet] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Detail inspection
  const [inspectedDataset, setInspectedDataset] = useState<Dataset | null>(null);
  const [datasetLayers, setDatasetLayers] = useState<Layer[]>([]);
  const [loadingLayers, setLoadingLayers] = useState<boolean>(false);

  // Sync with global planet when changed
  useEffect(() => {
    if (globalPlanet) {
      setSelectedPlanet(globalPlanet);
    }
  }, [globalPlanet]);

  const loadDatasets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { planet?: string; category?: string; status?: string } = {};
      if (selectedPlanet !== 'all') params.planet = selectedPlanet;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedStatus !== 'all') params.status = selectedStatus;

      const res = await getDatasets(params);
      setDatasets(res.items || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to connect to data catalog.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedPlanet, selectedCategory, selectedStatus]);

  useEffect(() => {
    loadDatasets();
  }, [loadDatasets]);

  const openInspector = async (ds: Dataset) => {
    setInspectedDataset(ds);
    setLoadingLayers(true);
    try {
      const layers = await getDatasetLayers(ds.id);
      setDatasetLayers(layers || []);
    } catch {
      setDatasetLayers([]);
    } finally {
      setLoadingLayers(false);
    }
  };

  const closeInspector = () => {
    setInspectedDataset(null);
    setDatasetLayers([]);
  };

  // Filter by search query client-side
  const filteredDatasets = datasets.filter((ds) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ds.name.toLowerCase().includes(q) ||
      (ds.description && ds.description.toLowerCase().includes(q)) ||
      ds.variable.toLowerCase().includes(q) ||
      (ds.source_agency && ds.source_agency.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
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
      <div className="p-4 rounded-xl bg-space-900 border border-space-border flex flex-wrap items-center justify-between gap-4">
        {/* Planet filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium mr-1">
            <Globe className="w-3.5 h-3.5" /> Body:
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

        {/* Category & Status Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              aria-label="Filter by Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-space-950 border border-space-border text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500/50"
            >
              <option value="all">All Categories</option>
              <option value="elevation">Elevation</option>
              <option value="imagery">Imagery</option>
              <option value="composition">Composition</option>
              <option value="geology">Geology</option>
              <option value="thermal">Thermal</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <select
              aria-label="Filter by Ingestion Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-space-950 border border-space-border text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500/50"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="prototype">Prototype</option>
            </select>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search datasets..."
              className="w-full bg-space-950 border border-space-border text-xs rounded-lg pl-9 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            >
            </input>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Querying dataset catalog..." />
      ) : error ? (
        <ErrorState
          title="Catalog Service Unavailable"
          message={error}
          onRetry={loadDatasets}
        />
      ) : filteredDatasets.length === 0 ? (
        <EmptyState
          title="No Datasets Found"
          message="No registered datasets match your active body, category, and status filters."
          actionText="Reset Filters"
          onAction={() => {
            setSelectedPlanet('all');
            setSelectedCategory('all');
            setSelectedStatus('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredDatasets.map((ds) => (
            <div
              key={ds.id}
              onClick={() => openInspector(ds)}
              className="p-5 rounded-xl bg-space-900 border border-space-border hover:border-sky-500/40 hover:bg-space-850/50 transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-mono uppercase px-2 py-0.5 rounded border ${
                        ds.planet_id === 'earth'
                          ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                          : ds.planet_id === 'moon'
                          ? 'bg-slate-300/10 text-slate-200 border-slate-400/30'
                          : 'bg-orange-500/10 text-orange-300 border-orange-500/30'
                      }`}
                    >
                      {ds.planet_id}
                    </span>
                    <span className="text-xs font-mono capitalize px-2 py-0.5 rounded bg-space-800 text-slate-300 border border-space-border">
                      {ds.category}
                    </span>
                    {ds.is_demo && (
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Demo Fixture
                      </span>
                    )}
                    <span
                      className={`text-xs font-mono capitalize px-2 py-0.5 rounded ${
                        ds.ingestion_status === 'available'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {ds.ingestion_status}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
                    {ds.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 bg-space-950 px-2 py-1 rounded border border-space-border">
                    {ds.coordinate_reference_system}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-4 max-w-3xl line-clamp-2">
                {ds.description || 'No description provided for this dataset.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 pt-3 border-t border-space-border">
                <div>
                  <span className="text-slate-500">Agency:</span>{' '}
                  <span className="text-slate-300">{ds.source_agency || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Variable:</span>{' '}
                  <span className="text-slate-300">{ds.variable}</span>
                </div>
                <div>
                  <span className="text-slate-500">Format:</span>{' '}
                  <span className="text-slate-300">{ds.format || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Resolution:</span>{' '}
                  <span className="text-slate-300">{ds.native_resolution || '—'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dataset Detail Inspector Modal */}
      {inspectedDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-space-900 border border-space-border rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4 border-b border-space-border pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30">
                    {inspectedDataset.planet_id}
                  </span>
                  <span className="text-xs font-mono capitalize px-2 py-0.5 rounded bg-space-800 text-slate-300 border border-space-border">
                    {inspectedDataset.category}
                  </span>
                  {inspectedDataset.is_demo && (
                    <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Demo Fixture
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-400 bg-space-950 px-2 py-0.5 rounded border border-space-border">
                    CRS: {inspectedDataset.coordinate_reference_system}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{inspectedDataset.name}</h2>
              </div>
              <button
                onClick={closeInspector}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-space-800"
                aria-label="Close Inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Description */}
              <div>
                <h4 className="text-slate-400 font-medium uppercase text-[11px] mb-1">Description</h4>
                <p className="text-slate-200 leading-relaxed bg-space-950 p-3 rounded-lg border border-space-border">
                  {inspectedDataset.description || 'No description provided.'}
                </p>
              </div>

              {/* Scientific Provenance Section */}
              <div>
                <h4 className="text-slate-400 font-medium uppercase text-[11px] mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-400" /> Scientific Provenance
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-space-950 p-3 rounded-lg border border-space-border">
                  <div>
                    <span className="text-slate-500">Source Agency:</span>{' '}
                    <span className="text-slate-200 font-medium">{inspectedDataset.source_agency || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Mission:</span>{' '}
                    <span className="text-slate-200 font-medium">{inspectedDataset.mission || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Instrument / Sensor:</span>{' '}
                    <span className="text-slate-200 font-medium">{inspectedDataset.instrument || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Processing Level:</span>{' '}
                    <span className="text-slate-200 font-medium">{inspectedDataset.processing_level || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">License:</span>{' '}
                    <span className="text-slate-200 font-medium">{inspectedDataset.license || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Source URL:</span>{' '}
                    {inspectedDataset.source_url ? (
                      <a
                        href={inspectedDataset.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-400 hover:underline inline-flex items-center gap-1"
                      >
                        External Link <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                  {inspectedDataset.citation && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-500">Citation:</span>{' '}
                      <span className="text-slate-300 italic">{inspectedDataset.citation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Specifications */}
              <div>
                <h4 className="text-slate-400 font-medium uppercase text-[11px] mb-2 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-sky-400" /> Technical Specifications
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-space-950 p-3 rounded-lg border border-space-border font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">VARIABLE</span>
                    <span className="text-slate-200">{inspectedDataset.variable}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">UNIT</span>
                    <span className="text-slate-200">{inspectedDataset.unit || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">FORMAT</span>
                    <span className="text-slate-200">{inspectedDataset.format || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">RESOLUTION</span>
                    <span className="text-slate-200">{inspectedDataset.native_resolution || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">TEMPORAL RANGE</span>
                    <span className="text-slate-200">
                      {inspectedDataset.temporal_start || inspectedDataset.temporal_end
                        ? `${inspectedDataset.temporal_start || 'Start'} to ${inspectedDataset.temporal_end || 'Present'}`
                        : 'Static'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">STATUS</span>
                    <span className="text-emerald-400 capitalize">{inspectedDataset.ingestion_status}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-slate-500 block text-[10px]">LOCAL RELATIVE PATH (NO MACHINE ABSOLUTES)</span>
                    <span className="text-slate-300 break-all">{inspectedDataset.local_path || 'Not stored locally'}</span>
                  </div>
                </div>
              </div>

              {/* Related Layers */}
              <div>
                <h4 className="text-slate-400 font-medium uppercase text-[11px] mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" /> Associated Map Layers
                </h4>
                {loadingLayers ? (
                  <p className="text-slate-500 italic">Querying associated layers...</p>
                ) : datasetLayers.length === 0 ? (
                  <p className="text-slate-500 bg-space-950 p-3 rounded-lg border border-space-border">
                    No active map layer views registered for this dataset yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {datasetLayers.map((layer) => (
                      <div
                        key={layer.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-space-950 border border-space-border"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-200 font-medium">{layer.name}</span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-space-800 text-slate-400">
                              {layer.rendering_type}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{layer.description || 'Layer view'}</span>
                        </div>
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded ${
                            layer.available
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {layer.available ? 'Ready' : 'Not Renderable'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-space-border flex justify-end">
              <button
                onClick={closeInspector}
                className="px-4 py-2 rounded-lg bg-space-800 hover:bg-space-700 text-slate-200 text-xs font-medium transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
