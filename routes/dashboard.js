const router = require('express').Router();
const workouts = require('../entities/workouts');
const jwt_service = require('../utils/jwt_service');
const { check, validationResult } = require('express-validator/check');

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
    workouts.createWorkout([user.id, day, name, description], (err, workoutId)=>{
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to create workout."
      });
      workouts.createWorkoutExercise(workoutId, exercises, (err) => {
        if(err) return res.status(500).send({ 
          error: err.code,
          message: "Server error! Failed to create workout exercise."
        });
        res.status(200).send({ message: "Workout succesfully created!" });
      })
    });
  }
});

//Route for creating a workout exercise
router.post('/workout/exercise', [
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
    workouts.createWorkout([user.id, day, name, description], (err, workoutId)=>{
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to create workout."
      });
      workouts.createWorkoutExercise(workoutId, exercises, (err) => {
        if(err) return res.status(500).send({ 
          error: err.code,
          message: "Server error! Failed to create workout exercise."
        });
        res.status(200).send({ message: "Workout succesfully created!" });
      })
    });
  }
});

//Route for registering a user
router.put('/workout', [
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

    const { workoutId, name, description } = request.body;
    workouts.editWorkout(workoutId, name, description, (err, workoutId)=>{
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to update workout."
      });
      res.status(200).send();
    });
  }
});

//Route for editing a workout exercise
router.put('/workout/exercise', (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    const { workoutId, exercise } = request.body;
    workouts.editWorkoutExercises(workoutId, exercise, (err, workoutId)=>{
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to update exercise."
      });
      res.status(200).send();
    });
  }
});

module.exports = router;