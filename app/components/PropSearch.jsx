import React from 'react'
import _ from 'lodash'

import {Dropdown, Input} from 'semantic-ui-react'

const source = _.times(5, (index) => ({
  key: index,
  text: `title ${index}`,
  value: `title ${index}`,
  description: `description ${index}`
}))

export default class PropSearch extends React.Component {
  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, result) => this.setState({ value: result.title })

  handleSearchChange = (e, {value}) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = (result) => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      })
    }, 500)
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
      <Dropdown
        selection search multiple fluid
        icon='search'
        placeholder='properties...'
        options={source}
        loading={isLoading}
        {...this.props}
      />
    )
  }
}
