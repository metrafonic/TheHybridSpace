# Installing:

There are two ways to install the service, through docker, or barebones on the server.

For the docker version see [DOCKER.md](DOCKER.md)

## Requirements:
This has only been tested on Fedora 25/26, other OS's will work, but may require some fine tuning to the instructions.

1. Fedora 25
2. PostgreSQL server
3. NodeJS


## Installing Postresql database server:

Install software
```
sudo dnf install postgresql-server postgresql-contrib
sudo postgresql-setup --initdb --unit postgresql
sudo systemctl enable postgresql
sudo systemctl start postgresql

```

Create user
```
sudo su - postgres
bash-4.3$ createuser yourusername
bash-4.3$ psql
postgres=# ALTER USER yourusername CREATEDB;
postgres=# \q
exit
createdb
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
psql -f initdb/initdb.sql

#Start service
npm start
```

You can now acces the webui via:  
http://127.0.0.1:3000/  
admin panel:  
http://127.0.0.1:3000/admin
