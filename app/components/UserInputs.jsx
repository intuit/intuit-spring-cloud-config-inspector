import React from 'react';
import PropTypes from 'prop-types'

import Headers from './Headers.jsx'

import { Form, Label, Menu } from 'semantic-ui-react';

const token = '726db489b8e34fa7b78540917245031cde359bbc'

import * as config from '../conf';

export default class UserInputs extends React.Component {

  static propTypes = {
    user: PropTypes.string.isRequired,
    repo: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    appName: PropTypes.string.isRequired,
    profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.string.isRequired,
    portal: PropTypes.bool,
    updateInfo: PropTypes.func.isRequired,
    updateLabel: PropTypes.func.isRequired,
    updateProfiles: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      profOptions: [{value: 'default', text: 'default'}],
      labelOptions: [{value: 'master', text: 'master', icon: 'fork'}],
      index: 0,
      toggle: false,
      url: props.url,
      appName: props.appName,
      profiles: props.profiles,
      label: props.label,
      headerCount: 1,
      headers: {}
    }


  }

  componentWillMount() {
    if (this.props.portal) {
      this.handleSubmit()
    }
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
    if (!this.state.profOptions.find( (option) => option.value === value )) {
      let label = { color:'red', content:'Not found' }
      this.setState({
        profOptions: [{text:value, value, label}, ...this.state.profOptions]
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
   * Update the value of input field
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   * @param {string} data.name - name of input field (url, appName)
   * @param {string} data.value - current input
   */
  handleInputChange = (e, {name, value}) => {
    this.setState({
      [name]: value
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
  handleLabelChange = (e, data) => {
    this.setState({
      label: data.value
    })
    this.props.updateLabel(data.value)
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
    if (value.length === 0 || value[value.length - 1] === 'default') {
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
    this.props.updateProfiles(profiles)
  }

  /**
   * Called from Headers button, switches between Collapse
   * and Expand, showing/revealing headers.
   */
  handleClick = () => {
    this.setState({
      toggle: !this.state.toggle
    })
  }

  /**
   * Called from Sumbit button, updates url, appName, and headers in
   * parent App component. Resets label and profiles to defaults.
   */
  handleSubmit = () => {
    const {url, appName, headers} = this.state

    this.setState({
      label: 'master',
      profiles: ['default']
    })
    this.props.updateInfo(url, appName, headers)

  }

  /**
   * Callback function passed to Headers. Creates a dict containint
   * headers key-value pairs
   *
   * @param {object[]} data - maps index to an object containing a key
   * and value object, each of which have a value and a bool 'neg'
   * @param {number} [headerCount] - number of headers
   */
  updateHeaders = (data, headerCount) => {
    let headers = {}
    for (var index in data) {
      headers[data[index].key.value] = data[index].value.value
    }
    this.setState({
      headers
    })
    if (headerCount !== undefined) {
      this.setState({
        headerCount
      })
    }
  }

  /**
   * If the label in labelmenu changes, update inputData and urls. If
   * either label, user, or repo changed, fetch list of profiles from
   * github and update profOptions.
   *
   * @param {object} nextProps
   * @param {string} nextProps.label - new label from labelmenu
   * @param {string} nextProps.user - current user (i.e. services-config)
   * @param {string} nextProps.repo - current repo
   */
  componentWillReceiveProps({user, repo}) {
    if (user !== this.props.user || repo !== this.props.repo) {
      fetch(
        `${config.GIT_REPOS_API}/${user}/${repo}/contents` +
        `?access_token=${token}`
      ).then(
        response => {
          if (response.status >= 400) {
            throw new Error("bad")
          }
          return response.json()
        }
      ).then(contents => {
        const { appName } = this.state
        const files = contents.filter(f => f.name.startsWith(appName))
        const profOptions = files.map(f => {
          let profile = f.name.substring(
            f.name.indexOf(`${appName}-`) + appName.length + 1,
            f.name.lastIndexOf('.')
          )
          profile = profile === '' ? 'default' : profile
          return {text: profile, value: profile}
        })
        this.setState({
          profOptions
        })
      }).catch(err => console.log(err.message))
      fetch(
        `${config.GIT_REPOS_API}/${user}/${repo}/git/refs` +
        `?access_token=${token}&per_page=100`
      ).then(response => {
        if (response.status >= 400) {
          throw new Error(response.json())
        }
        return response.json()
      }).then(refs => {
        const tagRefs = refs.filter(r => r.ref.startsWith('refs/tags'))
        const tags = tagRefs.map(r => ({
          value: r.ref.split('refs/tags/')[1],
          text: r.ref.split('refs/tags/')[1],
          icon: 'tag'
        }))
        const branchRefs = refs.filter(r => r.ref.startsWith('refs/heads'))
        const branches = branchRefs.map(r => ({
          value: r.ref.split('refs/heads/')[1],
          text: r.ref.split('refs/heads/')[1],
          icon: 'fork'
        }))
        this.setState({
          labelOptions: branches.concat(tags)
        })
      }).catch(err => console.log(err.message))
    }
  }

  render() {
    const { button, url, appName, profiles,
      label, profOptions, labelOptions,
      toggle, headerCount } = this.state
    const { portal } = this.props

    // Hide url and appName field if in portal view
    return (
      <div className='inputs'>
        {
          portal ?
          null :
          <Form onSubmit={this.handleSubmit}>
            <Form.Group widths='equal'>
              <Form.Input onChange={this.handleInputChange}
                label='Config URL' name='url'
                placeholder='config url...' value={url}/>
              <Form.Input onChange={this.handleInputChange}
                label='App Name' name='appName'
                placeholder='app name...' value={appName} />
              <Form.Field>
                <label>Headers</label>
                <Menu color='grey' compact inverted>
                  <Menu.Item onClick={this.handleClick} active={toggle}>
                    {toggle ? 'Collapse' : 'Expand'}
                    <Label color='red' floating>{headerCount}</Label>
                  </Menu.Item>
                </Menu>
              </Form.Field>
              <Form.Button width={1} floated='right'
                label={<label style={{visibility: 'hidden'}}>Submit</label>}
                content='Submit' />
            </Form.Group>
          </Form>
        }
        {
          portal ?
          null :
          <Headers show={toggle} updateHeaders={this.updateHeaders} />
        }
        <Form>
          <Form.Group widths='equal'>
            <Form.Dropdown label='Profiles'
              fluid multiple search selection scrolling
              options={profOptions} value={profiles}
              allowAdditions additionLabel='Add: '
              onAddItem={this.handleAddition}
              renderLabel={this.renderLabel}
              onChange={this.handleProfileChange} />
            <Form.Dropdown label='Label' fluid search selection
              scrolling options={labelOptions} value={label}
              onChange={this.handleLabelChange} />
          </Form.Group>
        </Form>
      </div>
    )
  }
}
