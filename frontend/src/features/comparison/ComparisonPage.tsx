import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRightLeft,
  Link2,
  Unlink2,
  RotateCcw,
  Radio,
} from 'lucide-react';
import { Region } from '../../types';
import { compareRegions, formatApiError, getRegions } from '../../services';
import { TerrainViewer, CameraSyncState } from './TerrainViewer';
import { ComparisonParameters } from './ComparisonParameters';
import { ComparisonResults } from './ComparisonResults';

export const ComparisonPage: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState<boolean>(true);

  // Selected regions
  const [referenceRegionId, setReferenceRegionId] = useState<string>('');
  const [candidateRegionId, setCandidateRegionId] = useState<string>('');

  // Selected comparison variables
  const [selectedVariables, setSelectedVariables] = useState<string[]>([
    'elevation',
    'slope',
    'roughness',
  ]);

  // Camera synchronization state
  const [syncCameras, setSyncCameras] = useState<boolean>(true);
  const [syncedCameraState, setSyncedCameraState] = useState<CameraSyncState | null>(null);

  // Comparison execution states
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [notImplementedInfo, setNotImplementedInfo] = useState<string | null>(null);
  const [apiResponseError, setApiResponseError] = useState<string | null>(null);
  const [comparisonResults, setComparisonResults] = useState<Record<string, unknown> | null>(null);

  // Separate reference targets (Moon/Mars) and terrestrial candidates (Earth)
  const referenceRegions = useMemo(() => {
    return regions.filter((r) => r.planet_id.toLowerCase() !== 'earth');
  }, [regions]);

  const candidateRegions = useMemo(() => {
    return regions.filter((r) => r.planet_id.toLowerCase() === 'earth');
  }, [regions]);

  // Active region objects
  const selectedReferenceRegion = useMemo(() => {
    return (
      referenceRegions.find((r) => r.id === referenceRegionId) ||
      referenceRegions[0] ||
      regions.find((r) => r.id === referenceRegionId) ||
      null
    );
  }, [referenceRegions, referenceRegionId, regions]);

  const selectedCandidateRegion = useMemo(() => {
    return (
      candidateRegions.find((r) => r.id === candidateRegionId) ||
      candidateRegions[0] ||
      regions.find((r) => r.id === candidateRegionId) ||
      null
    );
  }, [candidateRegions, candidateRegionId, regions]);

  const [searchParams] = useSearchParams();

  // Load regions from API on mount
  useEffect(() => {
    setLoadingRegions(true);
    getRegions({ limit: 100 })
      .then((data) => {
        const items = data.items || [];
        setRegions(items);

        const extraterrestrial = items.filter((r) => r.planet_id.toLowerCase() !== 'earth');
        const terrestrial = items.filter((r) => r.planet_id.toLowerCase() === 'earth');

        const urlRef = searchParams.get('ref');
        const urlCand = searchParams.get('cand');

        if (urlRef && items.some((r) => r.id === urlRef)) {
          setReferenceRegionId(urlRef);
        } else if (extraterrestrial.length > 0) {
          setReferenceRegionId(extraterrestrial[0].id);
        } else if (items.length > 0) {
          setReferenceRegionId(items[0].id);
        }

        if (urlCand && items.some((r) => r.id === urlCand)) {
          setCandidateRegionId(urlCand);
        } else if (terrestrial.length > 0) {
          setCandidateRegionId(terrestrial[0].id);
        } else if (items.length > 1) {
          setCandidateRegionId(items[1].id);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoadingRegions(false);
      });
  }, [searchParams]);

  const handleToggleVariable = (v: string) => {
    setSelectedVariables((prev) =>
      prev.includes(v)
        ? prev.length > 1
          ? prev.filter((item) => item !== v)
          : prev
        : [...prev, v]
    );
  };

  const handleCameraUpdate = useCallback(
    (source: string, position: [number, number, number], target: [number, number, number]) => {
      if (!syncCameras) return;
      setSyncedCameraState({ source, position, target });
    },
    [syncCameras]
  );

  const handleRunComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReferenceRegion || !selectedCandidateRegion || selectedVariables.length === 0) return;

    setSubmitting(true);
    setApiResponseError(null);
    setNotImplementedInfo(null);
    setComparisonResults(null);

    try {
      const response = await compareRegions({
        reference_region_id: selectedReferenceRegion.id,
        candidate_region_id: selectedCandidateRegion.id,
        variables: selectedVariables,
      });

      if (response && typeof response === 'object') {
        setComparisonResults(response as Record<string, unknown>);
      }
    } catch (err: unknown) {
      const formatted = formatApiError(err);
      // The backend returns 501 with message in the error envelope per BE-14 / ADR-008
      setNotImplementedInfo(formatted);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetWorkspace = () => {
    setNotImplementedInfo(null);
    setApiResponseError(null);
    setComparisonResults(null);
    setSelectedVariables(['elevation', 'slope', 'roughness']);
    setSyncCameras(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans select-none">
      {/* ========================================================================= */}
      {/* Header: Title & Subtitle                                                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-space-border/80">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono mb-2">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider">PAIRWISE TERRAIN COMPARISON LAB</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">MULTI-SPECTRAL ALTIMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Region Comparison Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Compare terrestrial environments against lunar and Martian exploration targets using measurable terrain and environmental characteristics.
          </p>
        </div>

        {/* Global Camera Sync Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSyncCameras((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
              syncCameras
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                : 'bg-space-950 text-slate-400 border-space-border hover:text-slate-200'
            }`}
          >
            {syncCameras ? (
              <>
                <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sync Cameras: ON</span>
              </>
            ) : (
              <>
                <Unlink2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Sync Cameras: OFF</span>
              </>
            )}
          </button>

          <button
            onClick={handleResetWorkspace}
            title="Reset Workspace"
            className="p-2 rounded-xl bg-space-950 text-slate-400 hover:text-slate-200 border border-space-border hover:border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Workspace Control Bar: Region Dropdowns & Action                         */}
      {/* ========================================================================= */}
      <form onSubmit={handleRunComparison} className="p-4 rounded-2xl bg-space-900 border border-space-border/80 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Reference Target Dropdown (Extraterrestrial) */}
          <div className="lg:col-span-2 p-3 rounded-xl bg-space-950/80 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Reference Target (Extraterrestrial)
              </span>
              <span className="text-[9px] font-mono text-slate-400">MOON / MARS</span>
            </div>
            <select
              aria-label="Select Reference Target Region"
              value={selectedReferenceRegion?.id || ''}
              onChange={(e) => setReferenceRegionId(e.target.value)}
              disabled={loadingRegions}
              className="w-full bg-[#030712] border border-cyan-500/20 text-xs rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400/60 transition-colors cursor-pointer"
            >
              {(referenceRegions.length > 0 ? referenceRegions : regions).map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.planet_id.toUpperCase()}] {r.name} ({r.coordinate_reference_system})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Terrestrial Candidate Dropdown (Earth) */}
          <div className="lg:col-span-2 p-3 rounded-xl bg-space-950/80 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Terrestrial Candidate (Earth)
              </span>
              <span className="text-[9px] font-mono text-slate-400">TERRESTRIAL ANALOGUE</span>
            </div>
            <select
              aria-label="Select Candidate Analog Region"
              value={selectedCandidateRegion?.id || ''}
              onChange={(e) => setCandidateRegionId(e.target.value)}
              disabled={loadingRegions}
              className="w-full bg-[#030712] border border-emerald-500/20 text-xs rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400/60 transition-colors cursor-pointer"
            >
              {(candidateRegions.length > 0 ? candidateRegions : regions).map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.planet_id.toUpperCase()}] {r.name} ({r.coordinate_reference_system})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Primary CTA: Run Pairwise Comparison */}
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={submitting || !selectedReferenceRegion || !selectedCandidateRegion}
              className="w-full h-[46px] rounded-xl font-bold text-xs text-[#030712] bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{submitting ? 'Comparing...' : 'Run Pairwise Comparison'}</span>
            </button>
          </div>
        </div>

        {/* Comparison Parameters Selector Chips */}
        <div className="pt-2 border-t border-space-border/60">
          <ComparisonParameters
            selectedVariables={selectedVariables}
            onToggleVariable={handleToggleVariable}
          />
        </div>
      </form>

      {/* ========================================================================= */}
      {/* 2 LARGE 3D TERRAIN VISUALIZATIONS (Side-by-Side Horizontal Layout)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL — REFERENCE TARGET (Extraterrestrial: Moon / Mars) */}
        <TerrainViewer
          viewerId="ref"
          title="Extraterrestrial Reference Target"
          badgeTag="REFERENCE TARGET"
          badgeColor="cyan"
          planet={selectedReferenceRegion?.planet_id || 'moon'}
          region={selectedReferenceRegion}
          syncEnabled={syncCameras}
          syncedCameraState={syncedCameraState}
          onCameraUpdate={handleCameraUpdate}
        />

        {/* RIGHT PANEL — TERRESTRIAL ANALOG (Earth) */}
        <TerrainViewer
          viewerId="cand"
          title="Terrestrial Candidate Analogue"
          badgeTag="TERRESTRIAL ANALOGUE"
          badgeColor="emerald"
          planet="earth"
          region={selectedCandidateRegion}
          syncEnabled={syncCameras}
          syncedCameraState={syncedCameraState}
          onCameraUpdate={handleCameraUpdate}
        />
      </div>

      {/* ========================================================================= */}
      {/* Scientific Comparison Analysis & Results Section                         */}
      {/* ========================================================================= */}
      <ComparisonResults
        referenceRegion={selectedReferenceRegion}
        candidateRegion={selectedCandidateRegion}
        selectedVariables={selectedVariables}
        loading={submitting}
        results={comparisonResults}
        notImplementedMessage={notImplementedInfo}
        errorMessage={apiResponseError}
      />
    </div>
  );
};
