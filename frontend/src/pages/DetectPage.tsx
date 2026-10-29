import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ScanLine,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Cpu,
  Info,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { analyzeImage, getPlants } from '../services/api';
import { PlantProfile } from '../types';

export const DetectPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [plants, setPlants] = useState<PlantProfile[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string>('');

  useEffect(() => {
    getPlants()
      .then(setPlants)
      .catch(() => {});
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setErrorMsg(null);
    setAnalysisStep('Verifying image resolution & focus metrics...');

    try {
      setTimeout(() => {
        setAnalysisStep('Running PyTorch MobileNetV3 convolutional inference...');
      }, 500);

      setTimeout(() => {
        setAnalysisStep('Computing Grad-CAM saliency attention maps...');
      }, 1200);

      const result = await analyzeImage(selectedFile, selectedPlantId || undefined);

      // Navigate to results page with analysis response
      navigate('/results', { state: { analysis: result } });
    } catch (err: any) {
      setErrorMsg(err.message || 'Analysis could not be completed. Please ensure image is clear and leaf is centered.');
    } finally {
      setAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Helper to generate curated test specimen from Canvas
  const loadSampleSpecimen = (cropName: string, lesionType: 'target' | 'rust' | 'healthy') => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#06130d';
    ctx.fillRect(0, 0, 400, 400);

    // Leaf base
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(200, 200, 140, 180, Math.PI / 12, 0, Math.PI * 2);
    ctx.fillStyle = lesionType === 'healthy' ? '#1b7a43' : '#22633d';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#2ed573';
    ctx.stroke();

    // Central vein
    ctx.beginPath();
    ctx.moveTo(200, 30);
    ctx.quadraticCurveTo(195, 200, 200, 370);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#7bed9f';
    ctx.stroke();

    // Secondary veins
    for (let y = 80; y <= 320; y += 45) {
      ctx.beginPath();
      ctx.moveTo(200, y);
      ctx.lineTo(100, y - 25);
      ctx.moveTo(200, y);
      ctx.lineTo(300, y - 25);
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = 'rgba(123, 237, 159, 0.45)';
      ctx.stroke();
    }

    // Lesions
    if (lesionType === 'target') {
      // Concentric circles (early blight)
      const lesions = [
        { x: 150, y: 170, r: 28 },
        { x: 260, y: 220, r: 20 },
        { x: 170, y: 270, r: 16 }
      ];
      lesions.forEach(l => {
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
        ctx.fillStyle = '#4a2810';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#b45309';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(l.x, l.y, l.r * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = '#d97706';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(l.x, l.y, l.r * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = '#1c0f05';
        ctx.fill();
      });
    } else if (lesionType === 'rust') {
      // Cinnamon rust pustules
      for (let i = 0; i < 25; i++) {
        const x = 140 + Math.random() * 120;
        const y = 100 + Math.random() * 180;
        ctx.beginPath();
        ctx.arc(x, y, 4 + Math.random() * 5, 0, Math.PI * 2);
        ctx.fillStyle = '#b45309';
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `${cropName.toLowerCase()}_sample_specimen.jpg`, { type: 'image/jpeg' });
        setSelectedFile(file);
        setErrorMsg(null);
      }
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
          <span>Foliar Disease Detection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 tracking-tight">
          {t('detect.title')}
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          {t('detect.subtitle')}
        </p>
      </div>

      {/* Uncertainty Notice Glass Banner */}
      <div className="glass-amber p-4 rounded-2xl text-amber-200 text-xs flex items-start space-x-3.5 shadow-lg">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-amber-300 font-semibold">Diagnostic Advisory: </strong>
          {t('detect.uncertaintyBanner')}
        </span>
      </div>

      {/* Upload Zone */}
      <div className="space-y-4">
        <ImageUploader
          selectedFile={selectedFile}
          onImageSelected={(file) => {
            setSelectedFile(file);
            setErrorMsg(null);
          }}
          onClear={() => {
            setSelectedFile(null);
            setErrorMsg(null);
          }}
        />

        {/* Quick Sample Specimen Strip */}
        {!selectedFile && (
          <div className="glass-panel p-4 rounded-2xl border border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Or test instantly with a curated specimen leaf:
              </span>
              <span className="text-[11px] text-slate-500">1-click test</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => loadSampleSpecimen('Tomato_Early_Blight', 'target')}
                className="px-3 py-2 rounded-xl glass-panel text-left text-xs text-slate-200 hover:text-white hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all flex items-center gap-2 group"
              >
                <span className="text-base">🍅</span>
                <div>
                  <div className="font-bold text-[11px] group-hover:text-emerald-300">Tomato Blight</div>
                  <div className="text-[9px] text-slate-400">Target spots</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loadSampleSpecimen('Corn_Common_Rust', 'rust')}
                className="px-3 py-2 rounded-xl glass-panel text-left text-xs text-slate-200 hover:text-white hover:border-amber-500/40 hover:bg-amber-500/10 transition-all flex items-center gap-2 group"
              >
                <span className="text-base">🌽</span>
                <div>
                  <div className="font-bold text-[11px] group-hover:text-amber-300">Corn Rust</div>
                  <div className="text-[9px] text-slate-400">Pustule lesions</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loadSampleSpecimen('Potato_Late_Blight', 'target')}
                className="px-3 py-2 rounded-xl glass-panel text-left text-xs text-slate-200 hover:text-white hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all flex items-center gap-2 group"
              >
                <span className="text-base">🥔</span>
                <div>
                  <div className="font-bold text-[11px] group-hover:text-emerald-300">Potato Blight</div>
                  <div className="text-[9px] text-slate-400">Foliar necrosis</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loadSampleSpecimen('Strawberry_Healthy', 'healthy')}
                className="px-3 py-2 rounded-xl glass-panel text-left text-xs text-slate-200 hover:text-white hover:border-teal-500/40 hover:bg-teal-500/10 transition-all flex items-center gap-2 group"
              >
                <span className="text-base">🍓</span>
                <div>
                  <div className="font-bold text-[11px] group-hover:text-teal-300">Healthy Leaf</div>
                  <div className="text-[9px] text-slate-400">Zero lesions</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Optional Plant Profile Association */}
        {plants.length > 0 && (
          <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-white/[0.08]">
            <label className="font-semibold text-slate-200">
              Associate with Saved Plant Profile:
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              className="glass-input px-3.5 py-2 rounded-xl text-xs font-medium focus:border-emerald-500/50 [&>option]:bg-[#0c1612] [&>option]:text-slate-200"
            >
              <option value="">None (Independent Scan)</option>
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.crop_species})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Error Message if any */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/15 backdrop-blur-md border border-red-500/35 text-red-200 text-xs flex items-start space-x-3">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-300">Diagnostics Notice:</div>
            <div>{errorMsg}</div>
          </div>
        </div>
      )}

      {/* Main Action Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={!selectedFile || analyzing}
          onClick={handleAnalyze}
          className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2.5 transition-all ${
            !selectedFile || analyzing
              ? 'bg-white/[0.03] text-slate-500 border border-white/[0.07] cursor-not-allowed shadow-none'
              : 'glass-button-primary shadow-glass-glow hover:scale-[1.01]'
          }`}
        >
          {analyzing ? (
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>{analysisStep || 'Analyzing foliar image...'}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>Analyze Plant Leaf Specimen</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>

      {/* Instructions / Best Practices */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-4">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Tips for Maximum AI Accuracy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Center the individual leaf against a neutral background (hand or soil).</span>
          </div>
          <div className="flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Avoid heavy shadow cast or blinding direct camera flash.</span>
          </div>
          <div className="flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Capture both healthy leaf tissue and visible lesions for contrast.</span>
          </div>
          <div className="flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Wipe off loose dust or debris on the foliar lamina before photographing.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
