const { generateApiKey } = require('../utils/helpers');
const crypto = require('crypto');

exports.getSettings = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findByPk(userId);
    
    return res.render('settings', {
      user,
      layout: 'main'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { name, email, notifications, theme } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (name) user.name = name;
    if (email) {
      user.email = email;
    }
    if (notifications !== undefined) {
      user.notifications = notifications;
    }
    if (theme !== undefined) {
      user.theme = theme;
    }
    
    await user.save();
    
    req.session.user.name = user.name;
    req.session.user.email = user.email;
    
    return res.json({ message: 'Settings updated', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update settings' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { oldPassword, newPassword } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const valid = await comparePassword(oldPassword, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    
    user.password = await hashPassword(newPassword);
    await user.save();
    
    return res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to change password' });
  }
};

exports.generateApiKey = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findByPk(userId);
    
    const apiKey = generateApiKey();
    const keys = JSON.parse(user.apiKeys || '[]');
    keys.push({ id: crypto.randomBytes(8).toString('hex'), key: apiKey, created: new Date().toISOString() });
    user.apiKeys = JSON.stringify(keys);
    await user.save();
    
    return res.json({ message: 'API key generated', key: apiKey });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate API key' });
  }
};
