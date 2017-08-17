import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';

/* component imports */
import DropDown from './dropdown.jsx';
import UserInputs from './UserInputs.jsx';
import Views from './Views.jsx'
import TopMenu from './TopMenu.jsx'

import './app.scss';

import * as config from '../conf'

export default class App extends React.Component {

  static propTypes = {
    label: PropTypes.string,
    url: PropTypes.string,
    appName: PropTypes.string,
    profiles: PropTypes.arrayOf(PropTypes.string),
    headers: PropTypes.object,
    portal: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      headers: props.headers,
      urls: {},
      user: '',
      repo: '',
      appName: props.appName,
      url: props.url,
      profiles: props.profiles,
      label: props.label
    }
  }

  /**
   * Callback function passed to UserInputs. Updates url, appName,
   * and headers and updates the urls.
   *
   * @param {string} url - new url
   * @param {string} appName - new appName
   * @param {object} headers - new headers
   */
  updateInfo = (url, appName, headers) => {
    this.setState({
      url,
      appName,
      headers
    })
    this.updateURLs(url, appName)
  }

  /**
   * Callback function passed to UserInputs. Updates profiles and urls.
   *
   * @param {string[]} profiles - new profiles
   */
  updateProfiles = (profiles) => {
    this.setState({
      profiles
    })
    this.updateURLs(this.state.url, this.state.appName,
      profiles, this.state.label)
  }

  /**
   * Callback function passed to UserInputs. Updates label and urls.
   *
   * @param {string} label - new label
   */
  updateLabel = (label) => {
    this.setState({
      label
    })
    this.updateURLs(this.state.url, this.state.appName,
      this.state.profiles, label)
  }

  /**
   * Creates new urls based on parameters. Replaces forward slashes in
   * label with (_). If no profiles or label provided, resets to defaults.
   *
   * @param {string} url - server url
   * @param {string} appName
   * @param {string[]} profiles - i.e. dev, e2e, qal...
   * @param {string} label - branch or tag
   */
  updateURLs(url, appName, profiles=['default'], label='master') {
    // For localhost, use the url in the app, or else use the configured ones
    const currentEnv = config.getCurrentHostEnv();
    const envUrl = currentEnv === config.Env.LOCAL ? `${url}/` : "";

    const urls = {
      metaURL: `${envUrl}${appName}/${profiles}/${label.replace(/\//g, '(_)')}`,
      confURL: `${envUrl}${label.replace(/\//g, '(_)')}/${appName}-${profiles}`
    }

    this.setState({
      urls
    })
  }

  /**
   * Callback function passed to Views. Updates user based on github
   * url found in metadata.
   *
   * @param {object} urls - current user
   */
  updateUserRepo = (user, repo) => {
    this.setState({
      user,
      repo
    })
  }

  render() {
    const { urls, headers, user, repo, url, appName, profiles, label } = this.state

    const { portal } = this.props

    return (
      <div>
        <ReactCSSTransitionGroup
          transitionName='app'
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          <div className='app'>
            <TopMenu />
            <UserInputs user={user} repo={repo} url={url}
              appName={appName} profiles={profiles}
              label={label} portal={portal}
              updateInfo={this.updateInfo}
              updateLabel={this.updateLabel}
              updateProfiles={this.updateProfiles} />
            <br/>
          </div>
          <div className='custom'>
            <Views urls={urls} headers={headers}
              updateUserRepo={this.updateUserRepo} />
          </div>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

App.defaultProps = {
  url: 'https://config-e2e.api.intuit.com/v2',
  appName: '',
  profiles: ['default'],
  label: 'master',
  headers: {}
}
