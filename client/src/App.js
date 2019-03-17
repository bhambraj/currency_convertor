import React, { Component } from 'react';
import Picklist from './Components/Picklist/index';
import Money from './Components/Money/index';

import './App.css';

class App extends Component {
  state = {
    amount: 0, // cannot be set to null as it is passed as a value of input control
    currency: null,
    calculatedValue: null,
    usdEquivalent: null,
    exchangeTime: null
  };

  postCurrencyExchange = async (opts = {}) => {
    const response = await fetch('http://localhost:5000/api/getRates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
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
        const { calculatedValue, usdEquivalent, exchangeTime } = result;
        this.setState({
          calculatedValue,
          usdEquivalent,
          exchangeTime
        });
      })
      .catch(err => {
        throw err;
      });
  };

  clearAmount = () => {
    this.setState({
      amount: 0
    });
  };

  render() {
    const {
      amount,
      calculatedValue,
      currency,
      usdEquivalent,
      exchangeTime
    } = this.state;

    return (
      <div className='App'>
        <div className='App-overlay'>
          <header className='App-header' />
          <div className='app-container'>
            <div className='main-controls'>
              <div className='form-row'>
                <label>Amount:</label>
                <Money
                  className='your-input'
                  onChangeFn={this.handleChange}
                  clearAmountFn={this.clearAmount}
                  amount={amount}
                  name='amount'
                />
              </div>
              <div className='form-row'>
                <label>Currency:</label>
                <Picklist
                  className='your-input'
                  onChangeFn={this.handleChange}
                  currency={currency}
                  name='currency'
                />
              </div>
              {currency && amount && (
                <div className='form-row show-money'>
                  <p>
                    {amount} {currency}
                  </p>
                  <p> {calculatedValue} USD</p>
                </div>
              )}
              {currency && amount && (
                <div className='form-row show-money'>
                  <p> Echange Rate</p>
                  <p>
                    1{currency} = {usdEquivalent} USD
                  </p>
                </div>
              )}
              {currency && amount && (
                <div className='form-row show-money'>
                  <p> Echange Rate as of</p>
                  <p> {exchangeTime}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
