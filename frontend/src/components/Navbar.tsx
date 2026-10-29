import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sprout,
  ScanLine,
  BookOpen,
  ShieldAlert,
  Bot,
  LayoutDashboard,
  History,
  CloudSun,
  Menu,
  X,
  Languages,
  Info,
  MapPin,
  ChevronDown,
  Check
} from 'lucide-react';
import { LANGUAGES } from '../i18n/i18n';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setLangMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  interface NavLinkItem {
    to: string;
    label: string;
    icon: any;
    highlight?: boolean;
    desc?: string;
  }

  const primaryNavLinks: NavLinkItem[] = [
    { to: '/', label: t('nav.home'), icon: Sprout },
    { to: '/detect', label: t('nav.detect'), icon: ScanLine, highlight: true },
    { to: '/library', label: t('nav.library'), icon: BookOpen },
    { to: '/guide', label: t('nav.guide'), icon: ShieldAlert },
    { to: '/weather', label: t('nav.weather'), icon: CloudSun },
    { to: '/assistant', label: t('nav.assistant'), icon: Bot },
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
  ];

  const secondaryNavLinks: NavLinkItem[] = [
    { to: '/history', label: t('nav.history'), icon: History, desc: 'Past foliar scans & PDF dossiers' },
    { to: '/plants', label: t('nav.plants'), icon: Sprout, desc: 'Longitudinal health progressions' },
    { to: '/farms', label: t('nav.farms'), icon: MapPin, desc: 'Spatial farm plots & acreage hotspots' },
    { to: '/about', label: t('nav.about'), icon: Info, desc: 'Agronomic methodology & ethics' },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const isActive = (path: string) => location.pathname === path;
  const isMoreActive = secondaryNavLinks.some(l => isActive(l.to));

  return (
    <nav className="sticky top-0 z-50 bg-[#07130f]/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo with Luminous Glow */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.55)] transition-all border border-white/25">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                PlantCare{' '}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                  AI
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline tracking-wider">
                Precision Crop Health
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {primaryNavLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    item.highlight
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] border border-emerald-400/40 ml-1'
                      : active
                      ? 'bg-white/[0.10] text-emerald-300 border border-white/[0.14] shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-white' : active ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Desktop "More" Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
                  isMoreActive
                    ? 'bg-white/[0.10] text-emerald-300 border border-white/[0.14]'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-panel-elevated rounded-2xl p-2 z-50 border border-white/[0.14] shadow-2xl animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/[0.06] mb-1">
                    Agronomic Management
                  </div>
                  {secondaryNavLinks.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMoreMenuOpen(false)}
                        className={`flex items-start space-x-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                          active
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'text-slate-200 hover:bg-white/[0.08] hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <div>
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Action & Language Selector */}
          <div className="flex items-center space-x-3">
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-xs font-semibold text-slate-200 hover:bg-white/[0.10] hover:border-emerald-500/40 transition-all shadow-sm"
                aria-expanded={langMenuOpen}
              >
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentLang.native}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-panel-elevated rounded-2xl shadow-2xl border border-white/[0.14] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/[0.06] mb-1">
                    Select Language
                  </div>
                  {LANGUAGES.map((lang) => {
                    const selected = i18n.language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-white/[0.08] transition-colors ${
                          selected ? 'text-emerald-300 font-bold bg-emerald-500/10' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {selected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>{lang.native}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{lang.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.06] border border-white/[0.12] text-slate-200 hover:bg-white/[0.12] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07130f]/95 backdrop-blur-2xl border-b border-white/[0.12] px-4 pt-3 pb-6 space-y-1.5 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {allNavLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-all ${
                    item.highlight
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold shadow-sm'
                      : active
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-200 hover:bg-white/[0.08]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-white' : active ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
