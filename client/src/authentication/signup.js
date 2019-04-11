import React, { Component } from "react";
import AuthHelperMethods from "../helpers/AuthHelperMethods";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import './authentication.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

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
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  /* Fired off every time the use enters something into the input fields */
  _handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  }

  _handleFormSubmit() {
    this.auth
      .signin_signup("/signup", this.state)
      .then(res => {
        this.props.history.replace("/");
      })
      .catch(() => {
        this.openModal();
      });
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
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
      <div className="container">
        <div className="signup card">
          <Modal
            className="modal"
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
          >
            <Typography paragraph="true">
            It seems something went wrong...<br/> 
            Please make sure all fields are filled in correctly and try again!. <br/><br/>
            Password Requirements: <br/>
            - minimum 6 characters long <br/>
            - must be alphanumeric (includes letters and numbers)
            </Typography>
            <Button id="button" variant="contained" onClick={event => this.closeModal(event)}>
              OK
            </Button>
          </Modal>
          <Typography variant="h6">Sign Up</Typography>
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
          <Button id="button" variant="contained" onClick={event => this._handleFormSubmit(event)}>
            Sign Up
          </Button>
          <div>
            Already have an account? Sign in <Link to="/signin" style={{ textDecoration: 'none' }}>here</Link>!
          </div>
        </div>
      </div>
    );
  }
}

export default signup;
