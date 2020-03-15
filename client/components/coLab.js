import React, {Component} from 'react'
import {CodeRoom, Canvas} from '../components'
import io from 'socket.io-client'


export const socket = io(window.location.pathname)

class CoLab extends Component{
  constructor(){
    super()
    this.state = {
      display: 'code'
    }
    this.changeDisplay = this.changeDisplay.bind(this)
  }

  changeDisplay(evt){
    this.setState({
      display: evt.target.value
    })
  }

  componentDidMount(){
    socket.emit('subscribe', this.props.match.params.roomName)
  }

  render(){
    const room = this.props.match.params.roomName
    return(
      <div id="colab-outer">
        <div id="room-choice">
          <button type="button" value="code" onClick={this.changeDisplay}>Code Editor</button>
          <button type="button" value="canvas" onClick={this.changeDisplay}>Whiteboard</button>
        </div>
        <div id="room">
          {this.state.display === "code" ?
            <CodeRoom room={room}/>:
            <Canvas room={room}/>
          }
        </div>
      </div>
    )
  }
}

export default CoLab
