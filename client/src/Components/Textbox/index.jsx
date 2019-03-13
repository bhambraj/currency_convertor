import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
class Textbox extends Component {
  state = {
    value: ''
  };
  handleChange = e => {
    this.setState({
      value: e.currentTarget.value
    });
  };
  render() {
    return (
      <div className='input-group'>
        <div className='input-group-prepend '>
          <span className='input-group-text'>$</span>
        </div>
        <input
          type='text'
          placeholder='Amount'
          onChange={this.handleChange}
          value={this.state.value}
        />
        <div className='input-group-append'>
          <span className='badge badge-danger'>X</span>
        </div>
      </div>
    );
  }
}

export default Textbox;
