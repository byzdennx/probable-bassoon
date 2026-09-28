const { chat } = require('../services/geminiService');
const { getModelByName } = require('../utils/helpers');
const Session = require('../models/Session');

exports.getPlayground = async (req, res) => {
  try {
    const { model, sessionId } = req.query;
    const models = [
      { name: 'gemini', provider: 'google', displayName: 'Gemini Pro', price: 0 },
      { name: 'gpt-4', provider: 'openai', displayName: 'GPT-4', price: 0.03 },
      { name: 'gpt-3.5-turbo', provider: 'openai', displayName: 'GPT-3.5 Turbo', price: 0.0015 },
      { name: 'claude-3-opus', provider: 'anthropic', displayName: 'Claude 3 Opus', price: 0.015 },
      { name: 'claude-3-sonnet', provider: 'anthropic', displayName: 'Claude 3 Sonnet', price: 0.003 },
      { name: 'llama-2', provider: 'meta', displayName: 'Llama 2', price: 0 },
      { name: 'mistral-large', provider: 'mistral', displayName: 'Mistral Large', price: 0.006 },
      { name: 'cohere-command', provider: 'cohere', displayName: 'Cohere Command', price: 0.001 }
    ];

    return res.render('playground', {
      models,
      selectedModel: model || 'gemini',
      sessionId: sessionId || null,
      layout: 'main'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load playground' });
  }
};

exports.chatWithAI = async (req, res) => {
  try {
    const { model, message, sessionId } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const modelObj = getModelByName(model);
    if (!modelObj) {
      return res.status(400).json({ error: 'Invalid model' });
    }

    // For Gemini, use the scrape service
    if (model === 'gemini') {
      const result = await chat(message, sessionId || undefined);
      return res.json({
        ...result,
        model: 'gemini',
        provider: 'google'
      });
    }

    // For other models, placeholder
    return res.json({
      creator: 'epannrouter',
      status: 200,
      response: `AI response from ${modelObj.displayName}: This is a placeholder response. Integration for ${modelObj.displayName} coming soon.`,
      model: model,
      provider: modelObj.provider
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to process chat' });
  }
};
