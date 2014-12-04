(function(){

	window.requestAnimationFrame = require('./util/requestAnimationFrame');

	var SVGHelper = require('./svg/SVGHelper');

	var position = {x:100, y:500 - 36};
	var currentPos = { x: 100, y: 500 - 36 };
	var radius = 30;
	var fill = "black";

	var circle, bg, speed, jumping, control, buttons;

	var socket, socketid, clients, nickname;

	var svg;

	var velocity = 0;
	var gravity = 0.4;

	function init(){

		socket = io("172.30.22.17:3000");
		socket.on("socketid",function(data){
			console.log("data = " + data);
			socketid = data;
		});

		socket.on("connect_disconnect",function(data){
		clients = data;
		console.log(clients);
		$(".clients").empty();
		for(var i = 0; i < clients.length; i++){
			if(clients[i].socketid === socketid){
				console.log("client = " + clients[i]);
				clients[i].button = false;
			}
		}
	});

		if(Modernizr.touch) {
			$('h1').text('Mobile = true');
			_mobile.call(this);
		} else {
			$('h1').text('Mobile = false');
			_desktop.call(this);
		}


	}

	function _desktop () {
		svg = document.querySelector('svg');
		svg.width = window.innerWidth;
		svg.height = window.innerHeight;
		console.log(svg.height);

		bg = SVGHelper.createElement('rect');
		bg.setAttribute('rx', 0);
		bg.setAttribute('ry', 0);
		bg.setAttribute('width', '100%');
		bg.setAttribute('height', '100%');
		bg.setAttribute('fill', fill);

		svg.appendChild(bg);

		circle = SVGHelper.createElement('circle');
		circle.setAttribute('cx', position.x); // cx = middelpunt v d cirkel in svg
		circle.setAttribute('cy', position.y);
		circle.setAttribute('r', radius);
		circle.setAttribute('fill', 'white');

		svg.appendChild(circle);


		speed = 10 + Math.round(Math.random() * (50 - 10));

		document.onkeydown = checkKeyDown;
		document.onkeyup = checkKeyUp;

		_enterFrame.call(this);

		socket.on('button_pressed', function(button){
			switch (button) {
				case "left" :
				control = "left";
				break;
				case "right" :
				control = "right";
				break;
				case "":
				control = null;
				break;
			}
			console.log(button);
		});
		socket.on('shake', function(){
			jumping = true;
		});
	}
	function shakeEventDidOccur () {
		$('h1').text('JUMP');
		socket.emit('shake');
		
	}
	function _mobile () {
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

			circle = SVGHelper.createElement('circle');
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
				button.addEventListener('touchstart', function(e){

					switch (button) {
						case buttons[0] :
							// $('h1').text('LINKS');
							socket.emit("button_pressed", "left");
							break;
							case buttons[1] :
							// $('h1').text('RECHTS');
							socket.emit("button_pressed", "right");
							break;
						}
					});

				button.addEventListener('touchend', function(e){
					socket.emit("button_pressed", "");
					/*switch (button) {
						case buttons[0] :
							// $('h1').text('LINKS');
							socket.emit("button_pressed", "");
							break;

							case buttons[2] :
							// $('h1').text('RECHTS');
							socket.emit("button_pressed", "");
							break;
						}*/
				});

			});

		}
		function _enterFrame(){
			switch (control) {
				case "left":
				currentPos.x -= 10;
				break;
				case "right":
				currentPos.x += 10;
				break;
			}

			position.x += (currentPos.x - position.x) / speed;
			position.y += (currentPos.y - position.y) / speed;

			circle.setAttribute('cx', position.x);
			circle.setAttribute('cy', position.y);

			if (jumping) {
				velocity = -20;
				jumping = false;
			}

			_update.call(this);

			requestAnimationFrame(_enterFrame.bind(this));

		}

		function _update(){
			if (position.y + velocity + 36 > 500) {
        // If so, move us back to ground level and set velocity to zero
        velocity = 0;
        position.y = 500 - 36;
      } else {
        // Otherwise, move what is indicated by velocity
        velocity += gravity;
        position.y += velocity;
      }
    }

    function checkKeyDown(e) {
    	switch (e.keyCode) {
    		case 37:
    		control = "left";
    		break;
    		case 39:
    		control = "right";
    		break;
    		case 32:
    		jumping = true;
    		break;
    	}
    }
    function checkKeyUp(e) {
    	switch (e.keyCode) {
    		case 37:
    		control = null;
    		break;
    		case 39:
    		control = null;
    		break;
    	}
    }

    init();

  })();
