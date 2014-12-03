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
	socket.emit("socketid",socket.id);
	io.sockets.emit("connect_disconnect",clients);


	socket.on('disconnect', function(){
		console.log(socket.id + 'disconnected');
		clients = _.filter(clients,function(client){
			return client.socketid !== socket.id;
		});
		io.sockets.emit("connect_disconnect",clients);
	});

	socket.on('button_pressed', function(button){
		socket.broadcast.emit('button_pressed', button);
	});
});

server.listen(port, function() {
	console.log('Server listening at port', port, 'in', process.env.NODE_ENV, 'mode');
});
