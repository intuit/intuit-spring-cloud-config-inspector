import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import DropDown from './dropdown.jsx';
import PropSearch from './PropSearch.jsx';
import UserInputs from './UserInputs.jsx';
import UserControls from './UserControls.jsx';
import LabelMenu from './LabelMenu.jsx';

import './app.scss';

import {Grid, Segment, Header, Divider} from 'semantic-ui-react';

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const list = [
      'App Name = my_app',
      'Version = v1.0.0',
      'Label = label'
    ]

    return (
      <ReactCSSTransitionGroup
        transitionName='app'
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        <div className='custom'>
          <Grid stackable columns='equal'>
            <Grid.Row>
              <Grid.Column>
                <UserInputs />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <UserControls />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <PropSearch />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column stretched>
                <Segment>
                  Version: af398de444416bb4cd867768b5a363a79b76f5e2
                  <Divider />
                  A bunch of code
                </Segment>
              </Grid.Column>
              <LabelMenu />
            </Grid.Row>
          </Grid>
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}
