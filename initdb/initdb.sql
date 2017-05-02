DROP DATABASE IF EXISTS thehybridspace;
CREATE DATABASE thehybridspace;

\c thehybridspace;

CREATE TABLE datasets (
  Dataset SERIAL PRIMARY KEY,
  Name VARCHAR(100)
);

CREATE TABLE persons (
  Dataset INTEGER REFERENCES datasets,
  Person INTEGER PRIMARY KEY,
  Team VARCHAR(10),
  Collection VARCHAR(10),
  Password VARCHAR(20) NOT NULL
);

CREATE TABLE evaluations (
  Dataset INTEGER REFERENCES datasets,
  evalID SERIAL PRIMARY KEY,
  Person INTEGER REFERENCES persons,
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
  currentDataset INTEGER,
  currentSlider1Text VARCHAR(100),
  currentSlider2Text VARCHAR(100)
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

CREATE OR REPLACE FUNCTION trg_slider()
  RETURNS trigger AS
$func$
BEGIN
NEW.slider1text := (SELECT currentslider1text FROM datasettings);
NEW.slider2text := (SELECT currentslider2text FROM datasettings);
RETURN NEW;
END
$func$ LANGUAGE plpgsql;

CREATE TRIGGER def_dataset_slider
BEFORE INSERT ON evaluations
FOR EACH ROW
WHEN (NEW.slider1text IS NULL)
EXECUTE PROCEDURE trg_slider();


CREATE VIEW view_persons AS
SELECT *
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

INSERT INTO datasets(name)
  VALUES ('Default');

INSERT INTO datasettings(revision, currentDataset, "currentslider1text", "currentslider2text")
  VALUES (1,1, 'Control', 'Effort');

INSERT INTO persons(Person, Password, Team, Collection)
  VALUES (1, 'heihei','Lag 1', 'Ving68');

INSERT INTO evaluations (Person, X, Y, Slider1, Comment)
  VALUES (1, 2, 4 , 7, 'test');
