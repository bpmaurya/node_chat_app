var socket = io()

socket.on('connect',function() {
    console.log('new user connected');

    socket.emit('createMessage',{
        from:"user@example.com",
        text:"hello sir"
    })
})

socket.on('disconnect',function() {
    console.log('user disconnected')
})

socket.on('newEmail',function(email) {
    console.log("new email",email);
})

socket.on('newMessage',function(message) {
    console.log("new message",message)
})