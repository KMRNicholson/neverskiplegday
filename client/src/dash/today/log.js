import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";
import CheckIcon from '@material-ui/icons/Check';
import Button from "@material-ui/core/Button";
import HttpHelperMethods from "../../helpers/HttpHelperMethods";

const route= "/dashboard"

class log extends Component {
  constructor(props){
    super(props);
    this.state = {
      weId:props.weId,
      log:props.log,
      disabled:true
    }
  }

  _handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      disabled:false
    });
  }

  updateLog = () => {
    var payload = {
      weId:this.state.weId,
      log:this.state.log
    }
    return new HttpHelperMethods().put(route+"/workout/exercise-log", 
    payload)
    .then(res => {
      this.setState({
        disabled:true
      })
      return Promise.resolve(res);
    })  
  }



  componentDidMount(){
    var payload = {
      weId:this.state.weId
    }
    return new HttpHelperMethods().get(route+"/workout/exercise-log", 
    payload)
    .then(res => {
      this.setState({
        log:res.data[0].log
      })
      return Promise.resolve(res);
    })
  }

  render() {
    const style = {
      maxWidth:160
    }
    return (
      <div>
        <TextField
          style={style}
          value={this.state.log}
          placeholder="Log progress here.."
          onChange={this._handleChange("log")}
          />

          <Button
          disabled={this.state.disabled}
          style={{float:"right"}}
          variant="contained"
          size="small"
          color="primary"
          onClick={event=>this.updateLog()}
          >
            <CheckIcon/>
          </Button>
      </div>
    );
  }
}

export default log;
