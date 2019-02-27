import React from 'react';

function Multipliers (props) {

	return(
		<button
		className="choice"
		type="button"
		onClick={props.click} 
		value={props.title}>
			{props.title}
		</button>)
}

export default function DdMenu (props) {

	function renderDropdownItems (options) {
		let arr = [];
		for (let i = 0; i < options.length; i++) {
			arr.push(<Multipliers 
				key={i} 
				click={click}
				title={options[i]} 
				num={props.num} 
				handleChange={props.handleChange}/>)
		}
		return arr;
	}

	return (<div className="ddmenu">
				<button 
				className="ddbutton"
				type="button" 
				onClick={openClose}>
				{props.lineItem.multiplier}
				</button>
				<div 
				tabindex={0} 
				className="better-select">
					<div id={`select-menu-${props.num}`}  className="select-menu">
						{renderDropdownItems([
							"Flat Rate", 
							"Per Student", 
							"Per Chaperone", 
							"Per Person", 
							"Per Vehicle", 
							"Per Hotel Room"
						])}
						<input 
						min={1}
						type="number" 
						onBlur={click} 
						placeholder="Custom Number"/>
					</div>
				</div>
			</div>)
}