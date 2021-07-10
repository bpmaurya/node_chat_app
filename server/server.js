const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const {generateMessage} = require('./utils/message')
publicPth = path.join(__dirname, '../public')
// console.log(__dirname + '/../public')
// console.log(publicPth)
const port = process.env.PORT || 3000

var app = express()
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection',(socket) => {
    console.log('new user connected');
   
    socket.emit('newMessage',generateMessage('admin','welcome to chat app'));

    socket.broadcast.emit('newMessage',generateMessage('admin','new user Joined'))

   socket.on('createMessage',(message) => {
       console.log('createMessage',message);
       io.emit('newMessage',generateMessage(message.from,message.text))


    //    socket.broadcast.emit('newMessage',{
    //        from:message.from,
    //        text:message.text,
    //        createdAt:new Date().getTime()
    //    })
   })
   
    socket.on('disconnect', ()=>{
        console.log('new user disconnected')
    })

})

app.use(express.static(publicPth))

server.listen(port,()=>{
    console.log(`started app on port ${port}`)

})