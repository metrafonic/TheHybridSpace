var json2csv = require('json2csv');
var myCars = [{
    "car": "Audi",
    "price": 40000,
    "color": "blue"
}, {
    "car": "BMW",
    "price": 35000,
    "color": "black"
}, {
    "car": "Porsche",
    "price": 60000,
    "color": "green",
    "swag": "yo"
}];


module.exports = {
    downloadCSV: downloadCSV
}



function downloadCSV(req, res, next) {

    var request = require("request");
    request({
        url: "http://127.0.0.1:3000/api/search",
        method: "GET",
        qs: req.query
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var importedJSON = JSON.parse(body);
            sendCSV(req, res, next, importedJSON.data);
            console.log(req.query);
        }else{
          res.send({
              status: 'error',
              data: 'failed',
              message: 'failed'
          });
        }
    });
}

function sendCSV(req, res, next, jsondata) {
    try {
        var result = json2csv({
            data: jsondata
        });
        res.set('Content-disposition', 'attachment; filename=data.csv');
        res.set('Content-Type', 'text/csv');
        res.send(result);
    } catch (err) {
        // Errors are thrown for bad options, or if the data is empty and no fields are provided.
        // Be sure to provide fields if it is possible that your data array will be empty.
        res.send({
            status: 'success',
            data: err,
            message: 'Retrieved all teams'
        });
    }

}
