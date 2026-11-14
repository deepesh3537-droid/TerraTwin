import React, { useEffect, useRef } from 'react';
import { Layer, Region } from '../types';
import { MapLibreAdapter } from './adapters/MapLibreAdapter';
import { NotConfiguredState } from '../components/feedback';

interface PlanetaryMapProps {
  planet: string;
  selectedRegion?: Region | null;
  activeLayers?: Layer[];
  className?: string;
}

export const PlanetaryMap: React.FC<PlanetaryMapProps> = ({
  planet,
  selectedRegion,
  activeLayers = [],
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<MapLibreAdapter | null>(null);

  const isEarth = planet.toLowerCase() === 'earth';

  useEffect(() => {
    if (!isEarth) {
      if (adapterRef.current) {
        adapterRef.current.destroy();
        adapterRef.current = null;
      }
      return;
    }

    if (mapContainerRef.current && !adapterRef.current) {
      const adapter = new MapLibreAdapter();
      adapter.initialize(mapContainerRef.current);
      adapterRef.current = adapter;
    }

    return () => {
      if (adapterRef.current) {
        adapterRef.current.destroy();
        adapterRef.current = null;
      }
    };
  }, [isEarth]);

  // Sync region footprint
  useEffect(() => {
    if (adapterRef.current) {
      if (selectedRegion && selectedRegion.footprint) {
        adapterRef.current.setRegionFootprint(selectedRegion.id, selectedRegion.footprint);
      } else {
        adapterRef.current.clearFootprint();
      }
    }
  }, [selectedRegion]);

  // Sync layers
  useEffect(() => {
    if (adapterRef.current) {
      activeLayers.forEach((layer) => {
        if (layer.available) {
          adapterRef.current?.addLayer(layer);
        }
      });
    }
  }, [activeLayers]);

  if (!isEarth) {
    const planetName = planet.charAt(0).toUpperCase() + planet.slice(1);
    return (
      <div className={`w-full h-full min-h-[480px] flex items-center justify-center p-6 bg-space-950/80 rounded-xl border border-space-border ${className}`}>
        <NotConfiguredState
          title={`${planetName} Imagery Not Configured`}
          message={`Map tile imagery is not configured for ${planetName}.`}
          technicalDetails={`${planetName} surface coordinates use dedicated IAU planetary coordinate frames (e.g., Moon IAU2000:30100, Mars IAU2000:49900) rather than Earth EPSG:4326. Dedicated planetary raster tile services must be configured before raster rendering can occur.`}
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[480px] rounded-xl overflow-hidden border border-space-border bg-space-950 ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />

      {/* Projection & Mode Info Badge */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-space-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-space-border text-[11px] font-mono text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>Projection: Earth EPSG:4326</span>
        {!import.meta.env.VITE_EARTH_MAP_STYLE_URL && (
          <span className="text-amber-400/90 border-l border-space-border pl-2">
            Offline Spatial Canvas
          </span>
        )}
      </div>
    </div>
  );
};
