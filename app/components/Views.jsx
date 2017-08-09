import React from 'react';
import {Segment, List, Tab, Menu, Label, Popup, Icon, Accordion} from 'semantic-ui-react';
import 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';
import {PrismCode} from 'react-prism';
import PropTypes from 'prop-types'

import getMockData from './mock.js';
import PropSearch from './PropSearch.jsx'

export default class Views extends React.Component {

  static propTypes = {
    urls: PropTypes.shape({
      metaURL: PropTypes.string,
      confURL: PropTypes.string
    }).isRequired,
    headers: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      values: {},
      activeIndex: 0,
      json: '',
      yaml: '',
      properties: '',
      requests: []
    }
  }

  /**
   * Traverses nested data object, adds key value pairs to values. If
   * nested objects present calls getValues on nested object.
   *
   * @param {object} values - mutable object to update key-value pairs
   * @param {object} data - object to traverse
   * @param {string} prefix - path to current object
   */
  getValues(values, data, prefix) {
    for (var key in data) {
      if (data[key] !== null && typeof(data[key]) == 'object') {
        this.getValues(values, data[key], prefix + key + '.')
      } else {
        values[prefix + key] = data[key]
      }
    }
  }

  /**
   * Wrapper for getValues. Traverses JSON file, adds key value pairs to
   * values. If nested objects present calls getValues on nested object.
   *
   * @param {object} data - JSON to traverse
   */
  getValuesWrapper(data) {
    let values = {}
    for (var key in data) {
      if (data[key] !== null && typeof(data[key]) == 'object') {
        this.getValues(values, data[key], key + '.')
      } else {
        values[key] = data[key]
      }
    }

    this.setState({
      values
    })
  }

  /**
   * Formats key value pair as '{key} = {value}'. Checks type of value
   * to use appropriate style. Returns a List Item
   *
   * @param {string} key - current key
   * @param {object} values - equivalent to this.state.values
   * @returns {ReactElement} List Item with key value pairs
   */
  formatPair(key, values) {
    let value = ''
    if (typeof values[key] == 'string') {
      value = (<span className='json-string'>"{values[key]}"</span>)
    } else if (typeof values[key] == 'boolean') {
      value = (<span className='json-bool'>{values[key].toString()}</span>)
    } else {
      value = (<span className='json-val'>{values[key].toString()}</span>)
    }

    return (<List.Item key={key}>
      <List.Content>
        <h4 className='ellipsis'>
          <span className='json-key'>{key}</span> = {value}
        </h4>
      </List.Content>
    </List.Item>)
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
   * @param {array} requests - array of responses and response info
   * @returns {Promise} Either text of response or Error to be caught
   */
  fetchFile(url, requests) {
    const intuit_tid = this.getTID()
    const completeURL = `http://localhost:3001/${url}`
    return fetch(completeURL, {
      headers: {
        intuit_tid,
        'X-Application-Name': 'services-config/config-inspector',
        ...this.props.headers
      }
    })
    .then(
      (response) => {
        let timestamp = new Date().toString()
        requests.push({
          response,
          timestamp,
          intuit_tid
        })
        if (response.ok) {
          return response.text()
        } else {
          return response.json()
            .then(err => {
              throw new Error(err.message)
            })
        }
      }
    )
  }

  /**
   * Creates pretty printed code from string of raw data
   *
   * @param {string} ext - extension (json, yaml, properties)
   * @returns {ReactElement} Tab Pane with formatted code
   */
  createTab(ext) {
    let className = `language-${ext}`
    return (
      <Tab.Pane className='raw'>
        <PrismCode component='pre' className={className}>
          {this.state[ext]}
        </PrismCode>
      </Tab.Pane>
    )
  }

  /**
   * Fetches raw data from config url if url is not null
   * and sets state. Not called for json as json requests
   * is made for config values.
   *
   * @param {string} url - metadata url
   * @param {string} ext - extension (yaml, properties)
   * @param {array} requests - array of responses and response info
   */
  getRawData(url, ext, requests) {
    if (url) {
      this.fetchFile(url + '.' + ext, requests)
      .then(response => {
        let code = response
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
   * Fetches data for all tabs. Updates requests and all data
   * and creates key value pairs by calling getValuesWrapper.
   * Handles bad requests.
   *
   * @param {object} nextProps
   * @param {object} nextProps.urls - metaURL and confURL from new props
   */
  componentWillReceiveProps({urls}) {
    if (this.props.urls != urls) {
      let requests = []
      this.fetchFile(urls.confURL + '.json', requests)
      .then(response => {
        this.getRawData(urls.confURL, 'yaml', requests)
        this.getRawData(urls.confURL, 'properties', requests)
        this.setState({requests})
        return JSON.parse(response)
      })
      .then(data => {
        this.setState({
          data,
          json: JSON.stringify(data, null, 2)
        })
        this.getValuesWrapper(data)
      })
      .catch(error => {
        this.setState({
          requests,
          values: error.toString(),
          json: error.toString(),
          yaml: error.toString(),
          properties: error.toString()
        })
      })
    }
  }

  render() {
    const { values, activeIndex, json, yaml, properties, requests } = this.state
    const { metaURL, confURL } = this.props.urls

    let config = []
    // values is only a string when there has been an error
    if (typeof values === 'string') {
      config = values
    } else {
      config = Object.keys(values).map(
        key => this.formatPair(key, values)
      )
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
            <PropSearch options={Object.keys(values)} />
          </Segment>
          <Segment attached='bottom' className='view'>
            <List relaxed divided>
              {config}
            </List>
          </Segment>
        </Tab.Pane>
      },
      {menuItem: '.json', render: () => this.createTab('json')},
      {menuItem: '.yml', render: () => this.createTab('yaml')},
      {menuItem: '.properties', render: () => this.createTab('properties')},
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
          <Menu.Item fitted disabled key='menu' position='right' >
            <Label color='grey'>f2de868380f695fb553a7fea1b4af8bc8fa489ae</Label>
          </Menu.Item>,
        render: () => {}
      }
    ]

    return (
      <Tab panes={panes} onTabChange={this.handleTabChange} activeIndex={activeIndex} />
    )
  }
}
