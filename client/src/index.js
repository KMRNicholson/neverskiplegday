import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import Signin from './authentication/signin';
import Signup from './authentication/signup';
import Dash from './dash/dash';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});

ReactDOM.render(
  <Router>
    <MuiThemeProvider theme={theme}>
      <div className="app">
          <Route exact path="/" component={Dash} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/signup" component={Signup} />
      </div>
    </MuiThemeProvider>
  </Router>, document.getElementById('root'));
serviceWorker.register();
