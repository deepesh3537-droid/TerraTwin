import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const AppShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState('earth');

  return (
    <div className="min-h-screen bg-space-950 flex flex-col lg:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <TopBar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          selectedPlanet={selectedPlanet}
          onSelectPlanet={setSelectedPlanet}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {/* Outlet receives shared context for child features */}
          <Outlet context={{ selectedPlanet, setSelectedPlanet }} />
        </main>
      </div>
    </div>
  );
};
