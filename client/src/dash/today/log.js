import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";
import CheckIcon from '@material-ui/icons/Check';
import Button from "@material-ui/core/Button";

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
    console.log(this.state)
  }

  componentDidMount(){
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
