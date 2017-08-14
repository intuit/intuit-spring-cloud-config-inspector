import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

import {Dropdown, Input} from 'semantic-ui-react'

export default class PropSearch extends React.Component {

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  constructor(props) {
    super(props)
  }

  /**
   * When the user adds or removes a property, update parent Views component.
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} props
   * @param {string} props.value - current input
   */
  handleChange = (e, {value}) => {
    this.props.updateFilter(value)
  }

  render() {
    const { options } = this.props

    return (
      <Dropdown
        selection search multiple fluid scrolling
        icon='search'
        placeholder='properties...'
        options={options.map(key => ({key:key, text:key, value:key}))}
        onChange={this.handleChange}
      />
    )
  }
}
