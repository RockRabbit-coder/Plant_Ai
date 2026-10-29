import React, { useState } from 'react';
import { Eye, Layers, Percent, Info, Sparkles } from 'lucide-react';
import { VisualExplanation } from '../types';

interface GradCamComparisonProps {
  originalImageUrl: string;
  visualExplanation: VisualExplanation;
}

export const GradCamComparison: React.FC<GradCamComparisonProps> = ({
  originalImageUrl,
  visualExplanation
}) => {
  const [viewMode, setViewMode] = useState<'slider' | 'sideBySide'>('slider');
  const [opacity, setOpacity] = useState<number>(65);
  const [showMaskOnly, setShowMaskOnly] = useState<boolean>(false);

  const affectedArea = visualExplanation?.estimated_affected_area_pct ?? 0;
  const overlayUrl = visualExplanation?.heatmap_overlay_base64 || originalImageUrl;
  const maskUrl = visualExplanation?.heatmap_mask_base64;

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Visual Symptom Attention (Grad-CAM)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Explainable AI heatmap showing convolutional filter activations influencing the prediction.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-white/[0.05] p-1 rounded-xl border border-white/[0.08] text-xs font-semibold">
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'slider'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overlay Slider
            </button>
            <button
              onClick={() => setViewMode('sideBySide')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'sideBySide'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
          </div>
        </div>
      </div>

      {/* Visual Presentation */}
      {viewMode === 'slider' ? (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-slate-950/80 border border-white/[0.08] flex items-center justify-center min-h-[320px] max-h-[480px]">
            {/* Base Original Image */}
            <img
              src={originalImageUrl}
              alt="Original Leaf"
              className="w-full max-h-[480px] object-contain"
            />

            {/* Heatmap Overlay with dynamic opacity */}
            <img
              src={showMaskOnly && maskUrl ? maskUrl : overlayUrl}
              alt="Grad-CAM Activation Map"
              style={{ opacity: opacity / 100 }}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-150"
            />

            {/* Affected Area Floating Glass Tag */}
            <div className="absolute top-3.5 left-3.5 bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 text-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Percent className="w-3.5 h-3.5 text-emerald-400" />
              <span>Affected Area: ~{affectedArea}%</span>
            </div>
          </div>

          {/* Slider and Toggles */}
          <div className="bg-white/[0.03] backdrop-blur-md p-4 rounded-2xl border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full sm:w-2/3">
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Original</span>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-xs font-semibold text-emerald-300 whitespace-nowrap">Heatmap ({opacity}%)</span>
            </div>

            {maskUrl && (
              <label className="flex items-center space-x-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showMaskOnly}
                  onChange={(e) => setShowMaskOnly(e.target.checked)}
                  className="rounded bg-slate-900 border-white/20 text-emerald-500 focus:ring-emerald-500/40"
                />
                <span>Raw Salience Mask</span>
              </label>
            )}
          </div>
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original Leaf Surface</div>
            <div className="rounded-2xl overflow-hidden bg-slate-950/80 h-64 flex items-center justify-center border border-white/[0.08]">
              <img src={originalImageUrl} alt="Original" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center justify-between">
              <span>Grad-CAM Activation Hotspot</span>
              <span className="text-emerald-400 font-extrabold">{affectedArea}% Salience</span>
            </div>
            <div className="rounded-2xl overflow-hidden bg-slate-950/80 h-64 flex items-center justify-center border border-white/[0.08]">
              <img src={overlayUrl} alt="Heatmap" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Explanatory Callout */}
      <div className="flex items-start space-x-3 p-4 bg-emerald-950/40 backdrop-blur-md rounded-2xl border border-emerald-500/20 text-xs text-slate-200 leading-relaxed shadow-inner">
        <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-300">Interpretation: </span>
          {visualExplanation?.interpretation || 'The visual heatmap highlights areas of significant foliar alteration.'}
          <div className="mt-1 text-slate-400 text-[11px]">
            * Note: Red and amber regions denote the greatest weight in the deep neural network’s activation layers. This represents model attention and is intended as a visual aid alongside ground inspection.
          </div>
        </div>
      </div>
    </div>
  );
};
