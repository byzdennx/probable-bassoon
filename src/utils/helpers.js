const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// Generate JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, plan: user.plan },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Verify JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Hash password
async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

// Compare password
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Generate API key
function generateApiKey() {
  return 'epan_' + crypto.randomBytes(32).toString('hex');
}

// Format number with commas
function formatNumber(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(num);
}

// Format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Clamp text
function clampText(text, maxLen = 100) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
}

// Random string
function randomString(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

// Validate email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Get model by name
function getModelByName(modelName) {
  const models = [
    { name: 'gemini', provider: 'google', displayName: 'Gemini Pro', price: 0, maxTokens: 3072, description: 'Google\'s flagship AI model' },
    { name: 'gpt-4', provider: 'openai', displayName: 'GPT-4', price: 0.03, maxTokens: 8192, description: 'OpenAI\'s most powerful model' },
    { name: 'gpt-3.5-turbo', provider: 'openai', displayName: 'GPT-3.5 Turbo', price: 0.0015, maxTokens: 16385, description: 'OpenAI\'s fast and capable model' },
    { name: 'claude-3-opus', provider: 'anthropic', displayName: 'Claude 3 Opus', price: 0.015, maxTokens: 200000, description: 'Anthropic\'s most powerful model' },
    { name: 'claude-3-sonnet', provider: 'anthropic', displayName: 'Claude 3 Sonnet', price: 0.003, maxTokens: 200000, description: 'Anthropic\'s balanced model' },
    { name: 'llama-2', provider: 'meta', displayName: 'Llama 2', price: 0, maxTokens: 4096, description: 'Meta\'s open-source model' },
    { name: 'mistral-large', provider: 'mistral', displayName: 'Mistral Large', price: 0.006, maxTokens: 32768, description: 'Mistral\'s largest model' },
    { name: 'cohere-command', provider: 'cohere', displayName: 'Cohere Command', price: 0.001, maxTokens: 4096, description: 'Cohere\'s search and generation model' },
  ];
  return models.find(m => m.name === modelName) || null;
}

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  generateApiKey,
  formatNumber,
  formatBytes,
  clampText,
  randomString,
  isValidEmail,
  getModelByName
};
