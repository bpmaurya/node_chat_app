const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const {generateMessage,generateLocationMessage} = require('./utils/message')
const { isRealString } = require('./utils/validation')
const {Users} = require('./utils/users')

publicPth = path.join(__dirname, '../public')
// console.log(__dirname + '/../public')
// console.log(publicPth)
const port = process.env.PORT || 3000
var users = new Users();

var app = express()
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection',(socket) => {
    console.log('new user connected');

    socket.on('join',(params,callback) => {
      if(!isRealString(params.name) && !isRealString(params.room)){
         return callback('name and room is required');
      }
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id,params.name,params.room);
      console.log(socket.id,params.name, params.room)
      io.to(params.room).emit('updateUserList', users.getUserList(params.room));



      socket.emit('newMessage',generateMessage('admin','welcome to chat app'));
      socket.broadcast.to(params.room).emit('newMessage',generateMessage('admin',`${params.name} has joined`));
      callback();

    })

   socket.on('createMessage',(message,callback) => {

       var user = users.getUser(socket.id);

       if(user && isRealString(message.text)){

           io.to(user.room).emit('newMessage',generateMessage(user.name ,message.text))
       }

       callback();

   })
   
   socket.on('createLocationMessage',(coords)=>{
      var user = users.getUser(socket.id);
      if(user){

          io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude, coords.longitude))
      }
   })
    socket.on('disconnect', ()=>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('admin' ,`${user.name} has left`));
        }
    })

})

app.use(express.static(publicPth))

server.listen(port,()=>{
    console.log(`started app on port ${port}`)

})