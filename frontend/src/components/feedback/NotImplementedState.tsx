import React from 'react';
import { Compass, Info } from 'lucide-react';

interface NotImplementedStateProps {
  moduleName?: string;
  description?: string;
  className?: string;
}

export const NotImplementedState: React.FC<NotImplementedStateProps> = ({
  moduleName = 'Analysis Module',
  description = 'This scientific analysis workflow is scaffolded in the API contract, but the underlying machine learning model and GIS processing pipeline are under active development.',
  className = '',
}) => {
  return (
    <div className={`p-6 rounded-lg border border-purple-900/30 bg-purple-950/10 text-slate-200 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-purple-900/20 border border-purple-700/30 flex items-center justify-center text-purple-400 shrink-0">
          <Compass className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-purple-200">{moduleName}</h4>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-700/40">
              Scaffolded (501)
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{description}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span>Per scientific integrity rules, no arbitrary or placeholder similarity scores are displayed.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
