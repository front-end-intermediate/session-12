import React, { Component } from 'react'

import Nav from './Nav'
import Body from './Body'

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <Nav />
        <Body />
      </div>
    )
  }
}
