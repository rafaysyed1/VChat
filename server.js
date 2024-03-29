const express = require('express')
const app = express();
const path = require('path')
const port = process.env.PORT || 4000
const server = app.listen(port, () => console.log(`Sever is running on port ${port}`))
const io = require('socket.io')(server)

let socketsConnected = new Set()

app.use(express.static(path.join(__dirname, 'public')))
io.on('connection', onConnected)


function onConnected(socket) {
    console.log(socket.id)
    socketsConnected.add(socket.id)
    io.emit('clientsTotal', socketsConnected.size)
    socket.on('disconnect', () => {
        console.log("Socket Disconnected", socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clientsTotal', socketsConnected.size);
        // Emit a message to the client side indicating disconnection
        io.emit('userDisconnected', { userId: socket.id });
    });
    
    socket.on('message', (data)=>{
        console.log(data)
        socket.broadcast.emit('message',data)
    })
    socket.on('feedback', (data)=>{
        socket.broadcast.emit('feedback',data)
    })
}