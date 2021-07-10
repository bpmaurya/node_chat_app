var socket = io()

socket.on('connect',function() {
    console.log('new user connected');

})

socket.on('disconnect',function() {
    console.log('user disconnected')
})

socket.on('newEmail',function(email) {
    console.log("new email",email);
})

socket.on('newMessage',function(message) {
    console.log("new message",message);

    var li = jQuery('<li></li>')
    li.text(`${message.from}:${message.text}`)
    jQuery('#messages').append(li)
})

socket.on('newLocationMessage', function(message) {
 var li = jQuery('<li></li>');
 var a = jQuery('<a target="_blank">My current location</a>');

 li.text(`${message.from}:`)
 a.attr('href', message.url);
 li.append(a);
 jQuery('#messages').append(li)

})

socket.emit('createMessage',{
    from:"bedprakash",
    text:"hi"
   },function(data){
       console.log( 'got it',data)
   })
   
   jQuery('#message-form').on('submit',function(e){
     e.preventDefault();
     
     socket.emit('createMessage',{
         from:"user",
         text:jQuery('[name=message]').val()
     },function(data){
         
     })
   })

   var locationButton = jQuery('#send-location')

   locationButton.on('click',function(){
       if(!navigator.geolocation){
           alert('geolocation not supported your browser')

       }
       navigator.geolocation.getCurrentPosition(function(position){
          console.log(position);
          socket.emit('createLocationMessage',{
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
          })
       },function(){
           alert('Unable to get current position')
       })

   })