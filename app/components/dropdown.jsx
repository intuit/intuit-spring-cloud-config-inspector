import React from 'react'
import _ from 'lodash'

import {Accordion} from 'semantic-ui-react'
import 'semantic-ui-css/components/accordion.min.css'

export default class DropDown extends React.Component {
  render() {
    const panels = [
      {
        title: 'First option',
        content: 'First content'
      },
      {
        title: 'Second option',
        content: 'Second content'
      }
    ]
    return (
      <Accordion {...this.props}
        panels={panels}
        exclusive={false}
        fluid styled />
    )
  }
}
