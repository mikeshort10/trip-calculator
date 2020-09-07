import React from 'react';
import './App.scss';
import { map, forEach } from 'lodash';
import { Item } from './components/Item';
import { MetaDatum } from './components/MetaDatum';
import * as d3 from 'd3';
import { CustomMultiplier } from './components/CustomMultiplier';

export const multiplierMap = {
  students: 'Students',
  chaperones: 'Chaperones',
  people: 'People',
  vehicles: 'Vehicles',
  flat: 'Flat',
  other: 'Other'
};

export type Multiplier = keyof typeof multiplierMap;

export interface IItem {
  name: string;
  unitCost: number;
  multiplier: Multiplier;
  other: number;
}

export interface IDatum {
  students: number;
  total: number;
  studentCost: number;
}

interface IProps {}

interface IState {
  students: number;
  studentsPerChaperone: number;
  seatsPerVehicle: number;
  chaperones: number;
  autoCalcChaperones: boolean;
  minStudents: number;
  maxStudents: number;
  items: IItem[];
}

const newItem = (): IItem => ({
  name: '',
  unitCost: 0,
  multiplier: 'flat',
  other: 1
});

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      students: 1,
      chaperones: 1,
      autoCalcChaperones: true,
      studentsPerChaperone: 15,
      seatsPerVehicle: 45,
      minStudents: 1,
      maxStudents: 60,
      items: [
        { name: 'Food', unitCost: 200, multiplier: 'people', other: 1 },
        { name: 'Tickets', unitCost: 20, multiplier: 'students', other: 1 },
        { name: 'Gas', unitCost: 45, multiplier: 'vehicles', other: 1 }
      ]
    };
  }

  get chaperones(): number {
    const {
      autoCalcChaperones,
      chaperones,
      students,
      studentsPerChaperone
    } = this.state;
    const answer = autoCalcChaperones
      ? Math.ceil(students / studentsPerChaperone)
      : chaperones;
    return answer;
  }

  get people(): number {
    const { students } = this.state;
    return this.chaperones + students;
  }

  get vehicles(): number {
    const { seatsPerVehicle } = this.state;
    return Math.ceil(this.people / seatsPerVehicle);
  }

  get total(): number {
    let total = 0;
    forEach(this.state.items, (item, i) => {
      total += this.itemTotal(i);
    });
    return total;
  }

  get studentCost(): number {
    return Math.round((this.total / this.state.students) * 100) / 100;
  }

  svgH = 400;
  svgW = 600;
  svgP = 100;

  createGraph(): void {
    const { minStudents, maxStudents, studentsPerChaperone } = this.state;
    d3.selectAll('rect').remove();
    d3.selectAll('g').remove();
    const dataset: IDatum[] = this.getAdjustedTotals();
    const max = d3.max(dataset, d => d.studentCost) || 0;
    const min = d3.min(dataset, d => d.studentCost) || 0;
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(min - 10, 0), max])
      .range([this.svgH - this.svgP, this.svgP]);
    const xScale = d3
      .scaleLinear()
      .domain([minStudents, maxStudents])
      .range([this.svgP, this.svgW - this.svgP]);

    const w = (this.svgW - this.svgP * 2) / dataset.length;
    const svg = d3.select('svg');

    svg
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('y', d => yScale(d.studentCost))
      .attr('width', () => w * 0.9)
      .attr('x', d => xScale(d.students))
      .attr('height', d => this.svgH - yScale(d.studentCost) - this.svgP)
      .attr('fill', d => (d.studentCost === min ? 'green' : 'blue'))
      .append('title')
      .text(d => {
        const chaperones = Math.ceil(d.students / studentsPerChaperone);
        return `Students: ${d.students}\nChaperones: ${chaperones}\nStudent Cost: $${d.studentCost}\nTotal: $${d.total}`;
      });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    svg
      .append('g')
      .attr('transform', `translate(0, ${this.svgH - this.svgP})`)
      .call(xAxis);

    // Add your code below this line
    svg
      .append('g')
      .attr('transform', `translate(${this.svgP}, 0)`)
      .call(yAxis);
  }

  multipliersByItem = (index: number) => {
    const { other } = this.state.items[index];
    const { students } = this.state;
    return {
      students,
      chaperones: this.chaperones,
      people: this.people,
      flat: 1,
      vehicles: this.vehicles,
      other
    };
  };

  adjustedMultipliers = (index: number, students: number) => {
    const { other } = this.state.items[index];
    const {
      autoCalcChaperones,
      studentsPerChaperone,
      seatsPerVehicle
    } = this.state;
    const chaperones = autoCalcChaperones
      ? Math.ceil(students / studentsPerChaperone)
      : this.state.chaperones;
    return {
      students,
      chaperones,
      people: students + chaperones,
      flat: 1,
      vehicles: Math.ceil(students / seatsPerVehicle),
      other
    };
  };

  itemTotal = (index: number): number => {
    const { unitCost, multiplier } = this.state.items[index];
    const multipliers = this.multipliersByItem(index);
    return multipliers[multiplier] * unitCost;
  };

  adjustedItemTotal = (index: number, students: number): number => {
    const { unitCost, multiplier } = this.state.items[index];
    const multipliers = this.adjustedMultipliers(index, students);
    return multipliers[multiplier] * unitCost;
  };

  adjustedTotal = (students: number): number => {
    let total = 0;
    forEach(this.state.items, (item, i) => {
      total += this.adjustedItemTotal(i, students);
    });
    return total;
  };

  getAdjustedTotals = (): IDatum[] => {
    const { minStudents, maxStudents } = this.state;
    const totals = [];
    for (let i = minStudents; i <= maxStudents; i++) {
      const total = this.adjustedTotal(i);
      const studentCost = Math.round((total / i) * 100) / 100 || 0.01;
      const datum: IDatum = { students: i, total, studentCost };
      totals.push(datum);
    }
    return totals;
  };

  addItem = (): void => {
    const items = [...this.state.items, newItem()];
    this.setState({ items });
  };

  deleteItem = (index: number) => (): void => {
    let { items } = this.state;
    items = items.slice(0, index).concat(items.slice(index + 1));
    return this.setState({ items });
  };

  changeMetaNumbers = (
    key:
      | 'studentsPerChaperone'
      | 'chaperones'
      | 'students'
      | 'seatsPerVehicle'
      | 'minStudents'
      | 'maxStudents'
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { maxStudents, minStudents } = this.state;
      const newProps = { [key]: this.state[key] };
      if (!isNaN(+e.target.value)) {
        let value = +e.target.value;
        if (key === 'minStudents') {
          value = maxStudents < value ? minStudents : value;
          value = Math.max(value, 1);
        } else if (key === 'maxStudents') {
          value = minStudents > value ? maxStudents : value;
        }
        newProps[key] = value;
      }
      this.setState(newProps as Pick<IState, typeof key>);
    };
  };

  toggleBooleans = (key: 'autoCalcChaperones') => {
    return () => {
      const value = !this.state[key];
      this.setState({ [key]: value });
    };
  };

  changeItem = (index: number) => {
    return (key: 'unitCost' | 'name' | 'other' | 'multiplier', value?: any) => {
      return (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ): void => {
        const { items } = this.state;
        const item: IItem = { ...items[index] };
        value = value || e.target.value;
        if (key === 'name') {
          item[key] = value;
        } else if (key === 'multiplier') {
          item.multiplier = value as Multiplier;
        } else {
          if (!isNaN(+value)) {
            item[key] = +value;
          }
        }
        items[index] = item;
        this.setState({ items });
      };
    };
  };

  renderItems = () => {
    return map(this.state.items, (item, i) => {
      const { multiplier } = item;
      return (
        <Item
          key={i}
          item={item}
          multiplierValue={this.multipliersByItem(i)[multiplier]}
          total={this.itemTotal(i)}
          handleBlur={this.changeItem(i)}
          deleteItem={this.deleteItem(i)}
        />
      );
    });
  };

  componentDidMount(): void {
    document
      .getElementsByTagName('body')[0]
      .setAttribute('class', 'calculator');
    this.createGraph();
  }

  render(): JSX.Element {
    const {
      studentsPerChaperone,
      students,
      autoCalcChaperones,
      seatsPerVehicle,
      minStudents,
      maxStudents
    } = this.state;
    this.createGraph();
    const customMultiplierProps = {
      students,
      vehicles: this.vehicles,
      chaperones: this.chaperones,
      people: this.people
    };
    return (
      <div>
        <div id="metadata-and-graph">
          <table>
            <tbody>
              <MetaDatum
                label={multiplierMap['students']}
                value={students}
                handleChange={this.changeMetaNumbers('students')}
              />
              <MetaDatum
                label={multiplierMap['chaperones']}
                disabled={autoCalcChaperones}
                value={this.chaperones}
                handleChange={this.changeMetaNumbers('chaperones')}
              />
              <MetaDatum
                label="Students Per Chaperone"
                disabled={!autoCalcChaperones}
                value={studentsPerChaperone}
                handleChange={this.changeMetaNumbers('studentsPerChaperone')}
              />
              <MetaDatum
                label="Seats Per Vehicle"
                value={seatsPerVehicle}
                handleChange={this.changeMetaNumbers('seatsPerVehicle')}
              />
              <MetaDatum
                label="Min Students"
                value={minStudents}
                handleChange={this.changeMetaNumbers('minStudents')}
              />
              <MetaDatum
                label="Max Students"
                value={maxStudents}
                handleChange={this.changeMetaNumbers('maxStudents')}
              />
              <CustomMultiplier {...customMultiplierProps} />
            </tbody>
          </table>
          <svg height={this.svgH} width={this.svgW} />
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Unit Cost</th>
              <th>Multiplier Type</th>
              <th>Multiplier Value</th>
              <th>Total</th>
              <th>
                <button onClick={this.addItem}>Add Item</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.renderItems()}
            <tr>
              <td />
              <td>
                <input disabled={true} value={this.studentCost} />
              </td>
              <td />
              <td />
              <td>
                <input disabled={true} value={this.total} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
