import React, { Component } from 'react';
import Picklist from './Components/Picklist/index';
import Money from './Components/Money/index';
import io from 'socket.io-client';

import './App.css';

const apiHostUrl =
  process.env.REACT_APP_HOST_API_URL || 'http://localhost:5000';
const socket = io.connect(apiHostUrl);

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

  componentDidMount() {
    // Updates the UI(set state) every 100ms from server data
    socket.on('real_time_updates', realTimeData => {
      this.setState(realTimeData);
    });
  }
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
    const { currency, amount } = this.state;

    const amountOrCurrencyHasChanged =
      amount &&
      currency &&
      (amount !== amountFromPreviousState ||
        currency !== currencyFromPreviousState);

    if (!amountOrCurrencyHasChanged) return;
    /*
     * ======================= Sockets =========================
     * Emit amount and currency to the server if anything has changed
     */
    socket.emit('amount_or_currency_changed', {
      amount,
      currency
    });
    socket.on('server_calculations_changed', data => {
      const { calculatedValue, usdEquivalent, exchangeTime } = data;
      this.setState({
        calculatedValue,
        usdEquivalent,
        exchangeTime
      });
    });
    return;
  }

  render() {
    const {
      amount,
      calculatedValue,
      currency,
      usdEquivalent,
      exchangeTime
    } = this.state;
    const amountAndCurrencyArePopulated = (amount && currency) || false;

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
              {amountAndCurrencyArePopulated && (
                <div className='form-row show-money'>
                  <p>
                    {amount} {currency}
                  </p>
                  <p> {calculatedValue} USD</p>
                </div>
              )}
              {amountAndCurrencyArePopulated && (
                <div className='form-row show-money'>
                  <p> Echange Rate</p>
                  <p>
                    1{currency} = {usdEquivalent} USD
                  </p>
                </div>
              )}
              {amountAndCurrencyArePopulated && (
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
