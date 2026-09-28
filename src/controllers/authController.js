const User = require('../models/User');
const { hashPassword, comparePassword, generateToken } = require('../utils/helpers');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, plan: 'free' });
    
    const token = generateToken({ id: user.id, email: user.email, role: user.role, plan: user.plan });
    
    req.session.user = { id: user.id, email: user.email, role: user.role, plan: user.plan };
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    return res.json({ message: 'Registration successful', user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken({ id: user.id, email: user.email, role: user.role, plan: user.plan });
    
    req.session.user = { id: user.id, email: user.email, role: user.role, plan: user.plan };
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    return res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  });
};

exports.isLoggedIn = (req, res) => {
  res.json({ isAuthenticated: !!req.session.user, user: req.session.user });
};
