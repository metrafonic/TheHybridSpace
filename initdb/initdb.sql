DROP DATABASE IF EXISTS thehybridspace;
CREATE DATABASE thehybridspace;

\c thehybridspace;

CREATE TABLE persons (
  Person INTEGER PRIMARY KEY,
  Team VARCHAR(10),
  Collection VARCHAR(10)
);

CREATE TABLE evaluations (
  evalID SERIAL PRIMARY KEY,
  Person INTEGER REFERENCES persons,
  Time NUMERIC(20) default (extract(epoch from now()) * 1000),
  Date varchar(8) default to_char(CURRENT_DATE, 'yyyymmdd'),
  X INTEGER,
  Y INTEGER,
  Slider1 INTEGER,
  Slider2 INTEGER,
  Comment VARCHAR(100)
);



INSERT INTO persons(Person, Team, Collection)
  VALUES (1, 'Lag 1', 'Ving68');

INSERT INTO evaluations (Person, X, Y, Slider1, Comment)
  VALUES (1, 2, 4 , 7, 'test');
