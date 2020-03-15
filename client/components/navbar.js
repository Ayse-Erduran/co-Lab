import React from 'react'
import {Link} from 'react-router-dom'
//import CreateRoom from './createRoom'

class Navbar extends React.Component{
  constructor(){
    super()
    this.state = {
      create: false
    }
  }

  render(){
    return(
      <div id="navbar-container">
        <div id="title-container">
          <h1>co-Lab</h1>
        </div>
        <div id="start-room-container">
          <Link to="/create"><button id="blue-button">+ start a room</button></Link>
        </div>
      </div>
    )
  }
}

export default Navbar
