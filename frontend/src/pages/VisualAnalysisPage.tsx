import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Layers, ShieldAlert, Cpu } from 'lucide-react';
import { GradCamComparison } from '../components/GradCamComparison';
import { AnalysisResponse } from '../types';
import { resolveMediaUrl } from '../services/api';

export const VisualAnalysisPage: React.FC = () => {
  const location = useLocation();
  const analysis = location.state?.analysis as AnalysisResponse | undefined;

  if (!analysis) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">No Visual Data Available</h2>
        <p className="text-xs text-slate-400">Please scan a plant image to generate Grad-CAM heatmaps.</p>
        <Link
          to="/detect"
          className="glass-button-primary inline-flex px-6 py-2.5 rounded-xl text-xs font-bold"
        >
          Open Scanner
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/results"
          state={{ analysis }}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Diagnosis Result</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Cpu className="w-3.5 h-3.5" />
          <span>Explainable AI (XAI)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">
          Visual Symptom Analysis & Heatmap
        </h1>
        <p className="text-xs text-slate-400">
          Diagnosed: <span className="font-bold text-emerald-300">{analysis.primary_prediction.crop} — {analysis.primary_prediction.disease}</span>
        </p>
      </div>

      {/* Main Interactive Comparison Component */}
      <GradCamComparison
        originalImageUrl={resolveMediaUrl(analysis.image_url)}
        visualExplanation={analysis.visual_explanation}
      />

      {/* Deep Technical Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            How Grad-CAM Works
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Gradient-weighted Class Activation Mapping calculates gradients of the predicted class score with respect to the feature maps of the final convolutional layer of MobileNetV3. By taking channel-pooled spatial activations, it identifies the exact macroscopic features (lesions, fungal margins, stippling) that directed the prediction.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Scientific Scope & Caution
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The visual saliency heatmap reflects the model’s focus zones. It must not be interpreted as an automated histological segmentation or exact disease boundary. Environmental glare, soil, or background stems can occasionally influence activations.
          </p>
        </div>
      </div>
    </div>
  );
};
