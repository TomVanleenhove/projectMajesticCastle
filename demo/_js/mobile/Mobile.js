/* globals Hammer:true */
/* globals Shake:true */

var SVGHelper = require('../svg/SVGHelper.js');
var characterList = require('../data/characters.json').characters;
var colorList = require('../data/characters.json').colors;
var Character = require('./Character.js');

function Mobile (socket, socketid, svg) {

	this.svg = svg;

	console.log(svg);

	this.socket = socket;
	this.socketid = socketid;

	this.mc = new Hammer(this.svg);

	var bg = SVGHelper.createElement('rect');
	bg.setAttribute('rx', 0);
	bg.setAttribute('ry', 0);
	bg.setAttribute('width', '100%');
	bg.setAttribute('height', '100%');
	bg.setAttribute('fill', '#E5D4A8');

	svg.appendChild(bg);


	this.currentCharacter = 0;
	this.currentColor = 0;


	this.character = new Character(characterList[this.currentCharacter].name, colorList[this.currentColor].color, this.svg);

	_createInterface.call(this);

}

function _createInterface () {
	var self = this;


	this.mc.on("swipeleft", function() {
		if(self.currentCharacter >= characterList.length - 1) {
			self.currentCharacter = 0;
		} else {
			self.currentCharacter++;
		}
		self.character.setCurrentCharacter(characterList[self.currentCharacter].name);
	});

	this.mc.on("swiperight", function() {
		if(self.currentCharacter <= 0) {
			self.currentCharacter = characterList.length - 1;
		} else {
			self.currentCharacter--;
		}
		self.character.setCurrentCharacter(characterList[self.currentCharacter].name);
	});


	$.get('../characters/arrow.svg', _createArrows.bind(this));
	_createColors.call(this, this.character);

	$.get('../characters/start_button.svg', _createReadyButton.bind(this));

}

function _createArrows (arrow) {
	arrow = arrow.documentElement;
	var leftArrow = arrow.querySelector('#leftArrow');
	var rightArrow = arrow.querySelector('#rightArrow');

	var self = this;

	leftArrow.setAttributeNS(null, 'transform', 'scale(0.7,0.7) translate(10, 80)');
	rightArrow.setAttributeNS(null, 'transform', 'scale(0.7,0.7) translate(370, 80)');

	this.svg.appendChild(leftArrow);
	this.svg.appendChild(rightArrow);

	leftArrow.addEventListener('touchstart', function(e){
		if(self.currentCharacter <= 0) {
			self.currentCharacter = characterList.length - 1;
		} else {
			self.currentCharacter--;
		}
		self.character.setCurrentCharacter(characterList[self.currentCharacter].name);
	});

	rightArrow.addEventListener('touchstart', function(e){
		if(self.currentCharacter >= characterList.length - 1) {
			self.currentCharacter = 0;
		} else {
			self.currentCharacter++;
		}
		self.character.setCurrentCharacter(characterList[self.currentCharacter].name);
	});

}

function _createReadyButton (button) {
	var self = this;
	button = button.documentElement;
	var buttonElement = button.querySelector('#readyButton');
	this.svg.appendChild(buttonElement);
	buttonElement.setAttributeNS(null, 'transform', 'translate(80, 450) scale(1.3, 1.3)');

	buttonElement.addEventListener('touchstart', function(e){
		if($('#txtName').val() !== '') {
			console.log("name not empty");
			self.name = $('#txtName').val();
			_removeInterface.call(self);
		}
	});
}

function _createColors (character) {
	var xPos = 65;
	var yPos = 230;
	var i = 1;

	this.colors = [];

	colorList.forEach(function(color){

		var colorCheckBox = SVGHelper.createElement('rect');
		colorCheckBox.setAttributeNS(null, 'x', xPos);
		colorCheckBox.setAttributeNS(null, 'y', yPos);
		colorCheckBox.setAttributeNS(null, 'width', 50);
		colorCheckBox.setAttributeNS(null, 'height', 50);
		colorCheckBox.setAttributeNS(null, 'class', 'colorCheckBox');
		colorCheckBox.setAttributeNS(null, 'fill', color.color);
		this.svg.appendChild(colorCheckBox);

		xPos += 70;
		if (i%3 === 0) {
			yPos += 70;
			xPos = 65;
		}

		i++;

		colorCheckBox.addEventListener('touchstart', function(e){
			character.setColor(colorCheckBox.getAttribute('fill'));
			this.currentColor = colorList.indexOf(color);
		});

	}, this);
}

function _removeInterface () {
	console.log("_removeInterface");
	$('#leftArrow').first().remove();
	$('#rightArrow').first().remove();
	$('.colorCheckBox').remove();
	$('#readyButton').first().remove();
	$('#txtName').remove();

	this.mc.off("swipeleft");
	this.mc.off("swiperight");


	$.get('../characters/instruction.svg', _createInstruction.bind(this));

}

function _createInstruction(instructions){
	console.log('_createInstructions');
	instructions = instructions.documentElement;
	var mobileInstruction = instructions.querySelector('#mobile');
	var desktopInstruction = instructions.querySelector('#desktop');

	this.svg.appendChild(mobileInstruction);
	this.svg.appendChild(desktopInstruction);

	mobileInstruction.setAttributeNS(null, 'transform', 'translate(170, 270) scale(0.5,0.5) rotate(180, 50,100)');
	desktopInstruction.setAttributeNS(null, 'transform', 'translate(45, 250)');


	window.addEventListener('shake', shakeEventDidOccur.bind(this, this.socket, this.socketid), false);

}

function shakeEventDidOccur (socket, socketid) {

	socket.emit('shakeToDesktop', socketid, characterList[this.currentCharacter].name, colorList[this.currentColor].color, this.name);
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
