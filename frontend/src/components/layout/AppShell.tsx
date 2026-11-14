import React, { useState, Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { PlanetaryProvider, usePlanetaryContext } from '../../app/planetaryContext';

const PlanetaryEntryScreen = lazy(() =>
  import('../../features/solar-system/PlanetaryEntryScreen').then((m) => ({
    default: m.PlanetaryEntryScreen,
  }))
);

const AppShellContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { showEntryScreen, setShowEntryScreen } = usePlanetaryContext();

  if (showEntryScreen) {
    return (
      <Suspense
        fallback={
          <div className="w-screen h-screen bg-[#02040a] flex items-center justify-center text-cyan-400 font-mono text-xs">
            Loading Solar System...
          </div>
        }
      >
        <PlanetaryEntryScreen onEnter={() => setShowEntryScreen(false)} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-space-950 flex flex-col lg:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <TopBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const AppShell: React.FC = () => {
  return (
    <PlanetaryProvider>
      <AppShellContent />
    </PlanetaryProvider>
  );
};
