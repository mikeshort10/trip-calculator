import React from 'react';

interface IProps {
  label: string;
  value: number;
  disabled?: boolean;
  handleChange(e: React.FocusEvent<HTMLInputElement>): void;
}

interface IState {
  value: string | number;
}

export class MetaDatum extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { value: this.props.value };
  }

  updateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };

  componentDidUpdate(prevProps: IProps): void {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  render(): JSX.Element {
    const { label, handleChange } = this.props;
    const disabled = !!this.props.disabled;
    return (
      <tr key={label}>
        <td>{label}</td>
        <td className="metadata-input">
          <input
            value={this.state.value}
            type="number"
            min={0}
            disabled={disabled}
            onChange={this.updateInput}
            onBlur={handleChange}
          />
        </td>
      </tr>
    );
  }
}
