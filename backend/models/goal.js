const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetEmissions: {
      type: Number,
      required: [true, 'Target emissions is required in kg CO2'],
      min: [0, 'Target emissions cannot be negative'],
    },
    period: {
      type: String,
      default: 'monthly',
      trim: true,
    },
    monthYear: {
      type: String, // e.g. "2026-11" for monthly tracking
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    note: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness per user per month
goalSchema.index({ userId: 1, monthYear: 1 }, { unique: true });

module.exports = mongoose.model('Goal', goalSchema);
