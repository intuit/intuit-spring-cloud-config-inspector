import React from 'react';

import {Segment, Header, Image} from 'semantic-ui-react';

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const logoImgPath = `${window.location.href}/images/configservice.png`;
    return (
      <Segment clearing inverted basic>
        <h3>
          Config Inspector
        </big>
        <Image verticalAlign='middle' floated='right' src={logoImgPath} size='mini' />
      </Segment>
    )
  }
}
