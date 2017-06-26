DROP DATABASE IF EXISTS thehybridspace;
CREATE DATABASE thehybridspace;

\c thehybridspace;

CREATE TABLE persons (
  Person INTEGER PRIMARY KEY,
  Team VARCHAR(10),
  Collection VARCHAR(10),
  Password VARCHAR(20) NOT NULL
);

CREATE TABLE evaluations (
  evalID SERIAL PRIMARY KEY,
  Person INTEGER REFERENCES persons,
  Time timestamp default (now() at time zone 'utc'),
  X INTEGER,
  Y INTEGER,
  Slider1 INTEGER,
  Slider2 INTEGER,
  Comment VARCHAR(100)
);



INSERT INTO persons(Person, Password, Team, Collection)
  VALUES (1, 'heihei','Lag 1', 'Ving68');

INSERT INTO evaluations (Person, X, Y, Slider1, Comment)
  VALUES (1, 2, 4 , 7, 'test');
