export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: 'audio' | 'workspace' | 'wearables' | 'home' | 'lifestyle';
  imageUrl: string;
  features: string[];
  tags: string[];
  inStock: boolean;
  matchScore?: number;
  recommendationReason?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserPersona {
  id: string;
  name: string;
  icon: string;
  description: string;
  browsedProductIds: string[];
  purchasedProductIds: string[];
  favoriteCategories: string[];
  vibe: string;
}

export interface BrowsingEvent {
  productId: string;
  timestamp: number;
  action: 'view' | 'cart' | 'purchase' | 'wishlist';
}

export interface RecommendationRequest {
  personaId: string;
  browsingHistory: string[];
  cartProductIds: string[];
  currentCategory?: string;
  searchQuery?: string;
}

export interface RecommendationResponse {
  recommendedIds: string[];
  explanations: Record<string, string>;
  collaborativeInsights: string;
  bundleOffer?: {
    productIds: string[];
    discountPercent: number;
    title: string;
    reason: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  suggestedProducts?: Product[];
}
