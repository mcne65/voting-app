import React, {Component} from 'react'
import axios from 'axios'

import {baseRoute} from '../../utils/api'

class Polls extends Component {
  constructor() {
    super()

    this.state = {
      polls: [],
      page: 1,
      totalPages: 1
    }

    this.handlePageIncrement = this.handlePageIncrement.bind(this)
    this.handlePageDecrement = this.handlePageDecrement.bind(this)
    this.getPills = this.getPolls.bind(this)
  }

  handlePageIncrement() {
    if(this.state.page === this.state.totalPages) { return }

    this.setState({ page: this.state.page-- })

    this.getPolls()
  }

  handlePageDecrement() {
    if(this.state.page === 1) { return }
    
    this.setState({ page: this.state.page++ })
    
    this.getPolls()
  }

  getPolls() {
    const self = this
    axios.get(`${baseRoute}/api/polls/${this.state.page}`)
      .then(response => self.setState({ polls: response.data.polls, totalPages: Math.ceil(response.data.totalPolls / 12) }))
      .then(() => console.log(self))
      .catch(error => console.log(error))
  }

  renderPolls() {
    return this.state.polls.map(poll => <li key={poll.id}><strong>title</strong> {poll.title}</li>)
  }

  componentWillMount() {
    console.log(this.state.polls);
    this.getPills()
  }

  render() {
    return (
      this.state.polls.length === 0
      ? <div>polls page</div>
      : <div>
          <ul>
            {this.renderPolls()}
          </ul>
          <div>totalPages: {this.state.totalPages}</div>
          <button onClick={this.handlePageIncrement}>increment</button>
          <button onClick={this.handlePageDecrement}>decrement</button>
        </div>
    )
  }
}

export default Polls
