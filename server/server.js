const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
const config = require('./src/config/env');

// Route imports
const authRoutes = require('./src/routes/auth');
const projectRoutes = require('./src/routes/projects');
const auditRoutes = require('./src/routes/audit');
const rankingRoutes = require('./src/routes/rankings');

const app = express();

// Security middleware
app.use(helmet());
// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://rank-pilot-seven.vercel.app',
  config.clientUrl,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/([a-zA-Z0-9_-]+\.)?vercel\.app$/.test(origin);

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/rankings', rankingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: config.nodeEnv === 'development' ? err.message : 'Internal server error',
  });
});

// Start server
const start = async () => {
  await connectDB();
  
  app.listen(config.port, () => {
    console.log(`RankPilot API running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });
};

start();
