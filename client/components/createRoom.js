import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import socket from '../socket'

class CreateRoom extends Component{
  constructor(){
    super()
    this.state = {
      clientName: '',
      roomName: '',
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(evt){
    this.setState({
      [evt.target.name]: evt.target.value
    })
  }

  render(){
    return(
        <form id="create-room-form" onChange={this.handleChange}>
          <label htmlFor="clientName"> Your Name </label>
          <input type="text" name="clientName" value={this.state.clientName}/>
          <label htmlFor="roomName"> Room Name </label>
          <input type="text" name="roomName" value={this.state.roomName}/>
          <Link to={`/room/${this.state.roomName}`}><button type="submit">Start</button></Link>
        </form>
    )
  }
}

export default CreateRoom
