var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Client = require('./classes/Client.js');
var _ = require("underscore");
var port = process.env.PORT || 3000;

var clients = [];

app.use(express.static(__dirname + '/public')); // Express = framework voor Node.js applicaties. Dit zorgt ervoor dat public/index.html gebruikt wordt

//SOCKET CODE




server.listen(port, function () {
	// console.log('Server listening at port ' + port);
});
