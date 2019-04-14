/* eslint-disable react/prop-types, react/jsx-handler-names */
import HttpHelperMethods from '../../helpers/HttpHelperMethods';
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Button from "@material-ui/core/Button";
import CancelIcon from '@material-ui/icons/Cancel';

const route = "/dashboard"

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class exercises extends React.Component {
  
  constructor(props){
    super(props)
    this.state = {
      exercise: null,
      suggestions: [],
      exerciseInfo:[],
      id:'',
      reps:0,
      sets:0,
      weight:0,
      minutes:0,
      type:''
    }
  }

  _handleFormSubmit(){
    this.props.exercises.push()
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSelection = name => value => {
    this.setState({
      [name]: value,
    });
  };

  addExercise(exercise){
    this.props.parent.addExercise(exercise);
    this.setState({exerciseInfo:[], exercise:null});
  }

  componentDidMount = () => {
    return new HttpHelperMethods().get(route+"/exercises")
    .then(res => {
      var exercises = res.data.map(exercise => ({
        label: exercise.name,
        id: exercise.id,
        type: exercise.type
      }));
      this.setState({suggestions:exercises})
    });
  }

  componentDidUpdate(prevProps){
    var exerciseInfo = []
    const style = {
      width:50,
      margin:5
    }
    if(this.props === prevProps){
      if(this.state.exercise !== null){
        this.props.parent.setState({
          exerciseId:this.state.exercise.id,
          exerciseName:this.state.exercise.label
        })
        if(this.state.exercise.type === 0){ 
          exerciseInfo.push(<div key="exercise-info" className="ex-info">
            <TextField
            label="Reps"
            value={this.state.reps}
            style={style}
            onChange={this.handleChange("reps")}
            />
            <TextField
            label="Sets"
            value={this.state.sets}
            style={style}
            onChange={this.handleChange("sets")}
            />
            <TextField
            label="Wt."
            id="e-info"
            className="e-info"
            value={this.state.weight}
            style={style}
            onChange={this.handleChange("weight")}
            />
            <Button id="ei-button" 
              variant="contained" 
              color="primary"
              onClick={event=>this.addExercise([{
                id:this.state.exercise.id,
                name:this.state.exercise.label,
                reps:this.state.reps,
                sets:this.state.sets,
                weight:this.state.weight,
                minutes:this.state.minutes,
                type:this.state.exercise.type}])}>
              <AddIcon/>
            </Button>
          </div>);
          this.setState({exerciseInfo:exerciseInfo});
        }else{
          exerciseInfo.push(<div key="exercise-info" className="ex-info">
            <TextField
            label="Minutes"
            value={this.state.reps}
            style={{width:165}}
            onChange={this.handleChange("reps")}
            />
            <Button id="ei-button" 
              variant="contained" 
              color="primary"
              onClick={event=>this.props.parent.addExercise()}>
              <AddIcon/>
            </Button>
          </div>);
          this.setState({exerciseInfo:exerciseInfo});
        }
      }else{
        this.props.parent.setState({
          exerciseId:new Date().getTime()
        })
        this.setState({exerciseInfo:exerciseInfo});
      }
    }
  }

  render() {
    const { classes, theme } = this.props;

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
      margin:5,
    };

    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            className="ex"
            classes={classes}
            styles={selectStyles}
            options={this.state.suggestions}
            components={components}
            value={this.state.exercise}
            placeholder="Exercise (required)"
            onChange={this.handleSelection('exercise')}
            isClearable
          />
        </NoSsr>
        {this.state.exerciseInfo}
        <Button id="button" variant="contained" color="primary" onClick={event => this.props.parent._handleFormSubmit(event)}>
          {this.props.parent.state.mode}
        </Button>
        <Button id="button" variant="contained" onClick={event => this.props.parent.props.parent.closeModal()}>
          <CancelIcon/>
        </Button>
      </div>
    );
  }
}

exercises.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(exercises);