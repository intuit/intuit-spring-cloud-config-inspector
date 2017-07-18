import React from 'react';

import {Segment, Grid, Button, Dropdown} from 'semantic-ui-react';

const extOptions = [
  {key: 'json', text: '.json', value: '.json'},
  {key: 'yaml', text: '.yaml', value: '.yaml'},
  {key: 'properties', text: '.properties', value: '.properties'}
]

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    return (
      <Segment>
        <Grid columns='equal' stackable>
          <Grid.Row>
            <Grid.Column>
              <p>Metadata URL</p>
            </Grid.Column>
            <Grid.Column width={10}>
              <p>https://config-qal.api.intuit.net/my_app/prof/label</p>
            </Grid.Column>
            <Grid.Column>
              <Button fluid content='Metadata' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <p>Config File URL</p>
            </Grid.Column>
            <Grid.Column width={10}>
              <span>
                https://config-qal.api.intuit.net/label/my_app-prof
                <Dropdown
                  inline options={extOptions}
                  defaultValue={extOptions[0].text}
                />
              </span>
            </Grid.Column>
            <Grid.Column>
              <Button fluid content='Config' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    )
  }
}
