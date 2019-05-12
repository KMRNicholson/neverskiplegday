import React, { Component } from 'react';
import {TextField, Typography} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import ConfirmModal from 'react-modal';
import Button from "@material-ui/core/Button";
import DelIcon from '@material-ui/icons/Delete';
import HttpHelperMethods from "../../helpers/HttpHelperMethods";

const route= "/dashboard"

ConfirmModal.setAppElement('#root');

class log extends Component {
  constructor(props){
    super(props);
    this.state = {
      weId:props.weId,
      log:props.log,
			reps: props.reps,
			weight: props.weight,
      sets: props.sets,
      disabled: true,
      confirmDel: false
    }
  }

  _confirmDelete = () => {
    this.setState({confirmDel: true})
  }

  closeModal = () => {
    this.setState({confirmDel:false});
  }

  _handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      disabled:false
    });
  }

  _handleDelete = () => {
		var exercise = this;
    return new HttpHelperMethods().delete(route+"/workout/exercise", {weId:exercise.state.weId})
    .then(res => {
      window.location.reload();
      exercise.closeModal();
      return Promise.resolve(res);
    })
  };
  
  editExercise = () => {
		var payload = {
			weId: this.state.weId,
			reps: this.state.reps,
			sets: this.state.sets,
      weight: this.state.weight,
      log: this.state.log
    };
    console.log(payload)
		return new HttpHelperMethods().put(route + '/workout/exercise', payload).then(res => {
			console.log(res);
			this.setState({
				disabled: true,
			});
			return Promise.resolve(res);
		});
	};

  componentDidMount(){
    var payload = {
      weId:this.state.weId
    }
    return new HttpHelperMethods().get(route+"/workout/exercise", 
    payload)
    .then(res => {
      this.setState({
        log:res.data[0].log,
				reps:res.data[0].reps,
				sets:res.data[0].sets,
				weight:res.data[0].weight
      })
      return Promise.resolve(res);
    })
  }

  render() {
    const logstyle = {
      maxWidth:130,
      margin:2
    }
    const style = {
			maxWidth: 40,
			margin:2 
    };
    return (
      <div>
        <ConfirmModal
          className="confirm"
          isOpen={this.state.confirmDel}
          onRequestClose={this.closeModal}>
          <Typography style={{margin:5}}>
            Are you sure you want to delete this workout exercise?
          </Typography>
          <Button id="button" variant="contained" color="primary" onClick={event => this.closeModal()}>
            <CancelIcon/>
          </Button>
          <Button id="button" variant="contained" onClick={event => this._handleDelete()}>
            Yes
          </Button>
        </ConfirmModal>
        <div>
          <TextField
            label="Reps"
            style={style}
            value={this.state.reps}
            onChange={this._handleChange('reps')}
          />
          <TextField
            label="Sets"
            style={style}
            value={this.state.sets}
            onChange={this._handleChange('sets')}
          />
          <TextField
            label="Wt."
            style={style}
            value={this.state.weight}
            onChange={this._handleChange('weight')}
          />
        </div>
        <TextField
          style={logstyle}
          value={this.state.log}
          placeholder="Log progress here.."
          onChange={this._handleChange("log")}
          />
        <Button
          size="small"
          onClick={event=>this._confirmDelete(event)}
          variant="contained"
          id="sm-button">
          <DelIcon />
        </Button>
        <Button 
          disabled={this.state.disabled}
          size="small"
          onClick={event=>this.editExercise(event)}
          variant="contained"
          color="primary"
          id="sm-button">
          <CheckIcon />
        </Button>
      </div>
    );
  }
}

export default log;
