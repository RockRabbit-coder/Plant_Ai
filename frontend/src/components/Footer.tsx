import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldAlert, Heart, ExternalLink, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050b09]/85 backdrop-blur-2xl text-slate-300 border-t border-white/[0.08] relative overflow-hidden">
      {/* Subtle Bottom Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-white/20">
                <Sprout className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">PlantCare AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detect plant diseases with deep learning computer vision. Providing actionable cultural sanitation and IPM advice for farmers, researchers, and home gardeners.
            </p>
            <div className="text-[11px] text-emerald-400/90 font-mono flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 w-fit">
              <Cpu className="w-3 h-3" />
              <span>PyTorch MobileNetV3 • Grad-CAM</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/detect" className="text-slate-400 hover:text-emerald-400 transition-colors">Foliar Disease Scanner</Link></li>
              <li><Link to="/library" className="text-slate-400 hover:text-emerald-400 transition-colors">PlantVillage Disease Library</Link></li>
              <li><Link to="/guide" className="text-slate-400 hover:text-emerald-400 transition-colors">Smart Treatment Guide</Link></li>
              <li><Link to="/weather" className="text-slate-400 hover:text-emerald-400 transition-colors">Epidemiological Weather Risk</Link></li>
              <li><Link to="/assistant" className="text-slate-400 hover:text-emerald-400 transition-colors">Conversational Agronomist</Link></li>
            </ul>
          </div>

          {/* Farm Tools */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-3">Farm Management</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors">Analytics Dashboard</Link></li>
              <li><Link to="/history" className="text-slate-400 hover:text-emerald-400 transition-colors">Scan Records & PDF Dossiers</Link></li>
              <li><Link to="/plants" className="text-slate-400 hover:text-emerald-400 transition-colors">Crop & Plant Profiles</Link></li>
              <li><Link to="/farms" className="text-slate-400 hover:text-emerald-400 transition-colors">Field Hotspot Monitor</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">Agronomic Sources & Team</Link></li>
            </ul>
          </div>

          {/* Scientific Disclaimer Card */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Advisory Disclaimer
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed bg-white/[0.03] backdrop-blur-md p-3.5 rounded-2xl border border-white/[0.08] shadow-inner">
              PlantCare AI diagnoses are preliminary computer vision predictions. Always cross-check with certified local agricultural university extension agents before applying chemical controls or commercial pesticide treatments.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
              <a href="https://ipm.ucanr.edu" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                UC IPM <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <a href="https://fao.org" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                FAO <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <a href="https://extension.cornell.edu" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
                Cornell <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400">
          <div>© {new Date().getFullYear()} PlantCare AI. Protect Every Leaf.</div>
          <div className="mt-2 sm:mt-0 flex items-center space-x-1.5 text-slate-400">
            <span>Precision agriculture with environmental stewardship</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
