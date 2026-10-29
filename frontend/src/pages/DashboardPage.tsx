import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanLine,
  ShieldCheck,
  AlertTriangle,
  Sprout,
  TrendingUp,
  Activity,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from 'recharts';
import { getDashboardStats, resolveMediaUrl } from '../services/api';
import { DashboardStats } from '../types';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 text-emerald-400 animate-in fade-in duration-300">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs font-semibold text-slate-400">Aggregating real agronomic analytics...</span>
      </div>
    );
  }

  const summary = stats?.summary || {
    total_scans: 0,
    healthy_scans: 0,
    suspected_disease_scans: 0,
    healthy_ratio_pct: 100,
    total_plants_monitored: 0,
    active_alerts_count: 0
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel-elevated p-3 rounded-xl shadow-2xl text-xs space-y-1 border border-white/20">
          <div className="font-bold text-white">{label}</div>
          {payload.map((p: any, i: number) => (
            <div key={i} className="text-emerald-400 flex items-center gap-1.5">
              <span>{p.name || 'Scans'}:</span>
              <span className="font-mono font-bold text-white">{p.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Farm & Crop Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 mt-1">
            Plant Health Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time aggregate distribution of foliar scans, pathogen detection rates, and monitored plants.
          </p>
        </div>

        <Link
          to="/detect"
          className="glass-button-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 self-start sm:self-auto shadow-glass-glow hover:scale-105 transition-transform"
        >
          <ScanLine className="w-4 h-4 text-emerald-100" />
          <span>New Leaf Scan</span>
        </Link>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Scans */}
        <div className="glass-card-interactive rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Scans</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-sm">
              <ScanLine className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {summary.total_scans}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Recorded analyses</span>
          </div>
        </div>

        {/* Healthy Crops Ratio */}
        <div className="glass-card-interactive rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Healthy Ratio</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {summary.healthy_ratio_pct}%
          </div>
          <div className="text-[11px] text-emerald-300 font-medium">
            {summary.healthy_scans} healthy foliar scans
          </div>
        </div>

        {/* Suspected Pathogens */}
        <div className="glass-card-interactive rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Suspected Diseases</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-sm">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
            {summary.suspected_disease_scans}
          </div>
          <div className="text-[11px] text-amber-400/90 font-medium">
            Foliar lesions identified
          </div>
        </div>

        {/* Plants Monitored */}
        <div className="glass-card-interactive rounded-3xl p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Monitored Plants</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shadow-sm">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {summary.total_plants_monitored}
          </div>
          <div className="text-[11px] text-slate-400">
            Tracked profiles
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scans Activity Timeline (AreaChart) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Scans Activity Over Time
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Last 7 Days</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.activity_timeline || []}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" opacity={0.6} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="scans" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScans)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Healthy vs Diseased Pie Distribution */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 relative">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Health Ratio
            </h3>
          </div>

          <div className="h-64 w-full relative flex items-center justify-center">
            {summary.total_scans === 0 ? (
              <div className="text-xs text-slate-400 text-center">
                No scan data recorded yet.
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Healthy', value: summary.healthy_scans },
                        { name: 'Diseased', value: summary.suspected_disease_scans }
                      ]}
                      cx="50%"
                      cy="48%"
                      innerRadius={55}
                      outerRadius={78}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" stroke="#060b09" strokeWidth={2} />
                      <Cell fill="#f59e0b" stroke="#060b09" strokeWidth={2} />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center metric inside donut */}
                <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <div className="text-xl font-black text-emerald-300 font-mono leading-none">
                    {summary.healthy_ratio_pct}%
                  </div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                    Healthy
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Crop Distribution (BarChart) */}
        {stats?.crop_distribution && stats.crop_distribution.length > 0 && (
          <div className="lg:col-span-12 glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="border-b border-white/[0.06] pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-400" />
                Crop Diagnostic Frequency
              </h3>
            </div>
            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.crop_distribution}>
                  <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" opacity={0.6} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis allowDecimals={false} stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="scans" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Recent Scans Table */}
      {stats?.recent_scans && stats.recent_scans.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Recent Analyses
            </h3>
            <Link to="/history" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {stats.recent_scans.map((s) => (
              <div key={s.id} className="py-3.5 flex items-center justify-between text-xs hover:bg-white/[0.03] px-2.5 rounded-xl transition-colors">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-white/10">
                    <img src={resolveMediaUrl(s.image_url)} alt={s.crop} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{s.crop} — {s.disease}</div>
                    <div className="text-[11px] text-slate-400">{new Date(s.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    s.is_healthy ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {s.is_healthy ? 'Healthy' : `${s.confidence.toFixed(1)}%`}
                  </span>
                  <Link to={`/results`} state={{ analysis: { scan_id: s.id } }} className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
