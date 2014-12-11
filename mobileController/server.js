var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Client = require('./classes/Client.js');
var _ = require("underscore");
var port = process.env.PORT || 3000;

var clients = [];


require("./config/middleware.js")(app, express);

io.on('connection', function(socket){
	console.log(socket.id + 'connected');

	var maxid = 0;
	if(clients.length > 0){
		maxid = _.max(clients,function(client){
			return client.id;
		}).id;
	}
	var client  = new Client(maxid + 1,socket.id);
	clients.push(client);
	console.log(client);
	//io.to(socket.id).emit("socketid",socket.id);
	socket.emit("socketid",socket.id);
	socket.broadcast.emit("makeNewBall",socket.id);
	io.sockets.emit("connect_disconnect",clients);


	socket.on('disconnect', function(){
		console.log(socket.id + 'disconnected');
		clients = _.filter(clients,function(client){
			return client.socketid !== socket.id;
		});
		io.sockets.emit("connect_disconnect",clients);
		socket.broadcast.emit("removeBall",socket.id);
	});

	socket.on('button_pressed', function(buttonElement){
		console.log("pressed: " + buttonElement.pressed + " / id: " + buttonElement.socketid);
		socket.broadcast.emit('button_pressed', buttonElement);
	});
	socket.on('shake', function(jumpingSocketid){
		console.log("pressed: jump / id: " + jumpingSocketid);
		socket.broadcast.emit('shake', jumpingSocketid);
	});
});

server.listen(port, function() {
	console.log('Server listening at port', port, 'in', process.env.NODE_ENV, 'mode');
});
