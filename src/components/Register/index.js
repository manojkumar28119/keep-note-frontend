import { Component } from 'react';
import Cookies from 'js-cookie';
import {Link,Redirect} from 'react-router-dom';
 

import './index.css';

class Register extends Component {
  state = {
    username: '',
    name: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  };
  

  onChangeUsername = event => {
    this.setState({ username: event.target.value });
  };

  onChangeName = event => {
    this.setState({ name: event.target.value });
  };

  onChangePassword = event => {
    this.setState({ password: event.target.value });
  };


  onSubmitFailure = errorMsg => {
    this.setState({ showSubmitError: true, errorMsg });
  };

  submitForm = async event => {
    event.preventDefault();
    const { username, name, password } = this.state;
    const userDetails = { username, name, password };
    const url = 'http://localhost:4000/register';
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(url, options);
    
    if (response.ok === true) {
      console.log("user created")
      const {history} = this.props 
      history.replace("/")
    } else {
      console.log("user not created")
      const data = response.json()
      this.onSubmitFailure(data.error_msg)
    }
  };

  renderUsernameField = () => {
    const { username } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    );
  };

  renderNameField = () => {
    const { name } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="name">
          NAME
        </label>
        <input
          type="text"
          id="name"
          className="username-input-field"
          value={name}
          onChange={this.onChangeName}
          placeholder="Name"
        />
      </>
    );
  };

  renderPasswordField = () => {
    const { password } = this.state;
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    );
  };

  render() {
    const { showSubmitError, errorMsg } = this.state;
    const jwtToken = Cookies.get('jwt_token');

    if (jwtToken !== undefined) {
      return  <Redirect to="/"/>;
    }

    return (
      <div className="login-form-container">
        <img
          src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png"
          className="login-image"
          alt="website login"
        />
        <p className="login-text">Create your account</p>
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            className="login-website-logo-desktop-image"
            alt="website logo"
          />
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderNameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Register
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
        <Link to="/signin">
          login here
        </Link>
      </div>
    );
  }
}

export default Register;
