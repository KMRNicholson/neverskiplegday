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
    workouts.findWorkoutByUserId(user.id, (code, results)=>{
      if(code == 500) return res.status(code).send({ 
        message: "Server error! Failed to create workout."
      });
      res.status(code).send({ workouts: results });
    });
  }
});

router.get('/workout/exercise-log', [
  check('weId', 'We_id required to fetch log.').exists()
], (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    const err = validationResult(request);
    if(!err.isEmpty()){
      return res.status(422).send({ error: err.array() });
    }
    workouts.findWorkoutExerciseLog(request.query.weId, (code, results)=>{
      if(code == 500) return res.status(code).send({ 
        message: "Server error! Failed to create workout."
      });
      res.status(code).send(results);
    });
  }
});

router.post("/day", (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    const {name} = request.body
    days.findDayByName(name, (code, results)=>{
      if(code == 500) return res.status(code).send({ 
        message: "Server error! Failed to find day."
      });
      var day = results[0]
      res.status(code).send(day);
    });
  }
})

router.get('/exercises', (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    exercise.findAllExercises((code, results)=>{
      if(code == 500) return res.status(code).send({ 
        message: "Server error! Failed to get exercises."
      });
      res.status(code).send(results);
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
    workouts.createWorkout({userId:user.id, dayId:day, name:name, desc:description}, (code, results)=>{
      if(code == 500) return res.status(code).send({ 
        
        message: "Server error! Failed to create workout."
      });
      var workoutId = results[0].id
      workouts.createWorkoutExercise(workoutId, exercises, (code, results) => {
        if(code == 500) {
          var result = results[0];
          workouts.deleteWorkoutById(results.w_id, () => {}); 
          return res.status(code).send({
            
            message: "Server error! Failed to create workout exercise."
          });
        }
        return res.status(code).send({ message: "Workout succesfully created!" });
      })
    });
  }
});

//Route for creating a workout exercise
//THIS IS NOT BEING USED ATM.
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
    workouts.findWorkoutExercises(workoutId, (code, results) => {
      if(code == 500) return res.status(code).send({ 
        
        message: "Server error! Failed to find workout."
      });
      if(results.length > 9) return res.status(400).send({ 
        error: "Too many exercises. Maximum of 10 exercises per workout"
      });
      workouts.createWorkoutExercise(workoutId, exercises, (code, results) => {
        if(code == 500) return res.status(code).send({ 
          
          message: "Server error! Failed to create workout exercise."
        });
        res.status(code).send();
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
    workouts.editWorkout(workoutId, name, description, (code, results)=>{
      if(code == 500) return res.status(code).send({ 
        
        message: "Server error! Failed to update workout."
      });
      if(exercises.length>0){
        workouts.createWorkoutExercise(workoutId, exercises, (code, results) => {
          if(code == 500) return res.status(code).send({ 
            
            message: "Server error! Failed to create workout exercise."
          });
          res.status(code).send();
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
      workouts.editWorkoutExercises(workoutId, exercise, (code, results)=>{
        if(code == 500) return res.status(code).send({ 
          
          message: "Server error! Failed to update exercise."
        });
        res.status(code).send();
      });
    }
  }
);

router.put('/workout/exercise-log', [
  check('log', 'Log is too long.').isLength({min:0, max:50}),
  check('weId', 'Workout Exercises id required.').exists()
], (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""));
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    const err = validationResult(request);
    if(!err.isEmpty()){
      return res.status(422).send({ error: err.array() });
    }
    const { log, weId } = request.body;
    workouts.updateLog(weId, log, (code, results)=>{
      if(code == 500) return res.status(code).send({ 
        
        message: "Server error! Failed to update exercise."
      });
      res.status(code).send();
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
    workouts.deleteWorkoutExercises(workoutId, (code, results)=>{
      if(code == 500) return res.status(code).send({ 
        
        message: "Server error! Failed to delete exercises."
      });
      workouts.deleteWorkoutById(workoutId, (code, results)=>{
        if(code == 500) return res.status(code).send({ 
          
          message: "Server error! Failed to delete workout."
        });
        res.status(code).send();
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
    workouts.deleteWorkoutExercise(workoutId, exerciseId, (code, results)=>{
      if(code == 500) return res.status(code).send({ 
        
        message: "Server error! Failed to delete exercises."
      });
      res.status(code).send();
    });
  }
})

module.exports = router;