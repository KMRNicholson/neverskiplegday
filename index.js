const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;
const users = require('./users');
const jwt_service = require('./jwt_service');
const bcrypt = require('bcryptjs');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

//Route that defines the root of the api
app.get('/', (req, res) => {
  res.status(200).send({ info: 'Node.js, Express, and Postgres API' })
});

router.get('/users/:id', users.getUserById)
router.put('/users/:id', users.updateUser)
router.delete('/users/:id', users.deleteUser)

router.get('/users', (request, res) => {
  if(jwt_service.decode(request.headers.authorization) == null){
    res.status(401).send("Unauthorized");
  };
})

//Route for registering a user
router.post('/signup', (request, res) => {
  const { email, first_name, last_name } = request.body;
  const password = bcrypt.hashSync(request.body.password);

  users.createUser([email, password, first_name, last_name], (err)=>{
    if(err) return res.status(500).send("Server error! Failed to create user.");
    users.findUserByEmail(email, (err, user)=>{
      if(err) return res.status(500).send('Server error! Failed to find user.');  
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
    if(err) return res.status(500).send('Server error!');
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

//Specified port to run the app on
app.use(router);
const server = app.listen(port, () => {
  console.log('Server listening at http://localhost:'  +  port);
}); 
