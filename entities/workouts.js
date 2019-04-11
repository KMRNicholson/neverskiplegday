const pool = require('../config/dbconfig').pool;
const entities = require('./entities');
const table = 'workouts'

const createWorkout = (workout, callback) => {
  return pool.query('INSERT INTO workouts (user_id, day_id, name, description) VALUES ($1, $2, $3, $4) RETURNING id', 
    workout, 
    (err, result) => {
      callback(err, result);
    }
  );
}

const createWorkoutExercise = (workoutId, exercises, callback) => {
  var values = ""
  exercises.forEach(function(ex) {
    const exerciseId = ex.id;
    const reps = ex.reps;
    const sets = ex.sets;
    const weight = ex.weight;
    const minutes = ex.minutes;
    values += `(${workoutId}, ${exerciseId}, ${reps}, ${sets}, ${weight}, ${minutes}),`;
  })
  return pool.query(
    "INSERT INTO workout_exercises (workout_id, exercises_id, reps, sets, weight, minutes) VALUES " + values.slice(0,-1),
    (err) => {
      callback(err);
    }
  )
}

const findWorkoutExercises = (workoutId, callback) => {
  return pool.query(
    "SELECT name, reps, sets, minutes, type FROM workout_exercises AS we JOIN exercises ex ON ex.id = we.exercises_id WHERE workout_id = $1", 
    [workoutId], 
    (err, results) => {
      callback(err, results.rows);
    }
  )
}

const findWorkoutByUserId = (userId, callback) => {
  return pool.query(
    "SELECT workout_id, w.name as workout, description, d.name as day, ex.name as exercise, reps, sets, weight, minutes, type  FROM workouts AS w JOIN workout_exercises we ON we.workout_id = w.id JOIN exercises ex ON ex.id = we.exercises_id JOIN day d ON d.id = w.day_id WHERE user_id = $1", 
    [userId], 
    (err, results) => {
      callback(err, results.rows);
    }
  )
}

const findWorkoutById = (id, callback) => {
  return entities.findEntityById(id, table, callback);
}

const editWorkoutExercises = (workoutId, info, callback) => {
  return pool.query(
    'UPDATE workout_exercises SET exercises_id = $5, reps = $1, sets = $2, weight = $3, minutes = $4 WHERE workout_id = $6 AND exercises_id = $7', [ 
      info.reps,
      info.sets,
      info.weight,
      info.minutes,
      info.newId,
      workoutId,
      info.oldId 
    ], (err) => {
      callback(err);
    }
  )
}

const editWorkout = (workoutId, name, description, callback) => {
  return pool.query(
    'UPDATE workouts SET name = $1, description = $2 WHERE workout_id = $3', [ 
      name,
      description,
      workoutId 
    ], (err) => {
      callback(err);
    }
  )
}

const deleteWorkoutExercises = (workoutId, callback) => {
  return pool.query("DELETE FROM workout_exercises WHERE workout_id = $1", [workoutId], (err) =>{
    callback(err);
  })
}

const deleteWorkoutExercise = (workoutId, exerciseId, callback) => {
  return pool.query("DELETE FROM workout_exercises WHERE workout_id = $1 AND exercises_id = $2", [workoutId, exerciseId], (err) =>{
    callback(err);
  })
}

const deleteWorkoutById = (id, callback) => {
  return entities.deleteEntityById(id, table, callback);
}

module.exports = {
  createWorkout,
  createWorkoutExercise,
  findWorkoutExercises,
  findWorkoutByUserId,
  findWorkoutById,
  editWorkoutExercises,
  editWorkout,
  deleteWorkoutExercises,
  deleteWorkoutExercise,
  deleteWorkoutById
}