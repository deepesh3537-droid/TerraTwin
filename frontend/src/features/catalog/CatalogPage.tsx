import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { Dataset } from '../../types';
import { getDatasets } from '../../services';
import { LoadingState, EmptyState } from '../../components/feedback';
import { usePlanetaryContext } from '../../app/planetaryContext';
import { CatalogHeader } from './CatalogHeader';
import { CatalogFilterBar } from './CatalogFilterBar';
import { DatasetGridView } from './DatasetGridView';
import { DatasetListView } from './DatasetListView';
import { DatasetDetailDrawer } from './DatasetDetailDrawer';
import { DatasetComparisonModal } from './DatasetComparisonModal';
import { DEMO_CATALOG_DATASETS } from './catalogDemoData';

export const CatalogPage: React.FC = () => {
  const { selectedPlanet: globalPlanet } = usePlanetaryContext();

  // Active filters
  const [selectedPlanet, setSelectedPlanet] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // View state: 'grid' | 'list'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Backend dataset records
  const [backendDatasets, setBackendDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Offline / Demonstration mode toggle
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Inspection drawer state
  const [inspectedDataset, setInspectedDataset] = useState<Dataset | null>(null);

  // Multi-dataset comparison state
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);

  // Synchronize with global planetary context when it changes
  useEffect(() => {
    if (globalPlanet && globalPlanet !== 'all') {
      setSelectedPlanet(globalPlanet);
    }
  }, [globalPlanet]);

  // Load datasets from backend API (GET /api/v1/datasets)
  const loadDatasets = useCallback(async () => {
    setLoading(true);
    setBackendError(null);

    try {
      // Query backend with limit 100
      const res = await getDatasets({ limit: 100 });
      const items = res.items || [];
      setBackendDatasets(items);
      setIsBackendConnected(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to connect to dataset catalog API.';
      setBackendError(msg);
      setIsBackendConnected(false);
      // Auto-enable demo catalog if backend is completely offline so the user can inspect the UI
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDatasets();
  }, [loadDatasets]);

  // Determine active source dataset collection
  const activeDatasetCollection = useMemo(() => {
    if (isBackendConnected && backendDatasets.length > 0 && !isDemoMode) {
      return backendDatasets;
    }
    if (isDemoMode) {
      return DEMO_CATALOG_DATASETS;
    }
    return backendDatasets;
  }, [isBackendConnected, backendDatasets, isDemoMode]);

  // Compute statistics strictly from actual data
  const stats = useMemo(() => {
    if (!isBackendConnected && !isDemoMode) {
      return { total: null, earth: null, moon: null, mars: null };
    }

    const collection = activeDatasetCollection;
    return {
      total: collection.length,
      earth: collection.filter((d) => d.planet_id === 'earth').length,
      moon: collection.filter((d) => d.planet_id === 'moon').length,
      mars: collection.filter((d) => d.planet_id === 'mars').length,
    };
  }, [isBackendConnected, isDemoMode, activeDatasetCollection]);

  // Multi-field client filtering
  const filteredDatasets = useMemo(() => {
    return activeDatasetCollection.filter((ds) => {
      // Planet filter
      if (selectedPlanet !== 'all' && ds.planet_id !== selectedPlanet) {
        return false;
      }

      // Category filter (support category substring/synonym e.g. terrain_elevation -> elevation)
      if (selectedCategory !== 'all') {
        const cat = ds.category.toLowerCase();
        if (selectedCategory === 'elevation' && !cat.includes('elevation') && !cat.includes('topo')) {
          return false;
        } else if (selectedCategory !== 'elevation' && !cat.includes(selectedCategory)) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all' && ds.ingestion_status.toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }

      // Format filter
      if (selectedFormat !== 'all') {
        const fmt = (ds.format || '').toLowerCase();
        if (!fmt.includes(selectedFormat.toLowerCase())) {
          return false;
        }
      }

      // Search query (case-insensitive across name, description, variable, agency, mission, instrument)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesName = ds.name.toLowerCase().includes(q);
        const matchesDesc = (ds.description || '').toLowerCase().includes(q);
        const matchesVar = ds.variable.toLowerCase().includes(q);
        const matchesAgency = (ds.source_agency || '').toLowerCase().includes(q);
        const matchesMission = (ds.mission || '').toLowerCase().includes(q);
        const matchesInstrument = (ds.instrument || '').toLowerCase().includes(q);
        const matchesCrs = ds.coordinate_reference_system.toLowerCase().includes(q);

        if (
          !matchesName &&
          !matchesDesc &&
          !matchesVar &&
          !matchesAgency &&
          !matchesMission &&
          !matchesInstrument &&
          !matchesCrs
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    activeDatasetCollection,
    selectedPlanet,
    selectedCategory,
    selectedStatus,
    selectedFormat,
    searchQuery,
  ]);

  // Toggle dataset comparison selection
  const handleToggleCompare = (dataset: Dataset) => {
    setSelectedCompareIds((prev) =>
      prev.includes(dataset.id) ? prev.filter((id) => id !== dataset.id) : [...prev, dataset.id]
    );
  };

  // Remove single dataset from comparison
  const handleRemoveCompare = (id: string) => {
    setSelectedCompareIds((prev) => prev.filter((x) => x !== id));
  };

  // Clear all compare selections
  const handleClearCompare = () => {
    setSelectedCompareIds([]);
    setIsComparisonOpen(false);
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setSelectedPlanet('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedFormat('all');
    setSearchQuery('');
  };

  // Datasets selected for multi-comparison matrix
  const compareDatasets = useMemo(() => {
    return activeDatasetCollection.filter((ds) => selectedCompareIds.includes(ds.id));
  }, [activeDatasetCollection, selectedCompareIds]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      {/* ========================================================================= */}
      {/* 1. Header & Compact Statistics Section                                    */}
      {/* ========================================================================= */}
      <CatalogHeader
        totalCount={stats.total}
        earthCount={stats.earth}
        moonCount={stats.moon}
        marsCount={stats.mars}
        isBackendConnected={isBackendConnected}
        isDemoMode={isDemoMode}
        loading={loading}
        onRetry={loadDatasets}
        onToggleDemoMode={() => setIsDemoMode((prev) => !prev)}
      />

      {/* ========================================================================= */}
      {/* 2. Backend Offline Warning Banner (When Live API is Unreachable)         */}
      {/* ========================================================================= */}
      {!isBackendConnected && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white uppercase text-[11px] block">
                Catalog Service Offline — GET /api/v1/datasets Unreachable
              </span>
              <p className="text-[11px] text-amber-300/80 font-sans leading-relaxed">
                {backendError || 'Backend API server is currently not responding.'} Showing curated
                demonstration dataset fixtures with real scientific provenance for offline evaluation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={loadDatasets}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 text-[11px] font-bold transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Retry Connection</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. Advanced Dataset Filtering Bar                                         */}
      {/* ========================================================================= */}
      <CatalogFilterBar
        selectedPlanet={selectedPlanet}
        onSelectPlanet={setSelectedPlanet}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        selectedFormat={selectedFormat}
        onSelectFormat={setSelectedFormat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        selectedCount={selectedCompareIds.length}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onResetFilters={handleResetFilters}
      />

      {/* ========================================================================= */}
      {/* 4. Dataset Discovery Area (Grid View vs List View)                        */}
      {/* ========================================================================= */}
      {loading ? (
        <LoadingState message="Synchronizing scientific catalog records..." />
      ) : filteredDatasets.length === 0 ? (
        <EmptyState
          title="No Matching Datasets Found"
          message="No scientific datasets match your active planetary body, category, format, or search filters."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="space-y-3">
          {/* Active Results Count & Active Comparison Counter */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>
              Displaying <strong className="text-white">{filteredDatasets.length}</strong> registered{' '}
              {filteredDatasets.length === 1 ? 'dataset' : 'datasets'}
              {isDemoMode && ' (Offline Demonstration Fixtures)'}
            </span>

            {selectedCompareIds.length > 0 && (
              <button
                onClick={() => setIsComparisonOpen(true)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{selectedCompareIds.length} selected for comparison</span>
              </button>
            )}
          </div>

          {/* Render Active View Mode */}
          {viewMode === 'grid' ? (
            <DatasetGridView
              datasets={filteredDatasets}
              onSelectDataset={setInspectedDataset}
              selectedCompareIds={selectedCompareIds}
              onToggleCompare={handleToggleCompare}
            />
          ) : (
            <DatasetListView
              datasets={filteredDatasets}
              onSelectDataset={setInspectedDataset}
              selectedCompareIds={selectedCompareIds}
              onToggleCompare={handleToggleCompare}
            />
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. Dataset Detail Inspector Drawer                                        */}
      {/* ========================================================================= */}
      <DatasetDetailDrawer
        dataset={inspectedDataset}
        onClose={() => setInspectedDataset(null)}
        isSelectedForCompare={
          inspectedDataset ? selectedCompareIds.includes(inspectedDataset.id) : false
        }
        onToggleCompare={(ds) => handleToggleCompare(ds)}
      />

      {/* ========================================================================= */}
      {/* 6. Multi-Dataset Comparison Modal                                         */}
      {/* ========================================================================= */}
      {isComparisonOpen && (
        <DatasetComparisonModal
          selectedDatasets={compareDatasets}
          onClose={() => setIsComparisonOpen(false)}
          onRemoveDataset={handleRemoveCompare}
          onClearAll={handleClearCompare}
        />
      )}
    </div>
  );
};
