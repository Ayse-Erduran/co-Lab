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
      draw: true,
      color: 'black',
      currentMousePosition: [0, 0],
      lastMousePosition: [0, 0]
    }
    this.changeColor = this.changeColor.bind(this)
    this.toggleActivity = this.toggleActivity.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.clearCanvas = this.clearCanvas.bind(this)
    //this.onKeyDown = this.onKeyDown.bind(this)
    this.pos = this.pos.bind(this)
    this.draw = this.draw.bind(this)

    // this.write = this.write.bind(this)
    this.canvas = React.createRef()
    //this.createTextBox = this.createTextBox.bind(this)
  }

  changeColor(evt){
    this.setState({
      color: evt.target.value
    })
  }

  toggleActivity(){
    const prevState = this.state.draw
    this.setState({
      draw: !prevState
    })
  }

  clearCanvas(){
    this.canvas.current.getContext('2d').clearRect(0,0, window.innerWidth, window.innerHeight)
    whiteboard.emit('clear')
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



  // createTextBox(text, x, y, maxW, lineH){
  //   const ctx = this.canvas.current.getContext("2d")
  //   const words = text.split(' ');
  //   const line = '';

  //   for(const i = 0; i < words.length; i++) {
  //     const testLine = line + words[i] + ' ';
  //     const metrics = ctx.measureText(testLine);
  //     const testWidth = metrics.width;
  //     if (testWidth > maxW && i > 0) {
  //       ctx.fillText(line, x, y);
  //       line = words[n] + ' ';
  //       y += lineH;
  //     }
  //     else {
  //       line = testLine;
  //     }
  //   }
  //   ctx.fillText(line, x, y);
  // }



  onMouseMove(evt){
    if(!evt.buttons || !this.state.draw) return
    this.setState({
      lastMousePosition: this.state.currentMousePosition,
      currentMousePosition: this.pos(evt)
    })
    this.state.lastMousePosition && this.state.currentMousePosition &&
      this.draw(this.state.lastMousePosition, this.state.currentMousePosition, this.state.color, true)
  }


  onMouseDown(evt){
    console.log('MOUSEDOWN')
    this.setState({
      currentMousePosition: this.pos(evt)
    })
  }

  // onKeyDown(evt){
  //   console.log('BEFORE KEY DOWN')
  //   console.log('CUREENT POS', this.state.currentMousePosition)
  //   if(this.state.draw) return
  //   this.setState({
  //     text: this.state.text + `${evt.key}`
  //   })
  //   this.draw(this.state.currentMousePosition, [], this.state.color, true, this.state.text)
  //   //this.createTextBox(this.state.text, (this.canvas.current.width - 400)/2, 60, 400, 25)
  //   //this.write(this.state.text, [10, 60], this.state.font, this.state.color, true)
  // }

  componentDidMount(){
    //const room = this.props.room
    this.canvas.current.addEventListener('mousedown', this.onMouseDown)
    this.canvas.current.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('keydown', this.onKeyDown)

    whiteboard.on('draw', (start, end, strokeColor) => {
      socket.emit('draw', start, end, strokeColor, this.props.room)
    })

    // whiteboard.on('write', (text, coord, font, color) => {
    //   socket.emit('write', text, coord, font, color, this.props.room)
    // })

    whiteboard.on('clear', () => {
      socket.emit('clear', this.props.room)
    })

    socket.on('draw', (start, end, strokeColor) => {
      this.draw(start, end, strokeColor)
    })

    // socket.on('write', (text, coord, font, color) => {
    //   this.write(text, coord, font, color)
    // })

    socket.on('clear', () => {
      console.log('CLEAR')
      this.clearCanvas()
    })

  }

  render(){
    return (
      <div id="canvas-outer-container">
        <div id="canvas">
          <canvas height={600} width={600} ref={this.canvas}/>
          {!this.state.draw &&
          <textarea left={70} top={10}>Enter text here</textarea>} */}
        </div>
        <div id="color-picker">
          {colors.map(color => (
            <button type="button" id="color-opt" value={color}
              style={{backgroundColor: color}} onClick={this.changeColor}/>
          ))}
          <button onClick={this.toggleActivity}>Aa</button>
          <button onClick={this.clearCanvas}>Clear</button>
        </div>
      </div>
    )
  }
}

