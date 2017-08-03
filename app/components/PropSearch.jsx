import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

import {Dropdown, Input} from 'semantic-ui-react'

const source = _.times(10, (index) => ({
  key: index,
  text: `property ${index}`,
  value: `property ${index}`,
  description: `description ${index}`
}))

export default class PropSearch extends React.Component {

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {source}
  }

  /**
   * When user adds a profile that does not exist in search
   * results, add label 'Not found' to new input
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} props
   * @param {string} props.value - current input
   */
  handleAddition = (e, {value}) => {
    let label = { color:'red', content:'Not found' }
    this.setState({
      source: [{text:value, value, label}, ...this.state.source]
    })
  }

  /**
   * item.label returns true if the item (property input) was
   * an addition. If true add label to option in Dropdown menu.
   *
   * @param {object} item - A currently active dropdown item.
   * @param {number} index - The current index.
   * @param {object} props - The default props for an active item Label.
   * @returns Shorthand for a Label.
   */
  renderLabel = (item, index, props) => {
    if (item.label) {
      return {color:'red', content:`Not found: ${item.text}`}
    }
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
