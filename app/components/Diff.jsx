import React from 'react';
import { Breadcrumb, Segment, Dropdown } from 'semantic-ui-react';

import PropTypes from 'prop-types'

import 'lodash'
var jsdiff = require('diff')

import * as config from '../conf';

const org = 'services-config'

export default class Diff extends React.Component {

  static propTypes = {
    base: PropTypes.string.isRequired,
    compare: PropTypes.string.isRequired,
    baseLabel: PropTypes.string.isRequired,
    baseProfiles: PropTypes.array.isRequired,
    profOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    labelOptions: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      formatted: []
    }
  }

  componentWillMount = () => {
    this.createDiff(this.props.base, this.props.compare)
  }

  createDiff = (base, compare) => {
    let diff = jsdiff.diffLines(base, compare)
    const formatted = diff.map((part, index) => {
      const className = part.added ? 'ins' : part.removed ? 'del' : null
      return <pre key={index} className={className}>{part.value}</pre>
    })
    this.setState({
      formatted
    })
  }

  /**
   * Fetches data for all tabs. Updates requests, version, and all data and
   * creates key value pairs by calling updateValues. Handles bad requests.
   *
   * @param {object} nextProps
   * @param {object} nextProps.info - url, appName, label, profiles
   * @param {object} nextProps.headers - current headers
   */
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this.createDiff(nextProps.base, nextProps.compare)
    }
  }

  render() {
    const { baseLabel, baseProfiles, labelOptions, profOptions } = this.props
    const baseSections = [
      { key: 'label', content: baseLabel, active: true },
      { key: 'profiles', content: baseProfiles, active: true }
    ]

    const options = [
      {
        text: 'Jenny Hess',
        value: 'Jenny Hess'
      }
     ]
    return (
      <div>
        <Segment attached='top'>
          <Breadcrumb style={{color: '#b30000'}} divider='/'
            sections={baseSections} />
          <pre className='dots'> ... </pre>
          <Breadcrumb style={{color: '#406619'}}>
            <Breadcrumb.Section>
              <Dropdown scrolling options={labelOptions}
                inline />
            </Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section>
              <Dropdown scrolling options={profOptions} inline />
            </Breadcrumb.Section>
          </Breadcrumb>
        </Segment>
        <Segment attached='bottom' className='view'>
          {this.state.formatted}
        </Segment>
      </div>
    )
  }
}
