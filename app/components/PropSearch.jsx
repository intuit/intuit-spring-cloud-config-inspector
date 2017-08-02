import React from 'react'
import _ from 'lodash'

import {Dropdown, Input} from 'semantic-ui-react'

const source = _.times(10, (index) => ({
  key: index,
  text: `property ${index}`,
  value: `property ${index}`,
  description: `description ${index}`
}))

export default class PropSearch extends React.Component {
  state = {source}

  handleAddition = (e, {value}) => {
    let label = { color:'red', content:'Not found' }
    this.setState({
      source: [{text:value, value, label}, ...this.state.source]
    })
  }

  renderLabel = (item, index, props) => {
    if (item.label) return {color:'red', content:`Not found: ${item.text}`}
    return {content:item.text}
  }

  render() {
    const { options } = this.props

    return (
      <Dropdown
        selection search multiple fluid scrolling
        icon='search'
        placeholder='properties...'
        options={options.map(key => ({key:key, text:key, value:key}))}
        allowAdditions additionLabel='Custom: '
        onAddItem={this.handleAddition}
        renderLabel={this.renderLabel}
      />
    )
  }
}
