import React, {Component} from 'react'
import {EventEmitter} from 'events'
import io from 'socket.io-client'

import {socket} from '../coLab'

const whiteboard = new EventEmitter()

export const colors = [
  'black',
  'purple',
  'red',
  'green',
  'orange',
  'yellow',
  'brown'
]


export default class Canvas extends Component{
  constructor(){
    super()
    this.state = {
      color: 'black',
      currentMousePosition: [0, 0],
      lastMousePosition: [0, 0],
    }
    this.changeColor = this.changeColor.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.pos = this.pos.bind(this)
    this.draw = this.draw.bind(this)
    this.canvas = React.createRef()
  }

  changeColor(evt){
    this.setState({
      color: evt.target.value
    })
  }

  pos(evt){
    return [
      evt.pageX - this.canvas.current.offsetLeft,
      evt.pageY - this.canvas.current.offsetTop
    ]
  }

  //takes in start and end coordinates. Draws a line between the two with specified color
  draw(start, end, strokeColor = 'black', shouldBroadcast = true){
    const ctx = this.canvas.current.getContext("2d")
    ctx.beginPath()
    ctx.strokeStyle = strokeColor
    ctx.moveTo(...start)
    ctx.lineTo(...end)
    ctx.closePath()
    ctx.stroke()

    shouldBroadcast &&
      whiteboard.emit('draw', start, end, strokeColor)
  }

  onMouseMove(evt){
    if(!evt.buttons) return
    this.setState({
      lastMousePosition: this.state.currentMousePosition,
      currentMousePosition: this.pos(evt)
    })
    this.state.lastMousePosition && this.state.currentMousePosition &&
      this.draw(this.state.lastMousePosition, this.state.currentMousePosition, this.state.color, true)
  }

  onMouseDown(evt){
    this.setState({
      currentMousePosition: this.pos(evt)
    })
  }


  componentDidMount(){
    const room = this.props.room
    this.canvas.current.addEventListener('mousedown', this.onMouseDown)
    this.canvas.current.addEventListener('mousemove', this.onMouseMove)
    whiteboard.on('draw', (start, end, strokeColor) => {
      socket.emit('draw', start, end, strokeColor, room)
    })

    socket.on('draw', (start, end, strokeColor) => {
      console.log('DRAW'),
      this.draw(start, end, strokeColor)
    })
  }

  render(){
    return (
      <div id="canvas-outer-container">
        <div id="canvas">
          <canvas height={600} width={600} ref={this.canvas}/>
        </div>
        <div id="color-picker">
          {colors.map(color => (
            <button type="button" id="color-opt" value={color}
              style={{backgroundColor: color}} onClick={this.changeColor}/>
          ))}
        </div>
      </div>
    )
  }
}

