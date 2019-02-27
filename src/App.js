import React, { Component } from 'react';
import './App.css';
import Calculator from './Calculator';
import CustomCalc from './CustomCalc';
import StudentInfo from './StudentInfo';
import { Form, InputGroup, Dropdown } from 'react-bootstrap';

//make sure total, subtotal, and upcharge match up

function Multipliers (props) {

	return(
		<button
		className="choice"
		type="button"
		onClick={props.click || undefined} 
		value={props.title || undefined}>
			{props.title}
		</button>)
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			upcharge: 0,
			subtotal: 0,
			total: 0,
			students: {
				total: 1,
				min: 1,
				max: 300,
				male: undefined,
				female: undefined,
			},
			chaperones: {
				total: 1,
				min: 1,
				max: 5,
				male: undefined,
				female: undefined
			},
			vehicles: {
				seats: undefined,
				total: undefined
			},
			hotelRooms: {
				studentBeds: undefined,
				chaperoneBeds: undefined,
				total: undefined
			},
			modal: {
				show: true,
				type: 'Student Info'
			},
			lineItems: [{
				costName: "",
				unitCost: "0.00",
				multiplier: "Flat Rate",
				totalCost: 0,
				notes: ""
			}],
			buttons: [[{
				label: "Estimated/Total Students", 
				key: "total"
			}, {
				"label": "Minimum Students", 
				"key": "min"
			}, {
				label: "Maximum Students", 
				key: "max"
			}],
			[{
				label: "Estimated/Total Chaperones", 
				key: "total"
			}, {
				"label": "Minimum Chaperones", 
				"key": "min"
			}, {
				label: "Maximum Chaperones", 
				key: "max"
			}]]
		}
		this.handleChange = this.handleChange.bind(this);
		this.closeModal	= this.closeModal.bind(this);
		this.calculateCosts = this.calculateCosts.bind(this);
		this.addLineItem = this.addLineItem.bind(this);
		this.removeLineItem = this.removeLineItem.bind(this);
		this.adjustUpcharge = this.adjustUpcharge.bind(this);
	}

	handleChange = (num, key) => event => {
		let lineItems = [...this.state.lineItems];
		let val = event.target.value || event.target.innerHTML;
		if (!val && key === "multiplier")
			val = "Flat Rate"
		//if (key === "unitCost" || key === "totalCost") val = Number(val);
		lineItems[num][key] = val;
		this.setState({ lineItems }, () => {
			if (key === 'multiplier')
				this.calculateCosts(num);
		});
	}

	changeData = (key, data, modalInfo) => {
		let state = Object.assign({},this.state);
		state[key] = data;
		state.modal = modalInfo;
		this.setState(state);
	}

	closeModal () {
		this.setState({ modalShow: !this.state.modalShow })
	}

	renderModal () {
		switch (this.state.modal.type) {
			case 'Student Info':
				return (<StudentInfo
				modal={this.state.modal}
				title={this.state.modal.type} 
				buttons={this.state.buttons[0]} 
				data={{key: "students", data: this.state.students}} 
				changeData={this.changeData}
				next={{show: true, type: "Chaperone Info"}}/>);
			case 'Chaperone Info':
				return (<StudentInfo
				modal={this.state.modal}
				title={this.state.modal.type} 
				buttons={this.state.buttons[1]} 
				data={{key: "chaperones", data: this.state.chaperones}} 
				changeData={this.changeData}
				next={{show: false, type: undefined}}/>);
			default:
				return "";
		}
	}

	removeLineItem (num) {
		let lineItems = [...this.state.lineItems];
		lineItems.splice(num, 1);
		this.setState({ lineItems }, this.calculateTotal);
	}

	addLineItem (num) {
		let lineItems = [...this.state.lineItems];
		lineItems.splice(num+1, 0, {
			costName: "",
			unitCost: "0.00",
			multiplier: "Flat Rate",
			totalCost: 0,
			notes: ""
		})
		this.setState({ lineItems });
	}

	calculateCosts (num, callback) {
		let items = [...this.state.lineItems];
		let multiplyBy = () => {
			switch (items[num].multiplier) {
				case "Flat Rate":
					return 1;
				case "Per Student":
					return this.state.students.total;
				case "Per Chaperone":
					return this.state.chaperones.total;
				case "Per Person":
					return this.state.students.total + this.state.chaperones.total;
				case "Per Vehicle":
					return this.state.vehicles.total;
				case "Per Hotel Room":
					return this.state.hotelRooms.total;
				default:
					return items[num].multiplier;
			}
		}
		if (isNaN(items[num].unitCost)) 
			items[num].totalCost = "ERROR"
		else {
			items[num].unitCost = Number(items[num].unitCost).toFixed(2);
			items[num].totalCost = (Number(items[num].unitCost) * multiplyBy());
		}
		this.setState({ lineItems: items }, this.calculateTotal)
	}

	calculateTotal () {
		let subtotal = 0;
		for (let i = 0; i < this.state.lineItems.length; i++) 
			subtotal += this.state.lineItems[i].totalCost;
		subtotal = subtotal;
		this.setState({ subtotal, total: this.state.subtotal * (1 + this.state.upcharge) });
	}

	adjustUpcharge = percent => event => {
		percent = percent || Number(event.target.value)/100;
		document.getElementsByClassName(`upcharge-menu`)[0].style.display = "none";
		this.setState({ upcharge: percent, total: this.state.subtotal * (1 + percent) })
	}

	openClose () {
		let display = (document.getElementsByClassName(`upcharge-menu`)[0].style.display === "flex") ? "none" : "flex";
		document.getElementsByClassName(`upcharge-menu`)[0].style.display = display;
		if (display === "flex") document.getElementsByClassName('upcharge-select')[0].focus();
	}


	render() {
		return (
			<div id="container">
				{this.renderModal()}
				<CustomCalc 
				closeModal={this.closeModal} 
				modalShow={this.state.modalShow} 
				handleChange={this.handleChange}
				calculateCosts={this.calculateCosts} 
				lineItems={this.state.lineItems} 
				addLineItem={this.addLineItem}
				removeLineItem={this.removeLineItem} />
				<div>
					<div className="totals">
						<div className="total-label">Subtotal</div>
						<input 
						className="total-output"
						value={isNaN(this.state.subtotal) 
							? "---" : 
							'$' + Number(this.state.subtotal).toFixed(2)} 
						disabled/>
					</div>
					<div className="totals">
						<div style={{border: 'none'}} className="total-label">
								<button 
								className="ddbutton"
								type="button" 
								onClick={this.openClose}>
									{Number(this.state.upcharge) * 100 + "% Upcharge"}
								</button>	
								<div 
								tabindex={0} 
								className="upcharge-select">
									<div className="upcharge-menu">
										<Multipliers 
										click={this.adjustUpcharge(0)}
										title="0% Upcharge"/>
										<Multipliers 
										click={this.adjustUpcharge(0.05)}
										title="5% Upcharge"/>
										<Multipliers 
										click={this.adjustUpcharge(0.10)}
										title="10% Upcharge"/>
										<Multipliers 
										click={this.adjustUpcharge(0.15)}
										title="15% Upcharge"/>
										<Multipliers 
										click={this.adjustUpcharge(0.20)}
										title="20% Upcharge"/>
										<input 
										min={1}
										type="number"
										onBlur={this.adjustUpcharge()} 
										//onBlur={click} 
										placeholder="Custom Percentage"/>
									</div>
								</div>
						</div>
						<input 
						className="total-output"
						value={isNaN(this.state.subtotal)
							? "---" 
							: '$' + (this.state.subtotal*this.state.upcharge).toFixed(2)} 
						disabled/>
					</div>
					<div className="totals">
						<div className="total-label">Total</div>
						<input 
						className="total-output"
						value={isNaN(this.state.total) 
							? "---" : 
							'$' + Number(this.state.total).toFixed(2)} 
						disabled/>
					</div>
					<div className="totals">
						<div className="total-label">Per Student</div>
						<input 
						className="total-output"
						value={isNaN(this.state.total/this.state.students.total) 
							? "---" : 
							'$' + Number(this.state.total/this.state.students.total).toFixed(2)} 
						disabled/>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
