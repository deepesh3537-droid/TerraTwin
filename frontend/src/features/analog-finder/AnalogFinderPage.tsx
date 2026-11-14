import React, { useState, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Region } from '../../types';
import { findAnalogs, formatApiError, getRegions } from '../../services';
import { NotImplementedState, ErrorState } from '../../components/feedback';

export const AnalogFinderPage: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [targetRegionId, setTargetRegionId] = useState<string>('');
  const [selectedVariables, setSelectedVariables] = useState<string[]>([
    'elevation',
    'slope',
    'roughness',
    'temperature',
  ]);

  const [loading, setLoading] = useState(false);
  const [notImplementedInfo, setNotImplementedInfo] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    getRegions()
      .then((data) => {
        const items = data.items || [];
        setRegions(items);
        if (items.length > 0) {
          setTargetRegionId(items[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleVariable = (v: string) => {
    setSelectedVariables((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRegionId) return;

    setLoading(true);
    setNotImplementedInfo(null);
    setApiError(null);

    try {
      await findAnalogs({
        target_region_id: targetRegionId,
        candidate_planet: 'earth',
        variables: selectedVariables,
        limit: 10,
      });
    } catch (err: unknown) {
      const formatted = formatApiError(err);
      // Backend returns 501 with message in the error envelope
      setNotImplementedInfo(formatted);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">AI Analog Finder</h1>
        <p className="text-xs text-slate-400">
          Rank terrestrial locations on Earth that have comparable measurable characteristics to a target extraterrestrial region.
        </p>
      </div>

      {/* Form wired to contract */}
      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-space-900 border border-space-border space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Target Planetary Region
            </label>
            <select
              aria-label="Target Planetary Region"
              value={targetRegionId}
              onChange={(e) => setTargetRegionId(e.target.value)}
              className="w-full bg-space-950 border border-space-border text-xs rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-purple-500/50"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.planet_id.toUpperCase()}] {r.name} ({r.coordinate_reference_system})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Candidate Reference Planet
            </label>
            <input
              type="text"
              readOnly
              value="Earth (terrestrial candidate pool)"
              className="w-full bg-space-950 border border-space-border text-xs rounded-lg p-2.5 text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Target Comparison Dimensions
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: 'elevation', label: 'Elevation Profile' },
              { id: 'slope', label: 'Slope & Gradient' },
              { id: 'roughness', label: 'Terrain Roughness' },
              { id: 'temperature', label: 'Thermal Range' },
              { id: 'mineralogy', label: 'Mineral Composition' },
              { id: 'volatiles', label: 'Volatiles / Moisture' },
            ].map((dim) => {
              const active = selectedVariables.includes(dim.id);
              return (
                <button
                  type="button"
                  key={dim.id}
                  onClick={() => handleToggleVariable(dim.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs text-left transition-all ${
                    active
                      ? 'bg-purple-950/30 text-purple-200 border-purple-500/40'
                      : 'bg-space-950 text-slate-400 border-space-border hover:text-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    readOnly
                    className="rounded border-space-border text-purple-500 focus:ring-0"
                  />
                  <span>{dim.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading || !targetRegionId}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs transition-colors shadow-lg shadow-purple-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            {loading ? 'Submitting to Similarity Engine...' : 'Execute Analog Search (POST /api/v1/analysis/similarity)'}
          </button>
        </div>
      </form>

      {/* Honest 501 State from API envelope (FE-10, FE-11) */}
      {notImplementedInfo && (
        <NotImplementedState
          moduleName="Terrestrial Analog Ranking Engine (POST /api/v1/analysis/similarity)"
          description={notImplementedInfo}
        />
      )}

      {apiError && (
        <ErrorState
          title="Analog Finder API Error"
          message={apiError}
        />
      )}

      {!notImplementedInfo && !apiError && (
        <div className="p-4 rounded-xl bg-space-900/60 border border-space-border text-xs text-slate-400 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300 block mb-1">Scientific Ranking vs Probability</span>
            <p className="leading-relaxed">
              In accordance with ADR-011, analog matching ranks candidates by multi-dimensional similarity distance with explicit uncertainty metrics. It is never presented as a probability or percentage score.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
