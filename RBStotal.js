<Form>
	<InputGroup>
		<InputGroup.Prepend>
			<InputGroup.Text>Total $</InputGroup.Text>
		</InputGroup.Prepend>
		<Form.Control 
		value={isNaN(this.state.total) 
			? "---" : 
			Number(this.state.total).toFixed(2)} 
		disabled/>
	</InputGroup>
	<InputGroup>
		<InputGroup.Prepend>
			<InputGroup.Text>Cost Per Student</InputGroup.Text>
		</InputGroup.Prepend>
		<Form.Control 
		value={isNaN(this.state.total/this.state.students.total)
			? "---" 
			: (this.state.total/this.state.students.total).toFixed(2)} 
		disabled/>
	</InputGroup>
	<InputGroup>
		<InputGroup.Prepend>
			<Dropdown>
				<Dropdown.Toggle split>
					{Number(this.state.upcharge) * 100 + "% Upcharge"}
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<Dropdown.Item 
					onClick={() => this.adjustUpcharge(0)}>
						0% Upcharge
					</Dropdown.Item>
					<Dropdown.Item 
					onClick={() => this.adjustUpcharge(0.05)}>
						5% Upcharge
					</Dropdown.Item>
					<Dropdown.Item 
					onClick={() => this.adjustUpcharge(0.1)}>
						10% Upcharge
					</Dropdown.Item>
					<Dropdown.Item 
					onClick={() => this.adjustUpcharge(0.15)}>
						15% Upcharge
					</Dropdown.Item>
					<Dropdown.Item 
					onClick={() => this.adjustUpcharge(0.20)}>
						20% Upcharge
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</InputGroup.Prepend>
		<Form.Control 
		value={isNaN(this.state.total/this.state.students.total)
			? "---" 
			: (this.state.total/this.state.students.total*this.state.upcharge).toFixed(2)} 
		disabled/>
	</InputGroup>
</Form>