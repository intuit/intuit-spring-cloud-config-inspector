import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';

/* component imports */
import DropDown from './dropdown.jsx';
import UserInputs from './UserInputs.jsx';
import LabelMenu from './LabelMenu.jsx';
import Views from './Views.jsx'
import TopMenu from './TopMenu.jsx'
import Headers from './Headers.jsx'

import './app.scss';

import {Grid} from 'semantic-ui-react';

export default class App extends React.Component {

  static propTypes = {
    label: PropTypes.string,
    url: PropTypes.string,
    appName: PropTypes.string,
    profiles: PropTypes.arrayOf(PropTypes.string),
    portal: PropTypes.bool
  }

  /**
   * Sets default values of label, headerCount to 1 and headers
   * (show) to false.
   */
  constructor(props) {
    super(props)
    this.state = {
      label: props.label,
      headerShow: false,
      headerCount: 1,
      headers: {},
      urls: {},
      user: '',
      repo: ''
    }
  }

  /**
   * Callback function passed to LabelMenu. Called when user selects
   * new label. Updates label which may affect UserInputs or LabelMenu.
   *
   * @param {string} label - new label
   */
  updateLabel = (label) => {
    this.setState({
      label
    })
  }

  /**
   * Callback function passed to UserInputs. Updates bool header
   * which determines whether headers table is visible or not. Called
   * when button is clicked in UserInputs.
   */
  toggleHeaders = () => {
    this.setState({
      headerShow: !(this.state.headerShow)
    })
  }

  /**
   * Callback function passed to Headers. Updates number headerCount
   * which determines the number of headers to be displayed above
   * Headers button in UserInputs. Called when a header row is added
   * or removed.
   *
   * @param {number} headerCount - number of header rows
   */
  updateHeaderCount = (headerCount) => {
    this.setState({
      headerCount
    })
  }

  /**
   * Callback function passed to Headers. Updates number headerCount
   * which determines the number of headers to be displayed above
   * Headers button in UserInputs. Called when a header row is added
   * or removed.
   *
   * @param {number} data - number of header rows
   */
  updateHeaders = (data) => {
    let headers = {}
    for (var index in data) {
      headers[data[index].key.value] = data[index].value.value
    }
    this.setState({
      headers
    })
  }

  /**
   * Callback function passed to UserInputs. Updates object urls
   * which contains metaURL and confURL. urls used in Views.
   *
   * @param {object} urls - metaURL and confURL
   */
  updateURLs = (urls) => {
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
    const { headerShow, headerCount, label,
      urls, headers, user, repo } = this.state

    const { url, appName, profiles, portal } = this.props

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
            <div className='custom'>
              <UserInputs toggle={headerShow}
                updateLabel={this.updateLabel}
                toggleHeaders={this.toggleHeaders}
                headerCount={headerCount}
                label={label} updateURLs={this.updateURLs}
                user={user} repo={repo} url={url}
                appName={appName} profiles={profiles}
                portal={portal} />
              <Headers show={headerShow}
                updateHeaderCount={this.updateHeaderCount}
                updateHeaders={this.updateHeaders} />
              <br/>
            </div>
          </div>
          <div className='custom'>
            <Grid stackable columns='equal'>
                <Grid.Column stretched>
                  <Views urls={urls} headers={headers}
                    updateUserRepo={this.updateUserRepo} />
                </Grid.Column>
                <LabelMenu updateLabel={this.updateLabel}
                  label={label}
                  user={user} repo={repo} />
            </Grid>
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
  label: 'master'
}
