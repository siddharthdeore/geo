var express = require('express');

var app = express();
var server = app.listen(process.env.PORT);

app.use(express.static('public')); // location of public directory

console.log("Server Started");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

var users = {};

function newConnection(socket) {
	console.log('connected: ' + socket.id);
	socket.emit('UpdateOthers',users);

	socket.on('newLocation', function(user){
		users[socket.id]= {
			lat:user.lat,
			lon:user.lon,
			id: socket.id
		}
		socket.broadcast.emit('newUser',users[socket.id]);		
		socket.emit('UpdateOthers',users);
	});
	socket.on('disconnect', function () {
		  console.log('disconnected: ' + socket.id);
		 delete users[socket.id];
		// emit a message to all users to remove this player
		socket.broadcast.emit('userLeft',users);
		io.emit('disconnect', socket.id);
	});

}
