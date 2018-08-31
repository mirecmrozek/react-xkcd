import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'

import './Comic.css'

class Comic extends Component {
  componentWillMount() {
    this.setState({
      img: 'image',
      title: 'image',
      alt: 'alt',
      id: '',
      transcript: '',
      comics: {},
    })
    this.loadComic()
    document.addEventListener("keydown", (event) => this.handleKeydown(event), false);
  }
  componentWillUnmount() {
    document.removeEventListener("keyPress", (event) => this.handleKeydown(event), false);
  }
  handleKeydown({key}) {
    const {id} = this.state
    if (key === 'ArrowLeft' ||
      key === 'a' ||
      key === 'A')
      this.goToPage(id-1)
    else if (key === 'ArrowRight' ||
      key === 'd' ||
      key === 'D')
      this.goToPage(id+1)
  }
  loadComic(id = this.props.location.pathname.slice(1)) {
    if (this.state && this.state.comics[Number(id)]) {
      const {img, title, alt} = this.state.comics[Number(id)]
      this.setState({img, title, alt, id})
    } else {
      fetch('https://xkcd.now.sh/'.concat(id))
        .then(function(response) {
          return response.json()
        })
        .then(({img, title, alt, num, transcript}) => {
          this.setState({
            img,
            title,
            alt,
            id: num,
            transcript,
            comics: {...this.state.comics, [num]: {img, title, alt, transcript}},
          })
        })
        .catch((error) => {
          if (id === '' || id === '/'){
            return
          }
          this.loadComic('/')
        })
    }
  }
  goToPage(n = '') {
    this.props.history.push('/'.concat(n))
    this.loadComic(n)
  }
  randomInt(from, to) {
    return Math.floor((Math.random() * to) + from);
  }
  render() {
    const navigation =
      <div className="navigation-wrapper">
        <button onClick={() => this.goToPage(1)}>{'<<'}</button>
        <button onClick={() => this.goToPage(this.state.id - 1)}>Prev</button>
        <button onClick={() => this.goToPage(this.randomInt(1, 2039))}>Random</button>
        <button onClick={() => this.goToPage(this.state.id + 1)}>Next</button>
        <button onClick={() => this.goToPage()}>{'>>'}</button>
      </div>
    return (
      <div className="container">
        <h1>{this.state.title}</h1>
        {navigation}
        <br />
        <div className="image-wrapper">
          <img className="comic" src={this.state.img} alt="Possibly a game, try link to original page" />
          <div id="left-image-overlay"></div>
        </div>
        <br />
        <p>
          <strong>Alt text: </strong>
          {this.state.alt}
        </p>
        <br />
        {navigation}
        <br />
        <p>{this.state.transcript}</p>
        <br />
        <a href={'https://xkcd.com/'.concat(this.state.id)}>This comic on xkcd</a>
        <br />
        <br />
        <a href={'https://www.explainxkcd.com/wiki/index.php/'.concat(this.state.id)}>Don't get the joke?</a>
        <br />
        <br />
      </div>
    )
  }
}

export default withRouter(Comic)
