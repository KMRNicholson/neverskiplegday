import React, { Component } from 'react';
import AuthHelperMethods from '../helpers/AuthHelperMethods';
import HttpHelperMethods from '../helpers/HttpHelperMethods';
import Button from "@material-ui/core/Button";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import withAuth from '../helpers/withAuth';
import Today from '@material-ui/icons/CalendarToday';
import Week from '@material-ui/icons/CalendarViewDay';
import User from '@material-ui/icons/AccountCircle';
import Workout from './today'
import './dash.css';

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

class dash extends Component {
  constructor(props){
    super(props);
    this.state = {
      value:0,
      component:[],
      workouts:[]
    }
    this.auth = new AuthHelperMethods();
  }

  _handleLogout(){
    this.auth.logout()
    this.props.history.replace('/signin');
  }

  _handleChange = (event, value) => {
    var comp = []
    var day = weekdays[new Date().getDay()];
    switch(value){
      case 0:
        comp.push(<Workout key="today" parent={this} day={day}></Workout>)
        break;
      case 1:
        comp.push("Item 2")
        break;
      case 2:
        comp.push(
        <Button variant="contained" onClick={event => this._handleLogout()}>
          Sign In
        </Button>)
        break;
      default:
        comp.push("Error")
        break;
    }
    this.setState({ value:value, component:comp });
  };

  componentDidMount(){
    var day = weekdays[new Date().getDay()];
    return new HttpHelperMethods().get(route+"/workouts")
    .then(res => {
      var component = []
      component.push(<Workout key="today" parent={this} day={day}></Workout>)
      this.setState({value:0, component:component, workouts:res.data.workouts});
      return Promise.resolve(res);
    });
  }

  render() {
    return (
      <div className="dash">
        <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Never Skip Leg Day!
          </Typography>
        </Toolbar>
      </AppBar>
      <AppBar position="static">
          <Tabs value={this.state.value} onChange={this._handleChange}>
            <Tab id="tab" icon={<Today/>} />
            <Tab id="tab" label={<Week/>} />
            <Tab id="tab" label={<User/>} />
          </Tabs>
      </AppBar>
      {this.state.component}<br/>
      </div>
    );
  }
}

export default withAuth(dash);
