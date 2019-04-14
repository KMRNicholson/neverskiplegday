import React, { Component } from 'react';
import AuthHelperMethods from '../helpers/AuthHelperMethods';
import HttpHelperMethods from '../helpers/HttpHelperMethods';
import Logo from '../images/nsld-short.png';
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
        <Button key="logout" variant="contained" onClick={event => this._handleLogout()}>
          Sign Out
        </Button>)
        break;
      default:
        comp.push("Error")
        break;
    }
    this.setState({ value:value, component:comp });
  };

  componentDidMount = () => {
    console.log("NOT LETTING ME DO THIS")
    this.setState({component:[]});
    var day = weekdays[new Date().getDay()];
    return new HttpHelperMethods().get(route+"/workouts")
    .then(res => {
      var component = []
      component.push(<Workout key="today" parent={this} day={day}></Workout>)
      console.log(component)
      console.log(res.data)
      this.setState({value:0, component:component, workouts:res.data.workouts});
      return Promise.resolve(res);
    });
  }

  reloadToday = () => {
    this.setState({component:[]});
  }

  render() {
    return (
      <div className="dash">
      {this.state.component}
      <div className="app-bars">
          <AppBar position="static" color="primary">
            <img src={Logo} alt={"Never Skip Leg Day"} className="logo" />
          <Tabs value={this.state.value} onChange={this._handleChange}>
            <Tab id="tab" icon={<Today/>} />
            <Tab id="tab" label={<Week/>} />
            <Tab id="tab" label={<User/>} />
          </Tabs>
        </AppBar>
        </div>
      </div>
    );
  }
}

export default withAuth(dash);
