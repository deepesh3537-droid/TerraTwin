import React, { useState, useEffect, useMemo } from 'react';
import { Target } from 'lucide-react';
import { Region } from '../../types';
import { assessSuitability, formatApiError, getRegions } from '../../services';
import { SiteTerrainViewer } from './SiteTerrainViewer';
import { SuitabilityOverlayControls } from './SuitabilityOverlayControls';
import { SuitabilityOverlayMode } from './SuitabilityTerrainMesh';
import { SuitabilityCriteriaPanel } from './SuitabilityCriteriaPanel';
import { SuitabilityAnalysisResults } from './SuitabilityAnalysisResults';
import { MissionReadinessReport } from './MissionReadinessReport';

export const SuitabilityPage: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState<boolean>(true);

  // Target body and region
  const [selectedPlanet, setSelectedPlanet] = useState<string>('moon');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');

  // Scientific overlay mode
  const [activeOverlay, setActiveOverlay] = useState<SuitabilityOverlayMode>('slope');

  // Evaluation criteria
  const [criteria, setCriteria] = useState<string[]>([
    'slope_safety',
    'solar_illumination',
    'resource_proximity',
    'comms_line_of_sight',
  ]);

  // Execution states
  const [loading, setLoading] = useState<boolean>(false);
  const [notImplementedInfo, setNotImplementedInfo] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, unknown> | null>(null);

  // Load regions on mount
  useEffect(() => {
    setLoadingRegions(true);
    getRegions({ limit: 100 })
      .then((data) => {
        const items = data.items || [];
        setRegions(items);

        // Default to lunar region if available, else first item
        const lunar = items.filter((r) => r.planet_id.toLowerCase() === 'moon');
        if (lunar.length > 0) {
          setSelectedRegionId(lunar[0].id);
        } else if (items.length > 0) {
          setSelectedRegionId(items[0].id);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoadingRegions(false);
      });
  }, []);

  const handleSelectPlanet = (planet: string) => {
    setSelectedPlanet(planet);
    const matching = regions.filter((r) => r.planet_id.toLowerCase() === planet.toLowerCase());
    if (matching.length > 0) {
      setSelectedRegionId(matching[0].id);
    }
  };

  const filteredRegions = useMemo(() => {
    return regions.filter((r) => r.planet_id.toLowerCase() === selectedPlanet.toLowerCase());
  }, [regions, selectedPlanet]);

  const activeRegion = useMemo(() => {
    return (
      filteredRegions.find((r) => r.id === selectedRegionId) ||
      filteredRegions[0] ||
      regions.find((r) => r.id === selectedRegionId) ||
      null
    );
  }, [filteredRegions, selectedRegionId, regions]);

  const handleToggleCriteria = (c: string) => {
    setCriteria((prev) =>
      prev.includes(c)
        ? prev.length > 1
          ? prev.filter((x) => x !== c)
          : prev
        : [...prev, c]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRegion || criteria.length === 0) return;

    setLoading(true);
    setNotImplementedInfo(null);
    setApiError(null);
    setResults(null);

    try {
      const response = await assessSuitability({
        region_id: activeRegion.id,
        criteria,
      });

      if (response && typeof response === 'object') {
        setResults(response as Record<string, unknown>);
      }
    } catch (err: unknown) {
      const formatted = formatApiError(err);
      // Backend returns 501 with message in the error envelope per BE-14 / ADR-008
      setNotImplementedInfo(formatted);
    } finally {
      setLoading(false);
    }
  };

  const isMars = selectedPlanet.toLowerCase() === 'mars';
  const isEarth = selectedPlanet.toLowerCase() === 'earth';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans select-none">
      {/* ========================================================================= */}
      {/* Header: Title & Subtitle                                                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-space-border/80">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono mb-2">
            <Target className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider">3D PLANETARY SITE ASSESSMENT & MISSION PLANNING LAB</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">MULTIVARIATE FEASIBILITY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Base Suitability Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Multivariate site evaluation for lunar and Martian permanent habitats, landing sites, and resource operations.
          </p>
        </div>

        {/* Target Body Selector Pills (Moon / Mars / Earth Analogue) */}
        <div className="flex items-center gap-1.5 bg-space-950 p-1 rounded-xl border border-space-border shrink-0 text-xs font-mono">
          <button
            onClick={() => handleSelectPlanet('moon')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedPlanet === 'moon'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MOON
          </button>
          <button
            onClick={() => handleSelectPlanet('mars')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              isMars
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MARS
          </button>
          <button
            onClick={() => handleSelectPlanet('earth')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              isEarth
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EARTH (REF)
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A — Target Site Selection & Telemetry Header                      */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-space-900 border border-space-border/80 p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-xl">
            <label className="block text-[11px] font-mono text-cyan-400 uppercase font-semibold mb-1.5">
              Select Candidate Habitat / Landing Site:
            </label>
            <select
              aria-label="Target Planetary Site or Region"
              value={activeRegion?.id || ''}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              disabled={loadingRegions}
              className="w-full bg-[#02050c] border border-cyan-500/30 text-xs rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400/60 transition-colors cursor-pointer"
            >
              {(filteredRegions.length > 0 ? filteredRegions : regions).map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.planet_id.toUpperCase()}] {r.name} — CRS: {r.coordinate_reference_system}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[#02050c] border border-space-border/80">
              <span className="text-[9px] text-slate-400 uppercase block">SPATIAL CRS</span>
              <span className="text-cyan-300 font-bold truncate block">
                {activeRegion?.coordinate_reference_system || 'IAU2000'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#02050c] border border-space-border/80">
              <span className="text-[9px] text-slate-400 uppercase block">PLANETARY BODY</span>
              <span className="text-white font-bold uppercase block">{selectedPlanet}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#02050c] border border-space-border/80 col-span-2 sm:col-span-1">
              <span className="text-[9px] text-slate-400 uppercase block">SITE CLASS</span>
              <span className="text-emerald-400 font-semibold truncate block">Candidate Site</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION B & C & E — Interactive 3D Terrain Viewer & Overlay Controls      */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <SiteTerrainViewer
          planet={selectedPlanet}
          region={activeRegion}
          overlayMode={activeOverlay}
        />

        <SuitabilityOverlayControls
          activeOverlay={activeOverlay}
          onSelectOverlay={setActiveOverlay}
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTION D & F — Evaluation Criteria & Execute Suitability Action         */}
      {/* ========================================================================= */}
      <section>
        <SuitabilityCriteriaPanel
          selectedCriteria={criteria}
          onToggleCriteria={handleToggleCriteria}
          onSubmit={handleSubmit}
          loading={loading}
          disabled={loadingRegions || !activeRegion}
        />
      </section>

      {/* ========================================================================= */}
      {/* SECTION G — Site Suitability Results & Honest 501 State                   */}
      {/* ========================================================================= */}
      <SuitabilityAnalysisResults
        region={activeRegion}
        selectedCriteria={criteria}
        loading={loading}
        notImplementedMessage={notImplementedInfo}
        errorMessage={apiError}
        results={results}
      />

      {/* ========================================================================= */}
      {/* SECTION I — Mission Readiness Synthesis Report                            */}
      {/* ========================================================================= */}
      <MissionReadinessReport
        planet={selectedPlanet}
        region={activeRegion}
        selectedCriteria={criteria}
      />
    </div>
  );
};
