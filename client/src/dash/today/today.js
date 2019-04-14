import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Button from "@material-ui/core/Button";
import EditIcon from '@material-ui/icons/Edit';
import Log from './log';
import Fab from '@material-ui/core/Fab';
import Modal from 'react-modal';
import ConfirmModal from 'react-modal';
import AddIcon from '@material-ui/icons/Add';
import DelIcon from '@material-ui/icons/Delete';
import Workout from './workout'
import HttpHelperMethods from "../../helpers/HttpHelperMethods";
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
    this.props.parent.state.workouts.find(workout => {
      if(workout.day === day) {
        workoutName = workout.workout
        desc = workout.description
        workoutId = workout.workout_id
        var name=workout.exercise
        var reps=workout.reps
        var sets=workout.sets
        var weight=workout.weight
        var minutes=workout.minutes
        var we_id=workout.we_id
        var exerciseId=workout.exercise_id
        var log=workout.log
        existExercises.push({
          id:workoutId,
          name:workoutName,
          we_id:we_id,
          exerciseId:exerciseId,
          exercise:name,
          reps:reps,
          sets:sets,
          weight:weight,
          minutes:minutes,
          type:workout.type
        })
        exercises.push(<div key={"exercise"+i++}>
            {name} <br/>
            Reps: {reps} Sets: {sets} Weight: {weight}
          <Log parent={this} weId={we_id} log={log} />
        </div>)
      }
      return null; 
    });

    if(exercises === undefined || exercises.length === 0){
      workoutName = "No workout today"
      tooltip.push(<div key="add"  className="t-container">
          <Tooltip title="Add" aria-label="Add" onClick={event=>this._handleNew(event)}>
            <Fab color="secondary" id={this.props.className + "-tooltip"}>
              <AddIcon />
            </Fab>
          </Tooltip>
        </div>
        )
    }else{
      tooltip.push(<div key="edit" className="t-container">
        <Tooltip title="Delete" aria-label="Delete" onClick={event=>this._confirmDelete(event)}>
          <Fab id={this.props.className + "-tooltip"}>
            <DelIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Edit" aria-label="Edit" onClick={event=>this._handleEdit(event)}>
          <Fab color="secondary" id={this.props.className + "-tooltip-2"}>
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
      <div className={this.props.className}>
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
          <Workout parent={this}/>
        </Modal>
        <div className={this.props.className+"-workout-card"}>
          <Typography style={{marginBottom:5}} variant="h6">
          {this.state.name}
          </Typography>
          {this.state.exercises}
        </div>
        {this.state.tooltip}
      </div>
    );
  }
}

export default today;
