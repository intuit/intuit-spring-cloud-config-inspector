import React from 'react';
import {Segment, List} from 'semantic-ui-react';

import sample from '../sample/payload.json';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: sample,
      values: {}
    }
  }

  /**
   * Traverses nested data object, adds key value pairs to values. If
   * nested objects present calls getValues on nested object.
   *
   * @param {object} data - object to traverse
   * @param {string} prefix - path to current object
   */
  getValues(data, prefix) {
    let values = this.state.values
    for (var key in data) {
      if (data[key] !== null && typeof(data[key]) == 'object') {
        this.getValues(data[key], prefix + key + '.')
      } else {
        values[prefix + key] = data[key]
        this.setState({
          values
        })
      }
    }
  }

  /**
   * Wrapper for getValues. Traverses JSON file, adds key value pairs to
   * values. If nested objects present calls getValues on nested object.
   *
   * @param {object} data - JSON to traverse
   */
  getValuesWrapper(data) {
    let values = this.state.values
    for (var key in data) {
      if (data[key] !== null && typeof(data[key]) == 'object') {
        this.getValues(data[key], key + '.')
      } else {
        values[key] = data[key]
        this.setState({
          values
        })
      }
    }
  }

  /**
   * Formats key value pair as '{key} = {value}'. Checks type of value
   * to use appropriate style. Returns a List Item
   *
   * @param {string} key - current key
   * @param {object} values - equivalent to this.state.values
   */
  formatPair(key, values) {
    let value = ''
    if (typeof values[key] == 'string') {
      value = (<span className='json-string'>"{values[key]}"</span>)
    } else if (typeof values[key] == 'boolean') {
      value = (<span className='json-bool'>{values[key].toString()}</span>)
    } else {
      value = (<span className='json-val'>{values[key].toString()}</span>)
    }

    return (<List.Item key={key}>
      <List.Content>
        <h4>
          <span className='json-key'>{key}</span> = {value}
        </h4>
      </List.Content>
    </List.Item>)
  }

  /**
   * Calls function to create flattened JSON tree before component mounts
   */
  componentWillMount() {
    this.getValuesWrapper(this.state.data)
  }

  render() {
    const { values } = this.state

    return (
      <div>
        <Segment attached='top'>
          Version: af398de444416bb4cd867768b5a363a79b76f5e2
        </Segment>
        <Segment attached='bottom' className='view'>
          <List relaxed divided>
            {Object.keys(values).map(key =>
                this.formatPair(key, values)
              )
            }
          </List>
        </Segment>
      </div>
    )
  }
}
