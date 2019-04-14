const router = require('express').Router();
const workouts = require('../entities/workouts');
const exercise = require('../entities/exercises');
const days = require('../entities/days');
const jwt_service = require('../utils/jwt_service');
const { check, validationResult } = require('express-validator/check');

//Gets the workouts associated to the user
router.get('/workouts', (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    workouts.findWorkoutByUserId(user.id, (err, results)=>{
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to create workout."
      });
      res.status(200).send({ workouts: results });
    });
  }
});

router.post("/day", (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    const {name} = request.body
    days.findDayByName(name, (err, results)=>{
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to find day."
      });
      res.status(200).send(results);
    });
  }
})

router.get('/exercises', (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    exercise.findAllExercises((err, results)=>{
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to get exercises."
      });
      res.status(200).send(results);
    });
  }
});

//Route for creating a workout
router.post('/workout', [
  check('name', 'Invalid name.').isLength({min:1, max:30}),
  check('description', 'Description is too long.').isLength({max:255}),
  check('exercises', 'No exercises were provided.').exists(),
  check('day', 'Day was not chosen').exists()
], (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    const err = validationResult(request);
    if(!err.isEmpty()){
      return res.status(422).send({ error: err.array() });
    }
    const { name, description, exercises, day } = request.body;
    if(exercises.length > 15){
      return res.status(422).send({error:"Too many exercises. Maximum of 15 exercises per workout."})
    }
    workouts.createWorkout([user.id, day, name, description], (err, results)=>{
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to create workout."
      });
      workouts.createWorkoutExercise(results.rows[0].id, exercises, (err, result) => {
        if(err) {
          workouts.deleteWorkoutById(result.w_id, () => {}); 
          return res.status(500).send({
            error: err.code,
            message: "Server error! Failed to create workout exercise."
          });
        }
        return res.status(200).send({ message: "Workout succesfully created!" });
      })
    });
  }
});

//Route for creating a workout exercise
router.post('/workout/exercise', [
  check('exercises', 'Exercise required.').exists(),
  check('workoutId', 'Workout id required.').exists()
], (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    const err = validationResult(request);
    if(!err.isEmpty()){
      return res.status(422).send({ error: err.array() });
    }

    const { workoutId, exercises } = request.body;
    workouts.findWorkoutExercises(workoutId, (err, results) => {
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to find workout."
      });
      if(results.length > 14) return res.status(422).send({ 
        error: "Too many exercises. Maximum of 15 exercises per workout"
      });
      workouts.createWorkoutExercise(workoutId, exercises, (err) => {
        if(err) return res.status(500).send({ 
          error: err.code,
          message: "Server error! Failed to create workout exercise."
        });
        res.status(200).send();
      });
    })
  }
});

//Route for updating a workout.
router.put('/workout', [
  check('workoutId', 'No workout id was provided.').exists(),
  check('name', 'Invalid name.').isLength({min:1, max:30}),
  check('description', 'Description is too long.').isLength({max:255}),
], (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    const err = validationResult(request);
    if(!err.isEmpty()){
      return res.status(422).send({ error: err.array() });
    }

    const { workoutId, name, description, exercises } = request.body;
    workouts.editWorkout(workoutId, name, description, (err)=>{
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to update workout."
      });
      if(exercises.length>0){
        workouts.createWorkoutExercise(workoutId, exercises, (err) => {
          if(err) return res.status(500).send({ 
            error: err.code,
            message: "Server error! Failed to create workout exercise."
          });
          res.status(200).send();
        });
      }
    });
  }
});

//Route for editing a workout exercise
router.put('/workout/exercise', [
    check('exercise', 'No exercise was provided.').exists(), 
    check('workoutId', 'No workout id was provided.').exists()
  ], (request, res) => {
    const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
    if(!user){
      res.status(401).send("Unauthorized");
    }else{
      const err = validationResult(request);
      if(!err.isEmpty()){
        return res.status(422).send({ error: err.array() });
      }
      const { workoutId, exercise } = request.body;
      workouts.editWorkoutExercises(workoutId, exercise, (err)=>{
        if(err) return res.status(500).send({ 
          error: err.code,
          message: "Server error! Failed to update exercise."
        });
        res.status(200).send();
      });
    }
  }
);

//Deletes a workout and the associated exercises
router.delete('/workout', [
  check('workoutId', 'Workout id required.').exists()
], (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    const err = validationResult(request);
    if(!err.isEmpty()){
      return res.status(422).send({ error: err.array() });
    }
    const { workoutId } = request.body;
    workouts.deleteWorkoutExercises(workoutId, (err)=>{
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to delete exercises."
      });
      workouts.deleteWorkoutById(workoutId, (err)=>{
        if(err) return res.status(500).send({ 
          error: err.code,
          message: "Server error! Failed to delete workout."
        });
        res.status(200).send();
      })
    });
  }
})

//Deletes an exercise from a workout
router.delete('/workout/exercise', [
  check('workoutId', 'Workout id required.').exists(),
  check('exerciseId', 'Exercise id required.').exists()
], (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    const err = validationResult(request);
    if(!err.isEmpty()){
      return res.status(422).send({ error: err.array() });
    }
    const { workoutId, exerciseId } = request.body;
    workouts.deleteWorkoutExercise(workoutId, exerciseId, (err)=>{
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to delete exercises."
      });
      res.status(200).send();
    });
  }
})

module.exports = router;