import React from 'react';
import { EyeOff, AlertCircle } from 'lucide-react';

interface NotConfiguredStateProps {
  title?: string;
  message?: string;
  technicalDetails?: string;
  className?: string;
}

export const NotConfiguredState: React.FC<NotConfiguredStateProps> = ({
  title = 'Imagery Not Configured',
  message = 'Map tile imagery is not configured for this planetary body.',
  technicalDetails = 'Moon and Mars surface coordinates use distinct IAU planetary reference frames rather than Earth EPSG:4326. Dedicated planetary raster tile services must be configured before raster rendering can occur.',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-lg border border-orange-900/30 bg-orange-950/10 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-orange-900/20 flex items-center justify-center text-orange-400 mb-3 border border-orange-800/40">
        <EyeOff className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-orange-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-300 max-w-md mb-3">{message}</p>
      {technicalDetails && (
        <div className="flex items-start gap-2 max-w-lg text-left text-xs text-slate-400 bg-space-950/60 p-3 rounded border border-space-border">
          <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <p>{technicalDetails}</p>
        </div>
      )}
    </div>
  );
};
