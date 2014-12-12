/* globals io:true */
/* globals Modernizr:true */

(function(){

	window.requestAnimationFrame = require('./util/requestAnimationFrame');

	var SVGHelper = require('./svg/SVGHelper');
	var Circle = require('./util/Circle');
	var Mobile = require('./mobile/Mobile');
	var characters = require('./data/characters').characters;
	var fill = "black";
	var initialized = false;

	var bg;
	// var buttons;
	var circles;

	var socket, socketid, clients;

	var svg;

	function init(){

		svg = document.querySelector('svg');
		svg.width = window.innerWidth;
		svg.height = window.innerHeight;

		socket = io("172.30.14.135:3000");
		socket.on("socketid",function(data){
			console.log("data = " + data);
			if(initialized === false){
				socketid = data;
				if(Modernizr.touch) {
					_mobile.call(this);
				} else {
					// _desktop.call(this);
					_mobile.call(this, socketid);
				}
			}
			initialized = true;

		});

		socket.on("connect_disconnect",function(data){
			clients = data;
		//console.log(clients);
		$(".clients").empty();
		for(var i = 0; i < clients.length; i++){
			if(clients[i].socketid === socketid){
				console.log("client = " + clients[i]);
				clients[i].button = false;
			}
		}
	});
	}

	function _desktop () {
		$('h1').text('Mobile = false / id = '+ socketid);

		circles = [];

		bg = SVGHelper.createElement('rect');
		bg.setAttribute('rx', 0);
		bg.setAttribute('ry', 0);
		bg.setAttribute('width', '100%');
		bg.setAttribute('height', '100%');
		bg.setAttribute('fill', fill);

		svg.appendChild(bg);

		socket.on("makeNewBall",function(data){
			console.log("making new ball");
			var circle = new Circle(data);
			document.addEventListener('loaded',function(e){
				svg.prepend(circle.element[0]);
				console.log("figure appended");
			});
		});

		// speed = 10 + Math.round(Math.random() * (50 - 10));
		// _enterFrame.call(this);

		socket.on('button_pressed', function(buttonElement){
			if (circles !== []) {
				for (var i = 0; i < circles.length; i++) {
					var currentCircle = circles[i];
					if (currentCircle.getSocketBallId() === buttonElement.socketid){
						switch (buttonElement.pressed) {
							case "left" :
							console.log("left pressed");
							currentCircle.setControl("left");
							break;
							case "right" :
							console.log("right pressed");
							currentCircle.setControl("right");
							break;
							case "":
							currentCircle.setControl("");
							break;
						}
					}
				}
			}
		});
		socket.on('shake', function(jumpingSocketid){
			console.log("shake arrived from " + jumpingSocketid);
			if (circles !== []) {
				for (var i = 0; i < circles.length; i++) {
					var currentCircle = circles[i];
					if (currentCircle.getSocketBallId() === jumpingSocketid){
						currentCircle.setJumping(true);
					}
				}
			}
		});
		socket.on('removeBall', function(socketBallId){
			// console.log("trying to removed: " + socketBallId);
			if (circles !== []) {
				for (var i = 0; i < circles.length; i++) {
					var currentCircle = circles[i];
					if (currentCircle.getAttribute("socketBallId") === socketBallId){
				    	// console.log("removed: " + socketBallId);
				    	currentCircle.remove();
				    	circles.splice(i,1);
				    }
				  }
				}
			});
	}


	function _mobile (socketid) {
		$('h1').text('Mobile = true / id = '+ socketid);
		var mobile = new Mobile(socket, socketid, characters, svg);
	}

	init();

})();
