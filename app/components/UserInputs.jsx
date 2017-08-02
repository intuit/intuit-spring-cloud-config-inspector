import React from 'react';
import PropTypes from 'prop-types'

import { Form, Label, Menu } from 'semantic-ui-react';

const options = [
  { key: 'default', text: 'default', value: 'default' },
  { key: 'qal', text: 'qal', value: 'qal' },
  { key: 'P2', text: 'P2', value: 'P2' },
  { key: 'P3', text: 'P3', value: 'P3' },
]

export default class UserInputs extends React.Component {

  static propTypes = {
    toggle: PropTypes.bool.isRequired,
    transferData: PropTypes.func.isRequired,
    toggleHeaders: PropTypes.func.isRequired,
    headerCount: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      options,
      index: 0,
      button: 'Show',
      toggle: this.props.toggle
    }
  }

  /**
   * Called in Profiles Dropdown
   * When user adds a profile that does not exist in search
   * results, add label 'Not found' to new input
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {string} value - taken from dropdown props
   */
  handleAddition = (e, {value}) => {
    if (!this.state.options.find( (option) => option.value === value )) {
      let label = { color:'red', content:'Not found' }
      this.setState({
        options: [{text:value, value, label}, ...this.state.options]
      })
    }
  }

  /**
   * Called in Profiles Dropdown
   * item.label returns true if the item (profile input) was
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

  /**
   * Change the 'url' in parent App component using
   * callback function whenever input field changes
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {string} value - current input
   */
  handleURLChange = (e, {value}) => {
    this.props.transferData('url', value)
  }

  /**
   * Change the 'app' in parent App component using
   * callback function whenever input field changes
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {string} value - current input
   */
  handleAppChange = (e, {value}) => {
    this.props.transferData('app', value)
  }

  /**
   * Change the label in parent App component using
   * callback function whenever input field changes
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {string} value - current input
   */
  handleLabelChange = (e, {value}) => {
    this.props.transferData('label', value)
  }

  /**
   * Change the profiles array in parent App component
   * using callback function whenever input field changes
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {string} value - current input array
   */
  handleProfileChange = (e, {value}) => {
    this.props.transferData('profiles', value)
  }

  /**
   * Called from Headers button, switches between hide and show
   * and calls toggleHeaders to update parent.
   */
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
