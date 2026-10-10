const express = require('express');
const { body } = require('express-validator');
const auditController = require('../controllers/auditController');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/analyze',
  optionalAuth,
  [body('url').isURL({ require_protocol: false }).withMessage('Valid URL is required')],
  auditController.analyzeUrl
);

router.post('/compare', optionalAuth, auditController.compareUrls);
router.post('/crawl', optionalAuth, auditController.crawlDomain);

router.get('/history', auth, auditController.getAuditHistory);
router.get('/:id', optionalAuth, auditController.getAuditById);

module.exports = router;
