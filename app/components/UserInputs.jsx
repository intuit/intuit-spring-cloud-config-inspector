import React from 'react';

import {Input, Form, Grid, Header, Dropdown} from 'semantic-ui-react';

const options = [
  { key: '1', text: 'P1', value: 'P1' },
  { key: '2', text: 'P2', value: 'P2' },
  { key: '3', text: 'P3', value: 'P3' },
]

export default class UserInputs extends React.Component {
  state = {options}

  constructor(props) {
    super(props)
  }

  handleAddition = (e, {value}) => {
    let label = { color:'red', content:'Not found' }
    this.setState({
      options: [{text:value, value, label}, ...this.state.options]
    })
  }

  renderLabel = (item, index, props) => {
    if (item.label) return {color:'red', content:`Not found: ${item.text}`}
    return {content:item.text}
  }

  render() {
    return (
      <Form>
        <Form.Group widths='equal'>
          <Form.Field control={Input} label='Config URL' placeholder='config url...' />
          <Form.Field control={Input} label='App Name' placeholder='app name...' />
          <Form.Field control={Dropdown} label='Profiles' placeholder='profiles...'
            fluid multiple search selection scrolling
            options={this.state.options}
            allowAdditions additionLabel='Add: ' onAddItem={this.handleAddition}
            renderLabel={this.renderLabel} />
          <Form.Field control={Input} label='Label' placeholder='label...' defaultValue='master' />
        </Form.Group>
      </Form>
    )
  }
}
