# TheHybridSpace - Backend
**By Mathias Hedberg**


## API Calls:

HyybridSpace uses a standard REST API based on express.js on NodeJS

### Search:
The search call is used to get all evaluations 

### Evaluations:

Get all evaluations:
```
curl http://127.0.0.1:3000/api/evaluations

{"status":"success","data":[{"evalid":1,"person":1,"time":"20:06:36.467144","date":"2017-03-01T23:00:00.000Z","x":2,"y":4,"slider1":7,"slider2":null,"comment":"test"},{"evalid":2,"person":3,"time":"20:31:27.304949","date":"2017-03-01T23:00:00.000Z","x":22,"y":3,"slider1":2,"slider2":3,"comment":"test2"}],"message":"Retrieved ALL evaluations"}
```
Get all evaluations of a person:
```
# Get evaluations for person 3:
curl http://127.0.0.1:3000/api/evaluations/person/3

{"status":"success","data":[{"evalid":2,"person":3,"time":"20:31:27.304949","date":"2017-03-01T23:00:00.000Z","x":22,"y":3,"slider1":2,"slider2":3,"comment":"test2"}],"message":"Retrieved person evaluations"}
```
Get all evaluations of a team:  
same as person, different url: http://127.0.0.1:3000/api/evaluations/person/3

Get all evaluations of a collection:  
Same as person, different url: http://127.0.0.1:3000/api/evaluations/person/3

Get a specific evaluation:
```
# Get data from evaluation 2
curl http://127.0.0.1:3000/api/evaluation/2

{"status":"success","data":{"evalid":2,"person":3,"time":"20:31:27.304949","date":"2017-03-01T23:00:00.000Z","x":22,"y":3,"slider1":2,"slider2":3,"comment":"test2"},"message":"Retrieved single evaluation"}
```

Add evaluation:
```
# Adding evaluation for person 3
curl --data "person=3&x=22&y=3&slider1=2&slider2=3&comment=test2&password=mypass" \
http://127.0.0.1:3000/api/evaluation

{"status":"success","message":"Inserted one evaluation"}
```
Edit evaluation:
```
# Edit data of evaluation 4
curl -X PUT --data "person=2&x=99&y=77&slider1=10&slider2=20&comment=edited" http://127.0.0.1:3000/api/evaluation/4

{"status":"success","message":"Updated evaluation"}
```
Delete evaluation:
```
# Deleting evaluation 1
curl -X DELETE http://127.0.0.1:3000/api/evaluation/1

{"status":"success","message":"Removed 1 evaluation"}
```

### Persons
We can modify the people in the database through `/api/persons`. We also have `/api/person/:id` to access a spesific person.

These function similar to the evaluation API calls, so the similar curl statements can be used against these

Here is a brief overview:

Get all persons:
```
$ curl http://127.0.0.1:3000/api/persons
{"status":"success","data":[{"person":1,"team":"Lag 1","collection":"Ving68"}],"message":"Retrieved ALL persons"}
```
Get spesific person, via their ID number:
```
# Getting person 1
$ curl http://127.0.0.1:3000/api/person/1
{"status":"success","data":[{"person":1,"team":"Lag 1","collection":"Ving68"}],"message":"Retrieved ALL persons"}
```
Create an a new person in the database:
```
$ curl --data "person=4&team=ST5&collection=USAF&password=mypass" http://127.0.0.1:3000/api/person
{"status":"success","message":"Inserted one person"}
```

Updating information on an existing person:
```
$ curl -X PUT --data "team=ST6&collection=Marines" http://127.0.0.1:3000/api/person/1
{"status":"success","message":"Updated person"}
```
Delete person:
```
$ curl -X DELETE http://127.0.0.1:3000/api/person/4
{"status":"success","message":"Removed 1 person"}
```
```
router.get('/persons', db.getAllPersons);
router.get('/person/:id', db.getSinglePerson);
router.post('/person', db.createPerson);
router.put('/person/:id', db.updatePerson);
router.delete('/person/:id', db.removePerson);
```
