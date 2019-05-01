import React, { Component } from "react";
import { Typography }  from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Exercises from "./exercises";
import HttpHelperMethods from "../../helpers/HttpHelperMethods";

const route = "/dashboard";

class workout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      desc: "",
      day: "",
      id: "",
      mode:"Submit",
      exercises: [],
      existExercArray: [],
      newExercises: [],
      newExercArray: []
    };
  }

  _handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  addExercise = newExercise => {
    var newExercArray = [...this.state.newExercArray, ...newExercise];
    var exercises = [];
    var i = 0;
    newExercArray.forEach(exercise => {
      exercises.push(
        <div className="ex-info" key={"exercise" + i++}>
          <br /> {exercise.name} <br />
          Reps: {exercise.reps} Sets: {exercise.sets} Weight: {exercise.weight}
        </div>
      )
    });
    this.setState({ newExercises: exercises, newExercArray: newExercArray });
  };

  _handleFormSubmit = event => {
    var comp = this;
    if(this.state.mode === "Submit"){
      return new HttpHelperMethods()
      .post(route + "/day", {name:comp.props.parent.state.day})
      .then(res => {
        var payload = {
          name: comp.state.name,
          description: comp.state.description,
          exercises: comp.state.newExercArray,
          day: res.data.id
        };
        return new HttpHelperMethods()
          .post(route + "/workout", payload)
          .then(res => {
            comp.props.parent.closeModal();
            comp.props.parent.pageRefresh();
            return Promise.resolve(res);
          });
      });
    }else{
      var payload = {
        name: comp.state.name,
        description: comp.state.description,
        exercises: comp.state.newExercArray,
        workoutId: comp.state.id
      };
      return new HttpHelperMethods()
      .put(route + "/workout", payload)
      .then(res => {
        comp.props.parent.closeModal();
        comp.props.parent.pageRefresh();
        return Promise.resolve(res);
      });
    }
  };

  componentDidMount(){
    if(this.props.parent.state.name !== "No workout today"){
      var workout = this.props.parent.state
      var exercises = []
      var existExercArray = []
      var i = 0;
      this.props.parent.state.existExercises.forEach((exercise)=>{
        existExercArray.push({
          id:exercise.exerciseId,
          name:exercise.exercise,
          reps:exercise.reps,
          sets:exercise.sets,
          weight:exercise.weight,
          minutes:exercise.minutes,
          type:exercise.type
        })
        exercises.push(
          <div className="ex-info" key={"exercise" + i++}>
            <br /> {exercise.exercise} <br />
            Reps: {exercise.reps} Sets: {exercise.sets} Weight: {exercise.weight}
          </div>
        );
      })
      this.setState({
        id:workout.workoutId,
        name:workout.name,
        existExercArray:existExercArray,
        exercises:exercises,
        mode:"Save"
      })
    }
  }

  render() {
    const tstyles = {
      margin: 2
    };

    return (
      <div className="nw-work">
        <Typography variant="h6">Workout</Typography>
        <TextField
          fullWidth
          required
          label="Name"
          value={this.state.name}
          onChange={this._handleChange("name")}
          style={tstyles}
        />
        <br />
        {this.state.exercises}
        {this.state.newExercises}
        <Exercises parent={this} className="exercise" />
      </div>
    );
  }
}

export default workout;
