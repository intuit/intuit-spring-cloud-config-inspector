import React from 'react';
import Jumbotron from './jumbotron.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './app.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName='app'
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        <Jumbotron className="custom"></Jumbotron>
        <p>Hello, world!</p>
      </ReactCSSTransitionGroup>
    )
  }
}
