import React from 'react';
import { Sparkles, ArrowRight, TrendingUp, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { UserPersona } from '../types';

interface HeroBannerProps {
  activePersona: UserPersona;
  onExploreClick: () => void;
  onOpenVisualizer: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  activePersona,
  onExploreClick,
  onOpenVisualizer,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-stone-100 py-12 lg:py-20 border-b border-stone-800">
      
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800/90 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>LIVE DEMO: AI-Powered E-commerce Storefront</span>
            </div>

            <h1 className="font-sans font-bold tracking-tight text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.1]">
              Overcoming Generic Storefronts with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">Collaborative AI.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
              Low conversion rates plague traditional e-commerce due to one-size-fits-all browsing. We built a custom machine learning recommendation engine combining real-time browsing history and collaborative filtering vectors.
            </p>

            {/* Results Callout Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-stone-800/60 border border-stone-750 p-4 rounded-2xl flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-2xl sm:text-3xl">
                  <TrendingUp className="w-5 h-5" />
                  <span>+18%</span>
                </div>
                <p className="text-xs text-stone-400 mt-1 font-medium">Average Order Value Lift</p>
              </div>

              <div className="bg-stone-800/60 border border-stone-750 p-4 rounded-2xl flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-2xl sm:text-3xl">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>2.4x</span>
                </div>
                <p className="text-xs text-stone-400 mt-1 font-medium">Sales Conversion Rate</p>
              </div>

              <div className="bg-stone-800/60 border border-stone-750 p-4 rounded-2xl flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-sky-400 font-mono font-bold text-2xl sm:text-3xl">
                  <Cpu className="w-5 h-5" />
                  <span>Sub-50ms</span>
                </div>
                <p className="text-xs text-stone-400 mt-1 font-medium">Collaborative Inference</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-full flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-98 text-sm"
              >
                <span>Experience Personalized Storefront</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenVisualizer}
                className="px-5 py-3.5 bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 font-medium rounded-full flex items-center gap-2 transition-all text-sm"
              >
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Inspect Collaborative Matrix</span>
              </button>
            </div>

          </div>

          {/* Right Column: Live Simulated Profile Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-stone-800/80 border border-stone-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
              
              <div className="flex items-center justify-between border-b border-stone-700/80 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-stone-900 rounded-2xl border border-stone-700">{activePersona.icon}</span>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">Active Vector</span>
                    <h3 className="text-base font-bold text-white mt-1">{activePersona.name}</h3>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-stone-300 italic">"{activePersona.description}"</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="bg-stone-900/80 p-3.5 rounded-2xl border border-stone-750">
                  <div className="flex justify-between text-xs font-mono text-stone-400">
                    <span>Collaborative Affinity</span>
                    <span className="text-emerald-400 font-bold">High Alignment (94%)</span>
                  </div>
                  <div className="w-full bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full w-[94%]" />
                  </div>
                </div>

                <div className="bg-stone-900/80 p-3.5 rounded-2xl border border-stone-750 space-y-1.5">
                  <p className="text-[10px] font-mono uppercase text-stone-400">Top Predicted Intent Categories</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activePersona.favoriteCategories.map(cat => (
                      <span key={cat} className="px-2.5 py-1 rounded-lg bg-stone-800 text-amber-300 text-xs font-mono capitalize border border-stone-700">
                        #{cat}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 rounded-lg bg-stone-800 text-stone-400 text-xs font-mono border border-stone-700">
                      +Co-purchases
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ML Weights Updated Real-time
                </span>
                <span className="text-amber-400 underline cursor-pointer" onClick={onOpenVisualizer}>View Algorithm &rarr;</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
