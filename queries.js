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
  createSecureEvaluation: createSecureEvaluation,
  updateEvaluation: updateEvaluation,
  removeEvaluation: removeEvaluation,

  getAllDatasets: getAllDatasets,
  createDataset: createDataset,
  setDataset: setDataset,

  getAllSliders: getAllSliders,
  updateSliders: updateSliders,

  getAllPersons: getAllPersons,
  createPerson: createPerson,
  updatePerson: updatePerson,
  removePerson: removePerson,

  getAllTeams: getAllTeams,
  getAllCollections: getAllCollections,
  searchDB:searchDB
};

selectstringevaluations = "select evalid, view_persons.person, team, collection, x, y, slider1, slider1text, slider2, slider2text, comment, time ";
fromstringevaluations = "from view_persons INNER JOIN view_evaluations USING (pid)";
sortstring = "ORDER BY evalid";


function checkAuth(req, res, next, parentnext){
  //TODO: Check user exists
  authenticatePerson(req, res, next, parentnext);

}

function authenticatePerson(req, res, next, parentnext){
  req.body.person = parseInt(req.body.person);
  db.one('select password from view_persons where person = $1', req.body.person)
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


function getAllDatasets(req, res, next) {
  db.any('SELECT dataset, name, COUNT(evalid) AS evaluations FROM datasets LEFT JOIN evaluations USING (dataset) GROUP BY datasets.dataset ORDER BY datasets.dataset')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all datasets'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function createDataset(req, res, next) {
  console.log(req.body.password);
  db.none('insert into datasets(name)' +
      'values(${name})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Created Dataset'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function setDataset(req, res, next) {
  db.none('UPDATE datasettings set currentdataset = $1;',
    [parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Set dataset'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getAllSliders(req, res, next) {
  db.any('select slider1text AS Slider1, slider2text AS Slider2 from currentsettings')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all slider values'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateSliders(req, res, next) {
  db.none('UPDATE datasets set slider1text = $1, slider2text=$2 WHERE dataset = (SELECT currentDataset FROM datasettings)',
    [req.body.slider1text, req.body.slider2text])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated sliders'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function getAllPersons(req, res, next) {
  db.any('select * from view_persons')
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
  var pid = parseInt(req.params.id);
  db.result('delete from persons where pid = $1', pid)
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
  db.any('select DISTINCT team from view_persons')
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
  db.any('select DISTINCT collection from view_persons')
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

function searchDB(req, res, next){
  datamovement=1;
  dataaverage=2;
  searchstring = "";
  intlist = ['evalid', 'person', 'x', 'y', 'slider1', 'slider2', 'dataset'];
  for (key in req.query){
      comparestringstart=" LIKE '";
      comparestringend="'";
      value = req.query[key];
      //Convert compare statement if it is an int
      if ((intlist.indexOf(key) > -1)){
        value = value.toString();
        comparestringstart = " = ";
        comparestringend=""
      }

      //fix ambiguous error for person
      if (key == 'person'){
        key='view_persons.person';
      }
      if (key == 'dataset'){
        key='view_evaluations.dataset';
      }

      //Setup string
      if (searchstring!=""){
        searchstring+=" AND"
      }else{
        searchstring+= "WHERE";
      }
      searchstring += " " + key + comparestringstart + value + comparestringend;
  }
  db.any(selectstringevaluations + fromstringevaluations + searchstring + sortstring + ';')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved person evaluations',
          version: '1.0',
          movement: datamovement,
          average: dataaverage
        });
    })
    .catch(function (err) {
      return next(err);
    });

}
