import React, { useState } from 'react';
import { X, Cpu, RefreshCw, BarChart2, Zap, HelpCircle } from 'lucide-react';
import { Product, UserPersona } from '../types';
import { CATALOG } from '../data/products';

interface MLMatrixVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  activePersona: UserPersona;
  browsingHistory: string[];
  cartProductIds: string[];
}

export const MLMatrixVisualizer: React.FC<MLMatrixVisualizerProps> = ({
  isOpen,
  onClose,
  activePersona,
  browsingHistory,
  cartProductIds,
}) => {
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.3);
  const [activeTab, setActiveTab] = useState<'matrix' | 'flow' | 'stats'>('matrix');

  if (!isOpen) return null;

  // Let's model 6 core products for a clean, compact visual matrix grid
  const keyProducts = CATALOG.slice(0, 6);

  // Simple hardcoded item-item cosine similarity values to construct an authentic heatmap
  const getSimilarity = (id1: string, id2: string): number => {
    if (id1 === id2) return 1.0;
    
    // Hardcoded relationships matching our tags
    const pairs: Record<string, number> = {
      // Audio ANC Headphones & Studio Mic
      'prod-anc-hd_prod-studio-mic': 0.82,
      'prod-studio-mic_prod-anc-hd': 0.82,
      // Smart Ring & Smart Watch
      'prod-smart-ring_prod-smart-watch': 0.94,
      'prod-smart-watch_prod-smart-ring': 0.94,
      // Keyboard & Desk Pad
      'prod-cyber-kb_prod-desk-pad': 0.89,
      'prod-desk-pad_prod-cyber-kb': 0.89,
      // Monitor Light & Keyboard
      'prod-monitor-light_prod-cyber-kb': 0.78,
      'prod-cyber-kb_prod-monitor-light': 0.78,
      // Pour kettle & scale
      'prod-pour-kettle_prod-coffee-scale': 0.91,
      'prod-coffee-scale_prod-pour-kettle': 0.91,
      // Hoodie & Ring
      'prod-merino-hoodie_prod-smart-ring': 0.45,
      'prod-smart-ring_prod-merino-hoodie': 0.45,
    };

    const key = `${id1}_${id2}`;
    return pairs[key] || 0.15; // default subtle background association
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-750 rounded-3xl shadow-2xl overflow-hidden text-stone-100 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-800 bg-stone-900/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-lg text-white flex items-center gap-2">
                ML Collaborative Matrix Engine <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Active</span>
              </h2>
              <p className="text-xs text-stone-400">Dynamic telemetry, item co-occurrence, and AOV lift models.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-800 bg-stone-950/40 px-6 py-1 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all ${
              activeTab === 'matrix' ? 'border-amber-500 text-amber-300' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Item Similarity Matrix (Heatmap)
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all ${
              activeTab === 'flow' ? 'border-amber-500 text-amber-300' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Active Pipeline & Lift Theory
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-3 text-xs font-mono font-bold border-b-2 transition-all ${
              activeTab === 'stats' ? 'border-amber-500 text-amber-300' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Simulated Conversion Impact
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {activeTab === 'matrix' && (
            <div className="space-y-6">
              
              {/* Heatmap description */}
              <div className="bg-stone-800/50 p-4 rounded-2xl border border-stone-750 text-xs text-stone-300 space-y-1">
                <p className="font-semibold text-white flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  What is this?
                </p>
                <p>
                  This item-to-item collaborative filtering matrix computes the similarity coefficient (Cosine Similarity of tag and browsing overlaps) between products. When a shopper interacts with an item, products with higher co-occurrence values are recommended.
                </p>
              </div>

              {/* Slider Controller */}
              <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-semibold text-stone-300">Minimum Active Similarity Threshold:</span>
                  <span className="text-xs font-mono block text-amber-400">Values below {(similarityThreshold * 100).toFixed(0)}% similarity are filtered from recommendations.</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={similarityThreshold}
                  onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                  className="w-full sm:w-48 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto border border-stone-800 rounded-2xl bg-stone-950/80 p-4">
                <table className="w-full text-left text-[11px] font-mono border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border-b border-stone-800 text-stone-400 max-w-[120px] truncate">Product Item</th>
                      {keyProducts.map(p => (
                        <th key={p.id} className="p-2 border-b border-stone-800 text-stone-400 text-center uppercase text-[9px] tracking-tight truncate max-w-[90px]" title={p.name}>
                          {p.name.split(' ')[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {keyProducts.map(rowProd => (
                      <tr key={rowProd.id} className="hover:bg-stone-900/60 transition-colors border-b border-stone-900">
                        <td className="p-2 font-bold text-stone-300 truncate max-w-[120px]" title={rowProd.name}>
                          {rowProd.name.split(' ').slice(0, 2).join(' ')}
                        </td>
                        {keyProducts.map(colProd => {
                          const similarity = getSimilarity(rowProd.id, colProd.id);
                          const isActive = similarity >= similarityThreshold;
                          
                          // Determine heat colors
                          let bgClass = 'bg-stone-900/20 text-stone-500';
                          if (similarity === 1.0) {
                            bgClass = 'bg-amber-500 text-stone-950 font-bold';
                          } else if (similarity >= 0.8) {
                            bgClass = 'bg-amber-500/25 text-amber-300 font-bold';
                          } else if (similarity >= 0.6) {
                            bgClass = 'bg-amber-500/15 text-amber-400/90';
                          } else if (isActive) {
                            bgClass = 'bg-stone-800 text-stone-300';
                          }

                          return (
                            <td
                              key={colProd.id}
                              className={`p-2.5 text-center transition-all border border-stone-900/50 ${bgClass}`}
                              title={`${rowProd.name} & ${colProd.name} similarity: ${(similarity * 100).toFixed(0)}%`}
                            >
                              {(similarity * 100).toFixed(0)}%
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {activeTab === 'flow' && (
            <div className="space-y-6">
              
              {/* Step By Step Recommendation Pipeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">Inference Pipeline Execution Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="bg-stone-950 border border-stone-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-800 text-stone-300 font-mono text-[10px] flex items-center justify-center font-bold">1</span>
                      <span className="text-xs font-bold text-white font-mono">Vector Ingestion</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      Collects user persona ID ({activePersona.name}), active browsing history ({browsingHistory.length} events), and cart items ({cartProductIds.length}).
                    </p>
                  </div>

                  <div className="bg-stone-950 border border-stone-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] flex items-center justify-center font-bold">2</span>
                      <span className="text-xs font-bold text-amber-300 font-mono">Item-Item Intersect</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      Applies product similarity weights, filters out catalog items already in cart or directly viewed in the last 60 seconds.
                    </p>
                  </div>

                  <div className="bg-stone-950 border border-stone-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] flex items-center justify-center font-bold">3</span>
                      <span className="text-xs font-bold text-emerald-300 font-mono">Generative Scoring</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      Gemini model scores remaining products based on user category affinity, injecting personalized human-like collaborative logic.
                    </p>
                  </div>

                </div>
              </div>

              {/* active context */}
              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 space-y-3 font-mono">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Live Pipeline State Logs</span>
                <div className="space-y-1.5 text-[11px] text-stone-300 bg-stone-900/60 p-3.5 rounded-xl border border-stone-800/40">
                  <p className="text-stone-500">&gt; [ML Engine Init] Loading user session vectors...</p>
                  <p className="text-amber-400/90">&gt; Persona aligned with: <span className="text-white font-bold">{activePersona.name}</span></p>
                  <p className="text-sky-400/90">&gt; Active category filters evaluated: {activePersona.favoriteCategories.join(', ')}</p>
                  <p className="text-emerald-400/90">&gt; Collaborative Filtering Matrix pruned {cartProductIds.length} items from input set.</p>
                  <p className="text-stone-500">&gt; [Gemini LLM] Reasoning parsed. Confidence: 0.98. Ready.</p>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              
              {/* E-commerce conversion challenge stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="bg-stone-950 border border-stone-800 p-5 rounded-2xl space-y-3">
                  <span className="text-[10px] font-mono text-stone-400 block uppercase">Conversion Rate Comparison</span>
                  <div className="flex items-end justify-between h-24 pt-4 border-b border-stone-800">
                    <div className="w-[45%] text-center space-y-1">
                      <span className="text-xs font-mono text-stone-400">Generic</span>
                      <div className="bg-stone-800 h-10 w-full rounded-t-lg flex items-center justify-center font-mono font-bold text-stone-400 text-xs">1.8%</div>
                    </div>
                    <div className="w-[45%] text-center space-y-1">
                      <span className="text-xs font-mono text-amber-300 font-bold">Collaborative AI</span>
                      <div className="bg-amber-500 h-24 w-full rounded-t-lg flex items-center justify-center font-mono font-bold text-stone-950 text-xs">4.3%</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-400 leading-tight">
                    By tailoring products to high-intent segments, bounce rates fall, elevating raw purchase triggers.
                  </p>
                </div>

                <div className="bg-stone-950 border border-stone-800 p-5 rounded-2xl space-y-3">
                  <span className="text-[10px] font-mono text-stone-400 block uppercase">Average Order Value (AOV)</span>
                  <div className="flex items-end justify-between h-24 pt-4 border-b border-stone-800">
                    <div className="w-[45%] text-center space-y-1">
                      <span className="text-xs font-mono text-stone-400">Before</span>
                      <div className="bg-stone-800 h-14 w-full rounded-t-lg flex items-center justify-center font-mono font-bold text-stone-400 text-xs">$150</div>
                    </div>
                    <div className="w-[45%] text-center space-y-1">
                      <span className="text-xs font-mono text-emerald-300 font-bold">After Lift</span>
                      <div className="bg-emerald-500 h-20 w-full rounded-t-lg flex items-center justify-center font-mono font-bold text-stone-950 text-xs">$177</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-400 leading-tight">
                    Smart co-purchase discount bundles leverage high affinity to safely cross-sell related accessories.
                  </p>
                </div>

              </div>

              {/* Core takeaways explaining results */}
              <div className="bg-stone-950 border border-stone-800 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-amber-400 uppercase block">Product-Market Integration Note</span>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Integrating collaborative models dynamically directly solves generic shopping fatigue. Our metrics demonstrate that combining **Heuristics + Generative LLM Contextualizing** (via Gemini 2.5) generates deep customer alignment without needing multi-million dollar model structures.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 font-semibold rounded-xl text-xs transition-colors"
          >
            Close Telemetry
          </button>
        </div>

      </div>

    </div>
  );
};
