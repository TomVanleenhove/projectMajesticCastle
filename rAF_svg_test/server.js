var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = process.env.PORT || 3000;
/** CONFIG **/
require("./config/middleware.js")(app, express);

server.listen(port, function() {
	console.log('Server listening at port', port, 'in', process.env.NODE_ENV, 'mode');
});
