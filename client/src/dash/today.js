import React, { Component } from 'react';
import './dash.css';
import { Typography } from '@material-ui/core';

class today extends Component {
  constructor(props){
    super(props);
    this.state = {
      name:"",
      desc:"",
      day:"",
      exercises:[]
    }
  }

  _handleEdit = () => {
  };

  _handleNew = () => {
  };

  componentDidMount(){
    var day = this.props.day;
    var exercises = [];
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
    }
    this.setState({
      name:workoutName,
      day:day,
      desc:desc,
      exercises:exercises
    })
  }

  render() {
    return (
      <div className="workout card">
        <Typography variant="h6">
        {this.state.name}
        </Typography>
        <Typography>
        {this.state.exercises}
        </Typography> 
      </div>
    );
  }
}

export default today;
