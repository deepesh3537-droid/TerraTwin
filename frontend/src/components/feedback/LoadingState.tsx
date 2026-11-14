import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading planetary data...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <Loader2 className="w-8 h-8 text-sky-400 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-300">{message}</p>
    </div>
  );
};
