import React, { Component } from 'react';
import { Typography } from "@material-ui/core";
import Today from '../today/today'

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

const route = "/dashboard";

class week extends Component {
  constructor(props){
    super(props);
    this.state = {
      weekDays:[],
      workouts:[]
    }
  }

  componentDidMount = () => {
    var days = []
    weekdays.forEach(day => {
      days.push(<div key={day} className="day-card">
        <Typography variant="h6" style={{margin:5}}>{day}</Typography>
        <Today key="weekday" className="weekday" parent={this} day={day}/>
      </div>);      
    });
    this.setState({weekDays:days, workouts:this.props.parent.state.workouts})
  }

  render() {
    return (
      <div className="week">
        {this.state.weekDays}
      </div>
    );
  }
}

export default week;
