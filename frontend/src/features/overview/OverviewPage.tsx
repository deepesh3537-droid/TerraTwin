import React from 'react';
import { Globe, Database, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OverviewPage: React.FC = () => {
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
            <Link
              to="/explorer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-space-950 font-semibold text-sm transition-colors shadow-lg shadow-sky-500/20"
            >
              <Globe className="w-4 h-4" />
              Open Planetary Explorer
            </Link>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-200 border border-space-border text-sm font-medium transition-colors"
            >
              <Database className="w-4 h-4" />
              Browse Data Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-space-900 border border-space-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Supported Bodies</span>
            <Globe className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">3 Planets</p>
          <p className="text-xs text-slate-400">Earth, Moon, and Mars reference systems</p>
        </div>

        <div className="p-5 rounded-xl bg-space-900 border border-space-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Analysis Modules</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">5 Pipelines</p>
          <p className="text-xs text-purple-300">Scaffolded API contracts (HTTP 501)</p>
        </div>

        <div className="p-5 rounded-xl bg-space-900 border border-space-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Scientific Foundation</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">ADR-008 & 011</p>
          <p className="text-xs text-slate-400">Zero fabricated values; ranking ≠ probability</p>
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
