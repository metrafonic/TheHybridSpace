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
  quad INTEGER,
  Slider1 INTEGER,
  Slider1Text VARCHAR(100),
  Slider2 INTEGER,
  Slider2Text VARCHAR(100),
  quadchange BOOLEAN,
  xtravel INTEGER,
  ytravel INTEGER,
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
quad int;
BEGIN
xtrav := (@((SELECT x FROM evaluations WHERE pid = NEW.pid ORDER BY evalid DESC LIMIT 1 ) - NEW.x));
ytrav := (@((SELECT y FROM evaluations WHERE pid = NEW.pid ORDER BY evalid DESC LIMIT 1 ) - NEW.y));
NEW.xtravel := xtrav;
NEW.ytravel := ytrav;
NEW.travel := round(|/ ((xtrav^2) + (ytrav^2)));
RETURN NEW;
END
$func$ LANGUAGE plpgsql;

CREATE TRIGGER set_travel
BEFORE INSERT ON evaluations
FOR EACH ROW
WHEN (NEW.travel IS NULL)
EXECUTE PROCEDURE trg_travel();







CREATE OR REPLACE FUNCTION trg_quad()
  RETURNS trigger AS
$func$
BEGIN
IF NEW.x > 0 THEN
    IF NEW.y > 0 THEN
        NEW.quad := 2;
    ELSE
        NEW.quad := 4;
    END IF;
ELSE
    IF NEW.y > 0 THEN
        NEW.quad := 1;
    ELSE
        NEW.quad := 3;
    END IF;
END IF;
RETURN NEW;
END
$func$ LANGUAGE plpgsql;

CREATE TRIGGER set_quad
BEFORE INSERT ON evaluations
FOR EACH ROW
WHEN (NEW.quad IS NULL)
EXECUTE PROCEDURE trg_quad();




CREATE OR REPLACE FUNCTION trg_quadchange()
  RETURNS trigger AS
$func$
DECLARE
oldquad int;
BEGIN
oldquad := (SELECT quad FROM evaluations WHERE pid = NEW.pid ORDER BY evalid DESC LIMIT 1 );
IF NEW.quad = oldquad THEN
    NEW.quadchange := FALSE;
ELSE
    NEW.quadchange := TRUE;
END IF;
RETURN NEW;
END
$func$ LANGUAGE plpgsql;

CREATE TRIGGER set_quadchange
BEFORE INSERT ON evaluations
FOR EACH ROW
WHEN (NEW.quadchange IS NULL)
EXECUTE PROCEDURE trg_quadchange();










CREATE VIEW view_persons AS
SELECT persons.pid, persons.person, team, collection, password, count(evalid) AS evaluations, COUNT(NULLIF( quadchange, FALSE)) as quadchanges, sum(xtravel) AS xtravel, sum(ytravel) AS ytravel, sum(travel) AS travel
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
SELECT team, collection, count(person) AS members, sum(evaluations) AS evaluations, sum(quadchanges) as quadchanges, sum(xtravel) AS xtravel, sum(ytravel) AS ytravel, sum(travel) AS travel
FROM view_persons GROUP BY collection,team;

INSERT INTO datasets(name, slider1text, slider2text)
  VALUES ('Default', 'control', 'motivation');

INSERT INTO datasettings(revision, currentDataset)
  VALUES (1,1);

INSERT INTO persons(Person, Password, Team, Collection)
  VALUES (1, 'heihei','Lag 1', 'Ving68');

INSERT INTO evaluations (Person, X, Y, Slider1, Comment, travel)
  VALUES (1, 2, 4 , 7, 'test', 0);
insert into evaluations (person,x,y) VALUES (1,-5,-5);
insert into evaluations (person,x,y) VALUES (1,-5,5);
insert into evaluations (person,x,y) VALUES (1,5,5);
insert into evaluations (person,x,y) VALUES (1,-5,-5);
insert into evaluations (person,x,y) VALUES (1,-5,-5);
