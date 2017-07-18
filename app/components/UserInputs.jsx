import React from 'react';

import {Input, Form, Grid, Header, Dropdown} from 'semantic-ui-react';

const options = [
  { key: '1', text: 'P1', value: 'p1' },
  { key: '2', text: 'P2', value: 'p2' },
  { key: '3', text: 'P3', value: 'p3' },
]

export default class UserInputs extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Form>
        <Form.Group widths='equal'>
          <Form.Field control={Input} label='Config URL' placeholder='config url...' />
          <Form.Field control={Input} label='App Name' placeholder='app name...' />
          <Form.Field control={Dropdown} label='Profiles' placeholder='profiles...' fluid multiple search selection options={options} />
          <Form.Field control={Input} label='Label' placeholder='label...' defaultValue='master' />
        </Form.Group>
      </Form>
    )
  }
}
