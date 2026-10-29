import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ScanLine,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  HelpCircle,
  ArrowRight,
  Globe2,
  Eye,
  Activity,
  Bot,
  Zap,
  Target
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [heatmapActive, setHeatmapActive] = useState(true);

  const supportedCrops = [
    { name: 'Tomato', count: '10 conditions', icon: '🍅' },
    { name: 'Potato', count: '3 conditions', icon: '🥔' },
    { name: 'Corn (Maize)', count: '4 conditions', icon: '🌽' },
    { name: 'Apple', count: '4 conditions', icon: '🍎' },
    { name: 'Grape', count: '4 conditions', icon: '🍇' },
    { name: 'Pepper Bell', count: '2 conditions', icon: '🫑' },
    { name: 'Orange / Citrus', count: 'Citrus Greening', icon: '🍊' },
    { name: 'Peach', count: 'Bacterial Spot', icon: '🍑' },
    { name: 'Strawberry', count: 'Leaf Scorch', icon: '🍓' },
    { name: 'Squash', count: 'Powdery Mildew', icon: '🥒' },
    { name: 'Cherry', count: 'Powdery Mildew', icon: '🍒' },
    { name: 'Soybean', count: 'Foliar Health', icon: '🌱' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Capture or Upload',
      desc: 'Take a high-resolution photo of the symptomatic leaf showing discoloration, pustules, or spots.',
      icon: ScanLine,
    },
    {
      num: '02',
      title: 'Neural Vision Inference',
      desc: 'Our fine-tuned PyTorch MobileNetV3 model analyzes deep microscopic patterns and symptom signatures in milliseconds.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Grad-CAM Attention',
      desc: 'Gradient-weighted class activation mapping visualizes exactly where the AI focused to verify clinical relevance.',
      icon: Eye,
    },
    {
      num: '04',
      title: 'Integrated IPM Actions',
      desc: 'Receive cultural sanitation, pruning advice, watering guidance, and verified references from university extensions.',
      icon: ShieldCheck,
    },
  ];

  const faqs = [
    {
      q: 'How does PlantCare AI classify plant diseases?',
      a: 'PlantCare AI runs a deep convolutional neural network (MobileNetV3) trained across 38 distinct plant and pathogen categories. It computes predictive probabilities, evaluates distribution entropy, and highlights visible symptoms using Grad-CAM attention heatmaps.'
    },
    {
      q: 'Are the AI recommendations a substitute for laboratory testing?',
      a: 'No. PlantCare AI is designed as a rapid diagnostic screening tool. For large-scale commercial spraying or regulatory plant health certifications, always verify findings with a certified local agricultural extension agronomist.'
    },
    {
      q: 'Does PlantCare AI work with blurry or low-light images?',
      a: 'The scanner includes an automated image quality verification engine. If an image is too blurry, dark, or lacks plant features, the system displays an explicit uncertainty notice rather than guessing.'
    },
    {
      q: 'Which languages are supported?',
      a: 'PlantCare AI features complete multilingual interfaces for English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), and Kannada (ಕನ್ನಡ).'
    }
  ];

  return (
    <div className="space-y-24 pb-20 animate-in fade-in duration-500">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
        {/* Subtle Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('hero.badge')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 tracking-tight leading-[1.12]">
                Detect Plant Diseases with <span className="text-gradient-emerald">AI</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/detect"
                  className="glass-button-primary px-7 py-4 rounded-2xl font-bold text-sm flex items-center space-x-2.5 group shadow-glass-glow"
                >
                  <ScanLine className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
                  <span>{t('hero.ctaAnalyze')}</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/library"
                  className="glass-button-secondary px-7 py-4 rounded-2xl font-bold text-sm flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>{t('hero.ctaLibrary')}</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-300">
                <div className="flex items-center space-x-2 glass-panel px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PyTorch MobileNetV3</span>
                </div>
                <div className="flex items-center space-x-2 glass-panel px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Grad-CAM Visual Heatmaps</span>
                </div>
                <div className="flex items-center space-x-2 glass-panel px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Integrated IPM Guidance</span>
                </div>
              </div>
            </div>

            {/* Right Column: Luminous Glass Diagnostic Mockup Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md glass-panel-elevated rounded-3xl p-6 shadow-2xl border border-white/20">
                {/* Botanical Leaf Diagnostic Canvas */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a1813] to-[#040907] h-64 border border-white/10 flex items-center justify-center p-4">
                  {/* Botanical Leaf SVG Illustration */}
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full max-h-56 select-none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Leaf Blade Outer Contour */}
                    <path
                      d="M100 15 C145 45, 175 105, 140 165 C115 185, 85 185, 60 165 C25 105, 55 45, 100 15 Z"
                      fill="url(#leafGradient)"
                      stroke="#10b981"
                      strokeWidth="1.5"
                      strokeOpacity="0.6"
                    />

                    {/* Central Midrib Vein */}
                    <path
                      d="M100 15 Q100 90 100 175"
                      stroke="#34d399"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeOpacity="0.7"
                    />

                    {/* Secondary Lateral Veins */}
                    <path d="M100 45 Q125 55 140 70" stroke="#34d399" strokeWidth="1" strokeOpacity="0.4" />
                    <path d="M100 45 Q75 55 60 70" stroke="#34d399" strokeWidth="1" strokeOpacity="0.4" />
                    <path d="M100 75 Q135 90 150 110" stroke="#34d399" strokeWidth="1" strokeOpacity="0.4" />
                    <path d="M100 75 Q65 90 50 110" stroke="#34d399" strokeWidth="1" strokeOpacity="0.4" />
                    <path d="M100 110 Q130 125 145 145" stroke="#34d399" strokeWidth="1" strokeOpacity="0.4" />
                    <path d="M100 110 Q70 125 55 145" stroke="#34d399" strokeWidth="1" strokeOpacity="0.4" />

                    {/* Concentric Early Blight Lesions (Alternaria solani target spots) */}
                    <circle cx="82" cy="85" r="14" fill="#3f2715" stroke="#78350f" strokeWidth="1.2" />
                    <circle cx="82" cy="85" r="10" fill="#291a0c" stroke="#92400e" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx="82" cy="85" r="5" fill="#180f07" stroke="#b45309" strokeWidth="1.2" />

                    <circle cx="122" cy="115" r="10" fill="#3f2715" stroke="#78350f" strokeWidth="1" />
                    <circle cx="122" cy="115" r="6" fill="#291a0c" stroke="#92400e" strokeWidth="0.8" />

                    {/* Grad-CAM Saliency Heatmap Overlay (when active) */}
                    {heatmapActive && (
                      <g className="transition-opacity duration-300">
                        {/* Outer Green Halo */}
                        <circle cx="82" cy="85" r="32" fill="url(#gradCamOuter)" opacity="0.65" />
                        {/* Middle Amber Core */}
                        <circle cx="82" cy="85" r="22" fill="url(#gradCamMiddle)" opacity="0.8" />
                        {/* Center Crimson Hotspot */}
                        <circle cx="82" cy="85" r="12" fill="url(#gradCamHotspot)" opacity="0.9" />

                        {/* Secondary Lesion Heatmap */}
                        <circle cx="122" cy="115" r="18" fill="url(#gradCamMiddle)" opacity="0.6" />
                        <circle cx="122" cy="115" r="9" fill="url(#gradCamHotspot)" opacity="0.75" />
                      </g>
                    )}

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="leafGradient" x1="100" y1="15" x2="100" y2="185" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#064e3b" />
                        <stop offset="50%" stopColor="#047857" />
                        <stop offset="100%" stopColor="#065f46" />
                      </linearGradient>

                      <radialGradient id="gradCamHotspot" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
                        <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                      </radialGradient>

                      <radialGradient id="gradCamMiddle" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                        <stop offset="70%" stopColor="#10b981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </radialGradient>

                      <radialGradient id="gradCamOuter" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>

                  {/* Scanning Laser Beam */}
                  <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-scan-sweep pointer-events-none" />

                  {/* Saliency Heatmap Interactive Toggle Pill */}
                  <button
                    type="button"
                    onClick={() => setHeatmapActive(!heatmapActive)}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass-panel border border-emerald-500/30 text-[10px] font-bold text-emerald-300 hover:scale-105 transition-transform flex items-center gap-1 shadow-sm"
                  >
                    <Eye className="w-3 h-3 text-emerald-400" />
                    <span>{heatmapActive ? 'Heatmap: ON' : 'Heatmap: OFF'}</span>
                  </button>

                  {/* Floating AI Diagnostic Card */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent flex flex-col justify-end p-4">
                    <div className="flex items-center justify-between text-white">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                        Analyzed Leaf Specimen
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        96.2% Confidence
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-white mt-1">
                      Tomato — Early Blight
                    </div>
                    <div className="text-[10px] text-slate-300 italic font-mono">
                      Alternaria solani • Foliar Lesion Detected
                    </div>
                  </div>
                </div>

                {/* Saliency & Area Metric Pill */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="glass-panel p-3 rounded-2xl border border-white/[0.08] flex items-center space-x-2.5">
                    <Activity className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400">Affected Area</div>
                      <div className="font-bold text-slate-100">~18.4% Foliar Surface</div>
                    </div>
                  </div>

                  <div className="glass-panel p-3 rounded-2xl border border-white/[0.08] flex items-center space-x-2.5">
                    <Target className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400">Grad-CAM Salience</div>
                      <div className="font-bold text-slate-100">Concentric Rings</div>
                    </div>
                  </div>
                </div>

                {/* Action button inside card */}
                <Link
                  to="/detect"
                  className="mt-4 w-full py-3 glass-button-primary text-white font-bold text-xs rounded-2xl flex items-center justify-center space-x-2 shadow-glass-glow"
                >
                  <span>Scan Your Own Leaf Specimen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How the AI Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
            Diagnostic Methodology
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            How PlantCare AI Evaluates Foliar Health
          </h3>
          <p className="text-sm text-slate-300">
            A 4-step pipeline designed to deliver rapid, transparent, and evidence-grounded plant diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="glass-card-interactive rounded-3xl p-6 relative group"
              >
                <div className="text-3xl font-black text-white/10 group-hover:text-emerald-500/30 transition-colors mb-2 font-mono">
                  {s.num}
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">{s.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Supported Crops Grid */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                Coverage Catalog
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Supported Agricultural Crops
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Covering staples, vegetables, orchard fruits, and cash crops across 38 specific disease classes.
              </p>
            </div>
            <Link
              to="/library"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 transition-colors"
            >
              <span>Explore All 38 Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {supportedCrops.map((crop) => (
              <Link
                key={crop.name}
                to={`/library?crop=${encodeURIComponent(crop.name.split(' ')[0])}`}
                className="glass-card-interactive p-4 rounded-3xl text-center group"
              >
                <div className="text-3xl mb-2.5 group-hover:scale-110 transition-transform">
                  {crop.icon}
                </div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {crop.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{crop.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Multilingual & Accessibility Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-elevated rounded-3xl p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-white/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="lg:col-span-8 space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Farmer-Centric Multilingual Access</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Designed for Farmers & Growers in Regional Languages
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Precision agriculture should be accessible to all. PlantCare AI provides full native language support in English, தமிழ் (Tamil), हिन्दी (Hindi), తెలుగు (Telugu), and ಕನ್ನಡ (Kannada) for diagnoses, symptom lists, and treatment recommendations.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {['English', 'தமிழ் (Tamil)', 'हिन्दी (Hindi)', 'తెలుగు (Telugu)', 'ಕನ್ನಡ (Kannada)'].map((l) => (
                <span key={l} className="px-3 py-1 rounded-xl glass-panel border border-white/[0.1] text-xs font-medium text-slate-200">
                  {l}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center relative z-10">
            <Link
              to="/assistant"
              className="glass-button-primary px-7 py-4 font-bold text-xs rounded-2xl flex items-center space-x-2 shadow-glass-glow"
            >
              <Bot className="w-4 h-4 text-white" />
              <span>Talk with Agricultural AI</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
            Frequently Asked Questions
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Answers on AI Technology & Agronomy
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="glass-panel rounded-2xl p-6 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {f.q}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-panel-elevated rounded-3xl p-10 sm:p-14 border border-emerald-500/25 space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white relative z-10">
            Ready to Protect Your Crops?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto relative z-10 leading-relaxed">
            Scan your first plant leaf now and receive deep learning diagnostics, Grad-CAM visual verification, and evidence-based treatment steps.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Link
              to="/detect"
              className="glass-button-primary px-7 py-3.5 rounded-2xl font-bold text-xs flex items-center space-x-2 shadow-glass-glow"
            >
              <ScanLine className="w-4 h-4 text-emerald-100" />
              <span>Scan a Leaf Now</span>
            </Link>
            <Link
              to="/weather"
              className="glass-button-secondary px-7 py-3.5 rounded-2xl font-bold text-xs"
            >
              Check Weather Risk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
