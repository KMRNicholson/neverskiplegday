import React, { Component } from "react";
import AuthHelperMethods from "../helpers/AuthHelperMethods";
import Logo from "../images/nsld-long.png"
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Modal from 'react-modal';
import './authentication.css';

Modal.setAppElement('#root');

class signin extends Component {
  /* In order to utilize our authentication methods within the AuthService class, we want to instantiate a new object */
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      openModal: false
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
      .signin_signup("/signin", this.state)
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

  render() {
    const tstyles = {
      margin:10
    }

    return (
      <div className="container">
        <img src={Logo} alt={"Never Skip Leg Day"} className="fp-logo" />
        <div className="signin card">
          <Modal
            className="si-modal"
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
          >
            <Typography paragraph="true" style={{margin:5}}>
            It seems something went wrong... <br/>
            Please check your email and password and try again!
            </Typography>
            <Button id="button" variant="contained" color="primary" onClick={event => this.closeModal(event)}>
              OK
            </Button>
          </Modal>
          
          <Typography variant="h6">Sign In</Typography>
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
          <Button id="button" variant="contained" color="primary" onClick={event => this._handleFormSubmit(event)}>
            Sign In
          </Button>
          <div>
            Don't have an account? Sign up <Link to="/signup" style={{ textDecoration: 'none' }}>here</Link>!
          </div>
        </div>
      </div>
    );
  }
}

export default signin;
