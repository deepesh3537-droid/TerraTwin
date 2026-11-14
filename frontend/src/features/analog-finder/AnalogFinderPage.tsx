import React, { useState, useEffect, useMemo } from 'react';
import {
  Cpu,
  Globe,
  Compass,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Region } from '../../types';
import { findAnalogs, formatApiError, getRegions } from '../../services';
import { TargetEnvironmentPanel } from './TargetEnvironmentPanel';
import { AnalogSearchConfiguration } from './AnalogSearchConfiguration';
import { CandidateMap } from './CandidateMap';
import { RankedCandidateList } from './RankedCandidateList';
import { SelectedCandidateExplorer } from './SelectedCandidateExplorer';
import { CameraSyncState } from '../comparison/TerrainViewer';

export const AnalogFinderPage: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState<boolean>(true);

  // Target planetary environment selection
  const [selectedPlanet, setSelectedPlanet] = useState<string>('moon');
  const [targetRegionId, setTargetRegionId] = useState<string>('');

  // Search parameters
  const [selectedVariables, setSelectedVariables] = useState<string[]>([
    'elevation',
    'slope',
    'roughness',
    'temperature',
  ]);

  // Selected candidate region
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');

  // Camera synchronization state for target preview
  const [targetSyncCamera, setTargetSyncCamera] = useState<CameraSyncState | null>(null);

  // Execution states
  const [loading, setLoading] = useState<boolean>(false);
  const [notImplementedInfo, setNotImplementedInfo] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load regions on mount
  useEffect(() => {
    setLoadingRegions(true);
    getRegions({ limit: 100 })
      .then((data) => {
        const items = data.items || [];
        setRegions(items);

        // Default target region for initial planet
        const targets = items.filter((r) => r.planet_id.toLowerCase() === 'moon');
        if (targets.length > 0) {
          setTargetRegionId(targets[0].id);
        } else if (items.length > 0) {
          setTargetRegionId(items[0].id);
        }

        // Default candidate region for Earth
        const candidates = items.filter((r) => r.planet_id.toLowerCase() === 'earth');
        if (candidates.length > 0) {
          setSelectedCandidateId(candidates[0].id);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoadingRegions(false);
      });
  }, []);

  // Update target region if target planet changes
  const handleSelectPlanet = (planet: string) => {
    setSelectedPlanet(planet);
    const matching = regions.filter((r) => r.planet_id.toLowerCase() === planet.toLowerCase());
    if (matching.length > 0) {
      setTargetRegionId(matching[0].id);
    }
  };

  // Filtered regions
  const targetRegions = useMemo(() => {
    return regions.filter((r) => r.planet_id.toLowerCase() === selectedPlanet.toLowerCase());
  }, [regions, selectedPlanet]);

  const candidateRegions = useMemo(() => {
    return regions.filter((r) => r.planet_id.toLowerCase() === 'earth');
  }, [regions]);

  const selectedTargetRegion = useMemo(() => {
    return (
      targetRegions.find((r) => r.id === targetRegionId) ||
      targetRegions[0] ||
      regions.find((r) => r.id === targetRegionId) ||
      null
    );
  }, [targetRegions, targetRegionId, regions]);

  const selectedCandidateRegion = useMemo(() => {
    return (
      candidateRegions.find((r) => r.id === selectedCandidateId) ||
      candidateRegions[0] ||
      null
    );
  }, [candidateRegions, selectedCandidateId]);

  const handleToggleVariable = (v: string) => {
    setSelectedVariables((prev) =>
      prev.includes(v)
        ? prev.length > 1
          ? prev.filter((x) => x !== v)
          : prev
        : [...prev, v]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetRegion || selectedVariables.length === 0) return;

    setLoading(true);
    setNotImplementedInfo(null);
    setApiError(null);

    try {
      await findAnalogs({
        target_region_id: selectedTargetRegion.id,
        candidate_planet: 'earth',
        variables: selectedVariables,
        limit: 10,
      });
    } catch (err: unknown) {
      const formatted = formatApiError(err);
      // Backend returns 501 with message in the error envelope per BE-14 / ADR-011
      setNotImplementedInfo(formatted);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans select-none">
      {/* ========================================================================= */}
      {/* Header: Title & Subtitle                                                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-space-border/80">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-[10px] font-mono mb-2">
            <Cpu className="w-3 h-3 text-purple-400 animate-pulse" />
            <span className="font-bold tracking-wider">AI-POWERED PLANETARY ANALOG DISCOVERY LAB</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">PARAMETRIC SIMILARITY RANKING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Analog Finder
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Discover and rank terrestrial locations on Earth with comparable measurable characteristics to a target lunar or Martian exploration site.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 text-xs font-mono bg-space-950 px-3 py-1.5 rounded-xl border border-space-border shrink-0">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Target Body:</span>
          <span className="text-cyan-300 font-bold uppercase">{selectedPlanet}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A — Target Planetary Environment (Selection & 3D Terrain Preview)*/}
      {/* ========================================================================= */}
      <TargetEnvironmentPanel
        selectedPlanet={selectedPlanet}
        onSelectPlanet={handleSelectPlanet}
        regions={targetRegions.length > 0 ? targetRegions : regions}
        targetRegion={selectedTargetRegion}
        onSelectRegion={setTargetRegionId}
        syncEnabled={false}
        syncedCameraState={targetSyncCamera}
        onCameraUpdate={(_, pos, target) => setTargetSyncCamera({ source: 'target', position: pos, target })}
      />

      {/* ========================================================================= */}
      {/* SECTION B & C — Analog Search Configuration & Execution Action           */}
      {/* ========================================================================= */}
      <AnalogSearchConfiguration
        selectedVariables={selectedVariables}
        onToggleVariable={handleToggleVariable}
        onSubmit={handleSubmit}
        loading={loading}
        disabled={loadingRegions || !selectedTargetRegion}
      />

      {/* ========================================================================= */}
      {/* Error / 501 Architectural Notification (ADR-008 & ADR-011)               */}
      {/* ========================================================================= */}
      {notImplementedInfo && (
        <div className="p-6 rounded-2xl bg-space-900 border border-purple-500/30 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/40 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold uppercase">
                  SIMILARITY PIPELINE CONTRACT READY · HTTP 501
                </span>
                <span className="text-xs font-mono text-slate-400">
                  POST /api/v1/analysis/similarity
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Terrestrial Analog Ranking Engine Status
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {notImplementedInfo}
          </p>

          <div className="p-3.5 rounded-xl bg-[#02050c] border border-space-border/80 text-xs text-slate-400 font-mono space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ADR-011 MULTI-DIMENSIONAL RANKING DISCLOSURE:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              In accordance with ADR-011, terrestrial analog matching ranks candidates by multi-dimensional similarity distance with explicit uncertainty metrics. It is never presented as a probability or synthetic percentage score.
            </p>
          </div>
        </div>
      )}

      {apiError && (
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-rose-200 flex items-center gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION D — Analog Discovery Results (Map & Ranked Candidates List)      */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              Terrestrial Candidate Distribution & Ranking
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {candidateRegions.length} Earth Testbeds Available
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Earth Candidate GIS Map */}
          <CandidateMap
            candidates={candidateRegions}
            selectedCandidate={selectedCandidateRegion}
            onSelectCandidate={(c) => setSelectedCandidateId(c.id)}
          />

          {/* Right: Ranked Candidate List */}
          <RankedCandidateList
            candidates={candidateRegions}
            selectedCandidate={selectedCandidateRegion}
            onSelectCandidate={(c) => setSelectedCandidateId(c.id)}
            selectedVariables={selectedVariables}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION E, F, G — Selected Candidate 3D Exploration & Scientific Variance*/}
      {/* ========================================================================= */}
      {selectedCandidateRegion && selectedTargetRegion && (
        <SelectedCandidateExplorer
          selectedPlanet={selectedPlanet}
          targetRegion={selectedTargetRegion}
          candidateRegion={selectedCandidateRegion}
          selectedVariables={selectedVariables}
        />
      )}
    </div>
  );
};
