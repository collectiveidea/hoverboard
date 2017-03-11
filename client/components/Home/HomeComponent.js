import React, { PropTypes } from 'react'
import styles from './Home.scss'

export default class Home extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className={styles.mainLayout}>
        <h1>Homepage</h1>
      </div>
    )
  }
}
