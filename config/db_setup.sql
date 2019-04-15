DROP TABLE IF EXISTS workout_exercises;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS days;

CREATE TABLE users(
  id serial primary key,
  email varchar(30) not null,
  password varchar(100) not null,
  first_name varchar(30) not null,
  last_name varchar(30) not null,
  weight int,
  UNIQUE(email));
  
CREATE TABLE days(
  id serial primary key,
  name varchar(10),
  UNIQUE(name));
  
CREATE TABLE exercises(
  id serial primary key,
  name varchar(30),
  type integer,
  UNIQUE(name));
  
CREATE TABLE workouts(
  id serial primary key,
  users_id integer not null references users(id),
  days_id integer not null references days(id),
  name varchar(30) not null,
  description varchar(255),
  UNIQUE(users_id, days_id));
  
CREATE TABLE workout_exercises(
  id serial primary key,
  workouts_id integer not null references workouts(id),
  exercises_id integer not null references exercises(id),
  reps integer,
  sets integer,
  weight integer,
  minutes integer,
  log varchar(50));
  
INSERT INTO days(name) 
VALUES ('Sunday'),
  ('Monday'),
  ('Tuesday'),
  ('Wednesday'),
  ('Thursday'),
  ('Friday'),
  ('Saturday');
  
INSERT INTO exercises(name, type)
VALUES ('Barbell Bench Press', 0),
  ('Overhead Press', 0),
  ('Dumbell Shoulder Press', 0),
  ('Dumbell Bench Press', 0),
  ('Incline Barbell Bench Press', 0),
  ('Decline Barbell Bench Press', 0),
  ('Decline Dumbell Bench Press', 0),
  ('Dips', 0),
  ('Deadlift', 0),
  ('Pull-ups', 0),
  ('Chin-ups', 0),
  ('Pendlay Row', 0),
  ('Seated Cable Row', 0),
  ('Lawnmowers', 0),
  ('Yates Row', 0),
  ('Lat Pulldown', 0),
  ('Face Pull', 0),
  ('Reverse Pec-Dec', 0),
  ('Pec-Dec', 0),
  ('Dumbell Fly', 0),
  ('Incline Dumbell Fly', 0),
  ('Squat', 0),
  ('Front Squat', 0),
  ('Goblet Squat', 0),
  ('Bulgarian Split Squat', 0),
  ('Dumbell Lunges', 0),
  ('Leg Press', 0),
  ('Tricep Rope Pulldown', 0),
  ('Skullcrusher', 0),
  ('EZ Bar Curl', 0),
  ('Barbell Curl', 0),
  ('Dumbell Curl', 0),
  ('Glute Ham Raise', 0),
  ('Lying Leg Curl', 0),
  ('Leg Extension', 0),
  ('Box Jumps', 0),
  ('Standing Calf Raises', 0),
  ('Seated Calf Raises', 0),
  ('Jog', 1),
  ('Run', 1),
  ('Sprint', 1),
  ('Biking', 1),
  ('Burpees', 1),
  ('Walk', 1);