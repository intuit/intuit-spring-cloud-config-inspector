import React from 'react';

import { Form, Label, Menu } from 'semantic-ui-react';

const options = [
  { key: 'default', text: 'default', value: 'default' },
  { key: 'P1', text: 'P1', value: 'P1' },
  { key: 'P2', text: 'P2', value: 'P2' },
  { key: 'P3', text: 'P3', value: 'P3' },
]

export default class UserInputs extends React.Component {
  state = {options, index: 0, button: 'Show', toggle: this.props.toggle}

  constructor(props) {
    super(props)
  }

  handleAddition = (e, {value}) => {
    if (!this.state.options.find( (option) => option.value === value )) {
      let label = { color:'red', content:'Not found' }
      this.setState({
        options: [{text:value, value, label}, ...this.state.options]
      })
    }
  }

  renderLabel = (item, index, props) => {
    if (item.label) return {color:'red', content:`Not found: ${item.text}`}
    return {content:item.text}
  }

  handleURLChange = (e, {value}) => {
    this.props.transferData('url', value)
  }

  handleAppChange = (e, {value}) => {
    this.props.transferData('app', value)
  }

  handleLabelChange = (e, {value}) => {
    this.props.transferData('label', value)
  }

  handleProfileChange = (e, {value}) => {
    this.props.transferData('profiles', value)
  }

  handleClick = () => {
    const toggle = !this.state.toggle
    this.setState({
      active: !this.state.active,
      button: toggle ? 'Hide' : 'Show',
      toggle
    })
    this.props.toggleHeaders()
  }

  render() {
    const { active, button } = this.state
    const headerCount=this.props.headerCount
    return (
      <Form>
        <Form.Group widths='equal'>
          <Form.Input onChange={this.handleURLChange} label='Config URL'
            placeholder='config url...' defaultValue='https://config.api.intuit.com/v2'/>
          <Form.Input onChange={this.handleAppChange} label='App Name'
            placeholder='app name...' />
          <Form.Dropdown label='Profiles' placeholder='profiles...'
            fluid multiple search selection scrolling
            options={this.state.options} defaultValue={this.state.options[0].value}
            allowAdditions additionLabel='Add: ' onAddItem={this.handleAddition}
            renderLabel={this.renderLabel}
            onChange={this.handleProfileChange} />
          <Form.Input onChange={this.handleLabelChange} label='Label'
            placeholder='label...' defaultValue='master' />
          <Form.Field width={2}>
            <label>Headers</label>
            <Menu color='blue' compact inverted>
              <Menu.Item style={{width:'75px'}} onClick={this.handleClick} active={active}>
                {button}
                <Label color='red' floating>{headerCount}</Label>
              </Menu.Item>
            </Menu>
          </Form.Field>
        </Form.Group>
      </Form>
    )
  }
}
