const router = require('express').Router();
const users = require('../entities/users');
const days = require('../entities/days');
const jwt_service = require('../utils/jwt_service');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

router.get('/db', (request, res)=>{
  days.findAllDays((code, results)=>{
    res.status(code).send(results);
  });
})

router.get('/dashboard/user', (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""), request.headers);
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    users.findUserById(user.id, (code, results) =>{
      if(code == 500) return res.status(code).send("Server error! Failed to find user.");
      var user = results[0]
      if(!user) return res.status(404).send("User not found.");
      user.password = '';
      res.status(code).send(user);
    })
  }
})

//Route for registering a user
router.post('/signup', [
  check('email', 'Invalid email.').isEmail(),
  check('password', 'Password must be alphanumeric, and 6 characters long.').matches(/^(?=.*\d)(?=.*[0-9])[0-9a-zA-Z]{6,}$/, "i"),
  check('firstName', 'Invalid first name.').isLength({min:1, max:30}),
  check('lastName', 'Invalid last name.').isLength({min:1, max:30})
], (request, res) => {
  const err = validationResult(request);
  if(!err.isEmpty()){
    return res.status(422).send({ error: err.array() });
  }

  const { email, firstName, lastName } = request.body;
  const password = bcrypt.hashSync(request.body.password);

  users.createUser({email:email.toLowerCase(), pass:password, firstname:firstName, lastname:lastName}, (code, err)=>{
    if(code == 500) return res.status(code).send({ 
      
      message: "Server error! Failed to create user."
    });
    users.findUserByEmail(email, (code, results)=>{
      if(code == 500) return res.status(code).send({ 
        
        message: "Server error! Failed to find user."
      });
      var user = results[0];
      user.password = '';
      const expiresIn = 24 * 60 * 60;
      const accessToken = jwt_service.sign({ id: user.id }, {
        expiresIn: expiresIn
      });
      res.status(code).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn });
    });
  });
});

//Route for signing in
router.post('/signin',[
  check('email', 'Invalid email.').isEmail(),
  check('password', 'Password must be alphanumeric, and 6 characters long.').matches(/^(?=.*\d)(?=.*[0-9])[0-9a-zA-Z]{6,}$/, "i"),
], (request, res) => {
  const err = validationResult(request);
  console.log(request.body)
  if(!err.isEmpty()){
    return res.status(422).send({ error: err.array() });
  }

  const email = request.body.email;
  const password = request.body.password;

  users.findUserByEmail(email, (code, results)=>{
    if(code == 500) return res.status(code).send({ 
      
      message: "Server error! Failed to find user."
    });
    var user = results[0];
    if(!user) return res.status(401).send('Email/Password are invalid!');
    const result = bcrypt.compareSync(password, user.password);
    if(!result) return res.status(401).send('Email/Password are invalid!');
    const expiresIn = 24 * 60 * 60;
    const accessToken = jwt_service.sign({ id: user.id }, {
      expiresIn: expiresIn
    });
    res.status(code).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn});
  });
});

router.put('/dashboard/user',[
  check('email', 'Invalid email.').isEmail(),
  check('firstname', 'Invalid first name.').isLength({min:1, max:30}),
  check('lastname', 'Invalid last name.').isLength({min:1, max:30}),
  check('weight', 'Invalid weight').isLength({min:0, max:10})], 
(request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""), request.headers);
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    const err = validationResult(request);
    if(!err.isEmpty()){ 
      return res.status(422).send({ error: err.array() });
    }
    const { email, firstname, lastname, weight } = request.body;
    users.updateUserById({id:user.id, email:email.toLowerCase(), firstname:firstname, lastname:lastname, weight:weight}, (code, results) =>{
      if(code) return res.status(code).send("Server error! Failed to update user.");
      var user = results[0];
      if(!user) return res.status(404).send("User not found.");
      res.status(code).send(user);
    })
  }
})

module.exports = router;