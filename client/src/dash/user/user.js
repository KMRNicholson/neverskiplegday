import React, { Component } from 'react';
import HttpHelperMethods from '../../helpers/HttpHelperMethods';
import { Typography, TextField } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import Modal from 'react-modal';
import ImageUpload from 'react-modal';
import Avatar from '../../images/avatar.png';
import CancelIcon from '@material-ui/icons/Cancel';
import UploadIcon from '@material-ui/icons/Image';

Modal.setAppElement('#root');

ImageUpload.setAppElement('#root');

const route = '/dashboard';

class user extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstname: '',
			lastname: '',
			weight: '',
			email: '',
			openModal: false,
      confirmDel: false,
      uploadImageModal: false,
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	openModal() {
		this.setState({ modalIsOpen: true });
  }
  
  imageUploader = () => {
		this.setState({ uploadImageModal: true });
	}

	closeModal = () => {
		this.setState({ modalIsOpen: false, uploadImageModal:false });
	};

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	saveUser = () => {
		var payload = {
			email: this.state.email,
			firstname: this.state.firstname,
			lastname: this.state.lastname,
			weight: this.state.weight,
		};
		new HttpHelperMethods().put(route + '/user', payload).then(res => {
			window.location.reload();
			return Promise.resolve(res);
		});
	};

	componentDidMount() {
		new HttpHelperMethods().get(route + '/user').then(res => {
			var firstname = res.data.first_name;
			var lastname = res.data.last_name;
			var email = res.data.email;
			var weight = res.data.weight;
			this.setState({
				firstname: firstname,
				lastname: lastname,
				email: email,
				weight: weight,
			});
			return Promise.resolve(res);
		});
	}

	render() {
		const style = {
			margin: 5,
		};

		return (
			<div className="user-card">
				<Modal className="ue-modal" isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>
					<TextField
						label="First Name"
						value={this.state.firstname}
						style={style}
						onChange={this.handleChange('firstname')}
					/>
					<TextField
						label="Last Name"
						value={this.state.lastname}
						style={style}
						onChange={this.handleChange('lastname')}
					/>
					<TextField
						label="Email"
						value={this.state.email}
						style={style}
						onChange={this.handleChange('email')}
					/>
					<TextField
						label="Weight"
						value={this.state.weight}
						style={style}
						onChange={this.handleChange('weight')}
					/>
					<Button id="button" variant="contained" color="primary" onClick={event => this.saveUser()}>
						Save
					</Button>
					<Button id="button" variant="contained" onClick={event => this.closeModal()}>
						<CancelIcon />
					</Button>
				</Modal>
        <ImageUpload className="ue-modal" isOpen={this.state.uploadImageModal} onRequestClose={this.closeModal}>
          <span style={{display:"block"}}>"Patience is virtue" - Abraham Lincoln probably</span>
          <Button id="button" variant="contained" onClick={event => this.closeModal()}>
						<CancelIcon />
					</Button>
        </ImageUpload>
        <div className="avatar">
          <img src={Avatar} alt={'Avatar'} style={{ width: 275, height: 275, display:'block' }} className="avatar" />
          <Button id="button" size="small" variant="contained" color="primary" onClick={event => this.imageUploader()}>
              <UploadIcon />
          </Button>
        </div>
				<Typography variant="h6">{this.state.firstname + ' ' + this.state.lastname}</Typography>
				<Typography>Email: {this.state.email}</Typography>
				<Typography>Weight: {this.state.weight}</Typography>
				<Button
					key="logout"
					variant="contained"
					id="logout-button"
					onClick={event => this.props.parent._handleLogout()}
				>
					Sign Out
				</Button>
				<Tooltip title="Edit" aria-label="Edit" onClick={event => this.openModal(event)}>
					<Fab color="secondary" id={'today-tooltip-2'}>
						<EditIcon />
					</Fab>
				</Tooltip>
			</div>
		);
	}
}

export default user;
