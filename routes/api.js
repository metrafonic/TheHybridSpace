var express = require('express');
var router = express.Router();

var db = require('../queries');


router.get('/evaluations', db.getAllEvaluations);
router.get('/evaluation/:id', db.getSingleEvaluation);
router.post('/evaluation', db.createSecureEvaluation);
router.put('/evaluation/:id', db.updateEvaluation);
router.delete('/evaluation/:id', db.removeEvaluation);

router.get('/persons', db.getAllPersons);
router.get('/person/:id', db.getSinglePerson);

router.post('/person', db.createPerson);
router.put('/person/:id', db.updatePerson);
router.delete('/person/:id', db.removePerson);

router.get('/teams', db.getAllTeams);
router.get('/collections', db.getAllCollections);

router.get('/search', db.searchDB);

module.exports = router;
