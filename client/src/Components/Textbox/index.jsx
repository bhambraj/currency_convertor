import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Textbox extends Component {
  render() {
    return (
      <div className='input-group'>
        <div className='input-group-prepend '>
          <span className='input-group-text'>$</span>
        </div>
        <input
          type='number'
          name={this.props.name}
          placeholder='Amount'
          onChange={e => this.props.onChangeFn(e.target)}
          value={this.props.value}
        />
        <div className='input-group-append'>
          <span className='badge badge-danger'>X</span>
        </div>
      </div>
    );
  }
}

export default Textbox;
