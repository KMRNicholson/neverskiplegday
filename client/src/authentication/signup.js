import React, { Component } from "react";
import AuthHelperMethods from "../helpers/AuthHelperMethods";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import './authentication.css';

class signup extends Component {
  /* In order to utilize our authentication methods within the AuthService class, we want to instantiate a new object */
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      passConfirm: "",
      firstName: "",
      lastName: ""
    };
    this.auth = new AuthHelperMethods();
  }

  /* Fired off every time the use enters something into the input fields */
  _handleChange = name => event => {
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

  passwordCheck(){
    var results;
    if(this.state.confirmPassword.trim() !== this.state.password.trim()){
      results = false;
    }else{
      results = true;
    }
    return results;
  }

  render() {
    const tstyles = {
      margin:10
    }

    return (
      <div className="signup">
        <Typography variant="title">Sign Up</Typography>
        <TextField
          required
          label="First Name"
          value={this.state.firstName}
          onChange={this._handleChange("firstName")}
          style={tstyles}
        /><br/>
        <TextField
          required
          label="Last Name"
          value={this.state.lastName}
          onChange={this._handleChange("lastName")}
          style={tstyles}
        /><br/>
        <TextField
          required
          label="Email"
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
        <TextField
          required
          label="Confirm Password"
          type="password"
          value={this.state.passConfirm}
          onChange={this._handleChange("passConfirm")}
          style={tstyles}
        /><br/>
        <Button id="button" variant="contained" onClick={event => this._handleChange(event)}>
          Sign Up
        </Button>
        <div>
          Already have an account? Sign in <Link to="/signin" style={{ textDecoration: 'none' }}>here</Link>!
        </div>
      </div>
    );
  }
}

export default signup;
