import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Droplets,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Loader2,
  ScanLine
} from 'lucide-react';
import { getDiseaseDetail } from '../services/api';
import { DiseaseDetail } from '../types';

export const DiseaseDetailPage: React.FC = () => {
  const { rawLabel } = useParams<{ rawLabel: string }>();
  const [disease, setDisease] = useState<DiseaseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rawLabel) return;
    setLoading(true);
    getDiseaseDetail(rawLabel)
      .then(setDisease)
      .catch((err) => setError(err.message || 'Disease record not found.'))
      .finally(() => setLoading(false));
  }, [rawLabel]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 text-emerald-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs font-semibold">Loading plant pathology dossier...</span>
      </div>
    );
  }

  if (error || !disease) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Disease Record Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'Could not locate requested agricultural dossier.'}</p>
        <Link
          to="/library"
          className="glass-button-primary inline-flex px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          Return to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/library"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Disease Library</span>
        </Link>
      </div>

      {/* Main Header Banner */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 space-y-4 border border-white/15">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 px-3.5 py-1 rounded-full border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              {disease.crop}
            </span>
            {disease.is_healthy ? (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Healthy Status</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Severity: {disease.severity_level}</span>
              </span>
            )}
          </div>

          <Link
            to="/detect"
            className="glass-button-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Scan a Leaf for this</span>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {disease.disease}
          </h1>
          {disease.scientific_name && (
            <div className="text-sm text-slate-400 font-mono italic mt-1">
              Pathogen: {disease.scientific_name}
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-3 border-t border-white/[0.08]">
          {disease.description}
        </p>
      </div>

      {/* Symptoms & Causes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            Diagnostic Symptoms
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {disease.symptoms.map((s, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Causes & Epidemiology */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-cyan-400" />
            Epidemiological Triggers
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {disease.causes}
          </p>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] text-[11px] text-slate-400 border border-white/[0.06] mt-2">
            Pathogens proliferate rapidly under stagnant humidity and prolonged free moisture on leaf blades.
          </div>
        </div>
      </div>

      {/* Management & Prevention Tabs */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Recommended Cultural Management
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            {disease.management.map((m, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <span className="font-extrabold text-emerald-400 text-xs font-mono">{idx + 1}.</span>
                <span className="leading-relaxed">{m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-white/[0.08]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            Long-Term Preventive Measures
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            {disease.prevention.map((p, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Verified References */}
      {disease.references && disease.references.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Academic & Extension References
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {disease.references.map((ref, idx) => (
              <a
                key={idx}
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-emerald-300 border border-white/[0.1] flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>{ref.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
