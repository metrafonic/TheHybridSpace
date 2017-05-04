DROP DATABASE IF EXISTS thehybridspace;
CREATE DATABASE thehybridspace;

\c thehybridspace;

CREATE TABLE datasets (
  Dataset SERIAL PRIMARY KEY,
  Name VARCHAR(100),
  Slider1Text VARCHAR(100),
  Slider2Text VARCHAR(100)
);

CREATE TABLE persons (
  PID SERIAL PRIMARY KEY,
  Dataset INTEGER REFERENCES datasets(Dataset),
  Person INTEGER,
  Team VARCHAR(10),
  Collection VARCHAR(10),
  Password VARCHAR(20) NOT NULL
);

CREATE TABLE evaluations (
  Dataset INTEGER REFERENCES datasets,
  evalID SERIAL PRIMARY KEY,
  Person INTEGER,
  PID INTEGER REFERENCES persons,
  Time timestamp default (now() at time zone 'utc'),
  X INTEGER,
  Y INTEGER,
  Slider1 INTEGER,
  Slider1Text VARCHAR(100),
  Slider2 INTEGER,
  Slider2Text VARCHAR(100),
  Comment VARCHAR(100)
);

CREATE TABLE datasettings (
  revision INTEGER PRIMARY KEY,
  currentDataset INTEGER
);

CREATE VIEW currentsettings AS
SELECT *
FROM datasets
WHERE dataset =
(
  SELECT currentDataset
  FROM datasettings
);


CREATE OR REPLACE FUNCTION trg_dataset()
  RETURNS trigger AS
$func$
BEGIN
NEW.dataset := (SELECT currentDataset FROM datasettings);
RETURN NEW;
END
$func$ LANGUAGE plpgsql;


CREATE TRIGGER def_dataset_eval
BEFORE INSERT ON evaluations
FOR EACH ROW
WHEN (NEW.dataset IS NULL)
EXECUTE PROCEDURE trg_dataset();

CREATE TRIGGER def_dataset_pers
BEFORE INSERT ON persons
FOR EACH ROW
WHEN (NEW.dataset IS NULL)
EXECUTE PROCEDURE trg_dataset();

CREATE OR REPLACE FUNCTION trg_pid()
  RETURNS trigger AS
$func$
BEGIN
NEW.pid :=
(
  SELECT pid
  FROM persons
  WHERE persons.person = NEW.person
  AND dataset =
  (
    SELECT currentDataset
    FROM datasettings
  )
);

RETURN NEW;
END
$func$ LANGUAGE plpgsql;

CREATE TRIGGER def_pid_eval
BEFORE INSERT ON evaluations
FOR EACH ROW
WHEN (NEW.pid IS NULL)
EXECUTE PROCEDURE trg_pid();

CREATE OR REPLACE FUNCTION trg_slider()
  RETURNS trigger AS
$func$
BEGIN
NEW.slider1text := (SELECT slider1text FROM currentsettings);
NEW.slider2text := (SELECT slider2text FROM currentsettings);
RETURN NEW;
END
$func$ LANGUAGE plpgsql;

CREATE TRIGGER def_dataset_slider
BEFORE INSERT ON evaluations
FOR EACH ROW
WHEN (NEW.slider1text IS NULL)
EXECUTE PROCEDURE trg_slider();


CREATE VIEW view_persons AS
SELECT pid, person, team, collection, password
FROM persons
WHERE dataset =
(
  SELECT currentDataset
  FROM datasettings
);

CREATE VIEW view_evaluations AS
SELECT *
FROM evaluations
WHERE dataset =
(
  SELECT currentDataset
  FROM datasettings
);

INSERT INTO datasets(name, slider1text, slider2text)
  VALUES ('Default', 'control', 'motivation');

INSERT INTO datasettings(revision, currentDataset)
  VALUES (1,1);

INSERT INTO persons(Person, Password, Team, Collection)
  VALUES (1, 'heihei','Lag 1', 'Ving68');

INSERT INTO evaluations (Person, X, Y, Slider1, Comment)
  VALUES (1, 2, 4 , 7, 'test');
