import React from 'react';
import { X, Star, Sparkles, Plus, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  recommendationReason?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  recommendationReason,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-750 rounded-3xl shadow-2xl overflow-hidden text-stone-100 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Gallery */}
        <div className="md:col-span-6 bg-stone-950 relative aspect-square md:aspect-auto">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent" />
          
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-stone-900/90 text-stone-200 text-xs font-mono capitalize border border-stone-700 backdrop-blur-md">
              {product.category}
            </span>
          </div>
        </div>

        {/* Right Info Details */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-amber-400 text-sm font-mono">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-stone-400">({product.reviewsCount} Verified Reviews)</span>
              </div>
            </div>

            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-white tracking-tight">
              {product.name}
            </h2>

            <p className="text-sm font-medium text-amber-300/90 italic">
              "{product.tagline}"
            </p>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {product.description}
            </p>

            {/* AI Recommendation Pill */}
            {recommendationReason && (
              <div className="bg-amber-500/15 border border-amber-500/30 p-3.5 rounded-2xl space-y-1">
                <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-amber-400 uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  Collaborative ML Match Reason
                </span>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {recommendationReason}
                </p>
              </div>
            )}

            {/* Features List */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold">Key Specs & Engineering</span>
              <ul className="grid grid-cols-1 gap-2 text-xs text-stone-300">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-stone-800/60 px-3 py-2 rounded-xl border border-stone-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Footer Pricing & Add CTA */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-stone-400 block">Unit Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-bold text-white">${product.price}</span>
                  {product.originalPrice && (
                    <span className="font-mono text-sm text-stone-500 line-through">${product.originalPrice}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400 text-right">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>2-Year Warranty<br />Free Fast Dispatch</span>
              </div>
            </div>

            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-98 transition-all text-sm sm:text-base"
            >
              <Plus className="w-5 h-5 font-bold" />
              <span>Add to Shopping Cart</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
