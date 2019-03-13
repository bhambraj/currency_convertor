import React, { Component } from 'react';
const currencies = ['GBP', 'CAD', 'EUR'];

class Picklist extends Component {
  state = {
    value: 'Select'
  };

  handleChangeEvent = e => {
    this.setState({
      value: e.currentTarget.value
    });
  };

  render() {
    return (
      <div className='form-group'>
        <select onChange={this.handleChangeEvent} value={this.state.value}>
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
