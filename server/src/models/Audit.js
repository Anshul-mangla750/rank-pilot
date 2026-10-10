const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // can be anonymous or authenticated
    index: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false,
    index: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  targetKeyword: {
    type: String,
    trim: true,
    default: '',
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  categories: {
    onPage: { score: Number, passed: Number, failed: Number, warnings: Number },
    technical: { score: Number, passed: Number, failed: Number, warnings: Number },
    content: { score: Number, passed: Number, failed: Number, warnings: Number },
    performance: { score: Number, passed: Number, failed: Number, warnings: Number },
  },
  checks: [{
    id: String,
    category: {
      type: String,
      enum: ['onPage', 'technical', 'content', 'performance'],
    },
    name: String,
    status: {
      type: String,
      enum: ['pass', 'warning', 'fail'],
    },
    value: String,
    recommendation: String,
    impact: {
      type: String,
      enum: ['High', 'Medium', 'Low', 'Info'],
    },
    details: mongoose.Schema.Types.Mixed,
  }],
  aiRecommendations: [{
    issue: String,
    fix: String,
    codeSnippet: String,
  }],
  performanceMetrics: {
    responseTimeMs: Number,
    fcp: String,
    lcp: String,
    cls: String,
    fid: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Audit', auditSchema);
