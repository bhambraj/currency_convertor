import React, { Component } from 'react';
const currencies = ['GBP', 'CAD', 'EUR'];

class Picklist extends Component {
  render() {
    return (
      <div className='form-group'>
        <select
          onChange={e => this.props.onChangeFn(e.target)}
          value={this.props.value}
          name={this.props.name}
        >
          <option>Select</option>
          {currencies.map(currency => (
            <option key={currency.toLowerCase()}>{currency}</option>
          ))}
        </select>
      </div>
    );
  }
}

export default Picklist;
