const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters'],
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    trim: true,
    lowercase: true,
  },
  country: {
    type: String,
    default: 'IN',
    uppercase: true,
    maxlength: 2,
  },
  language: {
    type: String,
    default: 'en',
    lowercase: true,
    maxlength: 5,
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  lastAnalyzedAt: {
    type: Date,
    default: null,
  },
  lastScore: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
  },
  issueCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Compound index: user + domain should be unique
projectSchema.index({ userId: 1, domain: 1 }, { unique: true });

module.exports = mongoose.model('Project', projectSchema);
