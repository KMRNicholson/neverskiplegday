import React, { Component } from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import HttpHelperMethods from '../../helpers/HttpHelperMethods';

const route = '/dashboard';

class exercise extends Component {
	constructor(props) {
		super(props);
		this.state = {
			weId: props.weId,
			reps: props.reps,
			weight: props.weight,
			sets: props.sets,
			mode: [],
			disabled: true,
		};
	}

	_handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
			disabled: false,
		});
	};

	editExercise = () => {
		//TODO**
		var payload = {
			weId: this.state.weId,
		};
		return new HttpHelperMethods().put(route + '/workout/exercise', payload).then(res => {
			this.setState({
				disabled: true,
			});
			return Promise.resolve(res);
		});
	};

	componentDidMount() {
		var displayMode = [];
		var payload = {
			weId: this.state.weId,
		};

		return new HttpHelperMethods().get(route + '/workout/exercise', payload).then(res => {
			//TODO**
			console.log(res);
			this.setState({
				mode: displayMode,
			});
			return Promise.resolve(res);
		});
	}

	render() {
		const style = {
			maxWidth: 160,
		};
		return (
			<div>
				<TextField
					style={style}
					value={this.state.reps}
					placeholder="Reps"
					onChange={this._handleChange('reps')}
				/>
				<TextField
					style={style}
					value={this.state.sets}
					placeholder="Sets"
					onChange={this._handleChange('sets')}
				/>
				<TextField
					style={style}
					value={this.state.weight}
					placeholder="Weight"
					onChange={this._handleChange('weight')}
				/>

				<Button
					disabled={this.state.disabled}
					style={{ float: 'right' }}
					variant="contained"
					size="small"
					color="primary"
					onClick={event => this.updateLog()}
				>
					<EditIcon />
				</Button>
			</div>
		);
	}
}

export default exercise;
