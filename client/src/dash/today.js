import React, { Component } from 'react';
import './dash.css';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import Modal from 'react-modal';
import AddIcon from '@material-ui/icons/Add';
import NewWorkout from './newWorkout'

Modal.setAppElement('#root');

class today extends Component {
  constructor(props){
    super(props);
    this.state = {
      name:"",
      desc:"",
      day:"",
      exercises:[],
      tooltip:[],
      openModal: false
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.props.parent.componentDidMount();
    this.setState({modalIsOpen: false});
  }

  _handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  }

  _handleEdit = () => {
  };

  _handleNew = () => {
    this.openModal()
  };

  componentDidMount(){
    var day = this.props.day;
    var exercises = [];
    var tooltip = [];
    var workoutName;
    var desc;
    var i = 1;
    this.props.parent.state.workouts.find(function(workout){
      if(workout.day === day) {
        workoutName = workout.workout
        desc = workout.description
        var name=workout.exercise
        var reps=workout.reps
        var sets=workout.sets
        var weight=workout.weight
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
        <Tooltip title="Edit" aria-label="Edit" >
          <Fab color="secondary" id="tooltip">
            <EditIcon />
          </Fab>
        </Tooltip>
      </div>
      )
    }

    this.setState({
      name:workoutName,
      day:day,
      desc:desc,
      exercises:exercises,
      tooltip:tooltip
    })
  }

  render() {
    return (
      <div className="today">
        <Modal
            className="nw-modal"
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
          >
          <NewWorkout parent={this}/>
        </Modal>
        <div className="workout card">
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
