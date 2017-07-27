import React from 'react'
import PropTypes from 'prop-types';
import { Table, Input, Button } from 'semantic-ui-react'

export default class Header extends React.Component {

  static propTypes = {
    show: PropTypes.bool.isRequired,
    updateHeaderCount: PropTypes.func.isRequired
  }

  /**
   * Sets default values of index to zero and data to empty object.
   */
  constructor() {
    super()
    this.state = {
      index:0,
      data:{}
    }
  }

  /**
   * Called when user changes input in one of the headers fields.
   * Changes entry in this.state.data accordingly, creates new
   * entry if new field.
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} object - Input object. Classname is formatted
   * 'key {index}' or 'value {index}'. Value is current string input.
   */
  handleHeaderChange = (e, object) => {
    const data = this.state.data
    const [label, key] = object.className.split(' ')
    if (data[key]) {
      data[key][label] = object.value
    } else {
      const obj = {key: object.value}
      data[key] = obj
    }
    this.setState({
      data
    })
  }

  /**
   * Called when a delete button is clicked. Finds key-value pair in
   * data based on className of button and deletes it. Decreases
   * Header count and calls updateHeaderCount to send update to parent.
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} object - Button object. className is index
   * of associated key-value pair
   */
  handleDelete = (e, object) => {
    const data = this.state.data
    delete data[object.className]
    const newCount = Object.keys(data).length

    this.props.updateHeaderCount(newCount)
    this.setState({
      data
    })
  }

  /**
   * Called when 'Add new key-value pair' clicked. Adds empty pair to
   * data and increments count. Calls updateHeaderCount to send update
   * to parent. Increments index.
   */
  handleClick = () => {
    const key = this.state.index
    const data = this.state.data

    // Add new empty row with index
    data[key] = {key: '', value: ''}

    const newCount = Object.keys(data).length
    this.props.updateHeaderCount(newCount)

    this.setState({
      index: key + 1,
      data
    })
  }

  render() {
    if (this.props.show) {
      const {data} = this.state
      return (
        <Table columns={3}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={7}>Keys</Table.HeaderCell>
              <Table.HeaderCell width={7}>data</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {Object.keys(data).map(index =>
              <Table.Row key={index}>
                <Table.Cell width={7}>
                  <Input defaultValue={data[index].key}
                    className={`key ${index}`} fluid transparent
                    placeholder='key' onChange={this.handleHeaderChange} />
                </Table.Cell>
                <Table.Cell width={7}>
                  <Input defaultValue={data[index].value}
                    className={`value ${index}`} fluid transparent
                    placeholder='value' onChange={this.handleHeaderChange} />
                </Table.Cell>
                <Table.Cell>
                  <Button floated='right' className={index} onClick={this.handleDelete}>Delete</Button>
                </Table.Cell>
              </Table.Row>)}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='3'>
                <Button width={1} onClick={this.handleClick} fluid>
                  Add key-value pair
                </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      )
    } else return null

  }
}
