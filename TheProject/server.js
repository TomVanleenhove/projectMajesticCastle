var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Client = require('./classes/Client.js');
var _ = require("underscore");
var port = process.env.PORT || 3000;

var clients = [];

app.use(express.static(__dirname + '/public'));

//SOCKET CODE
io.on("connection",function(socket){
	console.log("connected");
	io.emit("socketid",socket.id);
	var maxid = 0;
	if (clients.length > 0) {
		maxid = _.max(clients, function(client){
			return client.id;
		}).id
	}
	var client = new Client(maxid+1,socket.id);
	clients.push(client);
	io.emit("connect_disconnect",clients);
	socket.on("disconnect", function(){
		clients = _.filter(clients,function(client){
			return client.socketid !== socket.id;
		});
		console.log("disconnected");
		io.emit("connect_disconnect",clients);
	});
	socket.on("changednickname", function(data){
		var nickname = data;
		clients.forEach(function(client) {
	  	if (client.socketid === socket.id){
	  		client.nickname = nickname;
	  	}
	  	socket.broadcast.emit("connect_disconnect",clients);
	  	//io.emit("connect_disconnect",clients);
		});
	});
	socket.on("shake", function(){
		console.log("shake");
		io.emit("shake");
	});
});

server.listen(port, function () {
  console.log('Server listening at port ' + port);
});
