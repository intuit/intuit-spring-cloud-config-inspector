import React from 'react';
import PropTypes from 'prop-types';

import {Segment, Grid, Button, Dropdown} from 'semantic-ui-react';

const extOptions = [
  {key: 'json', text: '.json', value: '.json'},
  {key: 'yaml', text: '.yaml', value: '.yaml'},
  {key: 'properties', text: '.properties', value: '.properties'}
]

export default class App extends React.Component {

  static propTypes = {
    inputData: PropTypes.object.isRequired,
    updateURLs: PropTypes.func.isRequired
  }

  constructor({inputData: {url, app, profiles, label}}) {
    super()
    this.state = {
      urls: {
        metaURL: `${url}/${app}/${profiles.toString()}/${label}`,
        confURL: `${url}/${label}/${app}-${profiles.toString()}`
      }
    }
  }

  componentWillReceiveProps({inputData}) {
    if (this.props.inputData != inputData) {
      const {url, app, profiles, label} = inputData
      const urls = {}
      urls.metaURL = `${url}/${app}/${profiles.toString()}/${label}`
      urls.confURL = `${url}/${label}/${app}-${profiles.toString()}`

      this.setState({urls})
      this.props.updateURLs(urls)
    }
  }

  render() {
    const {urls} = this.state

    return (
      <Segment>
        <Grid columns='equal' stackable>
          <Grid.Row>
            <Grid.Column>
              <p>Metadata URL</p>
            </Grid.Column>
            <Grid.Column width={10}>
              <p>{urls.metaURL}</p>
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
                {urls.confURL}
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
