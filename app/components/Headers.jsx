import React from 'react'
import { Table, Input, Button } from 'semantic-ui-react'

export default class Header extends React.Component {
  state = { rows:[] }

  newRow = (index) => {
    return (
      <Table.Row key={index}>
        <Table.Cell width={7}>
          <Input fluid transparent placeholder='key' />
        </Table.Cell>
        <Table.Cell width={7}>
          <Input fluid transparent placeholder='value' />
        </Table.Cell>
        <Table.Cell>
          <Button floated='right' className={index.toString()} onClick={this.handleDelete}>Delete</Button>
        </Table.Cell>
      </Table.Row>
    )
  }

  handleDelete = (e, object) => {
    const rows = this.state.rows
    // getting the location of the row which has a matching key with button
    var index = rows.map( (r) => r.key ).indexOf(object.className)
    // remove row at that location
    rows.splice(index, 1)
    this.setState({
      rows
    })
  }

  handleClick = () => {
    const rows = this.state.rows
    // Add new empty row with index
    rows.push({key:rows.length.toString(), row:this.newRow(rows.length)})
    this.setState({
      rows
    })
  }

  render() {
    // get an array of just the rows (no keys)
    if (this.props.show) {
      var rows = this.state.rows.map((r) => r.row)
      return (
        <Table columns={3}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={7}>Keys</Table.HeaderCell>
              <Table.HeaderCell width={7}>Values</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>{rows}</Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='3'>
                <Button width={1} onClick={this.handleClick} fluid>Add key-value pair</Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      )
    } else return null

  }
}
