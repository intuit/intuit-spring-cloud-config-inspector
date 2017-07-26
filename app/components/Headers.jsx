import React from 'react'
import { Table, Input, Button } from 'semantic-ui-react'

export default class Header extends React.Component {
  state = { index:0, data:{} }

  handleHeaderChange = (e, object) => {
    const data = this.state.data
    const [label, key] = object.className.split(' ')
    if (data[key]) data[key][label] = object.value
    else {
      const obj = {key: object.value}
      data[key] = obj
    }
    this.setState({
      data
    })
  }

  handleDelete = (e, object) => {
    const data = this.state.data
    delete data[object.className]
    const newCount = Object.keys(data).length

    this.props.updateHeaderCount(newCount)
    this.setState({
      data
    })
  }

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
