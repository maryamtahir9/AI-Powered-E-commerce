import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, ArrowRight } from 'lucide-react';
import { Product, ChatMessage } from '../types';

interface ChatAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
  personaName: string;
}

export const ChatAssistantDrawer: React.FC<ChatAssistantDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isLoading,
  onAddToCart,
  personaName,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const samplePrompts = [
    "What's the best noise-cancelling headset?",
    "Suggest a cozy desk mat for my developer setup",
    "How does collaborative filtering lift order value?"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 border-l border-stone-800 text-stone-100 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-800 bg-stone-900/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white flex items-center gap-1.5">
                  Lumi Stylist <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Gemini AI</span>
                </h3>
                <p className="text-[10px] font-mono text-stone-400">Styling for {personaName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                  msg.sender === 'user' ? 'bg-stone-700 text-white font-bold' : 'bg-amber-500 text-stone-950 font-bold'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : '⚡'}
                </div>

                <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-sm'
                    : 'bg-stone-800 border border-stone-750 text-stone-200 rounded-tl-sm space-y-3'
                }`}>
                  <p>{msg.text}</p>

                  {/* Suggested Products Pill inside AI Chat */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="pt-2 border-t border-stone-700 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-amber-300 block">Catalog Picks</span>
                      {msg.suggestedProducts.map((sp) => (
                        <div key={sp.id} className="bg-stone-900/80 p-2 rounded-xl flex items-center justify-between gap-2 border border-stone-700">
                          <img src={sp.imageUrl} alt={sp.name} className="w-10 h-10 rounded-lg object-cover bg-stone-950" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[11px] text-white truncate">{sp.name}</p>
                            <p className="font-mono text-amber-400 font-bold">${sp.price}</p>
                          </div>
                          <button
                            onClick={() => onAddToCart(sp)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[10px] rounded-lg shrink-0"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-stone-400 text-xs font-mono animate-pulse pl-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Lumi is consulting collaborative fashion vectors...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-5 pb-3 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-stone-400">Ask Stylist</span>
              <div className="flex flex-col gap-1.5">
                {samplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => onSendMessage(p)}
                    className="text-left text-xs bg-stone-800/80 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/50 p-2.5 rounded-xl text-stone-300 transition-colors flex items-center justify-between"
                  >
                    <span>{p}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-stone-800 bg-stone-900 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message to AI Stylist..."
              className="flex-1 bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 rounded-xl font-bold transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
