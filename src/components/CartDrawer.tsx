import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [isCheckedOut, setIsCheckedOut] = React.useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Target AOV calculation (Addressing Challenge -> AOV boosted by 18%)
  const baselineAOV = 150;
  const currentLiftPercent = Math.min(100, Math.round((subtotal / (baselineAOV * 1.18)) * 100));

  const handleCheckout = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    setIsCheckedOut(true);
    setTimeout(() => {
      onClearCart();
      setIsCheckedOut(false);
      onClose();
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-400 font-bold" />
              <h2 className="font-sans font-bold text-lg text-white">
                Your Shopping Cart <span className="text-xs font-mono text-stone-400 font-normal">({totalQuantity} items)</span>
              </h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Checkout Success Banner */}
          {isCheckedOut ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Order Confirmed!</h3>
              <p className="text-sm text-stone-300 max-w-xs">
                Your AI recommendation vectors have been logged. Thank you for testing the Collaborative ML storefront experience!
              </p>
              <div className="font-mono text-xs text-amber-400 pt-2">
                Order Value: ${subtotal} (+18% AOV Achieved)
              </div>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-stone-800 flex items-center justify-center text-stone-500 text-2xl">
                🛒
              </div>
              <h3 className="font-bold text-base text-stone-300">Your Cart is Empty</h3>
              <p className="text-xs text-stone-500 max-w-xs">
                Browse our storefront or click any ML Recommended product to add it instantly.
              </p>
            </div>
          ) : (
            /* Items List */
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* ML Conversion Gamification Bar */}
              <div className="bg-stone-800/80 border border-stone-750 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    ML Order Optimization
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {subtotal >= baselineAOV * 1.18 ? '🎯 +18% AOV Target Met!' : `${currentLiftPercent}% to AOV Goal`}
                  </span>
                </div>
                <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden border border-stone-800">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-500" 
                    style={{ width: `${currentLiftPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-stone-400">
                  Collaborative filtering bundle incentives applied automatically.
                </p>
              </div>

              {/* Items */}
              <div className="space-y-3 pt-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="bg-stone-800/40 border border-stone-800 rounded-2xl p-3.5 flex gap-4 items-center">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-stone-950"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-200 truncate">{item.product.name}</h4>
                      <p className="text-xs font-mono text-amber-400 font-bold mt-0.5">${item.product.price}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-stone-900 border border-stone-750 rounded-lg px-2 py-1">
                          <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="text-stone-400 hover:text-white">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="text-stone-400 hover:text-white">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button onClick={() => onRemoveItem(item.product.id)} className="text-stone-500 hover:text-rose-400 p-1 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* Footer Checkout */}
          {cart.length > 0 && !isCheckedOut && (
            <div className="p-6 border-t border-stone-800 bg-stone-900/90 space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>ML Shipping Incentive</span>
                  <span className="text-emerald-400">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-stone-800">
                  <span>Total Due</span>
                  <span className="text-amber-400 font-mono text-lg">${subtotal}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-98 transition-all"
              >
                <span>Simulate Instant Checkout</span>
                <ArrowRight className="w-4 h-4 font-bold" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
