import React from 'react';
import {
  createCustomMultiplier,
  IMultipliers
} from '../../utils/customMultiplier';

interface IState {
  name: string;
  customMultiplier: string;
}

interface IProps extends IMultipliers {}

export class CustomMultiplier extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { name: '', customMultiplier: '' };
  }

  handleChange = (key: keyof IState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newProps = { [key]: e.target.value };
    this.setState(newProps as Pick<IState, keyof IState>);
  };

  render(): JSX.Element {
    const { name, customMultiplier } = this.state;
    return (
      <div>
        <input
          placeholder="Name"
          value={name}
          onChange={this.handleChange('name')}
        />
        <input
          placeholder="students / 8"
          value={customMultiplier}
          onChange={this.handleChange('customMultiplier')}
        />
        <input
          disabled={true}
          value={createCustomMultiplier(this.props)(customMultiplier)}
        />
      </div>
    );
  }
}
