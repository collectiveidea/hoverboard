import React from 'react'
import 'normalize.css/normalize.css'
import 'react-mdl/extra/css/material.cyan-red.min.css'
import styles from './App.scss'

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired,
    viewer: React.PropTypes.object.isRequired
  }

  render() {
    return (
      <div className={styles.root}>
        {this.props.children}
      </div>
    )
  }
}
