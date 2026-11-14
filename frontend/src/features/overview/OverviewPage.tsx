import React, { useEffect, useState, useCallback } from 'react';
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
  AlertTriangle,
  Orbit,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDatasets, getPlanets, getReadiness, getRegions, getSystemInfo } from '../../services';
import { ReadinessResponse, SystemInfo } from '../../types';
import { LoadingState } from '../../components/feedback';
import { usePlanetaryContext } from '../../app/planetaryContext';

export const OverviewPage: React.FC = () => {
  const { setShowEntryScreen } = usePlanetaryContext();
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [readiness, setReadiness] = useState<ReadinessResponse | null>(null);
  const [datasetCount, setDatasetCount] = useState<number | null>(null);
  const [regionCount, setRegionCount] = useState<number | null>(null);
  const [planetCount, setPlanetCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchOverviewData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // Parallel fetch from single API client
      const [sysRes, readyRes, dsRes, regRes, planRes] = await Promise.allSettled([
        getSystemInfo(),
        getReadiness(),
        getDatasets({ limit: 1 }),
        getRegions({ limit: 1 }),
        getPlanets(),
      ]);

      if (sysRes.status === 'fulfilled') {
        setSystemInfo(sysRes.value);
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
        setErrorMsg('TerraTwin backend server is currently unreachable. Start backend to view live metrics.');
      }

      if (readyRes.status === 'fulfilled') {
        setReadiness(readyRes.value);
      }

      if (dsRes.status === 'fulfilled') {
        setDatasetCount(dsRes.value.total);
      }

      if (regRes.status === 'fulfilled') {
        setRegionCount(regRes.value.total);
      }

      if (planRes.status === 'fulfilled') {
        setPlanetCount(planRes.value.length);
      }
    } catch {
      setBackendOnline(false);
      setErrorMsg('Unexpected error connecting to backend service.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-space-900 via-space-850 to-space-900 border border-space-border relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            NASA Space Apps Challenge
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Planetary Terrestrial Analog Platform
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Identifying and characterizing terrestrial environments with comparable measurable characteristics to lunar and Martian exploration sites.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowEntryScreen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-space-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25"
            >
              <Orbit className="w-4 h-4" />
              Launch 3D Solar System
            </button>
            <Link
              to="/explorer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-200 border border-space-border text-sm font-medium transition-colors"
            >
              <Globe className="w-4 h-4 text-sky-400" />
              Open 3D Mission Control
            </Link>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-space-850 hover:bg-space-800 text-slate-300 border border-space-border text-sm font-medium transition-colors"
            >
              <Database className="w-4 h-4" />
              Browse Data Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* Backend Status Banner (FE-12, FE-13) */}
      {!loading && backendOnline === false && (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold block text-amber-300">Backend Server Offline</span>
              <span className="text-slate-300">{errorMsg}</span>
            </div>
          </div>
          <button
            onClick={fetchOverviewData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
          </button>
        </div>
      )}

      {/* Loading State or Metric Cards (FE-03) */}
      {loading ? (
        <LoadingState message="Fetching live platform telemetry and catalog metrics..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Supported Planets */}
          <div className="p-5 rounded-xl bg-space-900 border border-space-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Planetary Bodies</span>
              <Globe className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {planetCount !== null ? `${planetCount} Bodies` : '3 Bodies'}
            </p>
            <p className="text-xs text-slate-400">Earth, Moon, and Mars reference systems</p>
          </div>

          {/* Registered Datasets */}
          <div className="p-5 rounded-xl bg-space-900 border border-space-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Registered Datasets</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {datasetCount !== null ? `${datasetCount} Datasets` : '—'}
            </p>
            <p className="text-xs text-slate-400">With complete scientific provenance</p>
          </div>

          {/* Seeded Regions */}
          <div className="p-5 rounded-xl bg-space-900 border border-space-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">Regions of Interest</span>
              <MapPin className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {regionCount !== null ? `${regionCount} Regions` : '—'}
            </p>
            <p className="text-xs text-slate-400">Terrestrial analogs & extraterrestrial targets</p>
          </div>

          {/* Service Readiness */}
          <div className="p-5 rounded-xl bg-space-900 border border-space-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">System Readiness</span>
              <Server className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold capitalize text-white mb-1">
              {readiness ? readiness.status : backendOnline ? 'Ready' : 'Offline'}
            </p>
            <p className="text-xs text-slate-400 font-mono">
              DB: {readiness ? readiness.database : 'unknown'}
            </p>
          </div>
        </div>
      )}

      {/* System & Architecture Status Summary */}
      <div className="p-6 rounded-xl bg-space-900 border border-space-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-space-border">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-white">System Architecture & Honest Capabilities</h2>
          </div>
          {systemInfo && (
            <span className="text-[11px] font-mono text-slate-400 bg-space-950 px-2.5 py-1 rounded border border-space-border">
              v{systemInfo.version} · {systemInfo.environment}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-space-950 border border-space-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-400" />
              <span className="text-slate-200">Data Catalog</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Available
            </span>
          </div>

          <div className="p-3 rounded-lg bg-space-950 border border-space-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span className="text-slate-200">Planetary Explorer</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Available
            </span>
          </div>

          <div className="p-3 rounded-lg bg-space-950 border border-space-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="text-slate-200">Geospatial CRS Framework</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Prototype
            </span>
          </div>

          <div className="p-3 rounded-lg bg-space-950 border border-space-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-slate-200">Region Comparison</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Scaffolded (501)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-space-950 border border-space-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-slate-200">AI Analog Finder</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Scaffolded (501)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-space-950 border border-space-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-slate-200">Rover Testing Lab</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Scaffolded (501)
            </span>
          </div>
        </div>
      </div>

      {/* Feature Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/compare"
          className="p-5 rounded-xl bg-space-900/60 hover:bg-space-900 border border-space-border hover:border-space-border-light transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
              Region Comparison
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct pairwise comparison between extraterrestrial regions and candidate terrestrial analogs across geology, elevation, and terrain roughness.
          </p>
        </Link>

        <Link
          to="/analog-finder"
          className="p-5 rounded-xl bg-space-900/60 hover:bg-space-900 border border-space-border hover:border-space-border-light transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
              AI Analog Finder
            </h3>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-dimensional search ranking Earth regions matching lunar or Martian terrain parameters without fabricated scores.
          </p>
        </Link>
      </div>
    </div>
  );
};
