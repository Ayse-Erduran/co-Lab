import React, {Component} from 'react'
import {CodeRoom, Canvas} from '../components'
import io from 'socket.io-client'
  // constructor(){
  //   super()
  //   this.state = {
  //     display: 'code'
  //   }
  //   this.changeDisplay = this.changeDisplay.bind(this)
  // }

  // changeDisplay(evt){
  //   this.setState({
  //     display: evt.target.value
  //   })
  // }

  // componentDidMount(){
  //   socket.emit('subscribe', this.props.match.params.roomName)
  // }

export const socket = io(window.location.pathname)

class CoLab extends Component{
    componentDidMount(){
      socket.emit('subscribe', this.props.match.params.roomName)
    }
    render(){
      const room = this.props.match.params.roomName
      return(
        <div id="colab-outer">
          <div id="room">
              <CodeRoom room={room}/>
              <Canvas room={room}/>
          </div>
        </div>
      )
    }

}

export default CoLab
