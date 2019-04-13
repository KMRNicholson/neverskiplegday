import React, { Component } from "react";
import "./dash.css";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Exercises from "./exercises";
import HttpHelperMethods from "../helpers/HttpHelperMethods";

const route = "/dashboard";

class newWorkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      desc: "",
      day: "",
      exerciseId: "",
      exerciseName: "",
      reps: "N/A",
      sets: "N/A",
      weight: "N/A",
      minutes: "",
      type: "",
      exercises: [],
      existExercises: []
    };
  }

  _handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  addExercise = newExercise => {
    var newExercises = [...this.state.existExercises, ...newExercise];

    var exercises = [];
    var i = 0;
    newExercises.find(function(exercise) {
      exercises.push(
        <div className="ex-info" key={"exercise" + i++}>
          <br /> {exercise.name} <br />
          Reps: {exercise.reps} Sets: {exercise.sets} Weight: {exercise.weight}
        </div>
      );
      return null;
    });
    this.setState({ exercises: exercises, existExercises: newExercises });
  };

  _handleFormSubmit = event => {
    console.log("SEND POST");
    console.log(this);
    var comp = this;
    return new HttpHelperMethods()
      .post(route + "/day", {name:comp.props.parent.state.day})
      .then(res => {
        console.log(res)
        var payload = {
          name: comp.state.name,
          description: comp.state.description,
          exercises: comp.state.existExercises,
          day: res.data.id
        };
        console.log(payload);
        return new HttpHelperMethods()
          .post(route + "/workout", payload)
          .then(res => {
            comp.props.parent.closeModal();
            return Promise.resolve(res);
          });
      });
  };

  componentDidMount(){
    if(this.props.parent.state.workoutName === "No workout today."){
      console.log("new");
    }else{
      console.log("edit");
    }
  }

  render() {
    const tstyles = {
      margin: 2
    };

    return (
      <div className="nw-work">
        <Typography variant="h6">New Workout</Typography>
        <TextField
          fullWidth
          required
          label="Name"
          value={this.state.name}
          onChange={this._handleChange("name")}
          style={tstyles}
        />
        <br />
        <TextField
          fullWidth
          required
          label="Description"
          value={this.state.description}
          onChange={this._handleChange("description")}
          style={tstyles}
        />
        <br />
        {this.state.exercises}
        <Exercises parent={this} className="exercise" />
      </div>
    );
  }
}

export default newWorkout;
