import React, { Component } from 'react';
import AuthHelperMethods from '../helpers/AuthHelperMethods';
import Button from "@material-ui/core/Button";
import withAuth from '../helpers/withAuth';

class dash extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: "",
      password: ""
    }
    this.auth = new AuthHelperMethods();
  }

  _handleLogout(){
    this.auth.logout()
    this.props.history.replace('/signin');
  }

  render() {
    let email = null;

    //This will be null until we set up authentication...
    if (this.props.confirm) {
      email = this.props.confirm.email;
    }

    return (
      <div className="dash">
        <div>
          <div>
            <h1>Welcome, {email}</h1>
          </div>
          <div>
            <button onClick={this._handleLogout}>LOGOUT</button>
            <Button variant="contained" onClick={event => this._handleLogout()}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(dash);
