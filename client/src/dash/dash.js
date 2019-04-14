import React, { Component } from 'react';
import AuthHelperMethods from '../helpers/AuthHelperMethods';
import HttpHelperMethods from '../helpers/HttpHelperMethods';
import Logo from '../images/nsld-short.png';
import Button from "@material-ui/core/Button";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import withAuth from '../helpers/withAuth';
import TodayIcon from '@material-ui/icons/CalendarToday';
import WeekIcon from '@material-ui/icons/CalendarViewDay';
import User from '@material-ui/icons/AccountCircle';
import Today from './today/today'
import Week from './week/week'
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

const tabs = [
  "today",
  "week",
  "account"
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
        comp.push(<Today key={"today"} parent={this} className={"today"} day={day}/>)
        break;
      case 1:
        comp.push(<Week key={"week"} parent={this}/>)
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

  componentReload=(test)=>{
    console.log("WHY")
    console.log(test)
  }

  componentDidMount = (test) => {
    console.log("refresh even more")
    console.log(test)
    this.setState({component:[]});
    var day = weekdays[new Date().getDay()];
    return new HttpHelperMethods().get(route+"/workouts")
    .then(res => {
      var comp = []
      switch(this.state.value){
        case 0:
          comp.push(<Today key={"today"} parent={this} className={"today"} day={day}/>)
          break;
        case 1:
          comp.push(<Week key={"week"} parent={this}/>)
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
      this.setState({component:comp, workouts:res.data.workouts});
      return Promise.resolve(res);
    });
  }

  render() {
    return (
      <div className="dash">
      <div className={tabs[this.state.value] + "-app-bars"}>
          <AppBar position="static" color="primary">
            <img src={Logo} alt={"Never Skip Leg Day"} className="logo" />
          <Tabs value={this.state.value} onChange={this._handleChange}>
            <Tab id="tab" icon={<TodayIcon/>} />
            <Tab id="tab" icon={<WeekIcon/>} />
            <Tab id="tab" label={<User/>} />
          </Tabs>
        </AppBar>
      </div>
      {this.state.component}
      </div>
    );
  }
}

export default withAuth(dash);
