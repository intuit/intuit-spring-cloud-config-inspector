import React from 'react';

export default class Jumbotron extends React.Component {
  render() {
    return (
      <div {...this.props}>
        <h1>{this.props.children}</h1>
      </div>
    )
  }
}
