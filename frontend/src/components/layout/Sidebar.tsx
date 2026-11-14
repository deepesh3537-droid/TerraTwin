import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  GitCompare,
  Sparkles,
  ShieldCheck,
  Bot,
  Database,
  BookOpen,
  Orbit,
} from 'lucide-react';
import { usePlanetaryContext } from '../../app/planetaryContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/explorer', label: 'Planetary Explorer', icon: Globe },
  { to: '/compare', label: 'Region Comparison', icon: GitCompare },
  { to: '/analog-finder', label: 'AI Analog Finder', icon: Sparkles },
  { to: '/suitability', label: 'Base Suitability', icon: ShieldCheck },
  { to: '/rover-lab', label: 'Rover Testing Lab', icon: Bot },
  { to: '/catalog', label: 'Data Catalog', icon: Database },
  { to: '/methodology', label: 'Methodology', icon: BookOpen },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { setShowEntryScreen } = usePlanetaryContext();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-space-900 border-r border-space-border flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-space-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-wide">TerraTwin</span>
              <span className="block text-[10px] font-mono text-sky-400 uppercase tracking-widest">
                Planetary Analogs
              </span>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {/* Quick jump to 3D Solar System Entry View */}
          <button
            type="button"
            onClick={() => {
              setShowEntryScreen(true);
              onClose?.();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono text-cyan-300 hover:text-white bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/30 transition-all mb-3 shadow-[0_0_10px_rgba(56,189,248,0.15)]"
          >
            <Orbit className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>3D Solar System View</span>
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-space-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Challenge Footer */}
        <div className="p-4 border-t border-space-border text-xs text-slate-500">
          <p className="font-medium text-slate-400 mb-1">NASA Space Apps Challenge</p>
          <p className="text-[11px] leading-tight">Terrestrial Analogs for Lunar & Martian Exploration</p>
        </div>
      </aside>
    </>
  );
};
