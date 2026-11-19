// --- 1. Imports ---
require('dotenv').config(); // Loads .env variables first
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const goalRoutes = require('./routes/goalRoutes');

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/goals', goalRoutes);

// A simple root route to test if the server is up
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Carbon Footprint Management Platform API is running!'
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Database Connection & Server Listen
if (!process.env.MONGO_URI) {
  console.error('WARNING: MONGO_URI is not defined in .env');
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB. Check MONGO_URI in .env:', err.message);
  });

module.exports = app;
