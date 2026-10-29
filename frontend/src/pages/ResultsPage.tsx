import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Eye,
  FileDown,
  RotateCcw,
  Bot,
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { AnalysisResponse } from '../types';
import { exportClientPdf } from '../utils/reportGenerator';
import { getScanPdfUrl, resolveMediaUrl } from '../services/api';

export const ResultsPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const analysis = location.state?.analysis as AnalysisResponse | undefined;
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  if (!analysis) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 animate-in fade-in duration-300">
        <h2 className="text-xl font-bold text-white">No Analysis Available</h2>
        <p className="text-xs text-slate-400">Please scan a leaf image first to view diagnostic findings.</p>
        <Link
          to="/detect"
          className="glass-button-primary inline-flex px-6 py-2.5 rounded-xl text-xs font-bold shadow-glass-glow"
        >
          Go to Scanner
        </Link>
      </div>
    );
  }

  const primary = analysis.primary_prediction;
  const alternatives = analysis.alternative_predictions || [];
  const details = analysis.disease_details;
  const isHealthy = primary.is_healthy;

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const res = await fetch(getScanPdfUrl(analysis.scan_id));
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PlantCare_Report_${analysis.scan_id.substring(0, 8)}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        exportClientPdf(analysis);
      }
    } catch {
      exportClientPdf(analysis);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Scan ID: {analysis.scan_id.substring(0, 13)}...
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 mt-1">
            {t('results.title')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Model: {analysis.model_version} • Generated {new Date(analysis.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="glass-button-secondary px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-1.5"
          >
            <FileDown className="w-4 h-4 text-emerald-400" />
            <span>{downloadingPdf ? 'Exporting...' : t('results.downloadPdf')}</span>
          </button>

          <Link
            to="/detect"
            className="glass-button-primary px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-glass-glow hover:scale-105"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('results.scanAnother')}</span>
          </Link>
        </div>
      </div>

      {/* Uncertainty Alert if flagged */}
      {analysis.is_uncertain && (
        <div className="glass-amber p-4 rounded-2xl text-amber-200 text-xs space-y-1.5 shadow-lg">
          <div className="flex items-center space-x-2 font-bold text-sm text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Diagnostic Uncertainty Advisory</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-200/90">
            The neural vision classifier detected ambiguity or low-margin distribution. Reasons:
          </p>
          <ul className="list-disc list-inside space-y-0.5 font-medium text-amber-200">
            {analysis.uncertainty_reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Diagnostic Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Leaf Photo and Grad-CAM preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel-elevated rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 border border-white/15">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950/90 border border-white/10 h-64 flex items-center justify-center">
              <img
                src={resolveMediaUrl(analysis.image_url)}
                alt="Analyzed Plant"
                className="w-full h-full object-contain"
              />
              <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-slate-200 border border-white/10 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                Uploaded Sample
              </span>
            </div>

            {/* Quick Saliency Button */}
            <button
              onClick={() => navigate('/visual-analysis', { state: { analysis } })}
              className="w-full py-3 glass-button-primary text-white text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-glass-glow hover:scale-[1.01]"
            >
              <Eye className="w-4 h-4 text-emerald-100" />
              <span>{t('results.viewVisual')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Diagnosis Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Primary Result Card */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 space-y-4 border border-white/15">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-300 glass-panel px-3.5 py-1 rounded-full border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                Crop: {primary.crop}
              </span>

              {isHealthy ? (
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-300 glass-panel px-3 py-1 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t('results.healthyStatus')}</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-300 glass-panel px-3 py-1 rounded-full border border-amber-500/30">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>{details.severity_level} Severity</span>
                </span>
              )}
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400">
                {t('results.primaryDiagnosis')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {primary.disease}
              </h2>
              {details.scientific_name && (
                <div className="text-xs text-slate-400 italic font-mono mt-0.5">
                  Pathogen: {details.scientific_name}
                </div>
              )}
            </div>

            {/* Confidence Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                <span>{t('results.confidence')}</span>
                <span className="text-emerald-400 font-mono">{primary.confidence.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/10 p-[1px]">
                <div
                  className={`h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(16,185,129,0.5)] ${
                    primary.confidence > 75
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : primary.confidence > 45
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-red-500 to-orange-400'
                  }`}
                  style={{ width: `${Math.min(primary.confidence, 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400">
                * Based on deep neural network activation; not equivalent to absolute medical probability.
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-white/[0.08]">
              {details.description}
            </p>
          </div>

          {/* Differential Alternatives */}
          {alternatives.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 space-y-3 border border-white/[0.08]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                {t('results.differential')}
              </h3>
              <div className="space-y-2">
                {alternatives.map((alt, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-slate-200 font-medium">{alt.crop} — {alt.disease}</span>
                    <span className="font-mono text-slate-400 font-semibold">{alt.confidence.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct CTA to Treatment Guide & Chatbot */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/guide"
              state={{ analysis }}
              className="flex-1 glass-button-primary py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-glass-glow"
            >
              <span>Explore Smart Treatment Protocols</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/assistant"
              state={{ currentScan: analysis }}
              className="glass-button-secondary py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Ask AI Chatbot</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
