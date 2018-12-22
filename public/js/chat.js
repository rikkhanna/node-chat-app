

function scrollToBottom(){
    //selectors

    var messages = jQuery('#messages');
    var newMessage = messages.children("li:last-child");
    //Heights

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight +lastMessageHeight >= scrollHeight){
        messages.scrollTop(clientHeight);
    }
}

var socket = io();
// creating connection b/w server and client

socket.on('connect',function() {
    console.log('connected to server');

    var params = jQuery.deparam(window.location.search);
    
    socket.emit('join',params,function(err){
        
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log('No Errors');
        }
    });

});
socket.on('disconnect',function(){
    console.log('disconnected from server');
});

socket.on('newEmail',function(email){
    console.log('newEmail',email);
});




socket.on('updateUserList',function(users){
    // console.log('Users List',users);
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery("#users").html(ol);
});

socket.on('newMessage',function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery("#message-template").html();
    var html     = Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt: formattedTime
    });
    jQuery("#messages").append(html);
    scrollToBottom();
    // var li = jQuery('<li></li>');
    // var formattedTime = moment(message.createdAt).format('h:mm a');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery("#messages").append(li)
    // console.log(message);
});

socket.on("newLocationMessage",function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery("#location-message-template").html();
    var html     = Mustache.render(template,{
        url:message.url,
        from:message.from,
        createdAt: formattedTime
    });
    jQuery("#messages").append(html);
    scrollToBottom();
    // var li = jQuery('<li></li>');
    // var formattedTime = moment(link.createdAt).format('h:mm a');
    // var a = jQuery('<a target="_blank">My Current Location</a>');

    // li.text(`${link.from} ${formattedTime}: `);
    // a.attr('href',link.url);
    // li.append(a);
    // jQuery("#messages").append(li);
    // console.log(message);
});

// socket.emit('createMessage',{
//     from:'Rishi',
//     text:'that worked for me'
// },function(){
//     console.log('Got It');
// });


var messageTextBox = jQuery('[name=message]')
jQuery("#messageForm").on("submit",function(event){
    event.preventDefault();

    socket.emit('createMessage',{
        // from:'Anonymous User',
        text: messageTextBox.val()
    },function(){
        messageTextBox.val('')
    });
    
});


var locationButton = jQuery("#send-location");
locationButton.on("click",function(event){
    if(!navigator.geolocation){
        alert('Your browser does not support ');
    }

    locationButton.attr('disabled','disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        });
        locationButton.removeAttr('disabled').text('Send location');
    },function(){
        locationButton.removeAttr('disabled').text('Send location');
        alert('unable to fetch location');
    })
});

