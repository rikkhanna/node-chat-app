const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 4000;
const {Users}    =   require('./utils/Users');
const socketIO = require('socket.io');
const server =  http.createServer(app);

const io    = socketIO(server);

var user = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket) => {
    console.log('new user connected');

    
    socket.on('disconnect',() => {
        console.log('disconnected the user');
        var removedUser = user.removeUser(socket.id);
        if(removedUser){
            io.to(removedUser.room).emit('updateUserList',user.getUserList(removedUser.room));
            io.to(removedUser.room).emit('newMessage',generateMessage('Admin',`${removedUser.name} has left the room`));
        }
    });
    socket.emit('newEmail',generateMessage("RISHABH@EXP.COM","HMM"));


    socket.on('join', (params,callback) => {
        // console.log('joined');
        if(!isRealString(params.name) || !isRealString(params.room)){
           return callback('Please input valid names');
        }else{
            callback();
        }

        /**
         *  socket.join('room name');
         *  socket.leave('room name');
         *  io.to('room name').emit('event name',{data})
         *  socket.broadcast.to('room name').emit('event name',{data})
         * socket.emit('event name');
         * 
         */
        socket.join(params.room);
        user.removeUser(socket.id);
        user.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList',user.getUserList(params.room));
        socket.emit('newMessage',generateMessage("Admin","Welcome to chat app"));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage("Admin", `${params.name} user joined`));
    });

    socket.on('createMessage',function(message,callback){
        // console.log(message);
        var userInfo = user.getUser(socket.id);
        if(userInfo && isRealString(message.text)){
            io.to(userInfo.room).emit('newMessage',generateMessage(userInfo.name,message.text));
        }

        //this broadcast will emit message to everyone but myself
        // socket.broadcast.emit('newMessage',generateMessage(message.from,message.text))

        callback();
    });
    
    socket.on("createLocationMessage",function(location){
        var userInfo = user.getUser(socket.id);
        if(userInfo){
            io.to(userInfo.room).emit('newLocationMessage',generateLocationMessage(userInfo.name,location.latitude,location.longitude));
        }
    });
});
server.listen(port,()=>{
    console.log(`starting at ${port}`);
});
server.on('listening',function(){
    console.log('ok, server is running');
});