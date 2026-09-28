const { formatBytes, formatNumber } = require('../utils/helpers');
const Session = require('../models/Session');
const Billing = require('../models/Billing');

exports.getUsage = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    const [usage, sessions, billing] = await Promise.all([
      Session.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 20
      }),
      Session.count({ where: { userId } }),
      Session.sum('messageCount', { where: { userId } }),
      Billing.findOne({ where: { userId } })
    ]);
    
    const totalMessages = formatBytes(billing?.credits || 0);
    
    return res.render('usage', {
      usage,
      totalSessions: sessions,
      totalMessages,
      plan: req.session.user.plan,
      layout: 'main'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load usage' });
  }
};
