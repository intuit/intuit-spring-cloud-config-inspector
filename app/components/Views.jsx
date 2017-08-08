import React from 'react';
import {Segment, List, Tab, Menu, Label} from 'semantic-ui-react';
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
      properties: ''
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
   * Fetches config url with given extension and with provided
   * headers.
   *
   * @param {string} url - metadata url
   * @param {string} ext - extension (json, yaml, properties)
   * @returns {Promise} Either text of response or Error to be caught
   */
  fetchFile(url, ext='json') {
    return fetch(`http://localhost:3001/${url}.${ext}`, {
      headers: this.props.headers
    })
    .then(
      (response) => {
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
   * and sets state
   *
   * @param {string} url - metadata url
   * @param {string} ext - extension (json, yaml, properties)
   */
  getRawData(url, ext) {
    if (url) {
      this.fetchFile(url, ext)
      .then(response => {
        let code = ext === 'json' ? JSON.stringify(JSON.parse(response), null, 2) : response
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
    if (activeIndex < 4) {
      this.setState({
        activeIndex
      })
    }
  }

  /**
   * Updates data when url is changed and creates key value pairs
   * by calling getValuesWrapper
   *
   * @param {object} nextProps
   * @param {object} nextProps.urls - metaURL and confURL from new props
   */
  componentWillReceiveProps({urls}) {
    if (this.props.urls != urls) {
      this.fetchFile(urls.confURL)
      .then(response => {
        this.getRawData(urls.confURL, 'json')
        this.getRawData(urls.confURL, 'yaml')
        this.getRawData(urls.confURL, 'properties')
        return JSON.parse(response)
      })
      .then(data => {
        this.setState({data})
        this.getValuesWrapper(data)
      })
      .catch(error => {
        this.setState({
          values: error.toString(),
          json: error.toString(),
          yaml: error.toString(),
          properties: error.toString()
        })
      })
    }
  }

  render() {
    const { values, activeIndex, json, yaml, properties } = this.state
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
