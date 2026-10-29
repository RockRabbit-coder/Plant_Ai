import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Droplets,
  Thermometer,
  CloudRain,
  AlertTriangle,
  ShieldCheck,
  Search,
  Info,
  Loader2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { getWeatherRisk } from '../services/api';
import { WeatherRiskResponse } from '../types';

export const WeatherRiskPage: React.FC = () => {
  const [location, setLocation] = useState<string>('California Central Valley');
  const [crop, setCrop] = useState<string>('All');
  const [weatherData, setWeatherData] = useState<WeatherRiskResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRisk = (loc: string, c: string) => {
    setLoading(true);
    getWeatherRisk(loc, c)
      .then(setWeatherData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRisk(location, crop);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRisk(location, crop);
  };

  const getRiskPct = (level: string) => {
    switch (level) {
      case 'Critical': return 95;
      case 'High': return 75;
      case 'Moderate': return 50;
      default: return 25;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <CloudSun className="w-3.5 h-3.5 text-emerald-400" />
          <span>Epidemiological Microclimate Risk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 tracking-tight">
          Weather-Based Disease Risk Assessment
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Evaluates local humidity, temperature, and moisture against university-verified infection thresholds.
        </p>
      </div>

      {/* Input Controls */}
      <div className="glass-panel-elevated rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/15">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="Enter agricultural region or city (e.g. Salinas Valley, Punjab, Nashik)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-xs font-medium placeholder-slate-500 focus:border-emerald-500/60"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-medium focus:border-emerald-500/60 [&>option]:bg-[#0c1612] [&>option]:text-slate-200"
            >
              <option value="All">All Supported Crops</option>
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
              <option value="Corn">Corn (Maize)</option>
              <option value="Apple">Apple</option>
              <option value="Squash">Squash / Cucurbits</option>
              <option value="Pepper">Pepper</option>
              <option value="Peach">Peach</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="glass-button-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-glass-glow hover:scale-105"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Evaluate</span>
            </button>
          </div>
        </form>
      </div>

      {/* Scientific Disclaimer Notice */}
      <div className="glass-amber p-4 rounded-2xl text-amber-200 text-xs flex items-start space-x-3.5 shadow-lg">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-amber-300 font-semibold">Epidemiological Notice: </strong>
          Weather risk indices estimate environmental suitability for fungal/bacterial sporulation based on pathogen temperature-humidity requirements. Elevated risk does NOT constitute proof of active field infection.
        </span>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-emerald-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Calculating epidemiological risk models...</span>
        </div>
      ) : weatherData ? (
        <div className="space-y-6">
          {/* Weather Metrics Strip */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/15">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4 mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  {weatherData.location}
                </h3>
                <div className="text-xs text-slate-400 mt-1">
                  Condition: <span className="font-bold text-emerald-300">{weatherData.condition}</span> • Source: {weatherData.source}
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-300 glass-panel px-3.5 py-1.5 rounded-full border border-emerald-500/30 self-start sm:self-auto">
                Crop Filter: {weatherData.crop}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Thermometer className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-mono">
                    {weatherData.temperature_c}°C
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Ambient Temperature</div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-cyan-300 font-mono">
                    {weatherData.humidity_pct}%
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Relative Humidity</div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CloudRain className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-teal-300 font-mono">
                    {weatherData.rainfall_mm} mm
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">24h Precipitation</div>
                </div>
              </div>
            </div>

            {/* Summary Guidance Banner */}
            <div className="mt-5 p-4 rounded-2xl glass-panel border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed font-medium flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-emerald-300 font-bold">Agronomic Summary: </strong>
                {weatherData.summary_guidance}
              </span>
            </div>
          </div>

          {/* Disease Specific Risk Cards */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Pathogen Environmental Susceptibility Factors ({weatherData.disease_risks.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weatherData.disease_risks.map((risk, idx) => (
                <div
                  key={idx}
                  className="glass-card-interactive rounded-3xl p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 glass-panel px-3 py-1 rounded-full border border-emerald-500/30">
                        {risk.crop}
                      </span>

                      <span
                        className={`text-xs font-extrabold px-3 py-0.5 rounded-full border ${
                          risk.risk_level === 'Critical'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                            : risk.risk_level === 'High'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                            : risk.risk_level === 'Moderate'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {risk.risk_level} Risk
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">
                      {risk.disease}
                    </h4>

                    {/* Visual Risk Gauge Meter */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Sporulation Risk Index</span>
                        <span className="font-mono font-bold text-slate-200">{getRiskPct(risk.risk_level)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            risk.risk_level === 'Critical'
                              ? 'bg-gradient-to-r from-amber-500 to-red-500'
                              : risk.risk_level === 'High'
                              ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                              : risk.risk_level === 'Moderate'
                              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${getRiskPct(risk.risk_level)}%` }}
                        />
                      </div>
                    </div>

                    {/* Contributing Factors */}
                    <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside pt-1">
                      {risk.contributing_factors.map((f, fIdx) => (
                        <li key={fIdx}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention Action */}
                  <div className="p-3.5 rounded-2xl glass-panel border border-white/[0.06] text-xs text-slate-300 mt-2">
                    <span className="font-bold text-emerald-300">Scouting Action: </span>
                    {risk.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
