import React from 'react'
import { Grid, Menu, Segment } from 'semantic-ui-react'

export default class LabelMenu extends React.Component {
  state = { branch: 'master', tag: {} }

  handleBranchClick = (e, { name }) => this.setState({ branch: name })
  handleTagClick = (e, { name }) => this.setState({ tag: name })

  render() {
    const { branch, tag } = this.state

    return (
      <Grid.Column width={4}>
        <Menu fluid vertical tabular='right'>
          <Menu.Item header>Branches</Menu.Item>
          <Menu.Item name='master' content='master' active={branch === 'master'} onClick={this.handleBranchClick} />
          <Menu.Item name='develop' content='develop' active={branch === 'develop'} onClick={this.handleBranchClick} />
          <Menu.Item header>Tags</Menu.Item>
          <Menu.Item name='v3.4.25' content='v3.4.25' active={tag === 'v3.4.25'} onClick={this.handleTagClick} />
          <Menu.Item name='v3.4.24' content='v3.4.24' active={tag === 'v3.4.24'} onClick={this.handleTagClick} />
          <Menu.Item name='v3.4.23' content='v3.4.23' active={tag === 'v3.4.23'} onClick={this.handleTagClick} />
          <Menu.Item name='v3.4.22' content='v3.4.22' active={tag === 'v3.4.22'} onClick={this.handleTagClick} />
        </Menu>
      </Grid.Column>
    )
  }
}
