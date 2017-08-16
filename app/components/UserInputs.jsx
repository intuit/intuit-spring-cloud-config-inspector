import React from 'react';
import PropTypes from 'prop-types'

import { Form, Label, Menu } from 'semantic-ui-react';

const urlHeader = 'https://github.intuit.com/api/v3/repos'
const urlFooter = 'contents?access_token='
const token = '726db489b8e34fa7b78540917245031cde359bbc'

import * as config from '../conf';

export default class UserInputs extends React.Component {

  static propTypes = {
    toggle: PropTypes.bool.isRequired,
    updateLabel: PropTypes.func.isRequired,
    toggleHeaders: PropTypes.func.isRequired,
    headerCount: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    updateURLs: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired,
    repo: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    appName: PropTypes.string.isRequired,
    profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    portal: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      options: [{value: 'default', text: 'default'}],
      index: 0,
      button: 'Expand',
      toggle: props.toggle,
      url: props.url,
      app: props.appName,
      profiles: props.profiles,
      label: props.label
    }


  }

  componentWillMount() {
    if (this.state.app !== '') this.handleGo()
  }

  /**
   * Called in Profiles Dropdown
   * When user adds a profile that does not exist in search
   * results, add label 'Not found' to new input
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} data - All props and the new item's value.
   * @param {string} data.value - current entered value
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
   * Change the value of 'url' in inputData
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   * @param {string} data.value - current input
   */
  handleURLChange = (e, {value}) => {
    this.setState({
      url: value
    })
  }

  /**
   * Change the value of 'app' in inputData
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   * @param {string} data.value - current input
   */
  handleAppChange = (e, {value}) => {
    this.setState({
      app: value
    })
  }

  /**
   * Change the label in parent App component using
   * callback function whenever input field changes
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   * @param {string} data.value - current input
   */
  handleLabelChange = (e, {value}) => {
    this.setState({
      label: value
    })
  }

  /**
   * Change the profiles array in input data. Sets to default if none are
   * selected and removes default if any are.
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   * @param {string[]} data.value - current input array
   */
  handleProfileChange = (e, {value}) => {
    let profiles = value
    if (value.length === 0) {
      profiles = ['default']
    } else {
      const index = profiles.indexOf('default')
      if (index > -1) {
        profiles.splice(index, 1)
      }
    }
    this.setState({
      profiles
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
      button: toggle ? 'Collapse' : 'Expand',
      toggle
    })
    this.props.toggleHeaders()
  }

  /**
   * Called from Sumbit button, updates label and URLs in parent
   * App component. Replaces forward slashes in label with (_).
   */
  handleGo = () => {
    const {url, app, profiles, label} = this.state
    this.props.updateLabel(label)

    // For localhost, use the url in the app, or else use the configured ones
    const currentEnv = config.getCurrentHostEnv();
    const envUrl = currentEnv === config.Env.LOCAL ? `${url}/` : "";

    const urls = {
      metaURL: `${envUrl}${app}/${profiles}/${label.replace(/\//g, '(_)')}`,
      confURL: `${envUrl}${label.replace(/\//g, '(_)')}/${app}-${profiles}`
    }
    this.props.updateURLs(urls)
  }

  /**
   * If the label in labelmenu changes, update inputData and urls. If
   * either label, user, or repo changed, fetch list of profiles from
   * github and update options.
   *
   * @param {object} nextProps
   * @param {string} nextProps.label - new label from labelmenu
   * @param {string} nextProps.user - current user (i.e. services-config)
   * @param {string} nextProps.repo - current repo
   */
  componentWillReceiveProps({label, user, repo}) {
    if (label !== this.props.label ||
        user !== this.props.user ||
        repo !== this.props.repo) {
      if (label !== this.props.label) {
        const { url, app, profiles } = this.state
        const urls = {
          metaURL: `${url}/${app}/${profiles}/${label.replace(/\//g, '(_)')}`,
          confURL: `${url}/${label.replace(/\//g, '(_)')}/${app}-${profiles}`
        }
        this.props.updateURLs(urls)
        this.setState({
          label
        })
      }
      fetch(`${urlHeader}/${user}/${repo}/${urlFooter}${token}&ref=${label}`).then(
        response => {
          if (response.status >= 400) {
            throw new Error("bad")
          }
          return response.json()
        }
      ).then(contents => {
        const { app } = this.state
        const files = contents.filter(f => f.name.startsWith(app))
        const options = files.map(f => {
          let profile = f.name.substring(
            f.name.indexOf(`${app}-`) + app.length + 1, f.name.lastIndexOf('.')
          )
          profile = profile === '' ? 'default' : profile
          return {key: profile, text: profile, value: profile}
        })
        this.setState({
          options
        })
      })
    }
  }

  render() {
    const { active, button, url, app, profiles, label } = this.state
    const { headerCount, portal } = this.props

    // Hide url and appName field if in portal view
    return (
      <Form>
        <Form.Group widths='equal'>
          {
            portal ?
            null :
            <Form.Input onChange={this.handleURLChange} label='Config URL'
              placeholder='config url...' value={url}/>
          }
          {
            portal ?
            null :
            <Form.Input onChange={this.handleAppChange} label='App Name'
              placeholder='app name...' value={app} />
          }
          <Form.Dropdown label='Profiles' placeholder='profiles...'
            fluid multiple search selection scrolling
            options={this.state.options} value={profiles}
            allowAdditions additionLabel='Add: ' onAddItem={this.handleAddition}
            renderLabel={this.renderLabel}
            onChange={this.handleProfileChange} />
          <Form.Input onChange={this.handleLabelChange} label='Label'
            placeholder='label...' value={label} />
          <Form.Field width={2}>
            <label>Headers</label>
            <Menu color='grey' compact inverted>
              <Menu.Item onClick={this.handleClick} active={active}>
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
