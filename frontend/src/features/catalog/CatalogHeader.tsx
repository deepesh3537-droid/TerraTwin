import React from 'react';
import { Database, Globe, RefreshCw, AlertCircle, Wifi } from 'lucide-react';

interface CatalogHeaderProps {
  totalCount: number | null;
  earthCount: number | null;
  moonCount: number | null;
  marsCount: number | null;
  isBackendConnected: boolean;
  isDemoMode: boolean;
  loading: boolean;
  onRetry: () => void;
  onToggleDemoMode: () => void;
}

export const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  totalCount,
  earthCount,
  moonCount,
  marsCount,
  isBackendConnected,
  isDemoMode,
  loading,
  onRetry,
  onToggleDemoMode,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-space-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase tracking-wider font-bold">
              PLANETARY SCIENTIFIC DATA EXPLORER
            </span>
            <span className="text-slate-600 font-mono text-xs">•</span>
            {isBackendConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                <Wifi className="w-3 h-3 animate-pulse" />
                LIVE BACKEND CONNECTED
              </span>
            ) : isDemoMode ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                <AlertCircle className="w-3 h-3" />
                DEMO CATALOG (OFFLINE REFERENCE)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono font-bold">
                <AlertCircle className="w-3 h-3" />
                BACKEND SERVICE OFFLINE
              </span>
            )}
            <span className="text-slate-600 font-mono text-xs">•</span>
            <span className="text-slate-400 text-xs font-mono">
              ENDPOINT: GET /api/v1/datasets
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Planetary Data Catalog
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl mt-1 leading-relaxed">
            Explore, discover and inspect scientific datasets across Earth, Moon and Mars with
            verifiable coordinate reference systems and scientific provenance.
          </p>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isBackendConnected && (
            <button
              onClick={onToggleDemoMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                isDemoMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-space-900 text-slate-300 border-space-border hover:bg-space-850'
              }`}
            >
              {isDemoMode ? 'Viewing Offline Demo Catalog' : 'Enable Demo Catalog'}
            </button>
          )}

          <button
            onClick={onRetry}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-space-900 border border-space-border hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all disabled:opacity-50"
            title="Refresh datasets from backend API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{loading ? 'Querying...' : 'Sync Catalog'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Compact Statistics Grid (Computed Strictly from Actual Data)             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        {/* Total Registered Datasets */}
        <div className="p-3.5 rounded-xl bg-space-900/80 border border-space-border/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              TOTAL REGISTERED
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-white">
                {totalCount !== null ? totalCount : '—'}
              </span>
              <span className="text-[10px] text-slate-500">
                {totalCount !== null ? 'datasets' : 'offline'}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-space-950 border border-space-border/60">
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        {/* Earth Datasets */}
        <div className="p-3.5 rounded-xl bg-space-900/80 border border-space-border/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              EARTH (ANALOG)
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-sky-400">
                {earthCount !== null ? earthCount : '—'}
              </span>
              <span className="text-[10px] text-slate-500">
                {earthCount !== null ? 'EPSG:4326' : 'unavailable'}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-space-950 border border-sky-500/20">
            <Globe className="w-4 h-4 text-sky-400" />
          </div>
        </div>

        {/* Lunar Datasets */}
        <div className="p-3.5 rounded-xl bg-space-900/80 border border-space-border/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              LUNAR TARGETS
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-slate-200">
                {moonCount !== null ? moonCount : '—'}
              </span>
              <span className="text-[10px] text-slate-500">
                {moonCount !== null ? 'IAU:30100' : 'unavailable'}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-space-950 border border-slate-600/30">
            <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
          </div>
        </div>

        {/* Martian Datasets */}
        <div className="p-3.5 rounded-xl bg-space-900/80 border border-space-border/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              MARTIAN TARGETS
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-orange-400">
                {marsCount !== null ? marsCount : '—'}
              </span>
              <span className="text-[10px] text-slate-500">
                {marsCount !== null ? 'IAU:49900' : 'unavailable'}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-space-950 border border-orange-500/20">
            <div className="w-4 h-4 rounded-full bg-orange-500/20 border-2 border-orange-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
