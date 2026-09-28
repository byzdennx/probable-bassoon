const { getModelByName } = require('../utils/helpers');

const ALL_MODELS = [
  { name: 'gemini', provider: 'google', displayName: 'Gemini Pro', price: 0, maxTokens: 3072, contextWindow: '8K', speed: 'fast', description: 'Google\'s flagship AI model for multi-modal tasks' },
  { name: 'gpt-4', provider: 'openai', displayName: 'GPT-4', price: 0.03, maxTokens: 8192, contextWindow: '8K', speed: 'medium', description: 'OpenAI\'s most powerful model' },
  { name: 'gpt-3.5-turbo', provider: 'openai', displayName: 'GPT-3.5 Turbo', price: 0.0015, maxTokens: 16385, contextWindow: '16K', speed: 'fast', description: 'OpenAI\'s fast and capable model' },
  { name: 'claude-3-opus', provider: 'anthropic', displayName: 'Claude 3 Opus', price: 0.015, maxTokens: 200000, contextWindow: '200K', speed: 'slow', description: 'Anthropic\'s most powerful model' },
  { name: 'claude-3-sonnet', provider: 'anthropic', displayName: 'Claude 3 Sonnet', price: 0.003, maxTokens: 200000, contextWindow: '200K', speed: 'medium', description: 'Anthropic\'s balanced model' },
  { name: 'llama-2', provider: 'meta', displayName: 'Llama 2', price: 0, maxTokens: 4096, contextWindow: '4K', speed: 'fast', description: 'Meta\'s open-source model' },
  { name: 'mistral-large', provider: 'mistral', displayName: 'Mistral Large', price: 0.006, maxTokens: 32768, contextWindow: '32K', speed: 'medium', description: 'Mistral\'s largest model' },
  { name: 'cohere-command', provider: 'cohere', displayName: 'Cohere Command', price: 0.001, maxTokens: 4096, contextWindow: '4K', speed: 'fast', description: 'Cohere\'s search and generation model' },
  { name: 'gemini-1.5', provider: 'google', displayName: 'Gemini 1.5 Pro', price: 0.001, maxTokens: 1048576, contextWindow: '1M', speed: 'medium', description: 'Gemini with 1M token context' },
  { name: 'gpt-4-turbo', provider: 'openai', displayName: 'GPT-4 Turbo', price: 0.01, maxTokens: 128000, contextWindow: '128K', speed: 'medium', description: 'GPT-4 with vision capabilities' },
  { name: 'claude-2', provider: 'anthropic', displayName: 'Claude 2', price: 0.008, maxTokens: 100000, contextWindow: '100K', speed: 'slow', description: 'Anthropic\'s second generation model' },
  { name: 'mixtral-8x7b', provider: 'mistral', displayName: 'Mixtral 8x7B', price: 0.0007, maxTokens: 32768, contextWindow: '32K', speed: 'fast', description: 'Sparse mixture model' },
  { name: 'phi-2', provider: 'microsoft', displayName: 'Phi-2', price: 0, maxTokens: 2048, contextWindow: '2K', speed: 'fast', description: 'Microsoft\'s compact model' },
  { name: 'tinyllama', provider: 'stateful', displayName: 'TinyLlama', price: 0, maxTokens: 2048, contextWindow: '2K', speed: 'fast', description: 'Small but capable model' }
];

exports.getExplore = async (req, res) => {
  try {
    const { search, provider, price, speed, context } = req.query;
    
    let filtered = [...ALL_MODELS];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.includes(searchLower) ||
        m.displayName.toLowerCase().includes(searchLower) ||
        m.provider.toLowerCase().includes(searchLower) ||
        m.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (provider && provider !== 'all') {
      filtered = filtered.filter(m => m.provider === provider);
    }
    
    if (price && price !== 'all') {
      filtered = filtered.filter(m => {
        if (price === 'free') return m.price === 0;
        if (price === 'cheap') return m.price < 0.001;
        if (price === 'expensive') return m.price >= 0.01;
        return true;
      });
    }
    
    if (speed && speed !== 'all') {
      filtered = filtered.filter(m => m.speed === speed);
    }
    
    if (context && context !== 'all') {
      filtered = filtered.filter(m => {
        const tokens = parseInt(m.contextWindow.replace('K', ''));
        if (context === 'small') return tokens < 10000;
        if (context === 'large') return tokens >= 100000;
        return true;
      });
    }
    
    const providers = ['google', 'openai', 'anthropic', 'meta', 'mistral', 'cohere', 'microsoft', 'stateful'];
    const speeds = ['fast', 'medium', 'slow'];
    const priceOptions = ['all', 'free', 'cheap', 'expensive'];
    const contextOptions = ['all', 'small', 'large'];
    
    return res.render('explore', {
      models: filtered,
      providers,
      selectedProvider: provider || 'all',
      speeds,
      selectedSpeed: speed || 'all',
      priceOptions,
      selectedPrice: price || 'all',
      contextOptions,
      selectedContext: context || 'all',
      searchQuery: search || '',
      layout: 'main'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load explore' });
  }
};
