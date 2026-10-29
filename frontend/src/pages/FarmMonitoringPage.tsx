import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  ShieldCheck,
  Compass,
  Info,
  Loader2,
  Sprout
} from 'lucide-react';
import { getFarmFields, createFarmField } from '../services/api';
import { FarmField } from '../types';

export const FarmMonitoringPage: React.FC = () => {
  const [fields, setFields] = useState<FarmField[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState('');
  const [cropType, setCropType] = useState('Tomato');
  const [areaHectares, setAreaHectares] = useState(2.5);
  const [latitude, setLatitude] = useState<number | undefined>(36.6777);
  const [longitude, setLongitude] = useState<number | undefined>(-121.6555);
  const [notes, setNotes] = useState('');

  const fetchFields = () => {
    setLoading(true);
    getFarmFields()
      .then(setFields)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const created = await createFarmField({
        name,
        crop_type: cropType,
        area_hectares: Number(areaHectares),
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        notes: notes || undefined
      });
      setFields((prev) => [created, ...prev]);
      setShowModal(false);
      setName('');
      setNotes('');
    } catch {
      alert('Failed to register farm plot.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full glass-panel text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Spatial Crop Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 mt-2">
            Farm Plots & Field Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Register plot boundaries, monitor field disease hotspots, and map diagnostic health across acreage.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="glass-button-primary px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto shadow-glass-glow hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Field Plot</span>
        </button>
      </div>

      {/* Location Privacy Callout */}
      <div className="p-4 rounded-2xl glass-panel border-cyan-500/30 text-slate-300 text-xs flex items-start space-x-3 shadow-glass">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-cyan-300 font-semibold">Location Privacy Guard: </strong>
          Field plot coordinates are approximate and strictly confidential. PlantCare AI never publishes private farm geolocation boundaries without explicit grower authorization.
        </span>
      </div>

      {/* Field Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-emerald-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading farm field records...</span>
        </div>
      ) : fields.length === 0 ? (
        <div className="glass-panel rounded-3xl border border-slate-800/80 p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl glass-panel flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">No farm fields registered yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Add field plots to group plant scans by location and spot emerging spatial disease hotspots across your property.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 glass-button-primary text-white rounded-xl text-xs font-bold shadow-glass-glow"
          >
            Register Plot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <div
              key={field.id}
              className="glass-card-interactive rounded-3xl border border-slate-800/80 p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 glass-panel px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                    <Sprout className="w-3 h-3 text-emerald-400" />
                    {field.crop_type}
                  </span>
                  <span className="text-xs font-mono font-semibold text-cyan-400">
                    {field.area_hectares} ha
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-100">{field.name}</h3>
                  {field.latitude && field.longitude && (
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{field.latitude.toFixed(4)}° N, {field.longitude.toFixed(4)}° W</span>
                    </div>
                  )}
                </div>

                {field.notes && (
                  <p className="text-xs text-slate-300 leading-relaxed glass-panel p-3.5 rounded-xl border border-slate-800/80">
                    {field.notes}
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="inline-flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Monitored Active</span>
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {new Date(field.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Field Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-700/80 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              Register Field Plot
            </h3>
            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-medium text-slate-300">Field / Plot Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Orchard Block 2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full mt-1 px-3 py-2 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="font-medium text-slate-300">Primary Crop Type:</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="glass-input w-full mt-1 px-3 py-2 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 [&>option]:bg-[#0c1612] [&>option]:text-slate-200"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Corn">Corn (Maize)</option>
                  <option value="Apple">Apple</option>
                  <option value="Grape">Grape</option>
                  <option value="Pepper">Pepper</option>
                  <option value="Squash">Squash</option>
                  <option value="Soybean">Soybean</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-300">Area (Hectares):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={areaHectares}
                  onChange={(e) => setAreaHectares(Number(e.target.value))}
                  className="glass-input w-full mt-1 px-3 py-2 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-slate-300">Latitude (Approx):</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude || ''}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="glass-input w-full mt-1 px-3 py-2 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-300">Longitude (Approx):</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude || ''}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="glass-input w-full mt-1 px-3 py-2 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-300">Soil or Agronomic Notes:</label>
                <textarea
                  rows={2}
                  placeholder="Drip irrigation, sandy loam soil, high humidity exposure..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="glass-input w-full mt-1 px-3 py-2 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl glass-panel text-slate-300 font-medium hover:text-white hover:border-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl glass-button-primary text-white font-bold shadow-glass-glow"
                >
                  Save Field Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
