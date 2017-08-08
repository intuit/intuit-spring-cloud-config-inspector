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
    headerCount: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      options,
      index: 0,
      button: 'Show',
      toggle: this.props.toggle,
      inputData: {
        url: 'https://config-e2e.api.intuit.com/v2',
        app: '',
        profiles: 'default',
        label: 'master'
      }
    }
  }

  /**
   * Called in Profiles Dropdown
   * When user adds a profile that does not exist in search
   * results, add label 'Not found' to new input
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} props
   * @param {string} props.value - current entered value
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
   * @param {object} props
   * @param {string} props.value - current input
   */
  handleURLChange = (e, {value}) => {
    const inputData = this.state.inputData
    inputData['url'] = value
    this.setState({
      inputData
    })
  }

  /**
   * Change the 'app' in parent App component using
   * callback function whenever input field changes
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} props
   * @param {string} props.value - current input
   */
  handleAppChange = (e, {value}) => {
    const inputData = this.state.inputData
    inputData['app'] = value
    this.setState({
      inputData
    })
  }

  /**
   * Change the label in parent App component using
   * callback function whenever input field changes
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} props
   * @param {string} props.value - current input
   */
  handleLabelChange = (e, {value}) => {
    const inputData = this.state.inputData
    inputData['label'] = value
    this.setState({
      inputData
    })
  }

  /**
   * Change the profiles array in parent App component
   * using callback function whenever input field changes
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} props
   * @param {string[]} props.value - current input array
   */
  handleProfileChange = (e, {value}) => {
    const inputData = this.state.inputData
    inputData['profiles'] = value
    this.setState({
      inputData
    })
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

  handleGo = () => {
    this.props.transferData(this.state.inputData)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.label != this.props.label) {
      const inputData = this.state.inputData
      inputData['label'] = nextProps.label
      this.setState({
        inputData
      })
    }
  }

  render() {
    const { active, button } = this.state
    const { url, app, profiles, label } = this.state.inputData
    const { headerCount} = this.props

    return (
      <Form>
        <Form.Group widths='equal'>
          <Form.Input onChange={this.handleURLChange} label='Config URL'
            placeholder='config url...' value={url}/>
          <Form.Input onChange={this.handleAppChange} label='App Name'
            placeholder='app name...' value={app} />
          <Form.Dropdown label='Profiles' placeholder='profiles...'
            fluid multiple search selection scrolling
            options={this.state.options} defaultValue={this.state.options[0].value}
            allowAdditions additionLabel='Add: ' onAddItem={this.handleAddition}
            renderLabel={this.renderLabel}
            onChange={this.handleProfileChange} />
          <Form.Input onChange={this.handleLabelChange} label='Label'
            placeholder='label...' value={label} />
          <Form.Field width={2}>
            <label>Headers</label>
            <Menu color='grey' compact inverted>
              <Menu.Item style={{width:'75px'}} onClick={this.handleClick} active={active}>
                {button}
                <Label color='red' floating>{headerCount}</Label>
              </Menu.Item>
            </Menu>
          </Form.Field>
          <Form.Button width={1} label='Submit' onClick={this.handleGo}>Go</Form.Button>
        </Form.Group>
      </Form>
    )
  }
}
