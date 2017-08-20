var express = require('express');
var router = express.Router();

var db = require('../queries');
var dl = require('../func/download');


router.post('/evaluation', db.createSecureEvaluation);
router.put('/evaluation/:id', db.updateEvaluation);
router.delete('/evaluation/:id', db.removeEvaluation);

router.get('/datasets', db.getAllDatasets);
router.post('/dataset', db.createDataset);
router.post('/dataset/:id', db.setDataset);

router.get('/sliders', db.getAllSliders);
router.post('/sliders', db.updateSliders);

router.get('/person/:id', db.getSinglePerson);
router.get('/persons', db.getAllPersons);

router.post('/person', db.createPerson);
router.put('/person/:id', db.updatePerson);
router.delete('/person/:id', db.removePerson);

router.get('/teams', db.getAllTeams);
router.get('/collections', db.getAllCollections);

router.get('/search', db.searchDB);

router.get('/download', dl.downloadCSV);

module.exports = router;
