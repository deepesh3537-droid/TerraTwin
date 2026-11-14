import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  code?: string;
  requestId?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Service Unavailable',
  message = 'Failed to load telemetry or catalog data from the backend.',
  code,
  requestId,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-lg border border-rose-900/30 bg-rose-950/10 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-rose-900/20 flex items-center justify-center text-rose-400 mb-3 border border-rose-800/40">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-300 max-w-md mb-2">{message}</p>
      
      {(code || requestId) && (
        <div className="text-xs font-mono text-slate-400 mb-4 bg-space-950/70 px-3 py-1.5 rounded border border-space-border">
          {code && <span>Code: {code}</span>}
          {code && requestId && <span className="mx-2">|</span>}
          {requestId && <span>Request ID: {requestId}</span>}
        </div>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      )}
    </div>
  );
};
