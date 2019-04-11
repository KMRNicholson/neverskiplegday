import React, { Component } from "react";
import AuthHelperMethods from "../helpers/AuthHelperMethods";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

class signin extends Component {
  /* In order to utilize our authentication methods within the AuthService class, we want to instantiate a new object */
  constructor() {
    super();
    this.state = {
      email: "",
      password: ""
    };
    this.auth = new AuthHelperMethods();
  }

  /* Fired off every time the use enters something into the input fields */
  _handleChange = name => event => {
    console.log(event.target)
    this.setState({
      [name]: event.target.value
    });
  }

  _handleFormSubmit() {
    this.auth
      .login(this.state.email, this.state.password)
      .then(res => {
        if (res === false) {
          return alert("Sorry those credentials don't exist!");
        }
        this.props.history.replace("/");
      })
      .catch(err => {
        alert(err);
      });
  }

  render() {
    const tstyles = {
      margin:10
    }

    return (
      <div className="signin">
        <Typography variant="title">Sign In</Typography>
        <TextField
          required
          label="Email"
          className="m-1"
          value={this.state.email}
          onChange={this._handleChange("email")}
          style={tstyles}
        /><br/>
        <TextField
          required
          label="Password"
          type="password"
          value={this.state.password}
          onChange={this._handleChange("password")}
          style={tstyles}
        /><br/>
        <Button id="button" variant="contained" onClick={event => this._handleFormSubmit(event)}>
          Sign In
        </Button>
        <div>
          Don't have an account? Sign up <Link to="/signup" style={{ textDecoration: 'none' }}>here</Link>!
        </div>
      </div>
    );
  }
}

export default signin;
