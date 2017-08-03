import React from 'react';
import {Segment, List, Tab} from 'semantic-ui-react';
import 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';
import {PrismCode} from 'react-prism';
import PropTypes from 'prop-types'

import getMockData from './mock.js';
import PropSearch from './PropSearch.jsx'

export default class App extends React.Component {

  static propTypes = {
    urls: PropTypes.shape({
      metaURL: PropTypes.string,
      confURL: PropTypes.string
    }).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      values: {}
    }
  }

  /**
   * Traverses nested data object, adds key value pairs to values. If
   * nested objects present calls getValues on nested object.
   *
   * @param {object} data - object to traverse
   * @param {string} prefix - path to current object
   */
  getValues(data, prefix) {
    let values = this.state.values
    for (var key in data) {
      if (data[key] !== null && typeof(data[key]) == 'object') {
        this.getValues(data[key], prefix + key + '.')
      } else {
        values[prefix + key] = data[key]
        this.setState({
          values
        })
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
    let values = data ? this.state.values : {}
    for (var key in data) {
      if (data[key] !== null && typeof(data[key]) == 'object') {
        this.getValues(data[key], key + '.')
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
   * Finds the app name, profiles, and label from a metadata url
   *
   * @param {string} url - metadata url
   * @returns {object} app name, profiles, and label from provided
   * url
   */
  parseURL(url) {
    let arr = url.split('/')
    return {app: arr[arr.length-3], profiles: arr[arr.length-2], label: arr[arr.length-1]}
  }

  /**
   * Calls parseURL and then send the fields to getMockData from mock.js
   *
   * @param {string} url - metadata url
   * @param {string} ext - extension (json, yaml, properties)
   * @returns {(string|null)} code returned from getMockData
   */
  fetchFile(url, ext='json') {
    let {app, profiles, label} = this.parseURL(url)
    return getMockData(app, profiles, label, ext)
  }

  /**
   * Creates pretty printed code from mock data using Prism
   *
   * @param {string} url - metadata url
   * @param {string} ext - extension (json, yaml, properties)
   * @returns {ReactElement} Tab Pane with formatted code
   */
  createTab(url, ext) {
    let code = url ? this.fetchFile(url, ext) : null
    let className = `language-${ext}`
    let html = code ? <PrismCode component='pre' className={className}>{code}</PrismCode> : null
    return (
      <Tab.Pane>
        {html}
      </Tab.Pane>
    )
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
      const data = JSON.parse(this.fetchFile(urls.metaURL))
      this.setState({
        data
      })
      this.getValuesWrapper(data)
    }
  }

  render() {
    const { values } = this.state
    const { metaURL } = this.props.urls

    // Config values, json, yaml, properties tab content
    const panes = [
      {menuItem: 'Config', render: () =>
        <Tab.Pane>
          <Segment attached='top'>
            <PropSearch options={Object.keys(values)} />
          </Segment>
          <Segment attached='bottom' className='view'>
            <List relaxed divided>
              {Object.keys(values).map(key =>
                  this.formatPair(key, values)
                )
              }
            </List>
          </Segment>
        </Tab.Pane>
      },
      {menuItem: '.json', render: () => this.createTab(metaURL, 'json')},
      {menuItem: '.yml', render: () => this.createTab(metaURL, 'yaml')},
      {menuItem: '.properties', render: () => this.createTab(metaURL, 'properties')}
    ]

    return (
      <Tab panes={panes} />
    )
  }
}
