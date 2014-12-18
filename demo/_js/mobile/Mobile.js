var SVGHelper = require('../svg/SVGHelper');

function Mobile (socket, socketid, characters, svg) {

	console.log('[Mobile] construct. Socketid = ' + socketid);

	// this.socketid = socketid;
	this.characters = characters;
	this.svg = svg;

	window.addEventListener('shake', shakeEventDidOccur.call(this,socket, socketid), false);

	bg = SVGHelper.createElement('rect');
	bg.setAttribute('rx', 0);
	bg.setAttribute('ry', 0);
	bg.setAttribute('width', '100%');
	bg.setAttribute('height', '100%');
	bg.setAttribute('fill', 'black');
	svg.appendChild(bg);

	$.get(characters[0].file, _createInterface.bind(this));
}

function _createInterface (character) {
	console.log(character);
	character = character.documentElement;
	renderedCharacter = character.querySelector('#character');
	console.log(renderedCharacter);
	// window.dispatchEvent(new Event('CHARACTER_LOADED'));
	this.svg.appendChild(renderedCharacter);
}

function shakeEventDidOccur (socket, socketid) {
	socket.emit('shake', socketid);
}

module.exports = Mobile;

// CODE VOOR BUTTONS

	// svg = document.querySelector('svg');
	// svg.width = window.innerWidth;
	// svg.height = window.innerHeight;

	// for (var i = 0; i < 2; i++) {

	// 	var circle = SVGHelper.createElement('circle');
	// 			circle.setAttribute('cx', buttonPos); // cx = middelpunt v d cirkel in svg
	// 			circle.setAttribute('cy', '50%');
	// 			circle.setAttribute('r', 35);
	// 			circle.setAttribute('fill', 'white');
	// 			circle.setAttribute('dislpay', 'block');
	// 			//circle.setAttribute('-webkit-user-select', 'none');

	// 			svg.appendChild(circle);

	// 			buttons.push(circle);

	// 			buttonPos = '66%';
	// 		}


	// 		buttons.forEach(function(button){
	// 			var buttonElement = {pressed:"",socketid:socketid};
	// 			button.addEventListener('touchstart', function(e){
	// 				switch (button) {
	// 					case buttons[0] :
	// 					buttonElement.pressed = "left";
	// 					socket.emit("button_pressed", buttonElement);
	// 					break;
	// 					case buttons[1] :
	// 					buttonElement.pressed = "right";
	// 					socket.emit("button_pressed", buttonElement);
	// 					break;
	// 				}
	// 			});

	// 			button.addEventListener('touchend', function(e){
	// 				buttonElement.pressed = "";
	// 				socket.emit("button_pressed", buttonElement);
	// 			});

	// 		});
