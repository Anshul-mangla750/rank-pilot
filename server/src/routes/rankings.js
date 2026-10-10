const express = require('express');
const serpService = require('../services/serpService');
const Project = require('../models/Project');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/check', optionalAuth, async (req, res) => {
  try {
    const { keyword, domain, country, location } = req.body;
    if (!keyword || !domain) {
      return res.status(400).json({ error: 'Keyword and domain are required' });
    }

    const serpResult = await serpService.checkKeywordRank(keyword, domain, country, location);
    res.json({ success: true, data: serpResult });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to check keyword rank' });
  }
});

router.get('/project/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const results = [];
    for (const kw of project.keywords || []) {
      const rank = await serpService.checkKeywordRank(kw, project.domain, project.country);
      results.push(rank);
    }

    res.json({ project, rankings: results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve project rankings' });
  }
});

module.exports = router;
