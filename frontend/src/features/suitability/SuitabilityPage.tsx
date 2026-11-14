import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { Region } from '../../types';
import { assessSuitability, formatApiError, getRegions } from '../../services';
import { NotImplementedState, ErrorState } from '../../components/feedback';

export const SuitabilityPage: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [criteria, setCriteria] = useState<string[]>([
    'slope_safety',
    'solar_illumination',
    'resource_proximity',
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
          setSelectedRegionId(items[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleCriteria = (c: string) => {
    setCriteria((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegionId) return;

    setLoading(true);
    setNotImplementedInfo(null);
    setApiError(null);

    try {
      await assessSuitability({
        region_id: selectedRegionId,
        criteria,
      });
    } catch (err: unknown) {
      const formatted = formatApiError(err);
      setNotImplementedInfo(formatted);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Base Suitability Analysis</h1>
        <p className="text-xs text-slate-400">
          Multivariate site evaluation for lunar and Martian permanent habitats, landing sites, and resource operations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-xl bg-space-900 border border-space-border space-y-5">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Target Planetary Site / Region
          </label>
          <select
            aria-label="Target Planetary Site or Region"
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="w-full bg-space-950 border border-space-border text-xs rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500/50"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                [{r.planet_id.toUpperCase()}] {r.name} ({r.coordinate_reference_system})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Evaluation Criteria & Constraints
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { id: 'slope_safety', title: 'Slope & Landing Safety', desc: 'Terrain slope < 5° and crater density thresholds for touchdown' },
              { id: 'solar_illumination', title: 'Solar Illumination', desc: 'Continuous solar exposure windows for power and thermal management' },
              { id: 'resource_proximity', title: 'In-Situ Resources (ISRU)', desc: 'Proximity to volatile deposits (crater water ice)' },
              { id: 'comms_line_of_sight', title: 'Direct-to-Earth Comms', desc: 'Continuous line-of-sight visibility windows for comms relays' },
            ].map((crit) => {
              const active = criteria.includes(crit.id);
              return (
                <button
                  type="button"
                  key={crit.id}
                  onClick={() => handleToggleCriteria(crit.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    active
                      ? 'bg-sky-950/20 border-sky-500/40 text-slate-200 shadow-sm'
                      : 'bg-space-950 text-slate-400 border-space-border hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={active}
                      readOnly
                      className="rounded border-space-border text-sky-500 focus:ring-0"
                    />
                    <span className="font-semibold text-xs">{crit.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-6 leading-tight">{crit.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading || !selectedRegionId}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-space-950 font-semibold text-xs transition-colors shadow-lg shadow-sky-500/20"
          >
            <Target className="w-4 h-4" />
            {loading ? 'Submitting Evaluation Request...' : 'Evaluate Site Suitability (POST /api/v1/analysis/suitability)'}
          </button>
        </div>
      </form>

      {/* Honest 501 State from API envelope (FE-10, FE-11) */}
      {notImplementedInfo && (
        <NotImplementedState
          moduleName="Site Suitability Assessment Engine (POST /api/v1/analysis/suitability)"
          description={notImplementedInfo}
        />
      )}

      {apiError && (
        <ErrorState
          title="Suitability API Error"
          message={apiError}
        />
      )}
    </div>
  );
};
