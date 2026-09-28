const { formatBytes, formatNumber } = require('../utils/helpers');
const Session = require('../models/Session');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    const [user, sessions, billing] = await Promise.all([
      User.findByPk(userId, { include: [{ model: Session, as: 'sessions' }] }),
      Session.count({ where: { userId } }),
      Session.sum('messageCount', { where: { userId } }),
      Billing.findOne({ where: { userId } })
    ]);
    
    const stats = {
      totalSessions: sessions || 0,
      totalMessages: formatBytes(billing?.credits || 0),
      plan: user.plan,
      planDetails: {
        free: { name: 'Free', price: 0, limit: '10 messages/day' },
        pro: { name: 'Pro', price: 29, limit: 'Unlimited' },
        enterprise: { name: 'Enterprise', price: 99, limit: 'Unlimited' }
      }
    };
    
    return res.render('dashboard', {
      user,
      stats,
      sessions: sessions.slice(0, 5),
      layout: 'main'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load dashboard' });
  }
};
