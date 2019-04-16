const entities = require('./entities');
const db = require('../config/dbconfig');
const table = 'workouts'

const createWorkout = (workout, callback) => {
  db.query(`
    INSERT INTO workouts (users_id, days_id, name, description) 
    VALUES (${workout.userId}, ${workout.dayId}, '${workout.name}', '${workout.desc}') 
    RETURNING id;`, 
    callback
  );
}

const createWorkoutExercise = (workoutId, exercises, callback) => {
  var values = ""
  exercises.forEach(ex => {
    const exerciseId = ex.id;
    const reps = ex.reps;
    const sets = ex.sets;
    const weight = ex.weight;
    const minutes = ex.minutes;
    values += `(${workoutId}, ${exerciseId}, ${reps}, ${sets}, ${weight}, ${minutes}, ''),`;
  })
  db.query(`
    INSERT INTO workout_exercises (workouts_id, exercises_id, reps, sets, weight, minutes, log) 
    VALUES ${values.slice(0,-1)} 
    RETURNING ${workoutId} AS w_id;`,
    callback
  )
}

const findWorkoutExercises = (workoutId, callback) => {
  db.query(`
    SELECT name, reps, sets, minutes, type 
    FROM workout_exercises AS we 
      JOIN exercises ex ON ex.id = we.exercises_id 
    WHERE workouts_id = ${workoutId};`,
    callback
  )
}

const findWorkoutExerciseLog = (weId, callback) => {
  db.query(`
    SELECT log 
    FROM workout_exercises
    WHERE id = ${weId};`,
    callback
  )
}

const findWorkoutByUserId = (userId, callback) => {
  db.query(`
    SELECT w.id AS workout_id, 
      w.name AS workout, 
      description, 
      d.name AS day, 
      we.id AS we_id, 
      ex.id AS exercise_id, 
      ex.name AS exercise, 
      reps, sets, weight, minutes, type, log  
    FROM workouts AS w 
      JOIN days d ON d.id = w.days_id 
      LEFT JOIN workout_exercises we ON we.workouts_id = w.id 
      LEFT OUTER JOIN exercises ex ON ex.id = we.exercises_id 
    WHERE users_id = ${userId};`,  
    callback
  )
}

const findWorkoutById = (id, callback) => {
  return entities.findEntityById(id, table, callback);
}

const editWorkoutExercises = (workoutId, exercise, callback) => {
  db.query(`
    UPDATE workout_exercises 
    SET exercises_id = ${exercise.newId}, 
      reps = ${exercise.reps}, 
      sets = ${exercise.sets}, 
      weight = ${exercise.weight}, 
      minutes = ${exercise.minutes} 
    WHERE workouts_id = ${workoutId} 
      AND exercises_id = ${exercise.oldId};`,
      callback
  )
}

const editWorkout = (workoutId, name, description, callback) => {
  db.query(`
    UPDATE workouts 
    SET name = '${name}', description = '${description}' 
    WHERE id = ${workoutId};`,
    callback
  )
}

const updateLog = (weId, log, callback) => {
  db.query(`
    UPDATE workout_exercises 
    SET log = '${log}'
    WHERE id = ${weId};`, 
    callback
  )
}

const deleteWorkoutExercises = (workoutId, callback) => {
  db.query(`
    DELETE FROM workout_exercises 
    WHERE workouts_id = ${workoutId};`,
    callback
  );
}

const deleteWorkoutExercise = (workoutId, exerciseId, callback) => {
  db.query(`
    DELETE FROM workout_exercises 
    WHERE workouts_id = ${workoutId} 
      AND exercises_id = ${exerciseId};`,
    callback 
  )
}

const deleteWorkoutById = (id, callback) => {
  return entities.deleteEntityById(id, table, callback);
}

module.exports = {
  createWorkout,
  createWorkoutExercise,
  findWorkoutExerciseLog,
  findWorkoutExercises,
  findWorkoutByUserId,
  findWorkoutById,
  editWorkoutExercises,
  editWorkout,
  updateLog,
  deleteWorkoutExercises,
  deleteWorkoutExercise,
  deleteWorkoutById
}