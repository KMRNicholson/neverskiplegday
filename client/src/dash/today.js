import React, { Component } from 'react';
import './dash.css';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Button from "@material-ui/core/Button";
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import Modal from 'react-modal';
import ConfirmModal from 'react-modal';
import AddIcon from '@material-ui/icons/Add';
import DelIcon from '@material-ui/icons/Delete';
import NewWorkout from './newWorkout'
import HttpHelperMethods from "../helpers/HttpHelperMethods";
import CancelIcon from '@material-ui/icons/Cancel';

const route = "/dashboard";

Modal.setAppElement('#root');
ConfirmModal.setAppElement('#root');

class today extends Component {
  constructor(props){
    super(props);
    this.state = {
      name:"",
      desc:"",
      day:"",
      exercises:[],
      existExercises:[],
      tooltip:[],
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

  pageRefresh = () => {
    window.location.reload();
  }

  _handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  }

  _handleEdit = () => {
    this.openModal()
  };

  _handleDelete = () => {
    today = this;
    return new HttpHelperMethods().delete(route+"/workout", {workoutId:today.state.workoutId})
    .then(res => {
      window.location.reload();
      today.closeModal();
      return Promise.resolve(res);
    })
  }

  _handleNew = () => {
    this.openModal()
  };

  componentDidMount = () =>{
    this.setState({
      workoutId:"",
      name:"",
      day:"",
      desc:"",
      exercises:[],
      tooltip:[]
    })

    var day = this.props.day;
    var exercises = [];
    var existExercises = [];
    var tooltip = [];
    var workoutName;
    var desc;
    var workoutId;
    var i = 1;
    this.props.parent.state.workouts.find(function(workout){
      if(workout.day === day) {
        workoutName = workout.workout
        desc = workout.description
        workoutId = workout.workout_id
        var name=workout.exercise
        var reps=workout.reps
        var sets=workout.sets
        var weight=workout.weight
        var minutes=workout.minutes
        var exerciseId=workout.exercise_id
        existExercises.push({
          id:workoutId,
          name:workoutName,
          exerciseId:exerciseId,
          exercise:name,
          reps:reps,
          sets:sets,
          weight:weight,
          minutes:minutes,
          type:workout.type
        })
        exercises.push(<Typography component={'span'} key={"exercise"+i++}>
          <br/> {name} <br/>
          Reps: {reps} Sets: {sets} Weight: {weight}
        </Typography>)
      }
      return null; 
    });

    if(exercises === undefined || exercises.length === 0){
      workoutName = "No workout today"
      tooltip.push(<div key="add"  className="t-container">
          <Tooltip title="Add" aria-label="Add" onClick={event=>this._handleNew(event)}>
            <Fab color="secondary" id="tooltip">
              <AddIcon />
            </Fab>
          </Tooltip>
        </div>
        )
    }else{
      tooltip.push(<div key="edit" className="t-container">
        <Tooltip title="Delete" aria-label="Delete" onClick={event=>this._confirmDelete(event)}>
          <Fab id="tooltip">
            <DelIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Edit" aria-label="Edit" onClick={event=>this._handleEdit(event)}>
          <Fab color="secondary" id="tooltip-2">
            <EditIcon />
          </Fab>
        </Tooltip>
      </div>
      )
    }

    this.setState({
      workoutId:workoutId,
      name:workoutName,
      day:day,
      desc:desc,
      exercises:exercises,
      existExercises:existExercises,
      tooltip:tooltip
    })
  }

  render() {
    return (
      <div className="today">
        <ConfirmModal
          className="confirm"
          isOpen={this.state.confirmDel}
          onRequestClose={this.closeModal}>
          <Typography style={{margin:5}}>
            Are you sure you want to delete today's workout?
          </Typography>
          <Button id="button" variant="contained" color="primary" onClick={event => this.closeModal()}>
            <CancelIcon/>
          </Button>
          <Button id="button" variant="contained" onClick={event => this._handleDelete()}>
            Yes
          </Button>
        </ConfirmModal>
        <Modal
            className="nw-modal"
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
          >
          <NewWorkout parent={this}/>
        </Modal>
        <div className="workout-card">
          <Typography variant="h6">
          {this.state.name}
          </Typography>
          <Typography>
          {this.state.exercises}
          </Typography> 
        </div>
        {this.state.tooltip}
      </div>
    );
  }
}

export default today;
