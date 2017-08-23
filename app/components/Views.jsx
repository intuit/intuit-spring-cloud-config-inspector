import React from 'react';
import {Segment, List, Tab, Menu, Label, Grid,
  Popup, Accordion, Message, Button} from 'semantic-ui-react';
import 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';
import {PrismCode} from 'react-prism';
import PropTypes from 'prop-types'
import { FaKey, FaGithub, FaCloud } from 'react-icons/lib/fa'
import { GoMarkGithub } from 'react-icons/lib/go'

import getMockData from './mock.js';
import PropSearch from './PropSearch.jsx'
import * as config from '../conf';

const org = 'services-config'

export default class Views extends React.Component {

  static propTypes = {
    urls: PropTypes.shape({
      metaURL: PropTypes.string,
      confURL: PropTypes.string
    }).isRequired,
    headers: PropTypes.object.isRequired,
    updateUserRepo: PropTypes.func.isRequired,
    filter: PropTypes.arrayOf(PropTypes.string).isRequired,
    updateFilter: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      values: {},
      activeTab: 'config',
      activeIndex: 0,
      metadata: '',
      json: '',
      yaml: '',
      properties: '',
      requests: [],
      version: '',
      filter: props.filter,
      secrets: false,
      label: '',
      repoURL: '',
      propertyFiles: []
    }
  }

  /**
   * Formats value depending on type. If the value contains a secret
   * and is not the first value, create a link to idps.
   *
   * @param {custom} value - current value
   * @param {boolean} [first] - true if this is the first value
   * @returns {HTML} formatted value
   */
  formatValue(value, first=false) {
    if (typeof value == 'string') {
      if (!first && value.startsWith('{secret}')) {
        return <a href='https://github.intuit.com/pages/idps/key-viewer'
          target='_blank' className='json-string'>"{value}"</a>
      }
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
          <span className='json-key'>
            {key}
          </span> = {this.formatValue(values[0].value, true)}
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
   * @return the http headers for calling Github
   */
  makeConfigServiceFetchRequest = (additionalHeaders, cors) => {
    let request = {
      method: 'GET',
      headers: {
        "intuit_tid": `${this.props.transactionId}`,
      }
    };

    if (additionalHeaders) {
      Object.assign(request.headers, additionalHeaders);
    }

    // To send cookies to the destination (Intuit authentication)
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters
    if (cors) {
      // Update the request object with the CORS and Cookies settings
      Object.assign(request, {
        mode: 'cors',
        credentials: 'include',
      })
    }
    return request;
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
    const proxy = config.getProxyServerUrl();
    const currentEnv = config.getCurrentHostEnv().toString();
    console.log(`Setting up the proxy url '${proxy}' to be used for env ${currentEnv}`);

    const configApiRequest = this.makeConfigServiceFetchRequest(headers, this.props.portal);
    const configApiUrl = `${proxy}${url}`
    console.log(`Requesting config api '${configApiUrl.replace(proxy, "")}' `)

    const intuit_tid = this.props.transactionId
    return fetch(configApiUrl, configApiRequest)
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
    })
  }

  /**
   * Creates pretty printed code from string of raw data. If metadata,
   * format as json.
   *
   * @param {string} ext - extension (json, yaml, properties, metadata)
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
   * Sets active index and tab unless user clicked on disabled version tab.
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} props
   * @param {number} props.activeIndex - index of clicked on tab
   * @param {object} props.panes - the tab panes
   * @param {object} props.panes[activeIndex].menuItem.key - name of active tab
   */
  handleTabChange = (e, {activeIndex, panes}) => {
    const activeTab = panes[activeIndex].menuItem.key
    if (activeTab !== 'version') {
      this.setState({
        activeTab,
        activeIndex
      })
    }
  }

  /**
   * Traverses properties in each file and updates values object. values
   * stores an array of values and file locations for each key found in
   * the property files in metadata. Updates state. Finds user and repo
   * name in first github url and updates both in parent App component.
   * Also updates repoURL and list of propertyFiles for github tab.
   *
   * @param {object[]} files - Array of propertyfiles from metadata
   */
  updateValues = (files) => {
    let values = {}
    const repoURL = files[0].name.substring(0, files[0].name.lastIndexOf('/'))
    const params = repoURL.replace(/^https:\/\/github\.intuit\.com\//, "")
    let split = params.split('/', 2)
    const user = split[0]
    const repo = split[1]
    this.props.updateUserRepo(user, repo)
    let propertyFiles = []
    for (let file of files) {
      const name = file.name.substring(file.name.lastIndexOf('/') + 1)
      propertyFiles.push(name)
      const props = file.source
      for (let key of Object.keys(props)) {
        const assoc = {
          value: props[key],
          file: name
        }
        if (typeof values[key] !== 'undefined') {
          values[key].push(assoc)
        } else {
          values[key] = [assoc]
        }
      }
    }
    this.setState({
      values,
      repoURL,
      propertyFiles
    })
  }

  /**
   * Toggle secrets boolean.
   */
  handleSecretsClick = () => {
    this.setState({
      secrets: !this.state.secrets
    })
  }

  /**
    * Creates list of github info: label, repo url, and property files urls.
    * Urls link to github.
    *
    * @returns {ReactElement} List of info
    */
  createGithubTab = () => {
    const { repoURL, propertyFiles, label } = this.state
    return (
      <List>
        <List.Item>
          <List.Header>Current Label</List.Header>
          <List.Content>{label}</List.Content>
        </List.Item>
        <List.Item>
          <List.Header>Github Repo URL</List.Header>
          <List.Content as='a' href={`${repoURL}/tree/${label}`} target='_blank'>
            {repoURL ? `${repoURL}` : null}
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Header>Property Files</List.Header>
            {propertyFiles.map(file =>
              <List.Item key={file} as='li' value='-'>
                <List.Content as='a' href={`${repoURL}/blob/${label}/${file}`}
                  target='_blank'>
                  {repoURL ? `${repoURL}/${file}` : null}
                </List.Content>
              </List.Item>
            )}
        </List.Item>
        <List.Item>
          <List.Header>Commit History</List.Header>
          <List.Content as='a' href={`${repoURL}/commits/${label}`} target='_blank'>
            {repoURL ? `${repoURL}/commits/${label}` : null}
          </List.Content>
        </List.Item>
      </List>
    )
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
          metadata: JSON.stringify(data, null, 2),
          label: data.label
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
          metadata: error.toString(),
          label: null,
          repoURL: null,
          propertyFiles: []
        })
      })
    }
  }

  render() {
    const { activeTab, activeIndex, json, yaml, properties, requests, values,
      version, secrets, repoURL, propertyFiles } = this.state
    const { metaURL, confURL } = this.props.urls
    const { updateFilter, filter } = this.props

    let config = []
    let keys = []
    let total = 0
    // values is only a string when there has been an error
    if (typeof values === 'string') {
      config = <Message error header={values} />
    } else {
      keys = Object.keys(values)

      if (secrets) {
        // show only values that start with {secret} or {cipher}
        keys = keys.filter(key => {
          const value = values[key][0].value
          if (typeof value === 'string') {
            return value.startsWith('{secret}') || value.startsWith('{cipher}')
          } else {
            return false
          }
        })
      }
      // if user has selected keys in the search, show only those pairs
      const filtered = filter.length > 0 ?
        keys.filter(key => filter.includes(key)) :
        keys
      total = filtered.length
      config =
        <Accordion exclusive={false} panels={filtered.map(key =>
          this.formatPair(key, values[key]))} />
    }

    // api logs
    const panels = requests.map((item, index) => ({
      title: item.response.url.replace('http://localhost:3001/', ''),
      content:
        <List celled>
          <List.Item>type: {item.response.type}</List.Item>
          <List.Item>
            status: {item.response.status} {item.response.statusText}
          </List.Item>
          <List.Item>timestamp: {item.timestamp}</List.Item>
          <List.Item>Intuit TID: {item.intuit_tid}</List.Item>
        </List>
    }))

    // tab content
    const panes = [
      {
        menuItem:
          <Menu.Item key='config'>
            Config
            <Popup inverted size='small'
              trigger={<Label size='small' className='counter' content={total} />}
              content='Property Count' position='top center' />
          </Menu.Item>,
        render: () =>
          <Tab.Pane>
            <Segment attached='top'>
              <Grid columns='equal'>
                <Grid.Column verticalAlign='middle' width={15}>
                  <PropSearch updateFilter={updateFilter}
                    options={keys} filter={filter} />
                </Grid.Column>
                <Grid.Column verticalAlign='middle'>
                  <Popup inverted content='Display only secret values'
                    trigger={
                      <Button icon={<FaKey />} toggle active={secrets}
                        onClick={this.handleSecretsClick} compact
                        floated='right' circular />
                    } position='top right' size='small' />
                </Grid.Column>
              </Grid>
            </Segment>
            <Segment attached='bottom' className='view'>
              {config}
            </Segment>
          </Tab.Pane>
      },
      {
        menuItem: {key: '.json', content: '.json'},
        render: () => this.createTab('json')
      },
      {
        menuItem: {key: '.yml', content: '.yml'},
        render: () => this.createTab('yaml')
      },
      {
        menuItem: {key: '.properties', content: '.properties'},
        render: () => this.createTab('properties')
      },
      {
        menuItem: {key: 'metadata', content: 'Metadata'},
        render: () => this.createTab('metadata')
      },
      {
        menuItem:
        <Menu.Item key='github' >
          <GoMarkGithub
            className={activeTab === 'github' ? 'enabled' : 'disabled'} />
          {'  '}GitHub
          <Popup inverted size='small'
            trigger={
              <Label size='small' content={propertyFiles.length}
                className='counter'/>
            }
            content='Property Files' position='top center' />
        </Menu.Item>,
        render: () => <Tab.Pane>{this.createGithubTab()}</Tab.Pane>
      },
      {
        menuItem:
          <Menu.Item key='api'>
            <Popup size='small'
              inverted
              trigger={<FaCloud
                className={activeTab === 'api' ? 'enabled' : 'disabled'} />
              }
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
          <Menu.Item as='p' fitted='horizontally' disabled
            key='version' position='right' >
            {
              version.length > 0 ?
              <Popup inverted size='small'
                trigger={
                  <Label href={`${repoURL}/commit/${version}`}
                    target='_blank' color='grey'>{version.substring(0, 7)}</Label>
                }
                content='Commit ID' position='top right' /> :
              null
            }
          </Menu.Item>,
        render: () => {}
      }
    ]

    return (
      <Tab menu={{stackable: true, tabular: true, attached: true}} panes={panes} onTabChange={this.handleTabChange} activeIndex={activeIndex} />
    )
  }
}
