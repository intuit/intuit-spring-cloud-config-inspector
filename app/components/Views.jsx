import React from 'react';

import {Segment, Divider} from 'semantic-ui-react';


export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    return (
      <Segment>
        Version: af398de444416bb4cd867768b5a363a79b76f5e2
        <Divider />
        A bunch of code
      </Segment>
    )
  }
}
