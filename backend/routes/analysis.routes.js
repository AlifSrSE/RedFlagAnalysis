const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');

router.post('/analyze', analysisController.analyzeData);
router.get('/analysis/:id', analysisController.getAnalysis);
router.put('/analysis/:id/override', analysisController.overrideDecision);

module.exports = router;