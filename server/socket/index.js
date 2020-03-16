module.exports = (io) => {
  io.on('connection', socket => {
    console.log(`A client connected: ${socket.id}`)

    socket.on('subscribe', (room) => {
      console.log(`A client joined room: ${room}`)
      socket.join(room)
    })

    socket.on('unsubscribe', (room) => {
      console.log(`A client left room: ${room}`)
      socket.leave(room)
    })

    socket.on('draw', (start, end, color, room) =>{
      io.to(room).emit('draw', start, end, color)
    })

    socket.on('code', (data) => {
      io.to(data.room).emit('code', data.value)
      //io.to(room).emit('code', newValue)
    })

    socket.on('clear', (room) => {
      io.in(room).emit('clear')
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the room`)
    })
  })
}

