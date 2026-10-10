const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Project = require('../models/Project');

const sampleProjects = [
  {
    _id: '661000000000000000000101',
    name: 'IndiaMART B2B Marketplace',
    domain: 'indiamart.com',
    country: 'IN',
    language: 'en',
    keywords: ['b2b marketplace india', 'wholesale suppliers delhi', 'industrial manufacturers'],
    lastScore: 84,
    issueCount: 5,
    lastAnalyzedAt: new Date(Date.now() - 3600000 * 4),
    createdAt: new Date(Date.now() - 3600000 * 240),
  },
  {
    _id: '661000000000000000000102',
    name: 'Nykaa Beauty & Cosmetics',
    domain: 'nykaa.com',
    country: 'IN',
    language: 'en',
    keywords: ['buy cosmetics online india', 'skincare routine products', 'luxury lipstick online'],
    lastScore: 88,
    issueCount: 3,
    lastAnalyzedAt: new Date(Date.now() - 3600000 * 12),
    createdAt: new Date(Date.now() - 3600000 * 180),
  },
  {
    _id: '661000000000000000000103',
    name: 'CarWale Automotive Portal',
    domain: 'carwale.com',
    country: 'IN',
    language: 'en',
    keywords: ['new cars in india', 'best mileage cars 2026', 'used car valuation mumbai'],
    lastScore: 81,
    issueCount: 6,
    lastAnalyzedAt: new Date(Date.now() - 3600000 * 24),
    createdAt: new Date(Date.now() - 3600000 * 120),
  },
  {
    _id: '661000000000000000000104',
    name: 'Practo Health & Doctors',
    domain: 'practo.com',
    country: 'IN',
    language: 'en',
    keywords: ['book doctor appointment bangalore', 'online consultation india', 'dermatologist near me'],
    lastScore: 86,
    issueCount: 4,
    lastAnalyzedAt: new Date(Date.now() - 3600000 * 48),
    createdAt: new Date(Date.now() - 3600000 * 90),
  },
  {
    _id: '661000000000000000000105',
    name: 'Zerodha Broking Fintech',
    domain: 'zerodha.com',
    country: 'IN',
    language: 'en',
    keywords: ['demat account opening india', 'online stock trading broker', 'mutual funds direct zerodha'],
    lastScore: 92,
    issueCount: 2,
    lastAnalyzedAt: new Date(Date.now() - 3600000 * 72),
    createdAt: new Date(Date.now() - 3600000 * 60),
  },
];

let inMemoryProjects = [...sampleProjects];

exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, domain, country, language, keywords } = req.body;
    const normalizedDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '')
      .toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const project = await Project.create({
        userId: req.userId,
        name,
        domain: normalizedDomain,
        country: country || 'IN',
        language: language || 'en',
        keywords: keywords || [],
      });
      return res.status(201).json({ project });
    }

    // In-memory fallback
    const newProj = {
      _id: 'mem_' + Date.now(),
      userId: req.userId,
      name,
      domain: normalizedDomain,
      country: country || 'IN',
      language: language || 'en',
      keywords: keywords || [],
      lastScore: 80,
      issueCount: 3,
      createdAt: new Date(),
    };
    inMemoryProjects.unshift(newProj);
    res.status(201).json({ project: newProj });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You already have a project for this domain' });
    }
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let projects = await Project.find({ userId: req.userId }).sort({ updatedAt: -1 });
      if (projects.length === 0) {
        // Automatically seed user with the 5 Indian case study websites
        for (const sp of sampleProjects) {
          try {
            await Project.create({
              userId: req.userId,
              name: sp.name,
              domain: sp.domain,
              country: sp.country,
              language: sp.language,
              keywords: sp.keywords,
              lastScore: sp.lastScore,
              issueCount: sp.issueCount,
              lastAnalyzedAt: sp.lastAnalyzedAt,
            });
          } catch (e) {}
        }
        projects = await Project.find({ userId: req.userId }).sort({ updatedAt: -1 });
      }
      return res.json({ projects });
    }

    res.json({ projects: inMemoryProjects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.json({ projects: inMemoryProjects });
  }
};

exports.getProject = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const project = await Project.findOne({
        _id: req.params.id,
        userId: req.userId,
      });
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.json({ project });
    }

    const p = inMemoryProjects.find((x) => x._id === req.params.id);
    if (!p) return res.status(404).json({ error: 'Project not found' });
    res.json({ project: p });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, country, language, keywords } = req.body;

    if (mongoose.connection.readyState === 1) {
      const project = await Project.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { name, country, language, keywords },
        { new: true, runValidators: true }
      );
      if (!project) return res.status(404).json({ error: 'Project not found' });
      return res.json({ project });
    }

    const idx = inMemoryProjects.findIndex((x) => x._id === req.params.id);
    if (idx !== -1) {
      inMemoryProjects[idx] = { ...inMemoryProjects[idx], name, country, language, keywords };
      return res.json({ project: inMemoryProjects[idx] });
    }
    res.status(404).json({ error: 'Project not found' });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const project = await Project.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId,
      });
      if (!project) return res.status(404).json({ error: 'Project not found' });
      return res.json({ message: 'Project deleted' });
    }

    inMemoryProjects = inMemoryProjects.filter((x) => x._id !== req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
