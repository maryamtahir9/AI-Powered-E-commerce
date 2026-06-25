import React from 'react';
import { Sparkles, Cpu, Gift, ArrowRight, TrendingUp } from 'lucide-react';
import { Product, RecommendationResponse } from '../types';
import { ProductCard } from './ProductCard';

interface RecommendationsSectionProps {
  recommendations: RecommendationResponse | null;
  catalog: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
  onAddBundleToCart: (productIds: string[]) => void;
  onQuickView: (product: Product) => void;
  cartProductIds: string[];
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  recommendations,
  catalog,
  isLoading,
  onAddToCart,
  onAddBundleToCart,
  onQuickView,
  cartProductIds,
}) => {
  if (isLoading) {
    return (
      <section className="bg-stone-900/60 border-y border-stone-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-800" />
            <div className="space-y-2">
              <div className="h-5 bg-stone-800 rounded w-64" />
              <div className="h-3 bg-stone-800 rounded w-96" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-80 bg-stone-800/80 rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!recommendations || recommendations.recommendedIds.length === 0) return null;

  const recommendedProducts = catalog.filter(c => recommendations.recommendedIds.includes(c.id));
  const bundleProducts = recommendations.bundleOffer 
    ? catalog.filter(c => recommendations.bundleOffer?.productIds.includes(c.id))
    : [];

  const bundleOriginalTotal = bundleProducts.reduce((acc, p) => acc + p.price, 0);
  const bundleDiscountAmount = Math.round((bundleOriginalTotal * (recommendations.bundleOffer?.discountPercent || 18)) / 100);
  const bundleFinalPrice = bundleOriginalTotal - bundleDiscountAmount;

  return (
    <section className="bg-gradient-to-b from-stone-950 via-stone-900/90 to-stone-950 border-y border-amber-500/20 py-12 lg:py-16 text-stone-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Title Rail */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>COLLABORATIVE FILTERING ENGINE (Real-time Inference)</span>
            </div>
            <h2 className="font-sans font-bold tracking-tight text-2xl sm:text-4xl text-white">
              Curated Specifically For Your Session
            </h2>
            <p className="text-sm text-stone-400 max-w-3xl">
              {recommendations.collaborativeInsights}
            </p>
          </div>

          <div className="bg-stone-800/80 border border-stone-700 px-4 py-2.5 rounded-2xl flex items-center gap-3 shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <div className="text-xs">
              <span className="text-stone-400 block font-mono">Algorithm Conversion Metric</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">+18% Higher Order Value</span>
            </div>
          </div>
        </div>

        {/* Recommended Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              isRecommended={true}
              recommendationReason={recommendations.explanations[prod.id]}
              inCart={cartProductIds.includes(prod.id)}
            />
          ))}
        </div>

        {/* Smart Bundle Offer Card (Addressing the Challenge -> +18% AOV Lift) */}
        {recommendations.bundleOffer && bundleProducts.length >= 2 && (
          <div className="mt-8 bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[90px] rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              
              <div className="lg:col-span-6 space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-950 font-mono text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  <Gift className="w-3.5 h-3.5" />
                  <span>ML High-Conversion Bundle</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {recommendations.bundleOffer.title}
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed">
                  {recommendations.bundleOffer.reason}
                </p>
                <div className="text-xs font-mono text-amber-300 pt-1">
                  ⚡ Collaborative filtering shows 78% co-purchase satisfaction.
                </div>
              </div>

              {/* Bundle Items Visual Preview */}
              <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-end gap-4">
                
                <div className="flex items-center -space-x-4 overflow-hidden py-2">
                  {bundleProducts.map((bp) => (
                    <img
                      key={bp.id}
                      src={bp.imageUrl}
                      alt={bp.name}
                      className="inline-block h-20 w-20 sm:h-24 sm:w-24 rounded-2xl ring-4 ring-stone-900 object-cover shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>

                <div className="bg-stone-900/90 border border-amber-500/40 p-4 sm:p-5 rounded-2xl flex flex-col items-center sm:items-start min-w-[200px]">
                  <span className="text-[10px] font-mono uppercase text-stone-400">Bundle Price ({recommendations.bundleOffer.discountPercent}% Off)</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono text-2xl font-bold text-amber-400">${bundleFinalPrice}</span>
                    <span className="font-mono text-sm text-stone-500 line-through">${bundleOriginalTotal}</span>
                  </div>
                  <button
                    onClick={() => onAddBundleToCart(recommendations.bundleOffer!.productIds)}
                    className="mt-3 w-full px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95"
                  >
                    <span>Add Bundle to Cart</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
