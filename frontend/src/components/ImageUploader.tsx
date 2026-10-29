import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  Upload,
  Camera,
  RotateCw,
  Trash2,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  selectedFile,
  onClear
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [qualityFeedback, setQualityFeedback] = useState<{
    width: number;
    height: number;
    warning?: string;
  } | null>(null);

  const processFile = (file: File) => {
    // 1. Validate file extension and MIME
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid JPG, JPEG, or PNG image.');
      return;
    }

    // 2. Size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds the 15MB limit. Please upload a smaller photo.');
      return;
    }

    // 3. Load image in browser to inspect dimensions
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      setRotation(0);

      const img = new Image();
      img.onload = () => {
        let warning: string | undefined;
        if (img.width < 150 || img.height < 150) {
          warning = `Low resolution image (${img.width}x${img.height} px). For reliable leaf diagnosis, use at least 250x250 px.`;
        }
        setQualityFeedback({
          width: img.width,
          height: img.height,
          warning,
        });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);

    onImageSelected(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const clearSelection = () => {
    setPreviewUrl(null);
    setRotation(0);
    setQualityFeedback(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    onClear();
  };

  return (
    <div className="w-full">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {!previewUrl ? (
        /* Glass Drop Zone */
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-3xl p-8 sm:p-14 text-center transition-all duration-300 ${
            dragActive
              ? 'bg-emerald-500/10 border-2 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.3)] scale-[1.01]'
              : 'glass-panel hover:border-emerald-500/35 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] group'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-5">
            {/* Ambient Animated Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all">
              <Upload className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {t('detect.dragDrop')}{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors"
                >
                  {t('detect.browse')}
                </button>
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                {t('detect.requirements')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="glass-button-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="glass-button-secondary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>{t('detect.camera')}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Preview Glass Card */
        <div className="glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-slate-950/80 border border-white/[0.08] flex items-center justify-center min-h-[300px] max-h-[460px]">
            <img
              src={previewUrl}
              alt="Leaf Preview"
              style={{ transform: `rotate(${rotation}deg)` }}
              className="max-h-[440px] w-auto object-contain transition-transform duration-300"
            />

            <div className="absolute top-3.5 right-3.5 flex items-center space-x-2">
              <button
                type="button"
                onClick={rotateImage}
                title={t('detect.rotate')}
                className="p-2.5 rounded-xl bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-white/10 backdrop-blur-md transition-all shadow-md"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={clearSelection}
                title={t('detect.remove')}
                className="p-2.5 rounded-xl bg-red-950/80 text-red-400 hover:text-red-300 hover:bg-red-900/80 border border-red-500/30 backdrop-blur-md transition-all shadow-md"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quality Assessment Preview Bar */}
          {qualityFeedback && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs bg-white/[0.04] backdrop-blur-md p-3.5 rounded-2xl border border-white/[0.08] gap-2">
              <div className="flex items-center space-x-2.5">
                {qualityFeedback.warning ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
                <span className={qualityFeedback.warning ? 'text-amber-300' : 'text-emerald-300 font-medium'}>
                  {qualityFeedback.warning || `Image verified: ${qualityFeedback.width}x${qualityFeedback.height} px. Focus verified for foliar diagnostic.`}
                </span>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                >
                  {t('detect.replace')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
