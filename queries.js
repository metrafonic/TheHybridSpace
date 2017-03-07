var promise = require('bluebird');
var async = require('async');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = process.env.DATABASE_URL || "postgres://127.0.0.1:5432/thehybridspace";
var db = pgp(connectionString);

// add query functions

module.exports = {
  getAllEvaluations: getAllEvaluations,
  getPersonEvaluations: getPersonEvaluations,
  getTeamEvaluations: getTeamEvaluations,
  getCollectionEvaluations: getCollectionEvaluations,
  getSingleEvaluation: getSingleEvaluation,
  createSecureEvaluation: createSecureEvaluation,
  createEvaluation: createEvaluation,
  updateEvaluation: updateEvaluation,
  removeEvaluation: removeEvaluation,
  getAllPersons: getAllPersons,
  getSinglePerson: getSinglePerson,
  createPerson: createPerson,
  updatePerson: updatePerson,
  removePerson: removePerson,
  getAllTeams: getAllTeams,
  getAllCollections: getAllCollections,
};

function checkAuth(req, res, next, parentnext){
  //TODO: Check user exists
  authenticatePerson(req, res, next, parentnext);

}

function authenticatePerson(req, res, next, parentnext){
  req.body.person = parseInt(req.body.person);
  db.one('select password from persons where person = $1', req.body.person)
    .then(function (data){

      if (data.password==req.body.password){
        next(req, res, parentnext);
      }else{
        res.status(403)
          .json({
            status: 'forbidden',
            message: 'wrong password'
          });
          return false;
      }
    }).catch(function (err) {
      res.status(500)
        .json({
          status: 'error',
          message: 'User does not exist'
        });
      return next(err);
    });
}

function getAllEvaluations(req, res, next) {
  db.any('select * from persons INNER JOIN evaluations ON (persons.person = evaluations.person);')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL evaluations'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getPersonEvaluations(req, res, next) {
  var person = parseInt(req.params.id);
  db.any('select * from evaluations where person = $1', person)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved person evaluations'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getTeamEvaluations(req, res, next) {
  var team = req.params.team;
  db.any('select * from evaluations where team = $1', team)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved team evaluations'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getCollectionEvaluations(req, res, next) {
  var collection = req.params.collection;
  db.any('select * from evaluations where collection = $1', collection)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved collection evaluations'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleEvaluation(req, res, next) {
  var evalID = parseInt(req.params.id);
  db.one('select * from evaluations where evalid = $1', evalID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved single evaluation'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}




function createSecureEvaluation(req, res, next){
  checkAuth(req, res, createEvaluation, next);
}

function createEvaluation(req, res, next) {
  console.log("working");
  req.body.x = parseInt(req.body.x);
  req.body.y = parseInt(req.body.y);
  req.body.slider1 = parseInt(req.body.slider1);
  req.body.slider2 = parseInt(req.body.slider2);

  db.none('insert into evaluations(person, x, y, slider1, slider2, comment)' +
      'values(${person}, ${x}, ${y}, ${slider1}, ${slider2}, ${comment})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one evaluation'
        });
    })
    .catch(function (err) {
      res.status(500)
        .json({
          status: 'error',
          message: 'Missing plot data'
        });
      return next(err);
    });

}

function updateEvaluation(req, res, next) {
  db.none('update evaluations set person=$1, x=$2, y=$3, slider1=$4, slider2=$5, comment=$6 where evalid=$7',
    [parseInt(req.body.person),parseInt(req.body.x), parseInt(req.body.y), parseInt(req.body.slider1),
      parseInt(req.body.slider2),req.body.comment, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated evaluation'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeEvaluation(req, res, next) {
  var evalID = parseInt(req.params.id);
  db.result('delete from evaluations where evalid = $1', evalID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} evaluation`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAllPersons(req, res, next) {
  db.any('select * from persons')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL persons'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSinglePerson(req, res, next) {
  var evalID = parseInt(req.params.id);
  db.one('select * from persons where person = $1', evalID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved single person'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createPerson(req, res, next) {
  req.body.person = parseInt(req.body.person);
  console.log(req.body.password);
  db.none('insert into persons(person, team, collection, password)' +
      'values(${person}, ${team}, ${collection}, ${password})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one person'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updatePerson(req, res, next) {
  db.none('update persons set team=$1, collection=$2 where person=$3',
    [req.body.team,req.body.collection, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated person'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removePerson(req, res, next) {
  var person = parseInt(req.params.id);
  db.result('delete from persons where person = $1', person)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} person`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAllTeams(req, res, next) {
  db.any('select DISTINCT team from persons')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all teams'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAllCollections(req, res, next) {
  db.any('select DISTINCT collection from persons')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all collections'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
