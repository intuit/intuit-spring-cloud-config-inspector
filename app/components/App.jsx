import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';

/* component imports */
import DropDown from './dropdown.jsx';
import PropSearch from './PropSearch.jsx';
import UserInputs from './UserInputs.jsx';
import UserControls from './UserControls.jsx';
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
        'url': 'https://config.api.intuit.com/v2',
        'app': '{app}',
        'profiles': 'default',
        'label': 'master'
      },
      header: false,
      headerCount: 0,
      urls: {}
    }
  }

  /**
   * Callback function passed to UserInputs. Updates inputData which
   * is used by UserControls to generate URLs. Called when an input
   * is changed in UserInputs.
   *
   * @param {string} field - inputData key (url, app, profiles, label)
   * @param {string|array} data - input value in field
   */
  getInputData = (field, data) => {
    const inputData = {...this.state.inputData};
    // If they clear input set back to template
    inputData[field] = data == '' ? `{${field}}` : data
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
      header: !(this.state.header)
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

  updateURLs = (urls) => {
    this.setState({
      urls
    })
  }

  render() {
    const { header, headerCount, inputData, urls } = this.state
    const inputDataClone = {...inputData}
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
                    <UserInputs toggle={header}
                      transferData={this.getInputData}
                      toggleHeaders={this.toggleHeaders}
                      headerCount={headerCount} />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Headers show={header}
                      updateHeaderCount={this.updateHeaderCount} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </div>
          <div className='custom'>
            <Grid stackable columns='equal'>
              <Grid.Row>
                <Grid.Column>
                  <UserControls inputData={inputData}
                    updateURLs={this.updateURLs} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <PropSearch />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column stretched>
                  <Views urls={urls} />
                </Grid.Column>
                <LabelMenu />
              </Grid.Row>
            </Grid>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}
