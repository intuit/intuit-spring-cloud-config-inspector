import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Menu } from 'semantic-ui-react'

const branches = [
  {key:'master', value: 'master', text:'master'},
  {key:'develop', value: 'develop', text:'develop'},
  {key:'feature', value: 'feature', text:'feature'}
]

const tags = [
  {key:'v3.4.25', value: 'v3.4.25', text:'v3.4.25'},
  {key:'v3.4.24', value: 'v3.4.24', text:'v3.4.24'},
  {key:'v3.4.23', value: 'v3.4.23', text:'v3.4.23'},
  {key:'v3.4.22', value: 'v3.4.22', text:'v3.4.22'},
  {key:'v3.4.21', value: 'v3.4.21', text:'v3.4.21'},
  {key:'v3.4.20', value: 'v3.4.20', text:'v3.4.20'}
]

export default class LabelMenu extends React.Component {

  static propTypes = {
    updateLabel: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
  }

  /**
   * Sets initial state label to master (branch)
   *
   * @param {object} props - updateLabel and label
   */
  constructor(props) {
    super()
    this.state = {
      branch: props.label,
      tag: null
    }
  }

  /**
   * Update branch and tag values in response to change
   * in user input label field.
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
          tag: null
        })
      } else if (tagKeys.includes(label)) {
        this.setState({
          branch: null,
          tag: label
        })
      }
    }
  }

  /**
   * Changes the value of the current branch and calls the
   * callback function to update parent App component
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {string} value - branch selection
   */
  handleBranchChange = (e, {name}) => {
    this.setState({
      branch: name,
      tag: null
    })
    this.props.updateLabel('label', name)
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

  render() {
    const {branch, tag} = this.state

    return (
      <Grid.Column width={4}>
        <h3>Branches</h3>
        <Menu fluid vertical borderless className='labelmenu'>
          {
            branches.map(item =>
              <Menu.Item key={item.key} name={item.value}
                content={item.value} active={branch === item.value}
                onClick={this.handleBranchChange} />
            )
          }
        </Menu>
        <h3>Tags</h3>
        <Menu fluid vertical borderless className='labelmenu'>
          {
            tags.map(item =>
              <Menu.Item key={item.key} name={item.value}
                content={item.value} active={tag === item.value}
                onClick={this.handleBranchChange} />
            )
          }
        </Menu>
      </Grid.Column>
    )
  }
}
