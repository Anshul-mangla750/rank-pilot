const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

const router = express.Router();

// All project routes require authentication
router.use(auth);

router.post('/', [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ max: 100 }).withMessage('Project name cannot exceed 100 characters'),
  body('domain')
    .trim()
    .notEmpty().withMessage('Domain is required'),
  body('country')
    .optional()
    .isLength({ min: 2, max: 2 }).withMessage('Country must be a 2-letter code'),
  body('language')
    .optional()
    .isLength({ min: 2, max: 5 }).withMessage('Language code must be 2-5 characters'),
], projectController.createProject);

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);

router.put('/:id', [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Project name cannot exceed 100 characters'),
], projectController.updateProject);

router.delete('/:id', projectController.deleteProject);

module.exports = router;
