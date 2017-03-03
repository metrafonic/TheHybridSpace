var express = require('express');
var router = express.Router();

var db = require('../queries');


router.get('/evaluations', db.getAllEvaluations);
router.get('/evaluations/:id', db.getPersonEvaluations);
router.get('/evaluation/:id', db.getSingleEvaluation);
router.post('/evaluation', db.createEvaluation);
router.put('/evaluation/:id', db.updateEvaluation);
router.delete('/evaluation/:id', db.removeEvaluation);

module.exports = router;
