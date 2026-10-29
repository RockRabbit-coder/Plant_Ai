import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Plus,
  Calendar,
  MapPin,
  Trash2,
  ScanLine,
  Activity,
  Layers,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { getPlants, createPlant, deletePlant, resolveMediaUrl } from '../services/api';
import { PlantProfile } from '../types';

export const PlantProfilesPage: React.FC = () => {
  const [plants, setPlants] = useState<PlantProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState('');
  const [cropSpecies, setCropSpecies] = useState('Tomato');
  const [variety, setVariety] = useState('');
  const [fieldIdentifier, setFieldIdentifier] = useState('North Greenhouse Bed 1');
  const [notes, setNotes] = useState('');

  // Selected Plant for Timeline Inspection
  const [activePlant, setActivePlant] = useState<PlantProfile | null>(null);

  const fetchPlants = () => {
    setLoading(true);
    getPlants()
      .then((data) => {
        setPlants(data);
        if (data.length > 0 && !activePlant) {
          setActivePlant(data[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const created = await createPlant({
        name,
        crop_species: cropSpecies,
        variety: variety || undefined,
        field_identifier: fieldIdentifier || undefined,
        notes: notes || undefined
      });
      setPlants((prev) => [created, ...prev]);
      setActivePlant(created);
      setShowCreateModal(false);
      setName('');
      setVariety('');
      setNotes('');
    } catch {
      alert('Failed to register plant profile.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this plant profile? Associated historical scans will remain in scan history.')) {
      return;
    }
    try {
      await deletePlant(id);
      const remaining = plants.filter((p) => p.id !== id);
      setPlants(remaining);
      setActivePlant(remaining.length > 0 ? remaining[0] : null);
    } catch {
      alert('Failed to delete plant profile.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Sprout className="w-3.5 h-3.5" />
            <span>Crop Lifecycle Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Plant & Crop Profiles
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track individual crops over time, compare foliar symptoms chronologically, and record agronomic notes.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="glass-button-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plant Profile</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-emerald-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-semibold">Loading plant profiles...</span>
        </div>
      ) : plants.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
          <Sprout className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No plant profiles created yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create a profile for your greenhouse tomatoes, orchard apples, or field corn to monitor changes over time.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="glass-button-primary px-6 py-2.5 rounded-xl text-xs font-bold"
          >
            Create Your First Plant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Plant List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Tracked Plants ({plants.length})
            </div>
            <div className="space-y-2">
              {plants.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setActivePlant(p)}
                  className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                    activePlant?.id === p.id
                      ? 'glass-panel-elevated border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : 'glass-card hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{p.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id);
                      }}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-300 mt-1">
                    Species: <span className="font-semibold text-emerald-300">{p.crop_species}</span>
                    {p.variety && <span> • {p.variety}</span>}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {p.field_identifier || 'Main Plot'}
                    </span>
                    <span className="font-mono text-emerald-400">{p.scans_count} scans</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Plant Details & Chronological Timeline */}
          {activePlant && (
            <div className="lg:col-span-8 space-y-6">
              {/* Plant Meta Card */}
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-7 space-y-4 border border-white/15">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">{activePlant.name}</h2>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">
                      Crop: <span className="text-emerald-300 font-semibold">{activePlant.crop_species}</span> • Location: {activePlant.field_identifier || 'Unassigned'}
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 bg-white/[0.04] px-3 py-1 rounded-xl border border-white/[0.08]">
                    Registered: {new Date(activePlant.created_at).toLocaleDateString()}
                  </span>
                </div>

                {activePlant.notes && (
                  <p className="text-xs text-slate-300 bg-white/[0.03] p-3.5 rounded-2xl border border-white/[0.06] leading-relaxed">
                    <span className="font-bold text-emerald-300">Agronomic Notes: </span>
                    {activePlant.notes}
                  </p>
                )}
              </div>

              {/* Scans Timeline */}
              <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Chronological Foliar Health Timeline
                </h3>

                {activePlant.scans.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
                    No scans linked to this plant profile yet. When scanning in the{' '}
                    <span className="font-bold text-emerald-400">Detect Disease</span> page, select "{activePlant.name}".
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Before & After Comparison if multiple scans */}
                    {activePlant.scans.length >= 2 && (
                      <div className="bg-white/[0.03] backdrop-blur-md p-5 rounded-3xl border border-white/[0.08] space-y-3">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-400" />
                          Progression Observation (Earliest vs Most Recent)
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">First Scan</span>
                            <div className="rounded-2xl overflow-hidden bg-slate-950 h-36 mt-1 border border-white/10">
                              <img
                                src={resolveMediaUrl(activePlant.scans[activePlant.scans.length - 1].image_url)}
                                alt="First scan"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="mt-1.5 font-bold text-white">
                              {activePlant.scans[activePlant.scans.length - 1].disease}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Latest Scan</span>
                            <div className="rounded-2xl overflow-hidden bg-slate-950 h-36 mt-1 border border-emerald-500/30">
                              <img
                                src={resolveMediaUrl(activePlant.scans[0].image_url)}
                                alt="Latest scan"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="mt-1.5 font-bold text-emerald-300">
                              {activePlant.scans[0].disease}
                            </div>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-400 italic">
                          * Visual changes indicate differences in symptomatic foliar areas over time without certifying chemical cure.
                        </div>
                      </div>
                    )}

                    {/* Timeline List */}
                    <div className="divide-y divide-white/[0.06]">
                      {activePlant.scans.map((s) => (
                        <div key={s.id} className="py-3.5 flex items-center justify-between text-xs hover:bg-white/[0.02] px-2 rounded-xl transition-colors">
                          <div className="flex items-center space-x-3.5">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-white/10">
                              <img src={resolveMediaUrl(s.image_url)} alt={s.crop} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-white">{s.disease}</div>
                              <div className="text-[11px] text-slate-400">
                                {new Date(s.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-emerald-400 font-mono">{s.confidence.toFixed(1)}%</div>
                            {s.severity_pct !== null && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                Area: {s.severity_pct.toFixed(1)}%
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Plant Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl">
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-white/20 space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Plant Profile</h3>
            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-300">Plant / Plot Identifier Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Greenhouse Tomato Row 3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full mt-1 px-3.5 py-2.5 rounded-2xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Crop Species:</label>
                <select
                  value={cropSpecies}
                  onChange={(e) => setCropSpecies(e.target.value)}
                  className="glass-input w-full mt-1 px-3.5 py-2.5 rounded-2xl"
                >
                  <option value="Tomato" className="bg-slate-900 text-white">Tomato</option>
                  <option value="Potato" className="bg-slate-900 text-white">Potato</option>
                  <option value="Corn" className="bg-slate-900 text-white">Corn (Maize)</option>
                  <option value="Apple" className="bg-slate-900 text-white">Apple</option>
                  <option value="Grape" className="bg-slate-900 text-white">Grape</option>
                  <option value="Pepper" className="bg-slate-900 text-white">Pepper</option>
                  <option value="Squash" className="bg-slate-900 text-white">Squash</option>
                  <option value="Strawberry" className="bg-slate-900 text-white">Strawberry</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300">Variety / Cultivar (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Roma VF / Early Girl"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="glass-input w-full mt-1 px-3.5 py-2.5 rounded-2xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Field / Zone Location:</label>
                <input
                  type="text"
                  placeholder="e.g. Plot B - Row 4"
                  value={fieldIdentifier}
                  onChange={(e) => setFieldIdentifier(e.target.value)}
                  className="glass-input w-full mt-1 px-3.5 py-2.5 rounded-2xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300">Agronomic Notes:</label>
                <textarea
                  rows={2}
                  placeholder="Fertilizer cycle, soil moisture, previous disease history..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="glass-input w-full mt-1 px-3.5 py-2.5 rounded-2xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="glass-button-secondary px-5 py-2.5 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-button-primary px-5 py-2.5 rounded-xl font-bold"
                >
                  Save Plant Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
