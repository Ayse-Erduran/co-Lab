// import {EventEmitter} from 'events'

// export const whiteboard = new EventEmitter()

// export const colors = [
//   'black',
//   'purple',
//   'red',
//   'green',
//   'orange',
//   'yellow',
//   'brown'
// ]

//   //takes in context, start and end coordinates. Draws a line between the two with specified color
//   export const draw = (ctx, start, end, strokeColor = 'black', shouldBroadcast = true) => {
//     ctx.beginPath()
//     ctx.strokeStyle = strokeColor
//     ctx.moveTo(...start)
//     ctx.lineTo(...end)
//     ctx.closePath()
//     ctx.stroke()

//     // If shouldBroadcast is truthy, we will emit a draw event to listeners
//     // with the start, end and color data.
//     shouldBroadcast &&
//         whiteboard.emit('draw', start, end, strokeColor)
//   }
