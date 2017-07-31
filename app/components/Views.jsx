import React from 'react';

import {Segment, Divider} from 'semantic-ui-react';
import JSONPretty from 'react-json-pretty';
import './json.styl';


export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    return (
      <div>
        <Segment attached='top'>
          Version: af398de444416bb4cd867768b5a363a79b76f5e2
        </Segment>
        <Segment attached='bottom' className='view'>
          <JSONPretty id='json-pretty' json={sample}></JSONPretty>
        </Segment>
      </div>
    )
  }
}
