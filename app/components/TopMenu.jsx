import React from 'react';

import {Segment, Header, Image} from 'semantic-ui-react';


export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Segment clearing inverted basic>
        <big>
          Config Inspector
        </big>
        <Image verticalAlign='middle' floated='right' src='/images/configservice.png' size='mini' />
      </Segment>
    )
  }
}
