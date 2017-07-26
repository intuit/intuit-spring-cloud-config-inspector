import React from 'react'
import { Grid, Menu, Dropdown, Tab, Select } from 'semantic-ui-react'

const branches = [
  {key:'master', value: 'master', text:'master'},
  {key:'develop', value: 'develop', text:'develop'}
]

const tags = [
  {key:'p', value: 'p', text:'p'},
  {key:'o', value: 'o', text:'o'}
]

export default class LabelMenu extends React.Component {
  constructor(props) {
    super()
    this.state = {
      branch: props.label,
      tag: tags[0].value
    }
  }

  componentWillReceiveProps(nextProps) {
    const keys = branches.map(b => b.key)
    if (this.props.label != nextProps.label
      && keys.includes(nextProps.label)) {
      this.setState({
        branch: nextProps.label
      })
    }
  }

  createBranches = () => (
    <Tab.Pane>
      <Dropdown compact fluid scrolling onChange={this.handleBranchChange}
        placeholder={'Select branch'} value={this.state.branch}
        search selection options={branches} />
    </Tab.Pane>
  )

  createTags = () => (
    <Tab.Pane>
      <Dropdown compact fluid  scrolling onChange={this.handleTagChange}
        placeholder={'Select tab'} value={this.state.tag}
        search selection options={tags} />
    </Tab.Pane>
  )

  handleBranchChange = (e, {value}) => {
    this.setState({
      branch: value
    })
    this.props.updateLabel('label', value)
  }

  handleTagChange = (e, {value}) => {
    this.setState({
      tag: value
    })
  }

  render() {
    const panes = [
      {menuItem: 'Branches', render: this.createBranches},
      {menuItem: 'Tags', render: this.createTags}
    ]

    return (
      <Grid.Column width={4}>
        <Tab panes={panes} />
      </Grid.Column>
    )
  }
}
