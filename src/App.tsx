import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { RecommendationsSection } from './components/RecommendationsSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ChatAssistantDrawer } from './components/ChatAssistantDrawer';
import { MLMatrixVisualizer } from './components/MLMatrixVisualizer';
import { ProductCard } from './components/ProductCard';

import { CATALOG, USER_PERSONAS } from './data/products';
import { Product, CartItem, UserPersona, RecommendationResponse, ChatMessage } from './types';
import { Sparkles, ArrowRight, TrendingUp, Filter, Search, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  // Active Persona State
  const [activePersona, setActivePersona] = useState<UserPersona>(USER_PERSONAS[0]);

  // Storefront & Cart State
  const [browsingHistory, setBrowsingHistory] = useState<string[]>(USER_PERSONAS[0].browsedProductIds);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [semanticSearchSummary, setSemanticSearchSummary] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(CATALOG);
  const [isGridLoading, setIsGridLoading] = useState<boolean>(false);

  // Recommendation Engine State
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState<boolean>(false);

  // Drawer / UI Toggles
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState<boolean>(false);

  // AI Chat Assistant State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // 1. Sync persona changes with browsing history & initial welcome chat
  useEffect(() => {
    setBrowsingHistory(activePersona.browsedProductIds);
    setSearchQuery('');
    setCategoryFilter('all');
    setFilteredProducts(CATALOG);
    setSemanticSearchSummary('');

    // Trigger customized initial assistant message
    const welcomeText = getWelcomeText(activePersona);
    setChatMessages([
      {
        id: 'initial-welcome',
        sender: 'ai',
        text: welcomeText,
        timestamp: new Date()
      }
    ]);
  }, [activePersona]);

  // 2. Fetch Personalized Recommendations dynamically based on browsing history / cart
  useEffect(() => {
    const fetchRecommendations = async () => {
      setRecommendationsLoading(true);
      try {
        const res = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            personaId: activePersona.id,
            browsingHistory,
            cartProductIds: cart.map((c) => c.product.id),
            currentCategory: categoryFilter === 'all' ? undefined : categoryFilter
          })
        });
        if (res.ok) {
          const data: RecommendationResponse = await res.json();
          setRecommendations(data);
        } else {
          console.warn('Failed to fetch recommendations from server, using local engine fallback.');
        }
      } catch (err) {
        console.error('Recommendations fetch error, using client-side heuristics:', err);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    fetchRecommendations();
  }, [activePersona, browsingHistory, cart, categoryFilter]);

  // 3. Dynamic Filter / Search handler with visual skeleton loading delay
  useEffect(() => {
    setIsGridLoading(true);
    const timeoutId = setTimeout(() => {
      let result = CATALOG;

      // Apply basic category filters if search isn't actively resetting it
      if (categoryFilter !== 'all') {
        result = result.filter((p) => p.category === categoryFilter);
      }

      setFilteredProducts(result);
      setIsGridLoading(false);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [categoryFilter]);

  // AI welcome message generation helper
  const getWelcomeText = (persona: UserPersona): string => {
    switch (persona.id) {
      case 'persona-tech-minimalist':
        return `Hello! I see you're perfecting your workspace. Based on your affinity for tactile feedback, premium acoustics, and pristine ergonomics, I recommend trying out our mechanical keyboard setup. Let me know if you need specific switch ratings or acoustics comparisons!`;
      case 'persona-coffee-home':
        return `Welcome to a slow, thoughtful morning. I noticed your interest in variable temperature kettles and precise weighing. Let's design an elegant kitchen bar setup that feels deliberate. What can I help you extract today?`;
      case 'persona-biohacker':
        return `Recovery optimization sequence online. I see you monitor sleep metrics, heart rate variability, and titanium physical wear. Let's find your next lightweight telemetry ring or ultra-endurance GPS companion. How can I assist your health metrics?`;
      default:
        return `Hello! I am Lumi, your personal AI Stylist. I am analyzing the storefront live to help you navigate our top co-purchased bundles and collaborative product recommendations. What are you looking to upgrade today?`;
    }
  };

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    // Record interaction in browsing history vector
    if (!browsingHistory.includes(product.id)) {
      setBrowsingHistory((prev) => [...prev, product.id]);
    }

    // Toggle cart drawer open for quick feedback
    setIsCartOpen(true);
  };

  const handleAddBundleToCart = (productIds: string[]) => {
    const productsToAdd = CATALOG.filter((p) => productIds.includes(p.id));
    
    setCart((prev) => {
      let updated = [...prev];
      productsToAdd.forEach((product) => {
        const existing = updated.find((item) => item.product.id === product.id);
        if (existing) {
          updated = updated.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          updated.push({ product, quantity: 1 });
        }
      });
      return updated;
    });

    // Sync all to history
    productIds.forEach((id) => {
      if (!browsingHistory.includes(id)) {
        setBrowsingHistory((prev) => [...prev, id]);
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Semantic Mood Search Submit Handler
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setRecommendationsLoading(true);
    setIsGridLoading(true);
    try {
      const res = await fetch('/api/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      if (res.ok) {
        const data = await res.json();
        // Subtle delay for transition layout feel
        setTimeout(() => {
          setFilteredProducts(data.results);
          setSemanticSearchSummary(data.moodSummary);
          setIsGridLoading(false);
        }, 350);
      } else {
        setIsGridLoading(false);
      }
    } catch (err) {
      console.error('Semantic search failed:', err);
      setIsGridLoading(false);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // AI Shopping Assistant Message Dispatcher
  const handleSendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages.slice(-6), // keep context short
          cart: cart.map((c) => c.product),
          personaName: activePersona.name
        })
      });

      if (res.ok) {
        const data = await res.json();
        const suggestedProducts = CATALOG.filter((p) => data.suggestedProductIds?.includes(p.id));
        
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date(),
          suggestedProducts
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('Chat assistant failed:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleQuickViewProduct = (product: Product) => {
    setSelectedProduct(product);
    // Record view to history vector
    if (!browsingHistory.includes(product.id)) {
      setBrowsingHistory((prev) => [...prev, product.id]);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      
      {/* Top Banner Navigation */}
      <Navbar
        personas={USER_PERSONAS}
        activePersona={activePersona}
        onSelectPersona={setActivePersona}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenVisualizer={() => setIsVisualizerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Hero Overview section */}
      <HeroBanner
        activePersona={activePersona}
        onExploreClick={() => {
          const el = document.getElementById('catalog-explore');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenVisualizer={() => setIsVisualizerOpen(true)}
      />

      {/* Dynamic Recommendation Shelf */}
      <RecommendationsSection
        recommendations={recommendations}
        catalog={CATALOG}
        isLoading={recommendationsLoading}
        onAddToCart={handleAddToCart}
        onAddBundleToCart={handleAddBundleToCart}
        onQuickView={handleQuickViewProduct}
        cartProductIds={cart.map((c) => c.product.id)}
      />

      {/* Main Catalog View */}
      <main id="catalog-explore" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Category Filter bar & Stats summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-800 pb-6">
          
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-white">
              {semanticSearchSummary ? 'AI Search Query Results' : 'Explore Catalog'}
            </h2>
            <p className="text-xs text-stone-400">
              {semanticSearchSummary ? semanticSearchSummary : 'Filter products to match your specific setup design criteria.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'workspace', label: 'Workspace' },
              { id: 'audio', label: 'Audio & Acoustics' },
              { id: 'wearables', label: 'Wearables' },
              { id: 'home', label: 'Home & Kitchen' },
              { id: 'lifestyle', label: 'Lifestyle' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoryFilter(cat.id);
                  setSemanticSearchSummary('');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium font-sans border transition-all ${
                  categoryFilter === cat.id && !semanticSearchSummary
                    ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold'
                    : 'bg-stone-900 text-stone-300 border-stone-850 hover:bg-stone-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Catalog Grid */}
        {isGridLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-stone-900 border border-stone-850 rounded-3xl overflow-hidden h-[450px] flex flex-col justify-between p-5 space-y-4">
                <div className="bg-stone-950 aspect-[4/3] w-full rounded-2xl" />
                <div className="space-y-3 flex-1 pt-2">
                  <div className="h-4 bg-stone-800 rounded-full w-2/3" />
                  <div className="h-3 bg-stone-800 rounded-full w-1/2" />
                  <div className="h-3 bg-stone-800 rounded-full w-5/6" />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-stone-800/80">
                  <div className="h-6 bg-stone-800 rounded-full w-20" />
                  <div className="h-8 bg-stone-800 rounded-full w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/40 border border-stone-850 rounded-3xl space-y-3">
            <p className="text-stone-400 text-sm font-medium">No direct category products found.</p>
            <button
              onClick={() => {
                setCategoryFilter('all');
                setSemanticSearchSummary('');
                setFilteredProducts(CATALOG);
              }}
              className="text-xs text-amber-400 underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredProducts.map((product) => {
              // Calculate custom category affinity match percentage dynamically
              const baseMatch = activePersona.favoriteCategories.includes(product.category) ? 94 : 45;
              const hasSharedTags = activePersona.browsedProductIds.some(bId => {
                const browsedItem = CATALOG.find(c => c.id === bId);
                return browsedItem?.tags.some(t => product.tags.includes(t));
              });
              const matchScore = hasSharedTags ? Math.min(99, baseMatch + 15) : baseMatch;

              return (
                <ProductCard
                  key={product.id}
                  product={{ ...product, matchScore }}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickViewProduct}
                  isRecommended={recommendations?.recommendedIds.includes(product.id)}
                  recommendationReason={recommendations?.explanations[product.id]}
                  inCart={cart.some((c) => c.product.id === product.id)}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* Footer Branding & Methodology */}
      <footer className="border-t border-stone-800 bg-stone-900/60 py-10 mt-16 text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold text-xs">⚡</span>
              <span className="text-sm font-bold text-white">AuraStore AI</span>
            </div>
            <div className="text-[11px] font-mono text-stone-500">
              Machine Learning storefront mockup utilizing collaborative co-purchase co-occurrence.
            </div>
          </div>
          <div className="border-t border-stone-850 pt-6 flex flex-col md:flex-row justify-between text-xs gap-4">
            <p>&copy; 2026 AuraStore AI. Built to demonstrate high-conversion recommendation workflows.</p>
            <div className="flex gap-4">
              <span className="cursor-pointer hover:text-stone-300" onClick={() => setIsVisualizerOpen(true)}>ML Engine Insights</span>
              <span className="cursor-pointer hover:text-stone-300" onClick={() => setIsChatOpen(true)}>AI Assistant Chat</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* AI Personal Shopping Assistant Drawer */}
      <ChatAssistantDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendChatMessage}
        isLoading={chatLoading}
        onAddToCart={handleAddToCart}
        personaName={activePersona.name}
      />

      {/* Product Quick View Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        recommendationReason={recommendations?.explanations[selectedProduct?.id || '']}
      />

      {/* ML Telemetry / Similarity Matrix Visualizer Modal */}
      <MLMatrixVisualizer
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
        activePersona={activePersona}
        browsingHistory={browsingHistory}
        cartProductIds={cart.map((c) => c.product.id)}
      />

    </div>
  );
}
