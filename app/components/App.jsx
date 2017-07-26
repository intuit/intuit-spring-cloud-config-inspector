import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
  constructor(props) {
    super(props)
    this.state = {
      inputData: {'url': 'https://config.api.intuit.com/v2', 'app': '{app}', 'profiles': 'default', 'label': 'master'},
      headers: false,
      headerCount: 0
    }
  }

  getInputData = (field, data) => {
    const inputData = this.state.inputData;
    // If they clear input set back to template
    inputData[field] = data == '' ? `{${field}}` : data
    this.setState({
      inputData
    })
  }

  toggleHeaders = () => {
    this.setState({
      header: !(this.state.header)
    })
  }

  updateHeaderCount = (headerCount) => {
    this.setState({
      headerCount
    })
  }

  render() {
    const { header, headerCount } = this.state
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
                  <UserControls inputData={this.state.inputData} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <PropSearch />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column stretched>
                  <Views />
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
