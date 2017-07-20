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

import './app.scss';

import {Grid} from 'semantic-ui-react';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputData: {'url': '{url}', 'app': '{app}', 'profiles': 'default', 'label': 'master'}
    }
  }

  getInputData = (field, data) => {
    const inputData = this.state.inputData;
    // If they clear input set back to template
    console.log(data)
    inputData[field] = data == '' ? `{${field}}` : data
    this.setState({
      inputData
    })
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName='app'
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        <TopMenu />
        <div className='custom'>
          <Grid stackable columns='equal'>
            <Grid.Row>
              <Grid.Column>
                <UserInputs transferData={this.getInputData} />
              </Grid.Column>
            </Grid.Row>
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
    )
  }
}
