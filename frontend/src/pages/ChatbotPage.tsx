import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bot,
  Send,
  User,
  Sparkles,
  ExternalLink,
  BookOpen,
  Loader2,
  ShieldCheck,
  HelpCircle,
  Sprout,
  Droplets,
  CloudSun
} from 'lucide-react';
import { sendChatMessage } from '../services/api';
import { ChatMessage, ReferenceItem, AnalysisResponse } from '../types';

export const ChatbotPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const initialScan = location.state?.currentScan as AnalysisResponse | undefined;

  const [messages, setMessages] = useState<Array<ChatMessage & { references?: ReferenceItem[]; source?: string }>>([
    {
      role: 'assistant',
      content: initialScan
        ? `Hello! I see you recently diagnosed **${initialScan.primary_prediction.crop} (${initialScan.primary_prediction.disease})** with ${initialScan.primary_prediction.confidence.toFixed(1)}% confidence. How can I assist you with cultural management, pruning, or prevention?`
        : `Hello! I am your PlantCare Agricultural Extension Assistant. I can help answer questions about foliar disease symptoms, organic prevention, soil moisture, and cultural sanitation for your crops. What are you observing in your field or garden today?`,
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterCards = [
    {
      title: 'Foliar Symptom Triage',
      desc: 'Identify yellowing, target rings, or rust spots',
      prompt: 'Why are my tomato leaves turning yellow with dark concentric target rings?',
      icon: Sprout,
      color: 'text-emerald-400'
    },
    {
      title: 'Rain & Humidity Risk',
      desc: 'Protocols for late blight during wet spells',
      prompt: 'How do I prevent potato late blight during continuous humid and rainy periods?',
      icon: CloudSun,
      color: 'text-cyan-400'
    },
    {
      title: 'Powdery Mildew Control',
      desc: 'Biological fungicides for cucurbits & squash',
      prompt: 'What causes white powdery patches on squash and cucurbit leaves and how to treat organically?',
      icon: Droplets,
      color: 'text-teal-400'
    },
    {
      title: 'Eco-Friendly IPM',
      desc: 'Control mites and aphids without harsh toxins',
      prompt: 'How can I control two-spotted spider mites on crops without harsh chemicals?',
      icon: ShieldCheck,
      color: 'text-amber-400'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory: ChatMessage[] = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await sendChatMessage(
        query,
        i18n.language,
        initialScan?.scan_id,
        chatHistory
      );

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.reply,
          references: res.relevant_references,
          source: res.source_type
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error retrieving agricultural data. Please check your query or try again.',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.35)] border border-white/20">
            <Bot className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200">
              PlantCare Agricultural Assistant
            </h1>
            <p className="text-xs text-slate-400">
              Evidence-based agronomic guidance grounded in university extension research.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>IPM Grounded</span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 min-h-[460px] max-h-[580px] overflow-y-auto space-y-4 shadow-2xl">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-sm shadow-[0_0_20px_rgba(16,185,129,0.25)] border border-emerald-400/30'
                  : 'glass-panel text-slate-200 border border-white/[0.1] rounded-tl-sm shadow-md'
              }`}
            >
              <div className="whitespace-pre-line">{m.content}</div>

              {/* Verified References if provided */}
              {m.references && m.references.length > 0 && (
                <div className="pt-2.5 border-t border-white/[0.08] mt-2 space-y-1.5">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Verified Agronomic References:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.references.map((ref, rIdx) => (
                      <a
                        key={rIdx}
                        href={ref.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-[10px] bg-white/[0.05] px-2.5 py-1 rounded-lg border border-white/[0.1] text-emerald-300 hover:text-white hover:border-emerald-500/40 transition-colors"
                      >
                        <span>{ref.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-emerald-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Starter Cards when only initial greeting is present */}
        {messages.length === 1 && (
          <div className="pt-4 space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Agronomic Topic Quick Starters:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {starterCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(card.prompt)}
                    className="p-3.5 rounded-2xl glass-card-interactive text-left border border-white/[0.08] hover:border-emerald-500/40 space-y-1 group"
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${card.color}`} />
                      <span className="font-bold text-xs text-slate-200 group-hover:text-emerald-300 transition-colors">
                        {card.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {card.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Consulting botanical knowledge base...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="glass-panel-elevated rounded-2xl p-2.5 shadow-2xl flex items-center space-x-2 border border-white/15">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={t('chat.placeholder')}
          className="flex-1 px-3.5 py-2 text-xs text-white placeholder-slate-400 bg-transparent focus:outline-none"
        />

        <button
          type="button"
          disabled={!input.trim() || loading}
          onClick={() => handleSend()}
          className={`p-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center ${
            !input.trim() || loading
              ? 'bg-white/[0.05] text-slate-500 cursor-not-allowed'
              : 'glass-button-primary shadow-glass-glow hover:scale-105'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
