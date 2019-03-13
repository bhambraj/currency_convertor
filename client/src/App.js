import React, { Component } from 'react';
import Picklist from './Components/Picklist/index';
import Textbox from './Components/Textbox/index';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <div className='row'>
            <Textbox />
            <Picklist />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
