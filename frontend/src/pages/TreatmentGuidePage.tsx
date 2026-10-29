import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Droplets,
  Wind,
  Trash2,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { AnalysisResponse, DiseaseDetail } from '../types';
import { getDiseases, getDiseaseDetail } from '../services/api';

export const TreatmentGuidePage: React.FC = () => {
  const location = useLocation();
  const initialAnalysis = location.state?.analysis as AnalysisResponse | undefined;

  const [diseaseList, setDiseaseList] = useState<any[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>(
    initialAnalysis?.primary_prediction.raw_label || 'Tomato___Early_blight'
  );
  const [currentDisease, setCurrentDisease] = useState<DiseaseDetail | null>(
    initialAnalysis?.disease_details || null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getDiseases({ healthy_only: false })
      .then(setDiseaseList)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedLabel) return;
    setLoading(true);
    getDiseaseDetail(selectedLabel)
      .then(setCurrentDisease)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedLabel]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
          <span>Integrated Pest Management (IPM)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 tracking-tight">
          Smart Treatment & Cultural Guide
        </h1>
        <p className="text-sm text-slate-300">
          Scientifically grounded sanitation, cultural interventions, and prevention protocols for plant health management.
        </p>
      </div>

      {/* Disease Selection Selector */}
      <div className="glass-panel-elevated rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/15">
        <label className="text-xs font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Select Diagnosed Crop & Condition:
        </label>
        <select
          value={selectedLabel}
          onChange={(e) => setSelectedLabel(e.target.value)}
          className="glass-input w-full sm:w-auto min-w-[320px] px-4 py-2.5 rounded-xl text-xs font-semibold focus:border-emerald-500/60 [&>option]:bg-[#0c1612] [&>option]:text-slate-200"
        >
          {diseaseList.map((d) => (
            <option key={d.raw_label} value={d.raw_label}>
              {d.crop} — {d.disease}
            </option>
          ))}
        </select>
      </div>

      {/* Chemical Regulation Disclaimer */}
      <div className="glass-amber p-4 rounded-2xl text-amber-200 text-xs flex items-start space-x-3.5 shadow-lg">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-amber-300 font-semibold">Agronomic Chemical Stewardship Warning: </strong>
          PlantCare AI promotes cultural, mechanical, and biological controls first. AI predictions must never serve as the sole justification for spraying regulated synthetic fungicides or bactericides. Verify active ingredients and regional label compliance with certified extension specialists.
        </div>
      </div>

      {currentDisease && (
        <div className="space-y-6">
          {/* Active Target Banner */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/15">
            <div>
              <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider font-mono">
                Active Protocol Target:
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {currentDisease.crop} — {currentDisease.disease}
              </div>
              {currentDisease.scientific_name && (
                <div className="text-xs text-slate-400 font-mono italic mt-0.5">
                  Pathogen: {currentDisease.scientific_name}
                </div>
              )}
            </div>

            <Link
              to={`/library/${encodeURIComponent(currentDisease.raw_label)}`}
              className="glass-button-secondary px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto hover:scale-105"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>View Library Dossier</span>
            </Link>
          </div>

          {/* Core Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Immediate Practical Steps */}
            <div className="glass-card-interactive rounded-3xl p-6 sm:p-7 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                Immediate Practical Steps
              </h3>
              <div className="space-y-2.5 text-xs text-slate-300">
                {currentDisease.management.slice(0, 3).map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl glass-panel border border-white/[0.08] leading-relaxed flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Sanitation & Pruning */}
            <div className="glass-card-interactive rounded-3xl p-6 sm:p-7 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                Sanitation & Leaf Disposal
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Promptly pinch or prune infected foliage on a sunny, dry afternoon.
              </p>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>Never compost blighted leaves; destroy or seal in trash bags.</li>
                <li>Disinfect pruning shears in 70% isopropyl alcohol between plants.</li>
                <li>Clear all plant residues and leaf litter at the end of each season.</li>
              </ul>
            </div>

            {/* 3. Watering & Airflow */}
            <div className="glass-card-interactive rounded-3xl p-6 sm:p-7 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <Wind className="w-4 h-4" />
                </div>
                Airflow & Moisture Controls
              </h3>
              <ul className="text-xs text-slate-300 space-y-2.5">
                <li className="flex items-start space-x-2.5">
                  <Droplets className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Switch strictly to drip irrigation or soaker hoses to keep foliage dry.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <Wind className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span>Prune lower suckers (bottom 25-30 cm) to eliminate splashback from soil spores.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Maintain wide crop spacing to promote rapid morning dew evaporation.</span>
                </li>
              </ul>
            </div>

            {/* 4. When to Contact an Expert */}
            <div className="glass-card-interactive rounded-3xl p-6 sm:p-7 space-y-4">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                When to Contact Extension Agents
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Contact your regional agricultural extension service or certified crop advisor if:
              </p>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li>More than 20% of your field or canopy shows rapid wilting or necrosis within 48 hours.</li>
                <li>Quarantine-regulated pathogens (such as Citrus Greening) are suspected.</li>
                <li>Organic cultural practices fail and commercial chemical options are being considered.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
