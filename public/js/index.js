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
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var li = jQuery('<li></li>')
    li.text(` ${message.from} ${formattedTime}:${message.text}`)
    jQuery('#messages').append(li)
})

socket.on('newLocationMessage', function(message) {
 var formattedTime = moment(message.createdAt).format('h:mm a')
 var li = jQuery('<li></li>');
 var a = jQuery('<a target="_blank">My current location</a>');

 li.text(`${message.from} ${formattedTime}:`)
 a.attr('href', message.url);
 li.append(a);
 jQuery('#messages').append(li)

})

var messageTextBox = jQuery('[name=message] ')
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
         text:messageTextBox.val()
     },function(data){
         messageTextBox.val('')
     })
   })

   var locationButton = jQuery('#send-location')

   locationButton.on('click',function(){
       if(!navigator.geolocation){
           alert('geolocation not supported your browser')

       }

       locationButton.attr('disabled', 'disabled').text('Sending Location....')
       navigator.geolocation.getCurrentPosition(function(position){
           locationButton.removeAttr('disabled').text('Send Location')
          console.log(position);
          socket.emit('createLocationMessage',{
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
          })
       },function(){
           alert('Unable to get current position')
           locationButton.removeAttr('disabled').text('Send Location')
       })

   })