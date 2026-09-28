const User = require('../models/User');
const Session = require('../models/Session');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findByPk(userId, {
      include: [{ model: Session, as: 'sessions', order: [['createdAt', 'DESC']] }]
    });
    
    return res.render('profile', {
      user,
      sessions: user?.sessions || [],
      layout: 'main'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load profile' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.session.user.id;
    await User.destroy({ where: { id: userId } });
    req.session.destroy(() => {
      res.clearCookie('token');
      res.redirect('/auth/login');
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
};
