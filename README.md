# TheHybridSpace - Backend
**By Mathias Hedberg**

## Requirements:
1. Fedora Server
2. PostgreSQL server
3. NodeJS

I have plans to integrate this as a docker container to avoid initialization.

## Installing Postresql:

Install software
```
sudo dnf install postgresql-server postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
sudo postgresql-setup --initdb --unit postgresql

```

Create user
```
sudo su - postgres
$ createuser yourusername
$ createdb owner=youusername yourusername
```

Give CREATEDB permission:
```
sudo su - postgres
$ psql
ALTER USER yourusername CREATEDB;
```

Give access to db by editing /var/lib/pgsql/data/pg_hba.conf:
```
# Database administrative login by Unix domain socket
local   all             all                                     trust

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     trust
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
# IPv6 local connections:
host    all             all             ::1/128                 trust

```

Restart Postrgesql:
```
sudo systemctl restart postgresql
```

## Installing & running:
```
# Install node dependancies
npm install

# Initialize PostgreSQL DB
psql -h localhost -U postgres -f TheHybridSpace.sql

#Start service
npm start
```

## API Calls:
Get all evaluations:
```
curl http://127.0.0.1:3000/api/evaluations
```
Get all evaluations of a person:
```
# Get evaluations for person 3:
curl http://127.0.0.1:3000/api/evaluations/3
```
Get a specific evaluation:
```
# Get data from evaluation 4
curl http://127.0.0.1:3000/api/evaluation/4
```

Add evaluation:
```
# Adding evaluation for person 3
curl --data "person=3&x=22&y=3&slider1=2&slider2=3&comment=test2" \
http://127.0.0.1:3000/api/evaluation
```
Edit evaluation:
```
# Edit data of evaluation 4
curl -X PUT --data "userid=2&x=99&y=77&slider1=10&slider2=20&comment=edited" http://127.0.0.1:3000/api/evaluation/4
```
Delete evaluation:
```
# Deleting evaluation 1
curl -X DELETE http://127.0.0.1:3000/api/evaluation/1
```
