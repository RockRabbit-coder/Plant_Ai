import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Search, Filter, Sprout, Loader2, Sparkles } from 'lucide-react';
import { getDiseases } from '../services/api';
import { DiseaseCard } from '../components/DiseaseCard';

export const DiseaseLibraryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCrop = searchParams.get('crop') || '';

  const [diseases, setDiseases] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>(initialCrop || 'All Crops');
  const [statusFilter, setStatusFilter] = useState<'all' | 'diseased' | 'healthy'>('all');

  const CROPS_LIST = [
    { name: 'All Crops', icon: '🌿' },
    { name: 'Tomato', icon: '🍅' },
    { name: 'Potato', icon: '🥔' },
    { name: 'Corn', icon: '🌽' },
    { name: 'Apple', icon: '🍎' },
    { name: 'Grape', icon: '🍇' },
    { name: 'Pepper', icon: '🫑' },
    { name: 'Orange', icon: '🍊' },
    { name: 'Peach', icon: '🍑' },
    { name: 'Squash', icon: '🥒' },
    { name: 'Strawberry', icon: '🍓' },
    { name: 'Cherry', icon: '🍒' },
    { name: 'Soybean', icon: '🌱' }
  ];

  useEffect(() => {
    setLoading(true);
    const cropParam = selectedCrop === 'All Crops' || !selectedCrop ? undefined : selectedCrop;
    const healthyParam = statusFilter === 'all' ? undefined : statusFilter === 'healthy';

    getDiseases({
      crop: cropParam,
      healthy_only: healthyParam,
      search: searchQuery || undefined
    })
      .then((data) => {
        setDiseases(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCrop, statusFilter, searchQuery]);

  const handleSelectCrop = (cropName: string) => {
    setSelectedCrop(cropName);
    if (cropName === 'All Crops') {
      setSearchParams({});
    } else {
      setSearchParams({ crop: cropName });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Agricultural Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 tracking-tight">
          PlantVillage Disease Library
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Search supported crops and diseases. Explore scientific pathogens, symptoms, causes, and university-verified prevention protocols.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel-elevated rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 border border-white/15">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by disease, symptom, or scientific name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium placeholder-slate-500 focus:border-emerald-500/60"
            />
          </div>

          {/* Crop Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCrop}
              onChange={(e) => handleSelectCrop(e.target.value)}
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-medium focus:border-emerald-500/60 [&>option]:bg-[#0c1612] [&>option]:text-slate-200"
            >
              {CROPS_LIST.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Health Filter */}
          <div className="md:col-span-3 flex glass-panel p-1 rounded-xl border border-white/[0.08] text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('diseased')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                statusFilter === 'diseased'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Diseases
            </button>
            <button
              onClick={() => setStatusFilter('healthy')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                statusFilter === 'healthy'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Healthy
            </button>
          </div>
        </div>

        {/* Quick Crop Tag Strip */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CROPS_LIST.map((c) => {
            const active = selectedCrop === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => handleSelectCrop(c.name)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 transition-all ${
                  active
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'glass-panel text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Showing <strong className="text-white font-mono">{diseases.length}</strong> verified dossiers
            {selectedCrop !== 'All Crops' && <span> for <strong>{selectedCrop}</strong></span>}
          </span>
        </div>
        <span className="font-mono text-emerald-400/80">38 PlantVillage Classes</span>
      </div>

      {/* Grid or Loader */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-emerald-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Querying agricultural knowledge base...</span>
        </div>
      ) : diseases.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-3 border border-white/10">
          <Sprout className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No matching crop records found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the crop filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCrop('All Crops');
              setStatusFilter('all');
            }}
            className="px-5 py-2.5 glass-button-primary text-white rounded-xl text-xs font-bold shadow-glass-glow"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.map((d) => (
            <DiseaseCard key={d.raw_label} disease={d} />
          ))}
        </div>
      )}
    </div>
  );
};
