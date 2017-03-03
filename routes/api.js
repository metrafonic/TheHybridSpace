var express = require('express');
var router = express.Router();

var db = require('../queries');


router.get('/evaluations', db.getAllEvaluations);
router.get('/evaluations/:id', db.getPersonEvaluations);
router.get('/evaluation/:id', db.getSingleEvaluation);
router.post('/evaluation', db.createEvaluation);
router.put('/evaluation/:id', db.updateEvaluation);
router.delete('/evaluation/:id', db.removeEvaluation);

router.get('/persons', db.getAllPersons);
router.get('/person/:id', db.getSinglePerson);
router.post('/person', db.createPerson);
router.put('/person/:id', db.updatePerson);
router.delete('/person/:id', db.removePerson);

module.exports = router;
