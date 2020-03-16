import React from 'react'
import {Link} from 'react-router-dom'
//import CreateRoom from './createRoom'

class Navbar extends React.Component{
  constructor(){
    super()
    this.state = {
      created: false
    }
    this.createRoom = this.createRoom.bind(this)
  }

  createRoom(){
    this.state.created ? window.open('/create', '_blank'):
    this.setState({
      created: true
    })

  }

  render(){
    return(
      <div id="navbar-container">
        <div id="title-container">
          <h1>co-Lab</h1>
        </div>
        <div id="start-room-container">
          {!this.state.created &&
          <Link to="/create"><button id="blue-button" onClick={this.createRoom}>+ start a room</button></Link>}
          {this.state.created && <button id="blue-button" onClick={this.createRoom}>+ start a room</button>}
        </div>
      </div>
    )
  }
}

export default Navbar
