import React, { createContext, useContext, useEffect, useState } from 'react';
import { Planet } from '../types';
import { getPlanets } from '../services';

interface PlanetaryContextType {
  selectedPlanet: string;
  setSelectedPlanet: (planet: string) => void;
  planets: Planet[];
  loadingPlanets: boolean;
  planetError: string | null;
  refreshPlanets: () => Promise<void>;
}

const defaultPlanets: Planet[] = [
  { id: 'earth', name: 'Earth', description: 'Terrestrial analog reference body', radius_km: 6371.0, created_at: '', updated_at: '' },
  { id: 'moon', name: 'Moon', description: 'Target exploration body', radius_km: 1737.4, created_at: '', updated_at: '' },
  { id: 'mars', name: 'Mars', description: 'Target exploration body', radius_km: 3389.5, created_at: '', updated_at: '' },
];

const PlanetaryContext = createContext<PlanetaryContextType>({
  selectedPlanet: 'earth',
  setSelectedPlanet: () => {},
  planets: defaultPlanets,
  loadingPlanets: false,
  planetError: null,
  refreshPlanets: async () => {},
});

export const PlanetaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<string>('earth');
  const [planets, setPlanets] = useState<Planet[]>(defaultPlanets);
  const [loadingPlanets, setLoadingPlanets] = useState<boolean>(true);
  const [planetError, setPlanetError] = useState<string | null>(null);

  const fetchPlanets = async () => {
    setLoadingPlanets(true);
    try {
      const data = await getPlanets();
      if (data && data.length > 0) {
        setPlanets(data);
      }
      setPlanetError(null);
    } catch (err) {
      // Backend may be offline; keep default bodies but record error for health state
      setPlanetError('Unable to load planet list from backend.');
    } finally {
      setLoadingPlanets(false);
    }
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  return (
    <PlanetaryContext.Provider
      value={{
        selectedPlanet,
        setSelectedPlanet,
        planets,
        loadingPlanets,
        planetError,
        refreshPlanets: fetchPlanets,
      }}
    >
      {children}
    </PlanetaryContext.Provider>
  );
};

export function usePlanetaryContext(): PlanetaryContextType {
  return useContext(PlanetaryContext);
}
