import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Trash2,
  FileDown,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  ScanLine
} from 'lucide-react';
import { getScans, deleteScan, getScanPdfUrl, resolveMediaUrl } from '../services/api';
import { ScanListItem } from '../types';

export const ScanHistoryPage: React.FC = () => {
  const [scans, setScans] = useState<ScanListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');

  const fetchScans = () => {
    setLoading(true);
    getScans(selectedCrop === 'All' ? undefined : selectedCrop)
      .then(setScans)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchScans();
  }, [selectedCrop]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this scan record and its images?')) {
      return;
    }
    try {
      await deleteScan(id);
      setScans((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('Failed to delete scan.');
    }
  };

  const filteredScans = scans.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.crop.toLowerCase().includes(q) || s.disease.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <History className="w-3.5 h-3.5" />
            <span>Foliar Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Scan History Dossiers
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Historical diagnostic records, affected area percentages, and downloadable official PDF reports.
          </p>
        </div>

        <Link
          to="/detect"
          className="glass-button-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <ScanLine className="w-4 h-4 text-emerald-100" />
          <span>New Leaf Scan</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search scans by crop or disease..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="glass-input w-full px-3.5 py-2.5 rounded-2xl text-xs font-medium"
          >
            <option value="All" className="bg-slate-900 text-white">All Crops</option>
            <option value="Tomato" className="bg-slate-900 text-white">Tomato</option>
            <option value="Potato" className="bg-slate-900 text-white">Potato</option>
            <option value="Corn" className="bg-slate-900 text-white">Corn</option>
            <option value="Apple" className="bg-slate-900 text-white">Apple</option>
            <option value="Grape" className="bg-slate-900 text-white">Grape</option>
            <option value="Pepper" className="bg-slate-900 text-white">Pepper</option>
          </select>
        </div>
      </div>

      {/* Scans List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-emerald-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-semibold">Loading scan history...</span>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
          <History className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No scans recorded yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Scan your first plant leaf to start tracking health and pathogen diagnoses.
          </p>
          <Link
            to="/detect"
            className="glass-button-primary inline-flex px-5 py-2.5 rounded-xl text-xs font-bold"
          >
            Go to Scanner
          </Link>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl divide-y divide-white/[0.06]">
          {filteredScans.map((scan) => (
            <div
              key={scan.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
            >
              {/* Left: Thumbnail & Details */}
              <div className="flex items-start sm:items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-950 flex-shrink-0 border border-white/10 shadow-md">
                  <img src={resolveMediaUrl(scan.image_url)} alt={scan.crop} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">
                      {scan.crop} — {scan.disease}
                    </span>
                    {scan.is_healthy ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Healthy</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{scan.confidence.toFixed(1)}% Conf</span>
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center space-x-3">
                    <span>{new Date(scan.created_at).toLocaleString()}</span>
                    {scan.severity_pct !== null && scan.severity_pct !== undefined && (
                      <span className="text-emerald-400/90 font-mono">• Area Salience: {scan.severity_pct.toFixed(1)}%</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center space-x-2.5 self-end sm:self-auto">
                <a
                  href={getScanPdfUrl(scan.id)}
                  download
                  className="glass-button-secondary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
                  title="Download PDF Dossier"
                >
                  <FileDown className="w-4 h-4 text-emerald-400" />
                  <span className="hidden md:inline">PDF Dossier</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(scan.id)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                  title="Delete scan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
