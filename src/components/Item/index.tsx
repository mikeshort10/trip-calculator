import React from 'react';
import { IItem, Multiplier, multiplierMap } from '../../App';
import { keys, map } from 'lodash';
import round from '../../utils/round';

interface ISelectProps {
  multiplier: Multiplier;
  handleChange(e: React.ChangeEvent<HTMLSelectElement>): void;
}

const Select = (props: ISelectProps): JSX.Element => {
  const { multiplier, handleChange } = props;
  const options = map(keys(multiplierMap), (key: Multiplier) => (
    <option key={key} value={key}>
      {multiplierMap[key]}
    </option>
  ));
  return (
    <select key="multiplier" value={multiplier} onChange={handleChange}>
      {options}
    </select>
  );
};

interface IItemProps {
  item: IItem;
  total: number;
  multiplierValue: number;
  handleBlur(
    key: keyof IItem,
    value?: any
  ): (
    e: React.ChangeEvent<HTMLSelectElement> | React.FocusEvent<HTMLInputElement>
  ) => void;
  deleteItem(e: React.MouseEvent<HTMLButtonElement>): void;
}

interface IItemState {
  name: string;
  multiplier: string;
  unitCost: string;
  other: string;
}

export class Item extends React.Component<IItemProps, IItemState> {
  constructor(props: IItemProps) {
    super(props);
    const { unitCost, other, ...stringProps } = this.props.item;
    this.state = {
      ...stringProps,
      unitCost: unitCost.toFixed(2),
      other: other.toFixed(2)
    };
  }

  // handleChange = (key: keyof IItemState) => {
  //   return (e: React.ChangeEvent<HTMLInputElement>): void => {
  //     let value: number | string = e.target.value;
  //     if (!isNaN(+value)) {
  //       value = Math.min(+value, 9999);
  //     } else if (key !== 'name') {
  //       return;
  //     }
  //     const newProps: unknown = { [key]: value };
  //     this.setState(newProps as Pick<IItemState, typeof key>);
  //   };
  // };

  handleChange = (key: keyof IItemState) => {
    return (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (e.target.value !== '') {
        const newProps: unknown = { [key]: e.target.value };
        this.setState(newProps as Pick<IItemState, typeof key>);
      }
    };
  };

  checkOnBlur = (key: keyof IItemState) => (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const val = this.props.item[key] as number;
    let newProps: unknown = { [key]: val.toFixed(2) };
    if (!isNaN(+e.target.value)) {
      const value = round(+e.target.value);
      newProps = { [key]: value.toFixed(2) };
      this.props.handleBlur(key, value)(e);
    }
    this.setState(newProps as Pick<IItemState, typeof key>);
  };

  render(): JSX.Element {
    const { handleBlur, total, deleteItem, multiplierValue } = this.props;
    const { unitCost, name } = this.state;
    return (
      <tr>
        <td>
          <input
            key="name"
            value={name}
            onChange={this.handleChange('name')}
            onBlur={handleBlur('name')}
          />
        </td>
        <td>
          <input
            key="unitCost"
            type="number"
            value={unitCost}
            onChange={this.handleChange('unitCost')}
            onBlur={this.checkOnBlur('unitCost')}
          />
        </td>
        <td>
          <Select
            multiplier={this.props.item.multiplier}
            handleChange={handleBlur('multiplier')}
          />
        </td>
        <td>
          <input
            disabled={this.props.item.multiplier !== 'other'}
            type="number"
            value={multiplierValue}
            onChange={this.handleChange('other')}
            onBlur={this.checkOnBlur('other')}
          />
        </td>
        <td>
          <input
            key="total"
            type="number"
            disabled={true}
            value={total.toFixed(2)}
          />
        </td>
        <td>
          <button className="delete-button" onClick={deleteItem}>
            Delete
          </button>
        </td>
      </tr>
    );
  }
}
