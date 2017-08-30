import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

// also includes withRouter
import RequireNoAuth from '../hoc/RequireNoAuth'
import {baseRoute} from '../../utils/api'

class Signup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      invalidSubmission: false,
      invalidUsername: false,
      invalidEmail: false,
      passwordsMatch: true,
      submissionError: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.checkusernameAvailability = this.checkUsernameAvailability.bind(this)
    this.confirmPasswordsMatch = this.confirmPasswordsMatch.bind(this)
    this.checkEmailAvailability = this.checkEmailAvailability.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // *** form input and availability checking methods ***
  // only returns true when all values are true. This prevents error message from going away on invalid input
  updateSubmissionStatus() {
    const {
      invalidUsername, 
      invalidEmail,
      passwordsMatch
    } = this.state

    if(!invalidEmail && !invalidUsername && passwordsMatch) {
      return this.setState({invalidSubmission: false})
    }

    this.setState({ invalidSubmission: true })
  }

  checkUsernameAvailability(e) {
    const self = this

    if(e.target.value === '') { return }

    axios.get(`${baseRoute}/api/signup/usernameIsused/${e.target.value}`)
      .then(response => {
        const {used} = response.data

        if(!used) {
          self.setState({ invalidUsername: used })
          self.updateSubmissionStatus()
          return
        }
        
        self.setState({
          invalidUsername: used,
          invalidSubmission: true,
          submissionError: 'Username Is Already In Use'
        })
      })
      .catch(err => console.log(err))
  }

  checkEmailAvailability(e) {
    const self = this

    if(e.target.value === '') { return }

    axios.get(`${baseRoute}/api/signup/emailIsused/${e.target.value}`)
      .then(response => {
        const {used} = response.data

        if(!used) {
          self.setState({ invalidEmail: used })
          self.updateSubmissionStatus()
          return
        }
        
        self.setState({
          invalidEmail: used,
          invalidSubmission: true,
          submissionError: 'Email Is Already In Use'
        })
      })
      .catch(err => console.log(err))
  }

  confirmPasswordsMatch(e) {
    // event value is used instead of state confirmPassword to avoid issues with set state async execution
    if(this.state.password !== e.target.value) {
      return this.setState({
        passwordsMatch: false,
        invalidSubmission: true,
        submissionError: 'Expected Passwords To Match'
      })
    }

    this.setState({ passwordsMatch: true }, () => this.updateSubmissionStatus())
  }
  
  // *** event handlers ***
  handleInputChange(e) {
    const maxInputSize = 72

    if(e.target.value.length > maxInputSize) { return }

    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    const user = this

    if(user.state.invalidSubmission) { return console.log('enter valid input for each field') } // FIXME: handle this better?

    axios.post(`${baseRoute}/api/signup`, { 
        username: user.state.username,
        email: user.state.email,
        password: user.state.password
      })
      .then(response => localStorage.setItem('userData', JSON.stringify(response.data)))
      .then(() => this.props.updateAuth('', true))
      .then(() => this.props.history.push('/'))
      .catch(error => this.props.updateAuth('internal error, please wait a minute and try again', false))
  }

  render() {
    return (
      <div className="uk-flex uk-flex-center">
        <div className="uk-card uk-card-default uk-width-1-2@s uk-width-1-3@m uk-animation-slide-top-small">
          <div className="uk-card-header uk-card-primary">
            <h3 className="card-title">Sign Up</h3>
          </div>

          <div className="uk-card-body">
            <form onSubmit={this.handleSubmit} className="uk-form-stacked">
              {this.state.invalidSubmission
                ? <div className={`uk-margin uk-text-danger ${this.state.invalidSubmission ? 'uk-animation-slide-bottom' : 'uk-animation-slide-top uk-animation-reverse'}`}>{this.state.submissionError}</div> 
                : ''
              }
              
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="username">Username</label>
                <input
                  className={`uk-input ${this.state.invalidUsername ? 'uk-form-danger' : ''}`}
                  type="text"
                  name="username"
                  placeholder="urAvgVoter"
                  value={this.state.username}
                  onChange={(e) => { this.checkUsernameAvailability(e); this.handleInputChange(e) }}
                />
              </div>

              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="email">Email</label>
                <input
                  className={`uk-input ${this.state.invalidEmail ? 'uk-form-danger' : ''}`}
                  type="email" 
                  name="email" 
                  placeholder="example@email.com"
                  value={this.state.email}
                  onChange={(e) => { this.checkEmailAvailability(e); this.handleInputChange(e) }}
                />
              </div>

              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="password">Password</label>
                <input 
                  className={`uk-input ${this.state.passwordsMatch ? '' : 'uk-form-danger'}`}
                  type="password" 
                  name="password"
                  placeholder="Don't worry, I wont tell anyone"
                  value={this.state.password}
                  onChange={this.handleInputChange} 
                />
              </div>

              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  className={`uk-input ${this.state.passwordsMatch ? '' : 'uk-form-danger'}`}
                  type="password"
                  name="confirmPassword"
                  placeholder="One more time!"
                  value={this.state.confirmPassword}
                  onChange={(e) => { this.handleInputChange(e); this.confirmPasswordsMatch(e); }}
                />
              </div>
      
              <div className="uk-margin">
                <button className="uk-button uk-button-primary">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

Signup.propTypes = {
  updateAuth: PropTypes.func.isRequired
}

export default RequireNoAuth(Signup)
