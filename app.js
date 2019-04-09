// Bring in our dependencies
const app = require('express')();
const index = require('./routes/index');
const dashboard = require('./routes/dashboard');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//  Connect all our routes to our application
app.use('/', index);
app.use('/dashboard/', dashboard);

// Turn on that server!
app.listen(port, () => {
  console.log('Server listening at http://localhost:'  +  port);
}); 