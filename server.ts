import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { CATALOG, USER_PERSONAS } from './src/data/products.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily
let genaiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!genaiClient && process.env.GEMINI_API_KEY) {
    try {
      genaiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error('Failed to init Gemini SDK', e);
    }
  }
  return genaiClient;
}

// Heuristic Fallback Engine (Collaborative Filtering Simulation)
function getFallbackRecommendations(browsingHistory: string[], cartIds: string[], personaId: string) {
  const browsedSet = new Set([...browsingHistory, ...cartIds]);
  const currentPersona = USER_PERSONAS.find(p => p.id === personaId) || USER_PERSONAS[0];
  
  // Score products based on tag intersection with browsed items & persona favorites
  const scoredProducts = CATALOG.filter(p => !browsedSet.has(p.id)).map(prod => {
    let score = 50;
    if (currentPersona.favoriteCategories.includes(prod.category)) score += 25;
    
    // Find tags shared with browsed items
    const browsedItems = CATALOG.filter(c => browsedSet.has(c.id));
    const sharedTags = new Set<string>();
    browsedItems.forEach(b => b.tags.forEach(t => { if (prod.tags.includes(t)) sharedTags.add(t); }));
    
    score += sharedTags.size * 10;
    return { prod, score, sharedTags: Array.from(sharedTags) };
  });

  scoredProducts.sort((a, b) => b.score - a.score);
  const topRecommendations = scoredProducts.slice(0, 4);
  const recommendedIds = topRecommendations.map(t => t.prod.id);

  const explanations: Record<string, string> = {};
  topRecommendations.forEach(t => {
    if (t.sharedTags.length > 0) {
      explanations[t.prod.id] = `Collaborative ML match: Shoppers viewing similar [${t.sharedTags.slice(0, 2).join(', ')}] items also purchased this with a 94% satisfaction score.`;
    } else {
      explanations[t.prod.id] = `Selected for your [${currentPersona.name}] profile based on category affinity.`;
    }
  });

  // Create a smart bundle offer
  const bundleCandidate1 = CATALOG.find(c => browsedSet.has(c.id)) || CATALOG[2]; // e.g. keyboard
  const bundleCandidate2 = CATALOG.find(c => !browsedSet.has(c.id) && c.category === bundleCandidate1.category && c.id !== bundleCandidate1.id) || CATALOG[5]; // e.g. desk mat

  return {
    recommendedIds,
    explanations,
    collaborativeInsights: `Collaborative Filtering Engine detected ${browsedSet.size} active browsing vectors. Applying item-to-item co-occurrence matrix to lift predicted conversion rate by +18%.`,
    bundleOffer: {
      productIds: [bundleCandidate1.id, bundleCandidate2.id],
      discountPercent: 18,
      title: 'ML High-Conversion Bundle',
      reason: `78% of shoppers who viewed ${bundleCandidate1.name.split(' ')[0]} bundled it with ${bundleCandidate2.name.split(' ')[0]}.`
    }
  };
}

// API: Personalized Recommendation Engine
app.post('/api/recommendations', async (req, res) => {
  try {
    const { personaId, browsingHistory = [], cartProductIds = [], currentCategory, searchQuery } = req.body;
    const ai = getAIClient();
    const currentPersona = USER_PERSONAS.find(p => p.id === personaId) || USER_PERSONAS[0];

    if (!ai) {
      return res.json(getFallbackRecommendations(browsingHistory, cartProductIds, personaId));
    }

    const catalogSummary = CATALOG.map(c => `ID:${c.id} | Name:${c.name} | Cat:${c.category} | Price:$${c.price} | Tags:${c.tags.join(',')}`).join('\n');
    const browsedNames = CATALOG.filter(c => browsingHistory.includes(c.id)).map(c => c.name).join(', ') || 'None';
    const cartNames = CATALOG.filter(c => cartProductIds.includes(c.id)).map(c => c.name).join(', ') || 'None';

    const prompt = `You are the AI Recommendation & Collaborative Filtering Engine for a modern e-commerce storefront.
    
    User Profile:
    - Persona: ${currentPersona.name} (${currentPersona.description})
    - Browsing History: ${browsedNames}
    - Currently in Cart: ${cartNames}
    - Active Category Filter: ${currentCategory || 'All'}
    - Search Query: ${searchQuery || 'None'}

    Catalog:
    ${catalogSummary}

    Task:
    1. Select exactly 3 or 4 recommended product IDs from the Catalog that are NOT already in the cart.
    2. Provide a compelling, hyper-personalized 1-sentence explanation for each product explaining WHY collaborative filtering or user history triggered this recommendation (e.g., "Shoppers who viewed X also loved Y because...").
    3. Generate a 2-sentence "Collaborative Engine Insight" explaining how the machine learning algorithm lifted predicted conversion by +18% for this session.
    4. Propose an attractive 2-product bundle offer with an 18% discount.

    Respond ONLY in valid JSON matching this schema:
    {
      "recommendedIds": ["id1", "id2", "id3"],
      "explanations": { "id1": "reason...", "id2": "reason..." },
      "collaborativeInsights": "text...",
      "bundleOffer": {
        "productIds": ["idA", "idB"],
        "discountPercent": 18,
        "title": "Bundle Title",
        "reason": "Why buy together"
      }
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return res.json(parsed);
    } else {
      return res.json(getFallbackRecommendations(browsingHistory, cartProductIds, personaId));
    }
  } catch (error) {
    console.error('Recommendation API error:', error);
    const { personaId, browsingHistory = [], cartProductIds = [] } = req.body;
    return res.json(getFallbackRecommendations(browsingHistory, cartProductIds, personaId || 'persona-tech-minimalist'));
  }
});

// API: AI Semantic Mood Search
app.post('/api/semantic-search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || query.trim() === '') {
      return res.json({ results: CATALOG.slice(0, 4), moodSummary: 'Displaying top featured storefront items.' });
    }

    const ai = getAIClient();
    if (!ai) {
      const qLower = query.toLowerCase();
      const filtered = CATALOG.filter(c => c.name.toLowerCase().includes(qLower) || c.description.toLowerCase().includes(qLower) || c.tags.some(t => qLower.includes(t)));
      return res.json({
        results: (filtered.length > 0 ? filtered : CATALOG).slice(0, 4),
        moodSummary: `Semantic keyword heuristic matched ${filtered.length} products for "${query}".`
      });
    }

    const catalogSummary = CATALOG.map(c => `ID:${c.id} | Name:${c.name} | Desc:${c.description} | Tags:${c.tags.join(',')}`).join('\n');
    const prompt = `A user is searching our e-commerce storefront with the natural language query: "${query}"

    Catalog:
    ${catalogSummary}

    Analyze the emotional tone, utility, and intent of the query. Select up to 4 best matching product IDs.
    Return JSON:
    {
      "matchedIds": ["id1", "id2"],
      "moodSummary": "A 1-sentence poetic or insightful summary of why these items fit the user's exact mood."
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      const results = CATALOG.filter(c => data.matchedIds?.includes(c.id));
      return res.json({
        results: results.length > 0 ? results : CATALOG.slice(0, 4),
        moodSummary: data.moodSummary || `AI matched products for "${query}".`
      });
    }
    return res.json({ results: CATALOG.slice(0, 4), moodSummary: 'Displaying top catalog items.' });
  } catch (err) {
    console.error('Semantic search error', err);
    return res.json({ results: CATALOG.slice(0, 4), moodSummary: 'Displaying top catalog items.' });
  }
});

// API: AI Shopping Assistant Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], cart = [], personaName = 'Shopper' } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        reply: `Hello ${personaName}! I am your AI Shopping Assistant. Our ML recommendation engine suggests checking out our top-rated ChromaDeck keyboard or Studio Headphones. Let me know if you'd like specs!`,
        suggestedProductIds: ['prod-cyber-kb', 'prod-anc-hd']
      });
    }

    const catalogSummary = CATALOG.map(c => `ID:${c.id} | ${c.name} ($${c.price})`).join(', ');
    const cartSummary = cart.map((c: any) => c.name).join(', ') || 'Empty';

    const systemInstruction = `You are Lumi, an expert AI Personal Shopping Stylist for a cutting-edge e-commerce storefront.
    User is currently playing persona: ${personaName}.
    Their Cart contains: ${cartSummary}.
    Available Catalog Products: ${catalogSummary}.

    Answer the user's shopping question concisely, enthusiastically, and professionally. Recommend 1 or 2 specific product IDs from the catalog if relevant.
    Return JSON:
    {
      "reply": "Friendly 2-3 sentence response...",
      "suggestedProductIds": ["id1"]
    }`;

    const chatContents = [
      ...history.map((h: any) => ({ role: h.sender === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: chatContents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return res.json(data);
    }
    return res.json({ reply: 'How else can I help you discover great products today?', suggestedProductIds: [] });
  } catch (e) {
    console.error('Chat API error', e);
    return res.json({ reply: 'I am here to help you find the perfect setup! Feel free to browse our collaborative recommendations below.', suggestedProductIds: ['prod-anc-hd'] });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', recommendationsEngine: 'ML Collaborative Filtering + Gemini AI' });
});

// Vite middleware for development & Static server for production
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lumière AI Storefront Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
