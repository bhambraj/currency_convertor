import React, { Component } from 'react';
import Picklist from './Components/Picklist/index';
import Money from './Components/Money/index';

import './App.css';

const apiHostUrl =
  process.env.REACT_APP_HOST_API_URL || 'http://localhost:5000';

class App extends Component {
  state = {
    amount: 0, // cannot be set to null as it is passed as a value of input control
    currency: null,
    calculatedValue: null,
    usdEquivalent: null,
    exchangeTime: null
  };

  postCurrencyExchange = async (opts = {}) => {
    const response = await fetch(`${apiHostUrl}/api/getRates`, {
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

    if (controlName === 'amount') {
      stateToSet.amount = changedValue;
    } else {
      stateToSet.currency = changedValue;
    }
    this.setState(stateToSet);
  };

  clearAmount = () => {
    this.setState({
      amount: 0
    });
  };

  /**
   *
   * @param {*} prevProps
   * @param {*} prevState
   *
   * This function is called anytime component(state) updates
   *
   * It will request the server if amount and currency has valid value
   * and atleast one of them has changed
   * otherwise this function can enter in an infinite loop
   * as we are setting state from server's response
   */
  componentDidUpdate(prevProps, prevState) {
    const amountFromPreviousState = prevState.amount;
    const currencyFromPreviousState = prevState.currency;
    const { amount, currency } = this.state;

    const amountOrCurrencyIsValid =
      amount &&
      currency &&
      (amount !== amountFromPreviousState ||
        currency !== currencyFromPreviousState);

    if (!amountOrCurrencyIsValid) return;
    this.postCurrencyExchange({
      amount
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
  }

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
