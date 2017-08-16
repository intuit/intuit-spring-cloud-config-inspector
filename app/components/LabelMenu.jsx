import React from 'react'
import PropTypes from 'prop-types'

import { Grid, Menu } from 'semantic-ui-react'

const urlHeader = 'https://github.intuit.com/api/v3/repos'
const urlFooter = 'git/refs?access_token='
const token = '726db489b8e34fa7b78540917245031cde359bbc'


export default class LabelMenu extends React.Component {

  static propTypes = {
    updateLabel: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    repo: PropTypes.string.isRequired
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
   * Update branch and tag values in response to change in user input
   * label field. Fetch branches and tags from github repo associated
   * with new user or new repo.
   *
   * @param {object} nextProps
   * @param {string} nextProps.user - current user (i.e. services-config)
   * @param {string} nextProps.repo - current repo
   * @param {string} nextProps.label - current label value
   */
  componentWillReceiveProps({user, repo, label}) {
    let {branches, tags} = this.state

    if (this.props.user != user || this.props.repo != repo) {
      fetch(`${urlHeader}/${user}/${repo}/${urlFooter}${token}&per_page=100`).then(
        function(response) {
          if (response.status >= 400) {
            throw new Error(response.json())
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
      }).catch(err => console.log(err.message))
    }

    if (this.props.label != label) {
      const branchKeys = branches.map(b => b.value)
      const tagKeys = tags.map(t => t.value)
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
   * @param {object} data
   * @param {string} data.name - branch selection
   */
  handleBranchChange = (e, {name}) => {
    this.setState({
      branch: name,
      tag: null
    })
    this.props.updateLabel(name)
  }

  /**
   * Changes the value of the current tag and calls the
   * callback function to update parent App component
   *
   * @param {SyntheticEvent} e - React's original SyntheticEvent.
   * @param {object} data
   * @param {string} data.name - tag selection
   */
  handleTagChange = (e, {name}) => {
    this.setState({
      branch: null,
      tag: name
    })
    this.props.updateLabel(name)
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
                onClick={this.handleTagChange} />
            )
          }
        </Menu>
      </Grid.Column>
    )
  }
}
