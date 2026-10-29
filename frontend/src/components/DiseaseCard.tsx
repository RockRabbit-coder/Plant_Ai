import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowRight, Activity } from 'lucide-react';

interface DiseaseCardProps {
  disease: {
    raw_label: string;
    crop: string;
    disease: string;
    display_name: string;
    scientific_name?: string;
    is_healthy: boolean;
    severity_level: string;
    description: string;
    symptoms_count: number;
    symptoms_preview: string[];
  };
}

export const DiseaseCard: React.FC<DiseaseCardProps> = ({ disease }) => {
  return (
    <div className="glass-card-interactive rounded-3xl p-6 flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Header Tags */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            {disease.crop}
          </span>
          {disease.is_healthy ? (
            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Healthy</span>
            </span>
          ) : (
            <span className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
              disease.severity_level.includes('Critical') || disease.severity_level.includes('Emergency')
                ? 'text-red-300 bg-red-500/15 border-red-500/30'
                : 'text-amber-300 bg-amber-500/15 border-amber-500/30'
            }`}>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{disease.severity_level}</span>
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
            {disease.disease}
          </h3>
          {disease.scientific_name && (
            <p className="text-xs text-slate-400 italic font-mono mt-0.5">
              {disease.scientific_name}
            </p>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {disease.description}
        </p>

        {/* Symptoms Preview */}
        {disease.symptoms_preview && disease.symptoms_preview.length > 0 && (
          <div className="bg-white/[0.03] backdrop-blur-md p-3 rounded-2xl border border-white/[0.06] space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              Key Signs:
            </div>
            <ul className="text-[11px] text-slate-300 list-disc list-inside space-y-0.5">
              {disease.symptoms_preview.map((s, idx) => (
                <li key={idx} className="line-clamp-1">{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between">
        <Link
          to={`/library/${encodeURIComponent(disease.raw_label)}`}
          className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center space-x-1.5 transition-colors"
        >
          <span>View Full Dossier</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
