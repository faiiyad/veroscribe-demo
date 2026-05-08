require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const physicianRoutes = require('./routes/physicians');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/physicians', physicianRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'patient-booking-backend',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ── Database ──────────────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI environment variable is required');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅  Connected to MongoDB Atlas');

    // Auto-seed on first run if no physicians exist
    const Physician = require('./models/Physician');
    const count = await Physician.countDocuments();
    if (count === 0) {
      console.log('🌱  No physicians found — running seed...');
      await require('./seed').run();
    }

    app.listen(PORT, () => {
      console.log(`🚀  Backend running → http://localhost:${PORT}`);
      console.log(`    Health check  → http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });
