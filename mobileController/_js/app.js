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
