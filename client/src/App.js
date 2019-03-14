import React, { Component } from 'react';
import Picklist from './Components/Picklist/index';
import Textbox from './Components/Textbox/index';

import './App.css';

class App extends Component {
  state = {
    amount: 0,
    currency: '',
    calculatedValue: 0,
    usdEquivalent: 0
  };

  postCurrencyExchange = async (opts = {}) => {
    const response = await fetch('http://localhost:5000/api/getRates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(opts)
    });
    return await response.json();
  };

  handleChange = target => {
    const changedValue = target.value;
    const controlName = target.name;
    const stateToSet = {};
    let controlThatDidNotChange;

    if (controlName === 'amount') {
      controlThatDidNotChange = 'currency';
      stateToSet.amount = changedValue;
    } else {
      controlThatDidNotChange = 'amount';
      stateToSet.currency = changedValue;
    }

    this.setState(stateToSet);

    const valueOfControlThatDidNotChange = this.state[controlThatDidNotChange];
    const canCallApi =
      (changedValue && valueOfControlThatDidNotChange) || false;

    if (!canCallApi) return;
    this.postCurrencyExchange({
      amount: controlName === 'amount' ? changedValue : this.state.amount
    })
      .then(result => {
        const { calculatedValue, usdEquivalent } = result;
        this.setState({
          calculatedValue,
          usdEquivalent
        });
      })
      .catch(err => {
        console.log('err -> ', err, '\n');
      });
  };

  render() {
    const { amount, calculatedValue, currency, usdEquivalent } = this.state;
    return (
      <div className='App'>
        <header className='App-header'>
          <div className='row'>
            <Textbox
              onChangeFn={this.handleChange}
              amount={amount}
              name='amount'
            />
            <Picklist
              onChangeFn={this.handleChange}
              currency={currency}
              name='currency'
            />
          </div>
          <div className='row'>
            <p>
              Exchange Rate of 1 {currency} : {usdEquivalent} USD
              {amount} {currency} = {calculatedValue} USD
            </p>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
