require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('rate-limit');

const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const billingRoutes = require('./src/routes/billingRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const usageRoutes = require('./src/routes/usageRoutes');
const exploreRoutes = require('./src/routes/exploreRoutes');
const docsRoutes = require('./src/routes/docsRoutes');
const playgroundRoutes = require('./src/routes/playgroundRoutes');

const app = express();

// Connect to PostgreSQL via mongoose
mongoose.connect(process.env.PG_DATABASE ? `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}` : `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@localhost:5432/epannrouter`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => console.error('DB connection error:', err));

// Redis client
const redis = require('redis');
const RedisStore = require('connect-redis').store;

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Session middleware
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Passport (optional) - using simple JWT/session
app.use((req, res, next) => {
  req.user = req.session.user || null;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/billing', billingRoutes);
app.use('/settings', settingsRoutes);
app.use('/profile', profileRoutes);
app.use('/usage', usageRoutes);
app.use('/explore', exploreRoutes);
app.use('/docs', docsRoutes);
app.use('/playground', playgroundRoutes);

// Global middleware for session
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  res.locals.isAuthenticated = !!req.session.user;
  next();
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EpannRouter AI running on http://localhost:${PORT}`);
});

module.exports = app;
