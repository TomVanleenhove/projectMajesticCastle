(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./_js/app.js":[function(require,module,exports){
/* globals io:true */
/* globals Modernizr:true */
(function(){

	window.requestAnimationFrame = require('./util/requestAnimationFrame');

	var SVGHelper = require('./svg/SVGHelper');
	var Circle = require('./util/Circle');
	var fill = "black";
	var initialized = false;

	var bg, buttons;
	var circles;

	var socket, socketid, clients;

	var svg;

	// var gravity = 0.4;
	// var position = {x:30,y:500};
	//var myShakeEvent = new Shake({ threshold: 10});

	function init(){
		socket = io("192.168.1.57:3000");
		socket.on("socketid",function(data){
			console.log("data = " + data);
			if(initialized === false){
				socketid = data;
				if(Modernizr.touch) {
					_mobile.call(this);
				} else {
					_desktop.call(this);
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

	// function makeBall(socketBallId){
		// var circle = SVGHelper.createElement('circle');
		// circle.setAttribute('cx', position.x); // cx = middelpunt v d cirkel in svg
		// circle.setAttribute('cy', position.y);
		// circle.setAttribute('currentx', position.x);
		// circle.setAttribute('currenty', position.y);
		// circle.setAttribute('r', radius);
		// circle.setAttribute('fill', 'white');
		// circle.setAttribute('socketBallId', socketBallId);
		// circle.setAttribute('control',"");
		// circle.setAttribute('jumping', false);
		// circle.setAttribute('velocity', 0);
		// svg.appendChild(circle);
		// circles.push(circle);
		// console.log(circles);

	// }

	function _desktop () {
		console.log("it's desktop");
		$('h1').text('Mobile = false / id = '+ socketid);
		svg = document.querySelector('svg');
		svg.width = window.innerWidth;
		svg.height = window.innerHeight;

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
				svg.appendChild(circle.element[0]);
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

	function shakeEventDidOccur () {
		socket.emit('shake', socketid);

	}
	function _mobile () {
		console.log("it's mobile");
		$('h1').text('Mobile = true / id = '+ socketid);
		window.addEventListener('shake', shakeEventDidOccur, false);

		svg = document.querySelector('svg');
		svg.width = window.innerWidth;
		svg.height = window.innerHeight;

		buttons = [];

		bg = SVGHelper.createElement('rect');
		bg.setAttribute('rx', 0);
		bg.setAttribute('ry', 0);
		bg.setAttribute('width', '100%');
		bg.setAttribute('height', '100%');
		bg.setAttribute('fill', fill);

		svg.appendChild(bg);

		var buttonPos = '33%';

		for (var i = 0; i < 2; i++) {

				var circle = SVGHelper.createElement('circle');
				circle.setAttribute('cx', buttonPos); // cx = middelpunt v d cirkel in svg
				circle.setAttribute('cy', '50%');
				circle.setAttribute('r', 35);
				circle.setAttribute('fill', 'white');
				circle.setAttribute('dislpay', 'block');
				//circle.setAttribute('-webkit-user-select', 'none');

				svg.appendChild(circle);

				buttons.push(circle);

				buttonPos = '66%';
			}
			buttons.forEach(function(button){
				var buttonElement = {pressed:"",socketid:socketid};
				button.addEventListener('touchstart', function(e){
					switch (button) {
						case buttons[0] :
							buttonElement.pressed = "left";
							socket.emit("button_pressed", buttonElement);
							break;
							case buttons[1] :
							buttonElement.pressed = "right";
							socket.emit("button_pressed", buttonElement);
							break;
						}
					});

				button.addEventListener('touchend', function(e){
					buttonElement.pressed = "";
					socket.emit("button_pressed", buttonElement);
				});

			});
			//myShakeEvent.start();
			window.addEventListener('shake', shakeEventDidOccur, false);
		}
		// function _enterFrame(){
		// 	if (circles !== []) {
		// 		for (var i = 0; i < circles.length; i++) {
		// 			var currentCircle = circles[i];
		// 			switch(currentCircle.getAttribute("control")){
		// 				case "left":
		// 				console.log("physical -> left");
		// 				currentCircle.setAttribute("currentx",parseFloat(currentCircle.getAttribute("currentx")) - 10);
		// 				break;
		// 				case "right":
		// 				console.log("physical -> right");
		// 				currentCircle.setAttribute("currentx",parseFloat(currentCircle.getAttribute("currentx")) + 10);
		// 				break;
		// 			}
		// 			currentCircle.setAttribute("cx", ((parseFloat(currentCircle.getAttribute("currentx")) - parseFloat(currentCircle.getAttribute("cx"))) / speed)+parseFloat(currentCircle.getAttribute("cx")));
		// 			currentCircle.setAttribute("cy", ((parseFloat(currentCircle.getAttribute("currenty")) - parseFloat(currentCircle.getAttribute("cy"))) / speed)+parseFloat(currentCircle.getAttribute("cy")));

		// 			if (currentCircle.getAttribute("jumping").toString() === "true"){
		// 				console.log("physical -> jumping");
		// 				currentCircle.setAttribute("velocity", (parseFloat(currentCircle.getAttribute("velocity")) - 20));
		// 				currentCircle.setAttribute("jumping", false);
		// 				console.log("physical -> jumping stopped");
		// 			}

		// 			_update.call(this);
		// 		}

		// 	}

		// 	requestAnimationFrame(_enterFrame.bind(this));
		// }

		// function _update(){
		// 	if (circles !== []) {
		// 		for (var i = 0; i < circles.length; i++) {
		// 			var currentCircle = circles[i];
		// 			if (parseFloat(currentCircle.getAttribute("cy")) + parseFloat(currentCircle.getAttribute("velocity")) + 36 > 500) {
		//         	// If so, move us back to ground level and set velocity to zero
		// 		    	currentCircle.setAttribute("velocity", 0);
		// 		    	currentCircle.setAttribute("cy", 500 - 36);
		// 		    } else {
		// 		      // Otherwise, move what is indicated by velocity
		// 		    	currentCircle.setAttribute("velocity", (parseFloat(currentCircle.getAttribute("velocity")) + gravity));
		// 		    	currentCircle.setAttribute("cy", (parseFloat(currentCircle.getAttribute("cy")) + parseFloat(currentCircle.getAttribute("velocity"))));
		// 		    }
		// 		}
		// 	}

  //   }

    init();

  })();

},{"./svg/SVGHelper":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/mobileController/_js/svg/SVGHelper.js","./util/Circle":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/mobileController/_js/util/Circle.js","./util/requestAnimationFrame":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/mobileController/_js/util/requestAnimationFrame.js"}],"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/mobileController/_js/svg/SVGHelper.js":[function(require,module,exports){
var namespace = "http://www.w3.org/2000/svg";

function SVGHelper(){

}

SVGHelper.createElement = function(el){
	return document.createElementNS(namespace, el); // svg-elementen worden aangemaakt binnen namespace -> dit is een helper die dit doet -> minder code
};

module.exports = SVGHelper;

},{}],"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/mobileController/_js/util/Circle.js":[function(require,module,exports){
//var SVGHelper = require('../svg/SVGHelper');
function Circle(socketBallId){
	console.log("[Circle] socketballId = " + socketBallId);
	this.radius = 30;
	this.gravity = 0.4;
	this.position = {x:500,y:500};
	this.currentPosition = {x:500,y:500};
	this.control = "";
	this.speed = 10 + Math.round(Math.random() * (50 - 10));
	this.jumping = true;
	this.velocity = 0;
	this.loaded = false;
	this.event = new Event('loaded');

	this.socketBallId = socketBallId;
	$.get('/players/boris.html', _create.bind(this));
}

function _create(player){
	console.log('creating...');
	this.element = $(player);
	console.log(this.element);
	this.element[0].setAttribute('transform', "translate(" + this.position.x + "," + this.position.y + ")"); // cx = middelpunt v d cirkel in svg
	console.log(this.element[0]);
	_enterFrame.call(this, this.control);
	document.dispatchEvent(this.event);
}

Circle.prototype.setControl = function(value){
	console.log("control changed to " + value);
	if(this.control !== value){
		this.control = value;
	}
};

Circle.prototype.setJumping = function(value){
	if(this.jumping !== value){
		this.jumping = true;
	}
};

Circle.prototype.getSocketBallId = function(){
	return this.socketBallId;
};

function _enterFrame(){
	switch(this.control){
		case "left":
			console.log("links");
			this.currentPosition.x -= 10;
			////this.element.setAttribute("currentSkew",parseFloat(this.element.getAttribute("currentSkew")) - 10);
		break;
		case "right":
			console.log("rechts");
			this.currentPosition.x += 10;
			////this.element.setAttribute("currentSkew",parseFloat(this.element.getAttribute("currentSkew")) + 10);
		break;
		/*case "":
		console.log("feest?");
			if(this.element.getAttribute('cSkew') === 0){
				this.element.setAttribute('currentSkew', 0);
			}else if (this.element.getAttribute('cSkew') > 0) {
				this.element.setAttribute("currentSkew",parseFloat(this.element.getAttribute("currentSkew")) - 10);
			}else{
				this.element.setAttribute("currentSkew",parseFloat(this.element.getAttribute("currentSkew")) + 10);
			}
		break;*/
	}
	this.position.x += (this.currentPosition.x - this.position.x) / this.speed;
	this.position.y += (this.currentPosition.y - this.position.y) / this.speed;
	this.element[0].setAttribute('transform', "translate(" + this.position.x + "," + this.position.y + ")");
	//this.element.setAttribute("cSkew", ((parseFloat(this.element.getAttribute("currentSkew")) - parseFloat(this.element.getAttribute("cSkew"))) / this.speed)+parseFloat(this.element.getAttribute("cSkew")));
	//this.element.setAttribute('transform', 'skewX('+ this.element.getAttribute("cSkew") +')');

	if (this.jumping){
		// console.log("physical -> jumping");
		this.velocity -= 20;
		this.jumping = false;
		// console.log("physical -> jumping stopped");
	}
	_update.call(this);

	requestAnimationFrame(_enterFrame.bind(this));
}

function _update(){
	if (this.position.y + this.velocity + 36 > 500) {
		this.velocity = 0;
		this.position.y = 500 - 36;
	} else {
		this.velocity += this.gravity;
		this.position.y +=this.velocity;
	}
}

module.exports = Circle;

},{}],"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/mobileController/_js/util/requestAnimationFrame.js":[function(require,module,exports){
module.exports = (function(){
	return  window.requestAnimationFrame       || // vedor prefixes. requestanimationframe is beste manier om te animeren in javascript
	        window.webkitRequestAnimationFrame ||
	        window.mozRequestAnimationFrame    ||
	        window.oRequestAnimationFrame      ||
	        window.msRequestAnimationFrame     ||
	        function(callback, element){
	          window.setTimeout(callback, 1000 / 60);
	        };
})();

},{}]},{},["./_js/app.js"]);
