import React, { Component } from 'react';
import { 
	Button,
	Form,
	FormGroup,
	FormControl,
	InputGroup,
	Dropdown,
	Modal } from 'react-bootstrap';

function Multipliers (props) {
	return(
		<Dropdown.Item 
		onClick={props.handleChange(props.num, "multiplier")} 
		value={props.title}>
			{props.title}
		</Dropdown.Item>)
}

function LineItem (props) {
	let cn = ""

	function renderDropdownItems () {
		let arr = [];
		let options = [
			"Flat Rate", 
			"Per Student", 
			"Per Chaperone", 
			"Per Person", 
			"Per Vehicle", 
			"Per Hotel Room"
		];
		for (let i = 0; i < options.length; i++) {
			arr.push(<Multipliers 
				key={i} 
				title={options[i]} 
				num={props.num} 
				handleChange={props.handleChange}/>)
		}
		return arr;
	}

	return(
		<FormGroup>
			<Dropdown drop="down">
				<InputGroup>
				<InputGroup.Prepend>
					<Dropdown.Toggle 
					split 
					variant={props.lineItem.notes ? "primary" : "secondary"} />
					<Dropdown.Menu >
						<Dropdown.Item style={{textAlign: 'left'}} disabled>
							Notes
						</Dropdown.Item>
						<Form.Control 
						value={props.lineItem.notes}
						onChange={props.handleChange(props.num, "notes")} 
						style={{textAlign: 'left'}} 
						as="textarea"/>
					</Dropdown.Menu>
				</InputGroup.Prepend>
				<FormControl
				onChange={props.handleChange(props.num, "costName")} 
				placeholder="Cost Name" 
				value={props.lineItem.costName}
				className={cn}/>
				</InputGroup>
			</Dropdown>
			<InputGroup className="col-sm-2">
				<InputGroup.Prepend>
					<InputGroup.Text>$</InputGroup.Text>
				</InputGroup.Prepend>	
				<FormControl
				onChange={props.handleChange(props.num, "unitCost")} 
				onBlur={props.calculateCosts} 
				placeholder="Unit Cost" 
				value={props.lineItem.unitCost}/>
			</InputGroup>
			<Dropdown className={cn}>
				<Dropdown.Toggle >
					{props.lineItem.multiplier}
				</Dropdown.Toggle>
				<Dropdown.Menu >
					{renderDropdownItems()}
					<FormControl
					min={1}
					type="number" 
					onChange={props.handleChange(props.num, "multiplier")} 
					placeholder="Custom" />
				</Dropdown.Menu>
			</Dropdown>
			<InputGroup className="col-sm-2">
				<InputGroup.Prepend>
					<InputGroup.Text>$</InputGroup.Text>
				</InputGroup.Prepend>
				<FormControl 
				disabled
				placeholder="Total Cost" 
				value={isNaN(props.lineItem.totalCost) 
					? "---"
					: Number(props.lineItem.totalCost).toFixed(2)}/>
			</InputGroup>
			{props.showDeleteButton ? 
				<Button 
				variant="danger" 
				onClick={() => props.removeLineItem(props.num)} >
					<i className="fa fa-trash" />
				</Button>
				: ""}
			<Button 
			variant="success" 
			onClick={() => props.addLineItem(props.num)} >
				<i className="fa fa-plus" />
			</Button>
		</FormGroup>
	);
}

export default class Calculator extends Component {
	constructor(props) {
		super(props);
		this.renderLineItems = this.renderLineItems.bind(this);
	}

	renderLineItems () {
		let arr = [];
		for (let i = 0; i < this.props.lineItems.length; i++) {
			arr.push(<LineItem 
				key={i} 
				num={i} 
				calculateCosts={() => this.props.calculateCosts(i)} 
				handleChange={this.props.handleChange} 
				lineItem={ this.props.lineItems[i] } 
				addLineItem={this.props.addLineItem}
				removeLineItem={this.props.removeLineItem}
				showDeleteButton={this.props.lineItems.length > 1 ? true : false} />)
		}
		return arr;
	}

	render () {
		return(
			<Form inline>
				{this.renderLineItems()}
			</Form>
		);
	}
}