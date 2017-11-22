import React from 'react';
import {Segment, List, Tab, Menu, Label, Grid,
  Popup, Accordion, Message, Button} from 'semantic-ui-react';

import 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-okaidia.css';
import {PrismCode} from 'react-prism';

import PropTypes from 'prop-types'
import FaKey from 'react-icons/lib/fa/key'
import FaGithub from 'react-icons/lib/fa/github'
import FaCloud from 'react-icons/lib/fa/cloud'

import GoMarkGithub from 'react-icons/lib/go/mark-github'
import GoDiff from 'react-icons/lib/go/diff'
import GoFileCode from 'react-icons/lib/go/file-code'
import GoGistSecret from 'react-icons/lib/go/gist-secret'

import 'lodash'

import PropSearch from './PropSearch.jsx'
import Diff from './Diff.jsx'
import * as config from '../conf';
import * as api from '../utils/api.js'

const org = 'services-config'

export default class Views extends React.Component {

  static propTypes = {
    info: PropTypes.shape({
      url: PropTypes.string,
      appName: PropTypes.string,
      label: PropTypes.string,
      profiles: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    headers: PropTypes.object.isRequired,
    updateUserRepo: PropTypes.func.isRequired,
    filter: PropTypes.arrayOf(PropTypes.string).isRequired,
    updateFilter: PropTypes.func.isRequired,
    portal: PropTypes.bool,
    transactionId: PropTypes.string.isRequired,
    labelOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    user: PropTypes.string.isRequired,
    repo: PropTypes.string.isRequired,
    stateHandler: PropTypes.func.isRequired,
    simple: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      values: {},
      activeTab: 'config',
      metadata: '',
      json: '',
      yaml: '',
      properties: '',
      compare: '',
      requests: [],
      version: '',
      secrets: false,
      repoURL: '',
      propertyFiles: [],
      compareLabel: '',
      compareProfiles: [],
      profOptions: [],
      raw: 'json',
      diffView: 'properties'
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
          target='_blank' className='json-string'>"&#8288;{value}"</a>
      }
      return (<span className='json-string'>"&#8288;{value}"</span>)
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
        "tid": `${this.props.transactionId}`,
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

    const configApiRequest = this.makeConfigServiceFetchRequest(
      headers, this.props.portal
    );
    const configApiUrl = `${proxy}${url}`
    console.log(`Requesting config api '${configApiUrl.replace(proxy, "")}' `)

    const tid = this.props.transactionId
    return fetch(configApiUrl, configApiRequest)
    .then(response => {
        let timestamp = new Date().toString()
        requests.push({
          response,
          timestamp,
          tid
        })
        if (response.ok) {
          return response.text()

        } else {
          return response.json().then(err => {
            this.props.stateHandler({phase: "file", url: url, error: err});
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
    className += ' raw-code'
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

        // don't set the value of files... Not needed.
        this.props.stateHandler({phase: "properties", type: "raw",
          url: `${url}.${ext}`, value: code});

        if (ext === "json") {
          this.props.stateHandler({phase: "loaded"});
        }

        this.setState({
          [ext]: code
        })
      })
      .catch(error => {
        this.props.stateHandler({phase: "properties", type: "raw",
          url: `${url}.${ext}`, error: error});

        // don't set the value of files... Not needed.
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
    this.setState({
      activeTab
    })
  }

  /**
   * Parses a URL.
   *
   */
  getLocation = (href) => {
    var l = document.createElement("a");
    l.href = href;
    return l;
  };

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
    const { appName } = this.props.info;
    let values = {}
    if (files.length === 0 && !repoURL) {
      const error = `There are no valid config files in the github repo for app "${appName}". Expecting "application.ext" or "${appName}.ext" in the master branch. (ext = yaml or properties)`;
      console.log(error);
      throw Error(error);
    }
    const repoURL = files[0].name.substring(0, files[0].name.lastIndexOf('/'))
    let urlParts = new URL(repoURL).pathname.split("/")
    const user = urlParts[1]
    const repo = urlParts[2]
    console.log(`Views: Loading config files from ${repoURL}: ${user}/${repo} will be used for API calls`)

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
    const { repoURL, propertyFiles } = this.state
    const { label } = this.props.info
    return (
      <List>
        <List.Item>
          <List.Header>Current Label</List.Header>
          <List.Content>{repoURL ? label : null}</List.Content>
        </List.Item>
        <List.Item>
          <List.Header>Github Repo URL</List.Header>
          <List.Content as='a' href={`${repoURL}/tree/${label}`}
            target='_blank'>
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
          <List.Content as='a' href={`${repoURL}/commits/${label}`}
            target='_blank'>
            {repoURL ? `${repoURL}/commits/${label}` : null}
          </List.Content>
        </List.Item>
      </List>
    )
  }

  /**
   * Fetch json or properties config for given label and profiles.
   * Called by Diff and in updateDiffView.
   *
   * @param {string} label - compare label
   * @param {string[]} profiles - compare profiles
   * @param {string} [diffView] - new diff view selection if applicable
   */
  fetchCompare = (label, profiles, diffView) => {
    const ext = diffView === undefined ? this.state.diffView : diffView
    this.setState({
      compareLabel: label,
      compareProfiles: profiles,
      diffView: ext
    })
    const { url, appName } = this.props.info
    const escapedLabel = label.replace(/\//g, '(_)')
    const compareURL = `${url}/${escapedLabel}/${appName}-${profiles}.${ext}`
    this.fetchFile(compareURL, [], this.props.headers)
    .then(response => {
      const code = ext === 'json'
        ? JSON.stringify(JSON.parse(response), null, 2)
        : response
      this.setState({
        compare: code
      })
    })
    .catch(error => {
      console.log(error.message)
    })
  }

  /**
   * Fetch list of profiles from github based onuser, repo, and label.
   * Update options in to pass to Diff.
   *
   * @param {string} label - current label
   * @param {string} [user] - new or current user
   * @param {string} [repo] - new or current repo
   */
  updateProfileOptions = (label, user=this.props.user, repo=this.props.repo) => {
    const proxy = config.getProxyServerUrl();
    const currentEnv = config.getCurrentHostEnv().toString();
    console.log(`Setting up the proxy url '${proxy}' to be used for env ${currentEnv}`);

    const { headers, portal, transactionId } = this.props

    const githubRequest = api.makeGithubFetchRequest(headers,
      portal, transactionId);

    const githubApiUrl =
      `${proxy}${config.GIT_REPOS_API}/${user}/${repo}/contents?ref=${label}`
    console.log(`Requesting github content from ${githubApiUrl.replace(proxy, "")} `)

    fetch(githubApiUrl, githubRequest).then((response) => {

      if (response.status >= 400) {
        throw new Error(response.json())
      }
      return response.json()

    }).then(contents => {
      const { appName } = this.props.info
      const profOptions = api.parseProfiles(contents, appName,
        this.state.compareProfiles, this.props.stateHandler, githubApiUrl)

      this.setState({
        profOptions
      })
    }).catch(err => console.log(err.message))
  }

  handleRawChange = (e, {name}) => {
    this.setState({
      raw: name
    })
  }

  /**
   * Fetches data for all tabs. Updates requests, version, and all data and
   * creates key value pairs by calling updateValues. Handles bad requests.
   * If new user or repo, reset diffs.
   *
   * @param {object} nextProps
   * @param {object} nextProps.info - url, appName, label, profiles
   * @param {object} nextProps.headers - current headers
   * @param {string} nextProps.user - current user
   * @param {string} nextProps.repo - current repo
   */
  componentWillReceiveProps({info, headers, user, repo}) {
    if (!_.isEqual(info, this.props.info) ||
        !_.isEqual(headers, this.props.headers)) {
      const { url, appName, profiles, label } = info
      const escapedLabel = label.replace(/\//g, '(_)')
      const metaURL = `${url}/${appName}/${profiles}/${escapedLabel}`
      const confURL = `${url}/${escapedLabel}/${appName}-${profiles}`
      let requests = []
      this.fetchFile(metaURL, requests, headers)
      .then(response => {
        this.getRawData(confURL, 'json', requests, headers)
        this.getRawData(confURL, 'yaml', requests, headers)
        this.getRawData(confURL, 'properties', requests, headers)

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
          metadata: error.toString(),
          repoURL: null,
          propertyFiles: [],
          compare: error.toString()
        })
        this.props.updateUserRepo('', '')
      })
    }
    if (user !== this.props.user || repo !== this.props.repo) {
      this.setState({
        compareLabel: info.label,
        compareProfiles: info.profiles
      })
      this.fetchCompare(info.label, info.profiles)
      this.updateProfileOptions(info.label, user, repo)
    }
  }

  render() {
    const { activeTab, json, yaml, properties, requests, values,
      diffView, version, secrets, repoURL, propertyFiles, compare,
      compareLabel, compareProfiles, profOptions, raw } = this.state
    const { updateFilter, filter, labelOptions, simple } = this.props
    const { label, profiles } = this.props.info

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
          <List.Item>transaction ID: {item.tid}</List.Item>
        </List>
    }))

    // config tab
    const viewPanes = [
      {
        menuItem:
          <Menu.Item key='config'>
            <GoGistSecret
              className={activeTab === 'config' ? 'enabled' : 'disabled'}
            />
            Config
            <Popup inverted size='small'
              trigger={<Label size='small' className='counter'
                content={total} />}
              content='Property Count' position='top center' />
          </Menu.Item>,
        pane:
          <Tab.Pane key='config'>
            <Segment attached='top' className='views-segment'>
              <Grid columns='equal'>
                <Grid.Column verticalAlign='middle' width={15}>
                  <PropSearch updateFilter={updateFilter}
                    options={keys} filter={[...filter]} />
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
      }
    ]

    // Add Raw and Diff tabs if in simple view
    if (!simple) {
      const rawPanes = [
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
          menuItem: {key: 'metadata', content: 'metadata'},
          render: () => this.createTab('metadata')
        }
      ]

      viewPanes.push(...[
        {
          menuItem: {key: 'raw', content: 'Raw', icon:
            <GoFileCode
              className={activeTab === 'raw' ? 'enabled' : 'disabled'}
            />
          },
          pane:
            <Tab.Pane key='raw'>
              <Tab menu={{stackable: true, secondary: true,
                  pointing: true, className: 'raw-menu'}}
                panes={rawPanes} onTabChange={this.handleRawChange} />
            </Tab.Pane>
        },
        {
          menuItem: {key: 'diff', content: 'Diff', icon:
            <GoDiff className={activeTab === 'diff' ? 'enabled' : 'disabled'} />
          },
          pane:
            <Tab.Pane key='diff'>
              <Diff base={diffView === 'json' ? json : properties}
                compare={compare} baseLabel={label}
                baseProfiles={profiles} profOptions={profOptions}
                labelOptions={labelOptions} fetchCompare={this.fetchCompare}
                compareLabel={compareLabel} compareProfiles={compareProfiles}
                updateProfileOptions={this.updateProfileOptions} />
            </Tab.Pane>
        }
      ])
    }

    // Add github, api logs, and version number
    viewPanes.push(...[
      {
        menuItem:
        <Menu.Item key='github' >
          <GoMarkGithub
            className={activeTab === 'github' ? 'enabled' : 'disabled'}
          />
          GitHub
          <Popup inverted size='small'
            trigger={
              <Label size='small' content={propertyFiles.length}
                className='counter'/>
            }
            content='Property Files' position='top center' />
        </Menu.Item>,
        pane:
        <Tab.Pane key='github' className='full-pane'>
          {this.createGithubTab()}
        </Tab.Pane>
      },
      {
        menuItem: {key: 'api', content: 'API Logs', icon:
          <FaCloud className={activeTab === 'api' ? 'enabled' : 'disabled'} />
        },
        pane:
          <Tab.Pane key='api' className='full-pane'>
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
                    target='_blank' color='grey'>
                    {version.substring(0, 7)}
                  </Label>
                }
                content='Commit ID' position='top right' /> :
              null
            }
          </Menu.Item>
      }
    ])

    return (
      <Tab menu={{stackable: true, tabular: true, attached: true}}
        panes={viewPanes} onTabChange={this.handleTabChange}
        renderActiveOnly={false} />
    )
  }
}
