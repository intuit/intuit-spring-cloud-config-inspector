import React from 'react'
import PropTypes from 'prop-types'

import {Dropdown, Input} from 'semantic-ui-react'
import { FaSearch } from 'react-icons/lib/fa'

export default class PropSearch extends React.Component {

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    updateFilter: PropTypes.func.isRequired,
    filter: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  constructor() {
    super()
    this.state = {
      value: []
    }
  }

  /**
   * Filter out properties that do not exist in options
   *
   * @param {object} nextProps
   * @param {string[]} nextProps.filter - search values from app
   * @param {string[]} nextProps.options - current key values
   */
  componentWillReceiveProps = ({filter, options}) => {
    const optionsSet = new Set(options)
    const value = filter.filter(p => optionsSet.has(p))
    this.setState({value})
  }

  /**
   * When the user adds or removes a property, update the filter used by
   * Views. Also update value.
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} props
   * @param {string} props.value - current input
   */
  handleChange = (e, {value}) => {
    this.setState({value})
    this.props.updateFilter(value)
  }

  render() {
    const { options } = this.props
    const { value } = this.state

    return (
      <Dropdown
        selection search multiple fluid scrolling
        icon={<FaSearch className='searchIcon' />}
        placeholder='properties...'
        options={options.map(key => ({text:key, value:key}))}
        onChange={this.handleChange} value={value}
      />
    )
  }
}
