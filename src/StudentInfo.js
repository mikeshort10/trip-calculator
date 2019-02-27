import React, { Component } from 'react';
import { 
	Button,
	Modal,
	Form } from 'react-bootstrap';

export default class StudentInfo extends Component {
	constructor(props) {
		super(props);
		this.state = this.props.data.data;
	}

	adjustState = key => event => {
		this.setState({ [key]: Number(event.target.value) })
	}

	renderFields () {
		let arr = [];
		for (let i = 0; i < this.props.buttons.length; i++) {
			arr.push(
			<div key={i}>
				<Form.Label>{this.props.buttons[i].label}</Form.Label>
				<Form.Control 
				type="number"
				min="1"
				onChange={this.adjustState(this.props.buttons[i].key)} 
				value={this.state[this.props.buttons[i].key]} />
			</div>)
		}
		return arr;
	}

	componentDidUpdate (prevProps) {
		if (prevProps.title !== this.props.title) {
			this.setState( this.props.data.data);
		}
	}

	render() {
		return(
			<Modal show={this.props.modal.show}>
				<Modal.Header>
					<Modal.Title style={{textAlign: 'center', width: '100%'}}>{this.props.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
					<div style={{width:"50%"}}>
						{this.renderFields()}
						<Button 
						onClick={() => this.props.changeData(this.props.title.slice(0,-5).concat("s").toLowerCase(), this.state, this.props.next)}>
							Next
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		)
	}
}

