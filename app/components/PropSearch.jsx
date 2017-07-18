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
    const { isLoading, value, results } = this.state

    return (
      <Dropdown
        selection search multiple fluid scrolling
        icon='search'
        placeholder='properties...'
        options={this.state.source}
        loading={isLoading}
        allowAdditions additionLabel='Custom: '
        onAddItem={this.handleAddition}
        renderLabel={this.renderLabel}
        {...this.props}
      />
    )
  }
}
