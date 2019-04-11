import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import Signin from './authentication/signin';
import Signup from './authentication/signup';
import Dash from './dash/dash';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
    <div>
        <Route exact path="/" component={Dash} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
    </div>
  </Router>, document.getElementById('root'));
serviceWorker.register();
