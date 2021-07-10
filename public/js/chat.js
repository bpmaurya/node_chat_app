var socket = io()
function scrollToBottom() {
 var messages = jQuery('#messages');
 var newMessage = messages.children('li:last-child')

 var clientHeight = messages.prop('clientHeight');

 var scrollTop = messages.prop('scrollTop');
 var scrollHeight = messages.prop('scrollHeight');
 var newMessageHeight = newMessage.innerHeight();
 var lastMessageHeight = newMessage.prev().innerHeight();

 if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>= scrollHeight){
     messages.scrollTop(scrollHeight)
 } 
}


socket.on('connect',function() {
    console.log('new user connected');
    var params = jQuery.deparam(window.location.search)
    socket.emit('join',params,function(err){
        if(err){
            alert(err);
            window.location.href = '/'
        }
        else{
          console.log('no error')
        }
    })

})

socket.on('disconnect',function() {
    console.log('user disconnected')
})

socket.on('newEmail',function(email) {
    console.log("new email",email);
})

socket.on('updateUserList',function(users){
  console.log('users is :', users);
  
})

socket.on('newMessage',function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')
    console.log("new message",message);
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom()
   
   
    // var formattedTime = moment(message.createdAt).format('h:mm a')
    // var li = jQuery('<li></li>')
    // li.text(` ${message.from} ${formattedTime}:${message.text}`)
    // jQuery('#messages').append(li)
})

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        from:message.from,
        url:message.url ,
        createdAt:formattedTime
    })
    jQuery('#messages').append(html)
    scrollToBottom();
//  var formattedTime = moment(message.createdAt).format('h:mm a')
//  var li = jQuery('<li></li>');
//  var a = jQuery('<a target="_blank">My current location</a>');

//  li.text(`${message.from} ${formattedTime}:`)
//  a.attr('href', message.url);
//  li.append(a);
//  jQuery('#messages').append(li)

})

var messageTextBox = jQuery('[name=message] ')
socket.emit('createMessage',{
    from:"bedprakash",
    text:"hi"
   },function(data){
    //    console.log( 'got it',data)
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