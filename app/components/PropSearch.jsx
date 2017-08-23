import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

import {Dropdown, Input} from 'semantic-ui-react'
import { FaSearch } from 'react-icons/lib/fa'

export default class PropSearch extends React.Component {

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    updateFilter: PropTypes.func.isRequired,
    filter: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  /**
   * When the user adds or removes a property, update the filter used by
   * Views. This in turn will change props.filter which is used as value.
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} props
   * @param {string} props.value - current input
   */
  handleChange = (e, {value}) => {
    this.props.updateFilter(value)
  }

  render() {
    const { options, filter } = this.props

    return (
      <Dropdown
        selection search multiple fluid scrolling
        icon={<FaSearch className='searchIcon' />}
        placeholder='properties...'
        options={options.map(key => ({key:key, text:key, value:key}))}
        onChange={this.handleChange} value={filter}
      />
    )
  }
}
