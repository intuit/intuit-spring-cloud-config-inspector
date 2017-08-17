import React from 'react';
import {Segment, List, Tab, Menu, Label,
  Popup, Icon, Accordion, Message} from 'semantic-ui-react';
import 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';
import {PrismCode} from 'react-prism';
import PropTypes from 'prop-types'

import getMockData from './mock.js';
import PropSearch from './PropSearch.jsx'
import * as config from '../conf';

const proxy = config.getProxyServerUrl();
const currentEnv = config.getCurrentHostEnv().toString();
console.log(`Setting up the proxy url '${proxy}' to be used for env ${currentEnv}`);

const org = 'services-config'

export default class Views extends React.Component {

  static propTypes = {
    urls: PropTypes.shape({
      metaURL: PropTypes.string,
      confURL: PropTypes.string
    }).isRequired,
    headers: PropTypes.object.isRequired,
    updateUserRepo: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      values: {},
      activeIndex: 0,
      metadata: '',
      json: '',
      yaml: '',
      properties: '',
      requests: [],
      version: '',
      filter: []
    }
  }

  /**
   * Formats value depending on type
   *
   * @param {custom} value - current value
   * @returns {HTML} formatted value
   */
  formatValue(value) {
    if (typeof value == 'string') {
      return (<span className='json-string'>"{value}"</span>)
    } else if (typeof value == 'boolean') {
      return (<span className='json-bool'>{value.toString()}</span>)
    } else {
      return (<span className='json-val'>{value.toString()}</span>)
    }
  }

  /**
   * Creates a list for each key, title is { key } = { final value },
   * content is a list of all values for that key and the files those
   * values come from.
   *
   * @param {string} key - current key
   * @param {object[]} values - the array of values and locations
   * @returns {object} A panel for the Config Accordion
   */
  formatPair = (key, values) => {
    return {
      key,
      title: <span key={key}>
          <span className='json-key'>{key}</span> = {this.formatValue(values[0].value)}
        </span>,
      content: <List celled key={key}>
          {
            values.map((item, index) =>
              <List.Item key={index}>
                {this.formatValue(item.value)}
                <span className='location'>{item.file}</span>
              </List.Item>
            )
          }
        </List>
    }
  }

  /**
   * Returns an intuit tid for request headers
   *
   * @returns {string} Intuit tid
   */
  getTID() {
    let date = new Date().getTime()
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (date + Math.random() * 16) % 16 | 0
      date = Math.floor(date / 16)
      return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16)
    })
  }

  /**
   * Fetches url with provided headers and adds response info
   * to provided array requests. Throws an error if bad request.
   *
   * @param {string} url - url
   * @param {object[]} requests - array of responses and response info
   * @param {object} headers - current headers
   * @returns {Promise} Either text of response or Error to be caught
   */
  fetchFile(url, requests, headers) {
    const intuit_tid = this.getTID()
    const completeURL = `${proxy}${url}`
    return fetch(completeURL, {
      headers: {
        intuit_tid,
        'X-Application-Name': 'services-config/config-inspector',
        ...headers
      }
    })
    .then(response => {
        let timestamp = new Date().toString()
        requests.push({
          response,
          timestamp,
          intuit_tid
        })
        if (response.ok) {
          return response.text()
        } else {
          return response.json().then(err => {
              throw new Error(err.message)
          })
        }
      }
    )
  }

  /**
   * Creates pretty printed code from string of raw data.
   *
   * @param {string} ext - extension (json, yaml, properties)
   * @returns {ReactElement} Tab Pane with formatted code
   */
  createTab(ext) {
    let className = ext === 'metadata' ? `language-json` : `language-${ext}`
    return (
      <Tab.Pane className='raw'>
        <PrismCode component='pre' className={className}>
          {this.state[ext]}
        </PrismCode>
      </Tab.Pane>
    )
  }

  /**
   * Fetches raw data from config url if url is not null and sets state.
   *
   * @param {string} url - metadata url
   * @param {string} ext - extension (json, yaml, properties)
   * @param {object[]} requests - array of responses and response info
   * @param {object} headers - current headers
   */
  getRawData(url, ext, requests, headers) {
    if (url) {
      this.fetchFile(url + '.' + ext, requests, headers)
      .then(response => {
        let code
        if (ext === 'json') {
          code = JSON.stringify(JSON.parse(response), null, 2)
        } else {
          code = response
        }
        this.setState({
          [ext]: code
        })
      })
      .catch(error => {
        this.setState({
          [ext]: error.toString()
        })
      })
    } else {
      this.setState({
        [ext]: null
      })
    }
  }

  /**
   * Sets active index unless user clicked on version tab
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} props
   * @param {number} props.activeIndex - index of clicked on tab
   */
  handleTabChange = (e, {activeIndex}) => {
    if (activeIndex < 5) {
      this.setState({
        activeIndex
      })
    }
  }

  /**
   * Traverses properties in each file and updates values object. values
   * stores an array of values and file locations for each key found in
   * the property files in metadata. Updates state. Finds user and repo
   * name in first github url and updates both in parent App component.
   *
   * @param {object[]} files - Array of propertyfiles from metadata
   */
  updateValues = (files) => {
    let values = {}
    let params = files[0].name.replace(/^https:\/\/github\.intuit\.com\//, "")
    let split = params.split('/', 2)
    let user = split[0]
    let repo = split[1]
    this.props.updateUserRepo(user, repo)
    for (let file of files) {
      const name = file.name
      const props = file.source
      for (let key of Object.keys(props)) {
        const assoc = {
          value: props[key],
          file: name.substring(name.lastIndexOf('/') + 1)
        }
        if (typeof values[key] !== 'undefined') {
          values[key].push(assoc)
        } else {
          values[key] = [assoc]
        }
      }
    }
    this.setState({values})
  }

  /**
   * Callback function passed to PropSearch. Called when user selects
   * new properties. Updates array of properties to view.
   *
   * @param {string[]} filter - array of properties to show (keys)
   */
  updateFilter = (filter) => {
    this.setState({
      filter
    })
  }

  /**
   * Fetches data for all tabs. Updates requests, version, and all data and
   * creates key value pairs by calling updateValues. Handles bad requests.
   *
   * @param {object} nextProps
   * @param {object} nextProps.urls - metaURL and confURL from new props
   * @param {object} nextProps.headers - current headers
   */
  componentWillReceiveProps({urls, headers}) {
    if (this.props.urls != urls || this.props.headers != headers) {
      let requests = []
      this.fetchFile(urls.metaURL, requests, headers)
      .then(response => {
        this.getRawData(urls.confURL, 'json', requests, headers)
        this.getRawData(urls.confURL, 'yaml', requests, headers)
        this.getRawData(urls.confURL, 'properties', requests, headers)
        this.setState({requests})
        return JSON.parse(response)
      })
      .then(data => {
        this.setState({
          version: data.version,
          metadata: JSON.stringify(data, null, 2)
        })
        this.updateValues(data.propertySources)
      })
      .catch(error => {
        this.setState({
          requests,
          version: '',
          values: error.toString(),
          json: error.toString(),
          yaml: error.toString(),
          properties: error.toString(),
          metadata: error.toString()
        })
      })
    }
  }

  render() {
    const { activeIndex, json, yaml, properties,
      requests, values, version, filter } = this.state
    const { metaURL, confURL } = this.props.urls

    let config = []
    let keys = []
    // values is only a string when there has been an error
    if (typeof values === 'string') {
      config = <Message error>{values}</Message>
    } else {
      keys = Object.keys(values)
      const filtered = filter.length > 0 ?
        keys.filter(key => filter.includes(key)) :
        keys
      config =
        <Accordion exclusive={false} panels={filtered.map(key =>
          this.formatPair(key, values[key]))} />
    }

    const panels = requests.map((item, index) => ({
      title: item.response.url.replace('http://localhost:3001/', ''),
      content:
        <List celled>
          <List.Item>type: {item.response.type}</List.Item>
          <List.Item>status: {item.response.status} {item.response.statusText}</List.Item>
          <List.Item>timestamp: {item.timestamp}</List.Item>
          <List.Item>Intuit TID: {item.intuit_tid}</List.Item>
        </List>
    }))

    // Config values, json, yaml, properties tab content
    const panes = [
      {menuItem: 'Config', render: () =>
        <Tab.Pane>
          <Segment attached='top'>
            <PropSearch updateFilter={this.updateFilter} options={keys} />
          </Segment>
          <Segment attached='bottom' className='view'>
            {config}
          </Segment>
        </Tab.Pane>
      },
      {menuItem: '.json', render: () => this.createTab('json')},
      {menuItem: '.yml', render: () => this.createTab('yaml')},
      {menuItem: '.properties', render: () => this.createTab('properties')},
      {menuItem: 'Metadata', render: () => this.createTab('metadata')},
      {
        menuItem:
          <Menu.Item key='API'>
            <Popup
              inverted
              trigger={<Icon name='cloud' />}
              content='API Requests'
              position='top center'
            />
          </Menu.Item>,
        render: () =>
          <Tab.Pane>
            <Accordion exclusive={false} panels={panels} />
          </Tab.Pane>
      },
      {
        menuItem:
          <Menu.Item fitted='horizontally' disabled key='menu' position='right' >
            <Label color='grey'>{version.substring(0, 7)}</Label>
          </Menu.Item>,
        render: () => {}
      }
    ]

    return (
      <Tab menu={{stackable: true, tabular: true, attached: true}} panes={panes} onTabChange={this.handleTabChange} activeIndex={activeIndex} />
    )
  }
}
