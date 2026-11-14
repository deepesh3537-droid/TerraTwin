import React from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  message = 'There are no items matching your criteria or registered in this view.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-lg border border-space-border bg-space-900/50 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-space-800 flex items-center justify-center text-slate-400 mb-3 border border-space-border">
        <Database className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-4">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-medium rounded-md bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
