import React, { Component } from 'react';
import Input from './loginInput';

import { loginAction } from './dataHandler';
import { redirectToDashboard } from '../../common/helpers';
import { getStyles, updateLocalStorage } from './helpers';
import { validatePayload } from './validate';
// Import Component Specific Styling
import './Login.scss';
import MessageBox from '../MessageBox';
import LoadingIndicator from '../LoadingIndicator';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      emailError: '',
      passwordError: '',
      disabled: false,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.enterFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.enterFunction, false);
  }

  setLocalState = (state, callback) => {
    this.setState(
      {
        ...this.state,
        ...state,
      },
      () => {
        if (callback) {
          callback();
        }
      },
    );
  };

  handleOnClick = event => {
    const payload = {
      email: this.email.state.value,
      password: this.password.state.value,
    };
    if (validatePayload.bind(this, payload)()) {
      const successCallback = response => {
        this.setLocalState(
          { error: '' },
          (response => {
            updateLocalStorage(response);
            redirectToDashboard();
          }).bind(undefined, response),
        );
      };
      const errorCallback = response => {
        this.setLocalState({
          error: response.data.email,
          disabled: false,
        });
      };

      loginAction(
        JSON.stringify(payload),
        successCallback.bind(this),
        errorCallback,
      );

      this.setLocalState({ disabled: true });
    }
  };

  handleErrorClose = () => {
    this.setLocalState({ error: '' });
  };

  enterFunction = event => {
    if (event.keyCode === 13) {
      this.handleOnClick();
    }
  };

  render() {
    return (
      <div className="login-wrapper">
        <div
          className={
            this.state.error === ''
              ? 'login-wrapper-header'
              : 'login-wrapper-header error-visible'
          }
        >
          <span className="catalog-logo d-block" />
          {this.state.error !== '' && (
            <MessageBox
              messageType="message-error"
              messageText={this.state.error}
              handleClose={this.handleErrorClose}
            />
          )}
        </div>
        <div
          className={`login-wrapper-content ${
            this.state.disabled ? 'disabled' : ''
          }`}
        >
          <Input
            header={{
              type: 'text',
              title: 'Username',
              placeholder: 'Enter username',
              name: 'username',
              className: this.state.emailError || '',
            }}
            ref={input => {
              this.email = input;
            }}
          />
          <Input
            header={{
              title: 'Password',
              type: 'password',
              placeholder: 'Enter password',
              name: 'password',
              className: this.state.passwordError || '',
            }}
            ref={input => {
              this.password = input;
            }}
          />
          <button
            type="button"
            className={`login-action primary-cta ${
              this.state.disabled ? 'disabled' : ''
            }`}
            onClick={this.handleOnClick}
          >
            {this.state.disabled ? (
              <LoadingIndicator {...getStyles()} color="white" />
            ) : (
              'Log in'
            )}
          </button>
        </div>
      </div>
    );
  }
}
