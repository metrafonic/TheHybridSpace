CREATE DATABASE thehybridspace;

\c thehybridspace;

CREATE TABLE datasets (
  Dataset SERIAL PRIMARY KEY,
  Name VARCHAR(100),
  Slider1Text VARCHAR(100),
  Slider2Text VARCHAR(100),
  openDateTime BIGINT default ((extract(epoch from now()) * 1000))
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
  Time timestamp default (now()),
  X INTEGER,
  Y INTEGER,
  Slider1 INTEGER,
  Slider1Text VARCHAR(100),
  Slider2 INTEGER,
  Slider2Text VARCHAR(100),
  Travel DECIMAL,
  Comment VARCHAR(100)
);

CREATE TABLE datasettings (
  revision INTEGER PRIMARY KEY,
  currentDataset INTEGER
);

CREATE VIEW currentsettings AS
SELECT *, ((extract(epoch from now()) * 1000)) AS currenttime
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

CREATE OR REPLACE FUNCTION trg_travel()
  RETURNS trigger AS
$func$
DECLARE 
xtrav int;
ytrav int;
BEGIN
xtrav := (@((SELECT x FROM evaluations WHERE pid = NEW.pid ORDER BY evalid DESC LIMIT 1 ) - NEW.x))^2;
ytrav := (@((SELECT y FROM evaluations WHERE pid = NEW.pid ORDER BY evalid DESC LIMIT 1 ) - NEW.y))^2;
NEW.travel := round(|/ (xtrav + ytrav));
RETURN NEW;
END
$func$ LANGUAGE plpgsql;

CREATE TRIGGER set_travel
BEFORE INSERT ON evaluations
FOR EACH ROW
WHEN (NEW.travel IS NULL)
EXECUTE PROCEDURE trg_travel();

CREATE VIEW view_persons AS
SELECT persons.pid, persons.person, team, collection, password, count(evalid) AS evaluations, sum(travel) AS travel
FROM persons LEFT OUTER JOIN evaluations ON (persons.pid=evaluations.pid)
WHERE persons.dataset =
(
  SELECT currentDataset
  FROM datasettings
)
GROUP BY persons.pid;

CREATE VIEW view_evaluations AS
SELECT *
FROM evaluations
WHERE dataset =
(
  SELECT currentDataset
  FROM datasettings
);

CREATE VIEW view_teams AS
SELECT team, collection, count(person) AS members, sum(evaluations) AS evaluatons, sum(travel) AS travel
FROM view_persons GROUP BY collection,team;

INSERT INTO datasets(name, slider1text, slider2text)
  VALUES ('Default', 'control', 'motivation');

INSERT INTO datasettings(revision, currentDataset)
  VALUES (1,1);

INSERT INTO persons(Person, Password, Team, Collection)
  VALUES (1, 'heihei','Lag 1', 'Ving68');

INSERT INTO evaluations (Person, X, Y, Slider1, Comment, travel)
  VALUES (1, 2, 4 , 7, 'test', 0);
