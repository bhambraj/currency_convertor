import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import './index.css';

class Money extends Component {
  render() {
    return (
      <div className='input-group'>
        <input
          className='form-control'
          type='number'
          min='0'
          name={this.props.name}
          placeholder='Amount'
          onChange={e => this.props.onChangeFn(e.target)}
          value={this.props.amount}
        />
        <span
          className='input-group-addon btn btn-danger mobile-visible-only'
          onClick={this.props.clearAmountFn}
        >
          X
        </span>
      </div>
    );
  }
}

export default Money;
