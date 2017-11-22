import React from 'react';

import {Segment, Header, Image} from 'semantic-ui-react';

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const location = window.location
    const logoImgPath = 'https://intuit.github.io/spring-cloud-config-inspector/images/logo.png';
    return (
      <div className='top'>
        <h2 style={{color: 'white'}}>
          <Image verticalAlign='middle' src={logoImgPath} size='mini' spaced />
          {'  '}Config Inspector

        </h2>
      </div>
    )
  }
}
