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
      tag: null,
      activeIndex: 0
    }
  }

  componentWillReceiveProps({label}) {
    const branchKeys = branches.map(b => b.key)
    const tagKeys = tags.map(t => t.key)
    if (this.props.label != label) {
      if (branchKeys.includes(label)) {
        this.setState({
          branch: label,
          tag: null,
          activeIndex: 0
        })
      } else if (tagKeys.includes(label)) {
        this.setState({
          branch: null,
          tag: label,
          activeIndex: 1
        })
      }
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
      branch: value,
      tag: null
    })
    this.props.updateLabel('label', value)
  }

  handleTagChange = (e, {value}) => {
    this.setState({
      branch: null,
      tag: value
    })
    this.props.updateLabel('label', value)
  }

  handleTabChange = (e, {activeIndex}) => this.setState({ activeIndex })

  render() {
    const {activeIndex} = this.state
    const panes = [
      {menuItem: 'Branches', render: this.createBranches},
      {menuItem: 'Tags', render: this.createTags}
    ]

    return (
      <Grid.Column width={4}>
        <Tab panes={panes} activeIndex={activeIndex} onTabChange={this.handleTabChange} />
      </Grid.Column>
    )
  }
}
