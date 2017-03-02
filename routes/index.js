var express = require('express');
var router = express.Router();

var db = require('../queries');


router.get('/api/evaluations', db.getAllEvaluations);
router.get('/api/evaluations/:id', db.getPersonEvaluations);
router.get('/api/evaluation/:id', db.getSingleEvaluation);
router.post('/api/evaluation', db.createEvaluation);
router.put('/api/evaluation/:id', db.updateEvaluation);
router.delete('/api/evaluation/:id', db.removeEvaluation);

module.exports = router;
