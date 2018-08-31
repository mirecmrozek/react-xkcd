import React, {Component} from 'react'
import {Route, withRouter} from 'react-router-dom'

import Comic from './components/Comic'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" component={Comic} />
      </div>
    )
  }
}

export default withRouter(App)
