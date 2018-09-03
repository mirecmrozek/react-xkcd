import React, {Component, Fragment} from 'react'
import {withRouter} from 'react-router-dom'
import {Button, ButtonGroup, UncontrolledCollapse, Card, CardBody} from 'reactstrap'

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
  componentWillReceiveProps(nextProps) {
    if (this.state.id !== Number(nextProps.history.location.pathname.slice(12))){
      this.loadComic(Number(nextProps.history.location.pathname.slice(12)))
    }
  }
  handleKeydown(event) {
    const {key, altKey} = event
    const {id} = this.state
    if (altKey && key === 'ArrowLeft'){} // not to override alt+ArrowLeft functionality
    else if (altKey && key === 'ArrowRight'){}
    else if (key === 'ArrowLeft' ||
      key === 'a' ||
      key === 'A')
      this.goToPage(id-1)
    else if (key === 'ArrowRight' ||
      key === 'd' ||
      key === 'D')
      this.goToPage(id+1)
    else if (key === 'r' ||
      key === 'R')
      this.goToPage(this.randomInt(1,2039))
  }
  loadComic(id = this.props.location.pathname.slice(12)) {
    if (this.state && this.state.comics[Number(id)]) {
      const {img, title, alt, transcript} = this.state.comics[Number(id)]
      this.setState({img, title, alt, id, transcript})
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
    this.props.history.push('/react-xkcd/'.concat(n))
  }
  randomInt(from, to) {
    return Math.floor((Math.random() * to) + from);
  }
  render() {
    const navigation =
      <div className="navigation-wrapper">
        <ButtonGroup>
          <Button color="primary" onClick={() => this.goToPage(1)}>{'<<'}</Button>
          <Button color="primary" onClick={() => this.goToPage(this.state.id - 1)}>Prev</Button>
          <Button color="primary" onClick={() => this.goToPage(this.randomInt(1, 2039))}>Random</Button>
          <Button color="primary" onClick={() => this.goToPage(this.state.id + 1)}>Next</Button>
          <Button color="primary" active={false} onClick={() => this.goToPage()}>{'>>'}</Button>
        </ButtonGroup>
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
        <p className="bodyText">
          <strong>Alt text: </strong>
          {this.state.alt}
        </p>
        {this.state.transcript &&
            <Fragment>
              <Button color="primary" id="toggler" className="mb-1">Transcript</Button>
              <UncontrolledCollapse toggler="#toggler">
                <Card className="bodyText">
                  <CardBody>
                    {this.state.transcript}
                  </CardBody>
                </Card>
              </UncontrolledCollapse>
            </Fragment>}
        {navigation}
        <a href={'https://www.explainxkcd.com/wiki/index.php/'.concat(this.state.id)}>Don't get the joke?</a>
        <br />
        <a href={'https://xkcd.com/'.concat(this.state.id)}>This comic on xkcd</a>
        <br />
      </div>
    )
  }
}

export default withRouter(Comic)
