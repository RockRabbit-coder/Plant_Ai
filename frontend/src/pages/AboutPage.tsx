import React, { useState } from 'react';
import {
  Info,
  Cpu,
  ShieldCheck,
  Send,
  MessageSquare,
  Lock,
  Star,
  CheckCircle2
} from 'lucide-react';
import { submitFeedback } from '../services/api';

export const AboutPage: React.FC = () => {
  const [category, setCategory] = useState('accuracy');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(5);
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    try {
      await submitFeedback({
        category,
        description,
        rating,
        contact_email: contactEmail || undefined
      });
      setSubmitted(true);
      setDescription('');
    } catch {
      alert('Feedback could not be submitted. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full glass-panel text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Info className="w-3.5 h-3.5" />
          <span>Project Dossier & Ethics</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 tracking-tight">
          About PlantCare AI
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Empowering growers with transparent, explainable deep learning computer vision and evidence-based precision agronomy.
        </p>
      </div>

      {/* Project Mission & Technology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card-interactive rounded-3xl border border-slate-800/80 p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Agronomic Mission
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            PlantCare AI addresses the global challenge of crop disease by providing early foliar screening. We prioritize cultural sanitation, resistant varieties, and integrated pest management (IPM) before any chemical intervention, safeguarding pollinator habitats and soil microbiomes.
          </p>
        </div>

        <div className="glass-card-interactive rounded-3xl border border-slate-800/80 p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Deep Learning Architecture
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Powered by a fine-tuned MobileNetV3-Small convolutional network running PyTorch with torchvision normalization. Predictions are audited via Gradient-weighted Class Activation Mapping (Grad-CAM) to maintain full explainability and prevent "black-box" diagnosis.
          </p>
        </div>
      </div>

      {/* Privacy & Terms */}
      <div className="glass-panel-elevated rounded-3xl border border-slate-800/80 p-6 sm:p-8 space-y-5">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          Privacy & Data Protection Principles
        </h3>
        <ul className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-100">Image Retention:</strong> Uploaded plant photos are processed on server storage strictly for generating your diagnostic dossier. Users can permanently delete their scans anytime from the Scan History page.</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-100">Location Confidentiality:</strong> Field coordinates are recorded solely with user consent and never broadcast publicly.</span>
          </li>
          <li className="flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-100">Scientific Responsibility:</strong> Softmax scores represent network activation distributions rather than clinical certainty. Always corroborate with certified agricultural extension agents.</span>
          </li>
        </ul>
      </div>

      {/* Feedback Form */}
      <div className="glass-panel-elevated rounded-3xl border border-slate-800/80 p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            Agronomic Feedback & Diagnostic Verification
          </h3>
          <p className="text-xs text-slate-400">
            Encountered a misclassified symptom or have an agronomic suggestion? Help refine PlantCare AI.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl glass-panel border-emerald-500/40 text-emerald-300 text-xs space-y-1.5 shadow-glass">
            <div className="font-bold flex items-center gap-2 text-sm text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Thank You! Your feedback has been recorded.
            </div>
            <p className="text-slate-300">Our agricultural modeling team reviews community observations to enhance diagnostic accuracy.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-slate-300">Feedback Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input w-full mt-1.5 px-3 py-2.5 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 [&>option]:bg-[#0c1612] [&>option]:text-slate-200"
                >
                  <option value="accuracy">Model Prediction Accuracy</option>
                  <option value="symptom_suggestion">New Crop / Disease Suggestion</option>
                  <option value="bug_report">Software / Interface Issue</option>
                  <option value="general">General Grower Inquiry</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-300">Experience Rating (1-5):</label>
                <div className="flex items-center space-x-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-amber-300 ml-2">{rating}/5</span>
                </div>
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-300">Observation or Feedback:</label>
              <textarea
                required
                rows={3}
                placeholder="Describe leaf symptoms, crop variety, weather conditions, or any inaccuracies..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="font-medium text-slate-300">Email Address (Optional):</label>
              <input
                type="email"
                placeholder="grower@farm.org"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="glass-input w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="glass-button-primary px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-glass-glow flex items-center space-x-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Send Feedback'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
