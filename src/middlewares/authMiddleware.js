const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
  const token = req.cookies?.token || req.session?.user?.token;
  if (!token) {
    return res.redirect('/auth/login');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
    return;
  }
  req.user = decoded;
  next();
}

function isAdmin(req, res, next) {
  if (!req.user) return res.redirect('/auth/login');
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

function requirePlan(plan) {
  return (req, res, next) => {
    if (!req.user) return res.redirect('/auth/login');
    if (plan && req.user.plan !== plan) {
      return res.status(403).json({ error: `Requires ${plan} plan` });
    }
    next();
  };
}

module.exports = { isAuthenticated, isAdmin, requirePlan };
