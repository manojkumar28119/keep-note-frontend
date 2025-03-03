import {Component} from 'react'
import Cookies from 'js-cookie'
import { Link,Redirect } from 'react-router-dom';


 
import './index.css'
import { headers } from 'next/headers';

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = data => {
    const {history} = this.props
    const {jwtToken,username} = data
 
    Cookies.set('jwt_token', jwtToken, {
      expires: 30
    })
    Cookies.set('username',username, {
      expires: 30
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'http://localhost:4000/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const response = await fetch(url, options)

    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderPasswordField = () => {
    const {password} = this.state
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
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
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
    )
  }

  onClickRegisterBtn = () => {
    const {history} = this.props 
    history.replace('/register')
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if(jwtToken !== undefined)
    {
      return <Redirect to="/" />;
    }

    console.log(jwtToken)
      
    return (
      <div className="login-form-container">
        <img
          src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png"
          className="login-image"
          alt="website login"
        />
        <p className='login-text'>Keep your notes</p>
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            className="login-website-logo-desktop-image"
            alt="website logo"
          />
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
        <Link to="/register">
            Register
        </Link>
      </div>
    )
  }
}

export default LoginForm


 