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
  /**
   * Sets initial state, branch to master and activeIndex to
   * branch tab
   *
   * @param {object} props - updateLabel and label
   */
  constructor(props) {
    super()
    this.state = {
      branch: props.label,
      tag: null,
      activeIndex: 0
    }
  }

  /**
   * Update branch and tag values in response to change
   * in user input label field. Change active tab if
   * applicable.
   *
   * @param {string} label - taken from props, current label
   * value
   */
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

  /**
   * Creates or repaints the branch dropdown menu. Sets the
   * value to the current value as defined in the state.
   *
   * @returns Tab Pane containing Branches Dropdown
   */
  createBranches = () => (
    <Tab.Pane>
      <Dropdown compact fluid scrolling onChange={this.handleBranchChange}
        placeholder={'Select branch'} value={this.state.branch}
        search selection options={branches} />
    </Tab.Pane>
  )

  /**
   * Creates or repaints the tag dropdown menu. Sets the
   * value to the current value as defined in the state.
   *
   * @returns Tab Pane containing Tags Dropdown
   */
  createTags = () => (
    <Tab.Pane>
      <Dropdown compact fluid  scrolling onChange={this.handleTagChange}
        placeholder={'Select tab'} value={this.state.tag}
        search selection options={tags} />
    </Tab.Pane>
  )

  /**
   * Changes the value of the current branch and calls the
   * callback function to update parent App component
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {string} value - branch selection
   */
  handleBranchChange = (e, {value}) => {
    this.setState({
      branch: value,
      tag: null
    })
    this.props.updateLabel('label', value)
  }

  /**
   * Changes the value of the current tag and calls the
   * callback function to update parent App component
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {string} value - tag selection
   */
  handleTagChange = (e, {value}) => {
    this.setState({
      branch: null,
      tag: value
    })
    this.props.updateLabel('label', value)
  }

  /**
   * Changes the active tab.
   */
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
