import React from 'react';
import { ShoppingBag, Sparkles, Search, User, SlidersHorizontal, Cpu } from 'lucide-react';
import { UserPersona } from '../types';

interface NavbarProps {
  personas: UserPersona[];
  activePersona: UserPersona;
  onSelectPersona: (persona: UserPersona) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  onOpenVisualizer: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  personas,
  activePersona,
  onSelectPersona,
  cartCount,
  onOpenCart,
  onOpenChat,
  onOpenVisualizer,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-bold text-lg shadow-lg shadow-amber-500/20">
              ⚡
            </div>
            <div>
              <span className="font-sans font-bold tracking-tight text-lg sm:text-xl text-white flex items-center gap-1.5">
                AuraStore <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-normal hidden sm:inline-block">AI-Collaborative</span>
              </span>
            </div>
          </div>

          {/* AI Semantic Search Bar */}
          <form onSubmit={onSearchSubmit} className="flex-1 max-w-md hidden md:block relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Ask AI: 'cozy lighting for slow mornings' or search..."
                className="w-full bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 focus:border-amber-400/80 rounded-full py-2 pl-9 pr-24 text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold rounded-full flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Mood Search</span>
              </button>
            </div>
          </form>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Persona Switcher Pill */}
            <div className="relative group">
              <button className="flex items-center gap-2 bg-stone-800 hover:bg-stone-750 border border-stone-700 px-3 py-1.5 rounded-full text-xs transition-colors">
                <span className="text-sm">{activePersona.icon}</span>
                <span className="font-medium text-stone-200 hidden lg:inline">{activePersona.name}</span>
                <SlidersHorizontal className="w-3 h-3 text-stone-400" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-72 bg-stone-900 border border-stone-750 rounded-2xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-3 py-2 border-b border-stone-800">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">Simulate Shopper Persona</p>
                  <p className="text-xs text-stone-400 mt-0.5">Watch the ML Recommendation Engine dynamically adapt storefront affinity.</p>
                </div>
                <div className="mt-1 space-y-1">
                  {personas.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onSelectPersona(p)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-3 transition-colors ${
                        p.id === activePersona.id ? 'bg-amber-500/15 border border-amber-500/30' : 'hover:bg-stone-800'
                      }`}
                    >
                      <span className="text-lg mt-0.5">{p.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${p.id === activePersona.id ? 'text-amber-300' : 'text-stone-200'}`}>{p.name}</p>
                        <p className="text-[10px] text-stone-400 line-clamp-2 mt-0.5">{p.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ML Visualizer Button */}
            <button
              onClick={onOpenVisualizer}
              title="View ML Collaborative Engine Matrix"
              className="p-2 sm:px-3 sm:py-1.5 bg-stone-800 hover:bg-stone-750 border border-stone-700 hover:border-amber-500/50 rounded-full text-xs font-mono text-stone-300 flex items-center gap-1.5 transition-all"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">ML Engine</span>
            </button>

            {/* AI Assistant Chat Toggle */}
            <button
              onClick={onOpenChat}
              className="p-2 sm:px-3 sm:py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 rounded-full text-xs font-medium text-amber-300 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI Stylist</span>
            </button>

            {/* Cart Drawer Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full transition-transform active:scale-95 shadow-md shadow-amber-500/20"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 font-bold" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-stone-900 shadow">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
