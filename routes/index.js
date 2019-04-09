const router = require('express').Router();
const users = require('../entities/users');
const jwt_service = require('../utils/jwt_service');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

router.get('/user', (request, res) => {
  const user = jwt_service.verify(request.headers.authorization.replace("Bearer ", ""), request.headers);
  if(!user){
    res.status(401).send("Unauthorized");
  }else{
    users.findUserById(user.id, (err, user) =>{
      if(err) return res.status(500).send("Server error! Failed to find user.");
      if(!user) return res.status(404).send("User not found.");
      res.status(200).send({"user": user});
    })
  }
})

//Route for registering a user
router.post('/signup', [
  check('email', 'Invalid email.').isEmail(),
  check('password', 'Password must be alphanumeric, and 6 characters long.').matches(/^(?=.*\d)(?=.*[0-9])[0-9a-zA-Z]{6,}$/, "i"),
  check('first_name', 'Invalid first name.').isLength({min:1, max:30}),
  check('last_name', 'Invalid last name.').isLength({min:1, max:30})
], (request, res) => {
  const err = validationResult(request);
  if(!err.isEmpty()){
    return res.status(422).send({ error: err.array() });
  }
  const { email, first_name, last_name } = request.body;
  const password = bcrypt.hashSync(request.body.password);

  users.createUser([email.toLowerCase(), password, first_name, last_name], (err)=>{
    if(err) return res.status(500).send({ 
      error: err.code,
      message: "Server error! Failed to create user."
    });
    users.findUserByEmail(email, (err, user)=>{
      if(err) return res.status(500).send({ 
        error: err.code,
        message: "Server error! Failed to find user."
      });  
      user.password = '';
      const expiresIn = 24 * 60 * 60;
      const accessToken = jwt_service.sign({ id: user.id }, {
        expiresIn: expiresIn
      });
      res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn });
    });
  });
});

//Route for signing in
router.post('/signin', (request, res) => {
  const email = request.body.email;
  const password = request.body.password;

  users.findUserByEmail(email, (err, user)=>{
    if(err) return res.status(500).send({ 
      error: err.code,
      message: "Server error! Failed to find user."
    });
    if(!user) return res.status(401).send('Email/Password are invalid!');
    const result = bcrypt.compareSync(password, user.password);
    if(!result) return res.status(401).send('Email/Password are invalid!');
    const expiresIn = 24 * 60 * 60;
    const accessToken = jwt_service.sign({ id: user.id }, {
      expiresIn: expiresIn
    });
    res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn});
  });
});

module.exports = router;