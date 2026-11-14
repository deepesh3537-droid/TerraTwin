import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Database,
  Sparkles,
  ArrowRight,
  Server,
  Activity,
  Layers,
  MapPin,
  RefreshCw,
  Orbit,
  Cpu,
  Compass,
  Radar,
  Radio,
  Clock,
  ChevronRight,
  Crosshair,
  Sliders,
  Flame,
  Droplets,
  Wind,
  Mountain,
} from 'lucide-react';
import {
  getDatasets,
  getLayers,
  getPlanets,
  getReadiness,
  getRegions,
  getSystemInfo,
} from '../../services';
import { Dataset, Layer, Region, ReadinessResponse, SystemInfo } from '../../types';
import { usePlanetaryContext } from '../../app/planetaryContext';

/**
 * Scientific categories per NASA analog mission classification
 */
interface ScientificCategoryDef {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
}

const SCIENTIFIC_CATEGORIES: ScientificCategoryDef[] = [
  {
    id: 'terrain_elevation',
    name: 'Terrain & Elevation',
    description: 'Digital elevation models, slope gradients & topography',
    icon: Mountain,
    keywords: ['terrain', 'elevation', 'topography', 'dem', 'slope', 'roughness'],
  },
  {
    id: 'geology_mineralogy',
    name: 'Geology & Mineralogy',
    description: 'Lithology, surface composition & spectral bands',
    icon: Sparkles,
    keywords: ['geology', 'mineralogy', 'composition', 'lithology', 'rock', 'spectral'],
  },
  {
    id: 'surface_temperature',
    name: 'Surface Temperature',
    description: 'Thermal inertia, surface heat flux & diurnal range',
    icon: Flame,
    keywords: ['temperature', 'thermal', 'heat', 'surface_temp'],
  },
  {
    id: 'water_ice',
    name: 'Water, Ice & Permafrost',
    description: 'Volatiles, subsurface ice sheets & paleohydrology',
    icon: Droplets,
    keywords: ['water', 'ice', 'permafrost', 'volatiles', 'hydrology'],
  },
  {
    id: 'dust_wind',
    name: 'Dust, Wind & Erosion',
    description: 'Eolian features, atmospheric optical depth & abrasion',
    icon: Wind,
    keywords: ['dust', 'wind', 'erosion', 'eolian', 'atmosphere'],
  },
  {
    id: 'surface_materials',
    name: 'Surface Materials',
    description: 'Regolith properties, grain size & trafficability',
    icon: Compass,
    keywords: ['material', 'regolith', 'soil', 'grain', 'bearing'],
  },
];

type CoverageStatus = 'available' | 'metadata' | 'no_data' | 'offline';

interface ActivityItem {
  id: string;
  type: 'dataset' | 'region' | 'layer';
  title: string;
  planet: string;
  note: string;
  timestamp: string;
}

/**
 * Aerospace Vector Earth Visual for Mission Control Hero
 */
const AerospaceEarthVisual: React.FC = () => {
  return (
    <div className="relative w-44 h-44 sm:w-52 sm:h-52 shrink-0 flex items-center justify-center">
      {/* Outer Radar Telemetry Grid Ring */}
      <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/30 animate-[spin_40s_linear_infinite_reverse]" />

      {/* Crosshair lines */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/20" />

      {/* Orbiting Satellite Marker */}
      <div className="absolute inset-[-6px] rounded-full animate-[spin_12s_linear_infinite]">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] ml-auto -mt-1.5 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-white" />
        </div>
      </div>

      {/* Earth Planetary Disc */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-[0_0_35px_rgba(56,189,248,0.25)] border border-sky-400/40">
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full bg-gradient-to-tr from-[#020617] via-[#041d3d] to-[#0c3a6b]"
        >
          <defs>
            <radialGradient id="earthAtmosphere" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0" />
              <stop offset="90%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.8" />
            </radialGradient>
            <linearGradient id="continentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Continents Silhouettes */}
          <path
            d="M 35 45 Q 55 30 75 42 Q 90 55 85 70 Q 70 85 50 80 Q 30 70 35 45 Z"
            fill="url(#continentGradient)"
            opacity="0.7"
          />
          <path
            d="M 95 65 Q 120 55 135 75 Q 140 100 120 120 Q 95 115 90 95 Q 85 80 95 65 Z"
            fill="url(#continentGradient)"
            opacity="0.6"
          />
          <path
            d="M 50 105 Q 70 95 80 115 Q 75 135 55 140 Q 40 130 50 105 Z"
            fill="url(#continentGradient)"
            opacity="0.5"
          />

          {/* Latitude & Longitude Coordinate Lines */}
          <ellipse cx="80" cy="80" rx="72" ry="72" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4" />
          <ellipse cx="80" cy="80" rx="60" ry="24" fill="none" stroke="#38bdf8" strokeWidth="0.6" strokeOpacity="0.3" />
          <ellipse cx="80" cy="80" rx="40" ry="72" fill="none" stroke="#38bdf8" strokeWidth="0.6" strokeOpacity="0.3" />
          <line x1="8" y1="80" x2="152" y2="80" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 3" />
          <line x1="80" y1="8" x2="80" y2="152" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 3" />

          {/* Atmospheric Rayleigh Rim */}
          <circle cx="80" cy="80" r="76" fill="url(#earthAtmosphere)" />
        </svg>

        {/* Dynamic Scanline Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent pointer-events-none" />
      </div>

      {/* Mission Telemetry Labels */}
      <div className="absolute -top-1 -left-2 text-[9px] font-mono text-cyan-400/80 bg-space-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
        REF-TERRA-01
      </div>
      <div className="absolute -bottom-1 -right-2 text-[9px] font-mono text-slate-400 bg-space-950/80 px-1.5 py-0.5 rounded border border-space-border">
        1.00 AU · J2000
      </div>
    </div>
  );
};

export const OverviewPage: React.FC = () => {
  const { selectedPlanet, setSelectedPlanet, setShowEntryScreen } = usePlanetaryContext();

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [readiness, setReadiness] = useState<ReadinessResponse | null>(null);

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  const [datasetCount, setDatasetCount] = useState<number | null>(null);
  const [layerCount, setLayerCount] = useState<number | null>(null);
  const [regionCount, setRegionCount] = useState<number | null>(null);
  const [planetCount, setPlanetCount] = useState<number | null>(null);

  const fetchOverviewData = useCallback(async () => {
    setRefreshing(true);

    try {
      const [sysRes, readyRes, dsRes, layRes, regRes, planRes] = await Promise.allSettled([
        getSystemInfo(),
        getReadiness(),
        getDatasets({ limit: 50 }),
        getLayers(),
        getRegions({ limit: 50 }),
        getPlanets(),
      ]);

      if (sysRes.status === 'fulfilled') {
        setSystemInfo(sysRes.value);
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }

      if (readyRes.status === 'fulfilled') {
        setReadiness(readyRes.value);
      }

      if (dsRes.status === 'fulfilled') {
        setDatasets(dsRes.value.items || []);
        setDatasetCount(dsRes.value.total);
      }

      if (layRes.status === 'fulfilled') {
        setLayers(layRes.value || []);
        setLayerCount(layRes.value.length);
      }

      if (regRes.status === 'fulfilled') {
        setRegions(regRes.value.items || []);
        setRegionCount(regRes.value.total);
      }

      if (planRes.status === 'fulfilled') {
        setPlanetCount(planRes.value.length);
      }
    } catch {
      setBackendOnline(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  /**
   * Helper to evaluate coverage status for category & planet
   */
  const getCoverageStatus = (planet: string, category: ScientificCategoryDef): CoverageStatus => {
    if (backendOnline === false) return 'offline';

    const planetLayers = layers.filter((l) => l.planet_id.toLowerCase() === planet.toLowerCase());
    const planetDatasets = datasets.filter((d) => d.planet_id.toLowerCase() === planet.toLowerCase());

    const hasMatchingLayer = planetLayers.some(
      (l) =>
        l.category === category.id ||
        category.keywords.some(
          (k) => l.category?.toLowerCase().includes(k) || l.variable?.toLowerCase().includes(k)
        )
    );

    const hasAvailableLayer = planetLayers.some(
      (l) =>
        l.available &&
        (l.category === category.id ||
          category.keywords.some(
            (k) => l.category?.toLowerCase().includes(k) || l.variable?.toLowerCase().includes(k)
          ))
    );

    const hasMatchingDataset = planetDatasets.some(
      (d) =>
        d.category === category.id ||
        category.keywords.some(
          (k) => d.category?.toLowerCase().includes(k) || d.variable?.toLowerCase().includes(k)
        )
    );

    if (hasAvailableLayer) return 'available';
    if (hasMatchingDataset || hasMatchingLayer) return 'metadata';
    return 'no_data';
  };

  /**
   * Combined and sorted recent research activity from real backend records
   */
  const recentActivities = useMemo<ActivityItem[]>(() => {
    const list: ActivityItem[] = [];

    datasets.forEach((d) => {
      list.push({
        id: `ds-${d.id}`,
        type: 'dataset',
        title: d.name,
        planet: d.planet_id,
        note: d.category ? d.category.replace('_', ' ') : 'General Dataset',
        timestamp: d.created_at,
      });
    });

    regions.forEach((r) => {
      list.push({
        id: `reg-${r.id}`,
        type: 'region',
        title: r.name,
        planet: r.planet_id,
        note: r.coordinate_reference_system,
        timestamp: r.created_at,
      });
    });

    layers.forEach((l) => {
      list.push({
        id: `lay-${l.id}`,
        type: 'layer',
        title: l.name,
        planet: l.planet_id,
        note: `${l.variable} · ${l.rendering_type}`,
        timestamp: l.created_at,
      });
    });

    // Sort descending by timestamp
    return list
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [datasets, regions, layers]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans select-none">
      {/* ========================================================================= */}
      {/* SECTION A — Mission Overview                                             */}
      {/* ========================================================================= */}
      <section className="relative rounded-2xl bg-[#030712] border border-space-border/80 p-6 sm:p-8 overflow-hidden shadow-2xl">
        {/* Subtle Background Circuit & Radial Accent */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl -z-0" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-64 h-32 bg-sky-500/5 blur-2xl -z-0" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Text & Mission Affordances */}
          <div className="flex-1 max-w-2xl">
            {/* Mission Tag / Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold tracking-wider">MISSION COMMAND CENTER</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">TERRESTRIAL ANALOG EXPLORATION</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
              Planetary Analog Exploration & Characterization
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
              TerraTwin characterizes terrestrial environments with geological, mineralogical, and atmospheric fidelity
              to extreme lunar and Martian exploration sites. Discover Earth's closest analogues to support future planetary missions.
            </p>

            {/* Planetary Destination Selector Pills */}
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider mr-1">
                Active Body ({planetCount !== null ? `${planetCount} Bodies` : '3 Bodies'}):
              </span>
              {[
                { id: 'earth', name: 'Earth', desc: '1.0 AU · Analog Base', tag: 'TERRESTRIAL REF' },
                { id: 'moon', name: 'Moon', desc: '384k km · Target Analog', tag: 'LUNAR' },
                { id: 'mars', name: 'Mars', desc: '1.52 AU · Target Analog', tag: 'MARTIAN' },
              ].map((b) => {
                const isActive = selectedPlanet.toLowerCase() === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedPlanet(b.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-sky-500/20 text-white border-sky-400/60 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                        : 'bg-space-950/60 text-slate-400 border-space-border hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-sky-400' : 'bg-slate-600'
                      }`}
                    />
                    <span className="font-bold">{b.name}</span>
                    <span className="text-[10px] text-slate-500 hidden sm:inline">({b.desc})</span>
                  </button>
                );
              })}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/explorer"
                className="group relative inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-[#030712] bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all duration-200 shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]"
              >
                <span>OPEN PLANETARY EXPLORER</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={() => setShowEntryScreen(true)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-xs text-slate-300 hover:text-white bg-space-900 hover:bg-space-850 border border-space-border hover:border-slate-700 transition-all"
              >
                <Orbit className="w-4 h-4 text-cyan-400" />
                <span>3D SOLAR SYSTEM ENTRY</span>
              </button>

              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-xs text-slate-300 hover:text-white bg-space-900 hover:bg-space-850 border border-space-border hover:border-slate-700 transition-all"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>DATA CATALOG</span>
              </Link>
            </div>
          </div>

          {/* Right Aerospace Earth Telemetry Graphic */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-space-950/60 border border-space-border/80 self-center">
            <AerospaceEarthVisual />
            <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              <span>GEODETIC CRS: EPSG:4326 · WGS84</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION B — Scientific Data Metrics                                      */}
      {/* ========================================================================= */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-sky-400" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold">
              Scientific Telemetry & Catalog Capacity
            </h2>
          </div>
          {(loading || refreshing) && (
            <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> {loading ? 'Initializing Telemetry...' : 'Synchronizing...'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Registered Datasets */}
          <div className="p-4 rounded-xl bg-space-900 border border-space-border/80 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Registered Datasets</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">
                {datasetCount !== null ? datasetCount : backendOnline === false ? '—' : '...'}
              </span>
              <span className="text-xs text-slate-400 font-mono">datasets</span>
            </div>
            <div className="mt-2 pt-2 border-t border-space-border/60 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Scientific Provenance</span>
              <span className="text-emerald-400 font-semibold">
                {backendOnline === false ? 'OFFLINE' : 'REGISTERED'}
              </span>
            </div>
          </div>

          {/* 2. Available Data Layers */}
          <div className="p-4 rounded-xl bg-space-900 border border-space-border/80 relative overflow-hidden group hover:border-sky-500/40 transition-all shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Available Data Layers</span>
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">
                {layerCount !== null ? layerCount : backendOnline === false ? '—' : '...'}
              </span>
              <span className="text-xs text-slate-400 font-mono">layers</span>
            </div>
            <div className="mt-2 pt-2 border-t border-space-border/60 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Raster & Vector Layers</span>
              <span className="text-sky-400 font-semibold">
                {backendOnline === false ? 'OFFLINE' : 'CARTOGRAPHIC'}
              </span>
            </div>
          </div>

          {/* 3. Registered Regions */}
          <div className="p-4 rounded-xl bg-space-900 border border-space-border/80 relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Registered Regions</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <MapPin className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">
                {regionCount !== null ? regionCount : backendOnline === false ? '—' : '...'}
              </span>
              <span className="text-xs text-slate-400 font-mono">regions</span>
            </div>
            <div className="mt-2 pt-2 border-t border-space-border/60 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Earth / Moon / Mars</span>
              <span className="text-amber-400 font-semibold">
                {backendOnline === false ? 'OFFLINE' : 'GEOSPATIAL'}
              </span>
            </div>
          </div>

          {/* 4. Analysis Module Readiness */}
          <div className="p-4 rounded-xl bg-space-900 border border-space-border/80 relative overflow-hidden group hover:border-purple-500/40 transition-all shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Analysis Readiness</span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Cpu className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-white uppercase truncate">
                {readiness ? readiness.status : backendOnline ? 'READY' : backendOnline === false ? 'OFFLINE' : '...'}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-space-border/60 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">PostGIS Database</span>
              <span
                className={`font-semibold ${
                  readiness?.database === 'connected' ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {readiness ? readiness.database.toUpperCase() : 'UNKNOWN'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION C — Planetary Data Coverage                                       */}
      {/* ========================================================================= */}
      <section className="rounded-xl bg-space-900 border border-space-border/80 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-space-border/80 gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Planetary Scientific Data Coverage Matrix
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Cross-body synchronization across Earth, Moon, and Mars reference systems
              </p>
            </div>
          </div>

          {/* Status Legend */}
          <div className="flex items-center gap-3 text-[10px] font-mono flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-slate-300">Metadata Only</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-slate-400">No Registered Data</span>
            </div>
          </div>
        </div>

        {/* Coverage Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-space-border/60 text-[11px] text-slate-400">
                <th className="py-2.5 px-3 font-semibold">SCIENTIFIC CATEGORY</th>
                <th className="py-2.5 px-3 font-semibold text-center">
                  EARTH <span className="text-[9px] text-slate-500 block font-normal">(EPSG:4326)</span>
                </th>
                <th className="py-2.5 px-3 font-semibold text-center">
                  MOON <span className="text-[9px] text-slate-500 block font-normal">(IAU2000:30100)</span>
                </th>
                <th className="py-2.5 px-3 font-semibold text-center">
                  MARS <span className="text-[9px] text-slate-500 block font-normal">(IAU2000:49900)</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-border/40">
              {SCIENTIFIC_CATEGORIES.map((cat) => {
                const CategoryIcon = cat.icon;
                const earthStatus = getCoverageStatus('earth', cat);
                const moonStatus = getCoverageStatus('moon', cat);
                const marsStatus = getCoverageStatus('mars', cat);

                const renderBadge = (status: CoverageStatus) => {
                  if (status === 'offline') {
                    return (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-space-950 text-slate-500 border border-space-border text-[10px]">
                        Pending Sync
                      </span>
                    );
                  }
                  if (status === 'available') {
                    return (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Available
                      </span>
                    );
                  }
                  if (status === 'metadata') {
                    return (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30 text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        Metadata Only
                      </span>
                    );
                  }
                  return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-space-950 text-slate-500 border border-space-border/70 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      No Data
                    </span>
                  );
                };

                return (
                  <tr key={cat.id} className="hover:bg-space-950/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded bg-space-950 border border-space-border flex items-center justify-center text-cyan-400 shrink-0">
                          <CategoryIcon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-200 block">{cat.name}</span>
                          <span className="text-[10px] text-slate-400 font-sans">{cat.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">{renderBadge(earthStatus)}</td>
                    <td className="py-3 px-3 text-center">{renderBadge(moonStatus)}</td>
                    <td className="py-3 px-3 text-center">{renderBadge(marsStatus)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION D — Exploration Modules Grid                                     */}
      {/* ========================================================================= */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold">
              Scientific Exploration Workspaces
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">4 Active Navigation Modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Module 1: Planetary Explorer */}
          <Link
            to="/explorer"
            className="group p-5 rounded-xl bg-space-900 border border-space-border/80 hover:border-cyan-400/50 hover:bg-space-850/80 transition-all flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                  3D Cartography
                </span>
              </div>
              <h3 className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors text-sm mb-1">
                Planetary Explorer
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Interactive 3D planetary globe with geospatial layer projection, day/night terminator lines, and coordinate inspection.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono text-cyan-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch Explorer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Module 2: Region Comparison */}
          <Link
            to="/compare"
            className="group p-5 rounded-xl bg-space-900 border border-space-border/80 hover:border-cyan-400/50 hover:bg-space-850/80 transition-all flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Sliders className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Comparative
                </span>
              </div>
              <h3 className="font-bold text-slate-100 group-hover:text-emerald-300 transition-colors text-sm mb-1">
                Region Comparison
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Direct pairwise comparison of extraterrestrial target sites against candidate terrestrial analogues across geology and topography.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Comparison</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Module 3: AI Analog Finder */}
          <Link
            to="/analog-finder"
            className="group p-5 rounded-xl bg-space-900 border border-space-border/80 hover:border-purple-400/50 hover:bg-space-850/80 transition-all flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  AI Parametric
                </span>
              </div>
              <h3 className="font-bold text-slate-100 group-hover:text-purple-300 transition-colors text-sm mb-1">
                AI Analog Finder
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Multi-dimensional environmental and geological search ranking without fabricated scores or synthetic measurements.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono text-purple-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Search Analogs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Module 4: Rover Testing Lab */}
          <Link
            to="/rover-lab"
            className="group p-5 rounded-xl bg-space-900 border border-space-border/80 hover:border-amber-400/50 hover:bg-space-850/80 transition-all flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Mountain className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Robotics Lab
                </span>
              </div>
              <h3 className="font-bold text-slate-100 group-hover:text-amber-300 transition-colors text-sm mb-1">
                Rover Testing Lab
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Assess terrain slope, rock distribution, and mechanical trafficability for lunar and Martian robotic traverse testing.
              </p>
            </div>
            <div className="flex items-center text-xs font-mono text-amber-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>Access Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTIONS E & F — Recent Research Activity & System Health Status         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION E — Recent Research Activity */}
        <section className="rounded-xl bg-space-900 border border-space-border/80 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-space-border/80 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Recent Research Activity
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {recentActivities.length} Entries Logged
              </span>
            </div>

            {recentActivities.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center text-slate-500">
                <Database className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs font-mono text-slate-400 mb-1">No research activity recorded yet.</p>
                <p className="text-[11px] text-slate-500 max-w-xs font-sans">
                  Register new spatial datasets or candidate regions to initiate the mission activity log.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentActivities.map((act) => {
                  const isDataset = act.type === 'dataset';
                  const isRegion = act.type === 'region';

                  return (
                    <div
                      key={act.id}
                      className="p-2.5 rounded-lg bg-space-950/80 border border-space-border/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                            isDataset
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isRegion
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          }`}
                        >
                          {isDataset ? (
                            <Database className="w-3 h-3" />
                          ) : isRegion ? (
                            <MapPin className="w-3 h-3" />
                          ) : (
                            <Layers className="w-3 h-3" />
                          )}
                        </div>

                        <div className="truncate">
                          <span className="font-semibold text-slate-200 block truncate">{act.title}</span>
                          <span className="text-[10px] font-mono text-slate-400 truncate">{act.note}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                        <span className="uppercase px-1.5 py-0.5 rounded bg-space-850 text-slate-300 border border-space-border">
                          {act.planet}
                        </span>
                        <span className="text-slate-500">
                          {act.timestamp ? new Date(act.timestamp).toLocaleDateString() : 'Active'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-space-border/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Provenance Audit Trail</span>
            <Link to="/catalog" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              <span>View Full Catalog</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </section>

        {/* SECTION F — System Status & Health */}
        <section className="rounded-xl bg-space-900 border border-space-border/80 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-space-border/80 mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">
                  System Health & Operational Status
                </h2>
              </div>

              {/* Status Pill */}
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                  backendOnline
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : backendOnline === false
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-space-950 text-slate-400 border-space-border'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    backendOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
                  }`}
                />
                <span>
                  {backendOnline
                    ? 'ALL SYSTEMS OPERATIONAL'
                    : backendOnline === false
                    ? 'BACKEND UNREACHABLE'
                    : 'CONNECTING...'}
                </span>
              </div>
            </div>

            {/* Health Rows */}
            <div className="space-y-2 text-xs font-mono">
              {/* Row 1: Backend API */}
              <div className="p-2.5 rounded-lg bg-space-950/80 border border-space-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-slate-300">FastAPI Application Service</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    backendOnline
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {backendOnline ? `ONLINE · v${systemInfo?.version || '0.1.0'}` : 'OFFLINE'}
                </span>
              </div>

              {/* Row 2: Database */}
              <div className="p-2.5 rounded-lg bg-space-950/80 border border-space-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-300">PostgreSQL + PostGIS Spatial Engine</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    readiness?.database === 'connected'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {readiness ? readiness.database.toUpperCase() : 'UNKNOWN'}
                </span>
              </div>

              {/* Row 3: CRS Planetary Framework */}
              <div className="p-2.5 rounded-lg bg-space-950/80 border border-space-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-300">Planetary CRS Engine (3 Projections)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  EPSG:4326 · IAU2000
                </span>
              </div>

              {/* Row 4: Analysis Module Contract */}
              <div className="p-2.5 rounded-lg bg-space-950/80 border border-space-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-slate-300">Exploration Pipelines</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Scaffolded (Contract Ready)
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 pt-3 border-t border-space-border/60 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500">
              API Base: <code className="text-slate-400 font-mono">/api/v1</code>
            </span>
            <button
              onClick={fetchOverviewData}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-space-850 hover:bg-space-800 text-cyan-300 hover:text-cyan-200 border border-space-border hover:border-cyan-500/40 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Retry Telemetry</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
