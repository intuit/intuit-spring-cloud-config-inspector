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

  /**
   * Sets default values of inputData, headerCount to zero and headers
   * (show) to false.
   */
  constructor(props) {
    super(props)
    this.state = {
      inputData: {
        'url': 'https://config-e2e.api.intuit.com/v2',
        'app': '{app}',
        'profiles': 'default',
        'label': 'master'
      },
      headerShow: false,
      headerCount: 1,
      headers: {},
      urls: {}
    }
  }

  /**
   * Callback function passed to UserInputs. Updates inputData which
   * is used by UserControls to generate URLs. Called when an inputs
   * are submitted.
   *
   * @param {array} data - new inputData
   */
  getInputData = (data) => {
    const inputData = {...data}
    this.setState({
      inputData
    })
  }

  /**
   * Callback function passed to LabelMenu. Called when user selects
   * new label. Updates inputData which updates User Inputs and urls.
   *
   * @param {string} label - new label
   */
  updateLabel = (label) => {
    const inputData = {...this.state.inputData}
    inputData.label = label
    this.setState({
      inputData
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

  render() {
    const { headerShow, headerCount, inputData, urls, headers } = this.state

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
              <Grid stackable columns='equal'>
                <Grid.Row>
                  <Grid.Column>
                    <UserInputs toggle={headerShow}
                      transferData={this.getInputData}
                      toggleHeaders={this.toggleHeaders}
                      headerCount={headerCount}
                      label={inputData.label}
                      updateURLs={this.updateURLs} />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Headers show={headerShow}
                      updateHeaderCount={this.updateHeaderCount}
                      updateHeaders={this.updateHeaders} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </div>
          <div className='custom'>
            <Grid stackable columns='equal'>
                <Grid.Column stretched>
                  <Views urls={urls} headers={headers} />
                </Grid.Column>
                <LabelMenu updateLabel={this.updateLabel}
                  label={inputData.label}
                  appName={inputData.app} />
            </Grid>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}
