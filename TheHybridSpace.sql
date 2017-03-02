DROP DATABASE IF EXISTS thehybridspace;
CREATE DATABASE thehybridspace;

\c thehybridspace;

CREATE TABLE evaluations (
  evalID SERIAL PRIMARY KEY,
  Person INTEGER,
  Time TIME DEFAULT NOW(),
  Date DATE DEFAULT NOW(),
  X INTEGER,
  Y INTEGER,
  Slider1 INTEGER,
  Slider2 INTEGER,
  Comment VARCHAR(100)
);

INSERT INTO evaluations (Person, X, Y, Slider1, Comment)
  VALUES (1, 2, 4 , 7, 'test');
