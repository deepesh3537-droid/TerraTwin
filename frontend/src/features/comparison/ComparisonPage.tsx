import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Sparkles } from 'lucide-react';
import { Region } from '../../types';
import { compareRegions, formatApiError, getRegions } from '../../services';
import { NotImplementedState, ErrorState } from '../../components/feedback';

export const ComparisonPage: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [referenceRegionId, setReferenceRegionId] = useState<string>('');
  const [candidateRegionId, setCandidateRegionId] = useState<string>('');
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['elevation', 'slope', 'roughness']);

  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponseError, setApiResponseError] = useState<string | null>(null);
  const [notImplementedInfo, setNotImplementedInfo] = useState<string | null>(null);

  useEffect(() => {
    getRegions()
      .then((data) => {
        const items = data.items || [];
        setRegions(items);
        if (items.length >= 2) {
          setReferenceRegionId(items[0].id);
          setCandidateRegionId(items[1].id);
        } else if (items.length === 1) {
          setReferenceRegionId(items[0].id);
          setCandidateRegionId(items[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const handleVariableToggle = (v: string) => {
    setSelectedVariables((prev) =>
      prev.includes(v) ? prev.filter((item) => item !== v) : [...prev, v]
    );
  };

  const handleRunComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceRegionId || !candidateRegionId) return;

    setLoading(true);
    setApiResponseError(null);
    setNotImplementedInfo(null);

    try {
      await compareRegions({
        reference_region_id: referenceRegionId,
        candidate_region_id: candidateRegionId,
        variables: selectedVariables,
      });
    } catch (err: unknown) {
      const formatted = formatApiError(err);
      // The backend returns 501 with message in the error envelope per BE-14
      setNotImplementedInfo(formatted);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Region Comparison</h1>
        <p className="text-xs text-slate-400">
          Pairwise terrain parameter comparison between extraterrestrial targets and terrestrial candidates.
        </p>
      </div>

      <form onSubmit={handleRunComparison} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reference Target Card */}
          <div className="p-5 rounded-xl bg-space-900 border border-space-border">
            <span className="text-xs font-mono uppercase text-sky-400 mb-1 block">Reference Target</span>
            <h3 className="text-sm font-semibold text-white mb-3">Extraterrestrial / Target Region</h3>
            <select
              aria-label="Select Reference Target Region"
              value={referenceRegionId}
              onChange={(e) => setReferenceRegionId(e.target.value)}
              className="w-full bg-space-950 border border-space-border text-xs rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500/50"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.planet_id.toUpperCase()}] {r.name} ({r.coordinate_reference_system})
                </option>
              ))}
            </select>
          </div>

          {/* Terrestrial Candidate Card */}
          <div className="p-5 rounded-xl bg-space-900 border border-space-border">
            <span className="text-xs font-mono uppercase text-emerald-400 mb-1 block">Candidate Analog</span>
            <h3 className="text-sm font-semibold text-white mb-3">Earth Terrestrial Candidate</h3>
            <select
              aria-label="Select Candidate Analog Region"
              value={candidateRegionId}
              onChange={(e) => setCandidateRegionId(e.target.value)}
              className="w-full bg-space-950 border border-space-border text-xs rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-sky-500/50"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.planet_id.toUpperCase()}] {r.name} ({r.coordinate_reference_system})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Parameters */}
        <div className="p-5 rounded-xl bg-space-900 border border-space-border">
          <h4 className="text-xs font-semibold text-slate-200 uppercase mb-3">Comparison Variables</h4>
          <div className="flex flex-wrap gap-2">
            {['elevation', 'slope', 'roughness', 'composition', 'thermal_inertia'].map((v) => {
              const selected = selectedVariables.includes(v);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleVariableToggle(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                    selected
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                      : 'bg-space-950 text-slate-400 border-space-border hover:text-slate-200'
                  }`}
                >
                  {v.replace(/_/g, ' ')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !referenceRegionId || !candidateRegionId}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-space-950 font-semibold text-xs transition-colors shadow-lg shadow-sky-500/20"
          >
            <ArrowRightLeft className="w-4 h-4" />
            {loading ? 'Submitting to Comparison API...' : 'Run Pairwise Comparison'}
          </button>
        </div>
      </form>

      {/* API Response Display: 501 Friendly State (FE-10, FE-11) */}
      {notImplementedInfo && (
        <NotImplementedState
          moduleName="Pairwise Region Comparison Pipeline (POST /api/v1/analysis/compare)"
          description={notImplementedInfo}
        />
      )}

      {apiResponseError && (
        <ErrorState
          title="Analysis API Error"
          message={apiResponseError}
        />
      )}

      {!notImplementedInfo && !apiResponseError && (
        <div className="p-4 rounded-xl bg-space-900/60 border border-space-border text-xs text-slate-400 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p>
            The comparison engine evaluates multi-dimensional morphological, geochemical, and terrain variance across planetary bodies. When submitted, this request validates against the backend OpenAPI contract.
          </p>
        </div>
      )}
    </div>
  );
};
