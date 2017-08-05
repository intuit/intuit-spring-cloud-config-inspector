import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Menu } from 'semantic-ui-react'

const urlHeader = 'https://github.intuit.com/api/v3/repos/ASTEIN/config-publisher-service-config/git/refs?access_token='
const accessToken = '5a5d4df85870b6d42580cd39b6fae3ce395f0742'


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
      branches: [],
      tags: [],
      branch: props.label,
      tag: null
    }
  }

  /**
   * Update branch and tag values in response to change
   * in user input label field.
   * @todo fetch url from metadata url
   *
   * @param {string} label - taken from props, current label
   * value
   */
  componentWillReceiveProps({appName, label}) {
    let {branches, tags} = this.state

    if (this.props.appName != appName) {
      fetch(`${urlHeader}${accessToken}`).then(
        function(response) {
          if (response.status >= 400) {
            throw new Error("bad")
          }
          return response.json()
        }
      ).then((refs) => {
        const tagRefs = refs.filter((r) => r.ref.startsWith('refs/tags'))
        tags = tagRefs.map((r) => ({value: r.ref.split('refs/tags/')[1], sha: r.object.sha}))
        const branchRefs = refs.filter((r) => r.ref.startsWith('refs/heads'))
        branches = branchRefs.map((r) => ({value: r.ref.split('refs/heads/')[1], sha: r.object.sha}))
        this.setState({
          branches,
          tags
        })
      })
    }

    if (this.props.label != label) {
      const branchKeys = branches.map(b => b.key)
      const tagKeys = tags.map(t => t.key)
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
    const {branches, tags, branch, tag} = this.state

    return (
      <Grid.Column width={4}>
        <h1>Labels</h1>
        <h3>Branches</h3>
        <Menu fluid vertical borderless className='labelmenu'>
          {
            branches.map(item =>
              <Menu.Item key={item.value} name={item.value}
                content={item.value} active={branch === item.value}
                onClick={this.handleBranchChange} />
            )
          }
        </Menu>
        <h3>Tags</h3>
        <Menu fluid vertical borderless className='labelmenu'>
          {
            tags.map(item =>
              <Menu.Item key={item.value} name={item.value}
                content={item.value} active={tag === item.value}
                onClick={this.handleBranchChange} />
            )
          }
        </Menu>
      </Grid.Column>
    )
  }
}
