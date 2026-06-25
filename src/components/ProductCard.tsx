import React from 'react';
import { Star, Plus, Eye, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isRecommended?: boolean;
  recommendationReason?: string;
  inCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  isRecommended = false,
  recommendationReason,
  inCart = false,
}) => {
  return (
    <div className={`group relative bg-stone-900 border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
      isRecommended 
        ? 'border-amber-500/50 shadow-xl shadow-amber-500/5 hover:border-amber-400' 
        : 'border-stone-800 hover:border-stone-700 shadow-md'
    }`}>
      
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          <div className="flex flex-col gap-1">
            {isRecommended && (
              <span className="inline-flex items-center gap-1 bg-amber-500 text-stone-950 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md">
                <Sparkles className="w-3 h-3 fill-stone-950" />
                ML Recommended
              </span>
            )}
            <span className="inline-block bg-stone-900/80 text-stone-300 font-mono text-[10px] px-2.5 py-1 rounded-full backdrop-blur-md border border-stone-700 w-max capitalize">
              {product.category}
            </span>
          </div>

          {product.originalPrice && (
            <span className="bg-rose-500/90 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              SAVE ${product.originalPrice - product.price}
            </span>
          )}
        </div>

        {/* Quick View Hover Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute inset-0 m-auto w-11 h-11 bg-stone-900/90 hover:bg-amber-500 text-white hover:text-stone-950 rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 backdrop-blur-md z-10"
          title="Quick View Product"
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-1.5 cursor-pointer" onClick={() => onQuickView(product)}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-amber-400 text-xs font-mono">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-stone-200">{product.rating}</span>
              <span className="text-stone-500">({product.reviewsCount})</span>
            </div>
            {product.matchScore && (
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                {product.matchScore}% Match
              </span>
            )}
          </div>

          <h3 className="font-sans font-bold text-base text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* AI Recommendation Reason Pill if present */}
        {recommendationReason && (
          <div className="bg-amber-500/10 border border-amber-500/25 p-2.5 rounded-xl">
            <p className="text-[11px] text-amber-200/90 leading-tight">
              <span className="font-bold text-amber-400 mr-1 font-mono">⚡ AI Reason:</span>
              {recommendationReason}
            </p>
          </div>
        )}

        {/* Footer Price & Cart Button */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-bold text-lg sm:text-xl text-white">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-stone-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
              inCart
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-stone-800 hover:bg-amber-500 text-stone-200 hover:text-stone-950 border border-stone-700 hover:border-amber-500 shadow-sm'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
