import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'

import './Comic.css'

class Comic extends Component {
  componentWillMount() {
    this.setState({
      img: 'image',
      title: 'image',
      alt: 'alt',
    })
    const id = this.props.location.pathname.slice(1)
    fetch('https://xkcd.now.sh/'.concat(id), {
      mode: 'cors',
    })
      .then(function(response) {
        return response.json()
      })
      .then(({img, title, alt}) => {
        this.setState({img, title, alt})
      })
  }
  render() {
    return (
      <div className="container">
        <h1>{this.state.title}</h1>
        <div className="image-wrapper">
          <img className="comic" src={this.state.img} alt="comic" />
        </div>
        <h3>Alt text</h3>
        <p>{this.state.alt}</p>
      </div>
    )
  }
}

export default withRouter(Comic)
