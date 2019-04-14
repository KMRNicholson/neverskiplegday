import React, { Component } from 'react';
import HttpHelperMethods from '../../helpers/HttpHelperMethods';
import { Typography, TextField } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import Button from "@material-ui/core/Button";
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import Modal from 'react-modal';
import CancelIcon from '@material-ui/icons/Cancel';

Modal.setAppElement("#root");

const route = "/dashboard";

class user extends Component {
  constructor(props){
    super(props);
    this.state = {
      firstname:"",
      lastname:"",
      weight:"",
      email:"",
      openModal: false,
      confirmDel: false
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  _confirmDelete = () => {
    this.setState({confirmDel: true})
  }

  closeModal = () => {
    this.setState({modalIsOpen: false, confirmDel:false});
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  saveUser = () => {
    var payload = {
      email:this.state.email,
      firstname:this.state.firstname,
      lastname:this.state.lastname,
      weight:this.state.weight
    }
    new HttpHelperMethods().put(route+"/user", payload)
    .then(res => {
      window.location.reload();
      return Promise.resolve(res);
    });
  };

  componentDidMount(){
    new HttpHelperMethods().get(route+"/user")
    .then(res => {
      console.log(res)
      var firstname = res.data.first_name;
      var lastname = res.data.last_name;
      var email = res.data.email;
      var weight = res.data.weight;
      this.setState({
        firstname:firstname,
        lastname:lastname,
        email:email,
        weight:weight
      });
      return Promise.resolve(res);
    });
  }

  render() {
    const style = {
      margin:5
    }

    return (
      <div className="user-card">
        <Modal
            className="ue-modal"
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
          >
          <TextField
            label="First Name"
            value={this.state.firstname}
            style={style}
            onChange={this.handleChange("firstname")}
            />
            <TextField
            label="Last Name"
            value={this.state.lastname}
            style={style}
            onChange={this.handleChange("lastname")}
            />
            <TextField
            label="Email"
            value={this.state.email}
            style={style}
            onChange={this.handleChange("email")}
            />
            <TextField
            label="Weight"
            value={this.state.weight}
            style={style}
            onChange={this.handleChange("weight")}
            />
            <Button id="button" 
              variant="contained" 
              color="primary"
              onClick={event=>this.saveUser()}>
              Save
            </Button>
            <Button id="button" 
              variant="contained" 
              onClick={event=>this.closeModal()}>
              <CancelIcon/>
            </Button>
        </Modal>
        <Typography variant="h6">
          {this.state.firstname + " " + this.state.lastname}
        </Typography>
        <Typography>
          Email: {this.state.email}
        </Typography>
        <Typography>
          Weight: {this.state.weight}
        </Typography>
        <Button key="logout" variant="contained" onClick={event => this.props.parent._handleLogout()}>
          Sign Out
        </Button>
        <Tooltip title="Edit" aria-label="Edit" onClick={event=>this.openModal(event)}>
          <Fab color="secondary" id={this.props.className + "-tooltip-2"}>
            <EditIcon />
          </Fab>
        </Tooltip>
      </div>
    );
  }
}

export default user;
