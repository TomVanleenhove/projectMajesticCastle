(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./_js/app.js":[function(require,module,exports){
/* globals io:true */
/* globals Modernizr:true */
/* globals Snap:true */

(function(){

	window.requestAnimationFrame = require('./util/requestAnimationFrame');

	var SVGHelper = require('./svg/SVGHelper');
	var Circle = require('./util/Circle');
	var Mobile = require('./mobile/Mobile');
	var characters = require('./data/characters').characters;
	var initialized = false;
	var ground;

	var bg;
	// var buttons;
	var circles;

	var socket, socketid, clients;

	function init(){
		socket = io("192.168.1.125:3000");

		socket.on("socketid",function(data){
			console.log("data = " + data);
			if(initialized === false){
				socketid = data;
				if(Modernizr.touch) {
					$.get('/components/mobile.html', _mobile.bind(this));
					
				} else {
					//$.get('/components/mobile.html', _mobile.bind(this));
					 $.get('/components/desktop.html', _desktop.bind(this));
					 console.log('modernizr desktop');
					//_mobile.call(this, socketid);
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

	function _desktop(htmlCode){
		$('h1').text('Mobile = false / id = '+ socketid);
		Snap.load('assets/svg/faces.svg', loadedFaces);
		circles = [];
		$("body").append($(htmlCode));
		makeBackground();
		$(window).resize(function(){
			makeBackground();
   		});
		socket.on("makeNewBall",function(socketid, character, color, name){
			console.log("making new ball with:");
			console.log("socket: " + socketid);
			console.log("character: " + character);
			console.log("color: " + color);
			console.log("name: " + name);
			var circle = new Circle(socketid, character, color, name, ground);
			document.addEventListener('loaded',function(e){
				var svg = Snap("#game");
				svg.append(circle.ventje);
				circles.push(circle);
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
	function makeBackground(){
		var widthB = window.innerWidth || document.body.clientWidth;
  		var heightB = window.innerHeight || document.body.clientHeight;
  		var s = new Snap("#game");
  		var imageHeight = (607 / 1500)*widthB;
        //cloudMaking();
  		var groundImg = s.select("#ground");
		s.attr({width: widthB,height: heightB});
		groundImg.attr({width:widthB,height:imageHeight,x:0,y: heightB - imageHeight});
		ground = heightB - (((imageHeight/100)*13) + 109);
		console.log("ground is made and is = " + ground);
		circles.forEach(function(circle) {
    		circle.setGround(ground);
		});
	}

	function loadedFaces(data){
		socket.on("makeNewBall",function(socketid, character, color, name){
			/*face = data.select("#" + who);
			line = data.select(".line");
			line.attr({	strokeMiterLimit: "10",
    				strokeDasharray: "9 9",
    				strokeDashOffset: "988.01"});
			face.append(line);/*
			face.attr({transform: "translate(10,10) scale(0.3,0.3)"});
			facesS.append(face);
			var lenB = line.getTotalLength();
		  	line.attr({
		  	  "stroke-dasharray": lenB + " " + lenB,
		  	  "stroke-dashoffset": lenB
		  	}).animate({"stroke-dashoffset": 10}, 1000,mina.easeout);
		  	face.animate({opacity: 0.7}, 1000,mina.easeout);*/
		});
	}
	function _mobile (htmlCode) {
		$('body').append($(htmlCode));
		$('h1').text('Mobile = true / id = '+ socketid);
		//$('body').append('<input type="text" id="txtName" name="txtName" placeholder="Naam"/> <svg xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="320" height="570"viewport="0 0 100% 100%"> <title></title> <desc></desc> </svg>');

		var svg = document.querySelector('svg');
		var mobile = new Mobile(socket, socketid, svg);
	}

	init();

})();

},{"./data/characters":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/data/characters.json","./mobile/Mobile":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/mobile/Mobile.js","./svg/SVGHelper":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/svg/SVGHelper.js","./util/Circle":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/util/Circle.js","./util/requestAnimationFrame":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/util/requestAnimationFrame.js"}],"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/data/characters.json":[function(require,module,exports){
module.exports={
	"characters": [
		{
			"name": "dirk",
		},
		{
			"name": "megan",
		},
		{
			"name": "filip",
		},
		{
			"name": "daryl",
		},
		{
			"name": "lenny",
		},
		{
			"name": "boris",
		},
	],

	"colors": [
		{
			"color":"#d8ae36",
		},
		{
			"color":"#7fe2e5",
		},
		{
			"color":"#32e0aa",
		},
		{
			"color":"#b235db",
		},
		{
			"color":"#e8887e",
		},
		{
			"color":"#f794c1",
		},
	]
}

},{}],"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/mobile/Character.js":[function(require,module,exports){
var self;

function Character (id, color, svg) {

	this.svg = svg;
	this.id = id;

	this.color = color;

	self = this;

	this.currentCharacter;
	this.characterSpriteSheet;

	console.log("id = "+this.id+" and color = "+this.color);

	$.get('../characters/characters2.svg', _createCharacter.bind(this));

}


function _createCharacter (characterSpriteSheet) {
	// console.log("current char = " + this.id);
	this.characterSpriteSheet = characterSpriteSheet.documentElement;
	this.currentCharacter = this.characterSpriteSheet.querySelector('#'+this.id);
	this.svg.appendChild(this.currentCharacter);
	// this.currentCharacter.setAttributeNS(null, 'transform', 'scale(0.5,0.5) translate(' + (((this.svg.width.baseVal.value/2)-(bbox.width/2))*3) + ',' + (((this.svg.height.baseVal.value/2)-(bbox.height/2))*3)  + ')');
	this.currentCharacter.setAttributeNS(null, 'transform', 'scale(0.5,0.5) translate(200,10)');
}

Character.prototype.setCurrentCharacter = function (id) {
	self.id = id;
	// console.log('setter ' + self.id);
	$(self.currentCharacter).first().remove();
	$.get('../characters/characters2.svg', _createCharacter.bind(self));
};

Character.prototype.setColor = function (color) {
	self.color = color;
	var body = self.currentCharacter.querySelector('.body > path');
	body.setAttributeNS(null, 'fill', color);
};

module.exports = Character;

},{}],"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/mobile/Mobile.js":[function(require,module,exports){
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
		self.currentColor = self.currentCharacter;
		self.character.setCurrentCharacter(characterList[self.currentCharacter].name);
	});

	this.mc.on("swiperight", function() {
		if(self.currentCharacter <= 0) {
			self.currentCharacter = characterList.length - 1;
		} else {
			self.currentCharacter--;
		}
		self.currentColor = self.currentCharacter;
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
		self.currentColor = self.currentCharacter;
		self.character.setCurrentCharacter(characterList[self.currentCharacter].name);
	});

	rightArrow.addEventListener('touchstart', function(e){
		if(self.currentCharacter >= characterList.length - 1) {
			self.currentCharacter = 0;
		} else {
			self.currentCharacter++;
		}
		self.currentColor = self.currentCharacter;
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
	var self = this;
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
			self.currentColor = colorList.indexOf(color);

		});

	}, this);
}

function _removeInterface () {
	console.log(this.currentColor);
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

	console.log(this.currentColor);

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

},{"../data/characters.json":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/data/characters.json","../svg/SVGHelper.js":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/svg/SVGHelper.js","./Character.js":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/mobile/Character.js"}],"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/svg/SVGHelper.js":[function(require,module,exports){
var namespace = "http://www.w3.org/2000/svg";

function SVGHelper(){

}

SVGHelper.createElement = function(el){
	return document.createElementNS(namespace, el); // svg-elementen worden aangemaakt binnen namespace -> dit is een helper die dit doet -> minder code
};


module.exports = SVGHelper;

},{}],"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/util/Circle.js":[function(require,module,exports){
/* globals Snap:true */

function Circle(socketid, character, color, name, ground){
	console.log("[Circle] socketballId = " + socketid);
	this.socketBallId = socketid;
	this.event = new Event('loaded');

	this.ventje;
	this.characterColor = color;
	this.jetpack;
	this.leftJet;
	this.rightJet;
	this.nameTag;
	this.nameTagString = name;
	this.s = new Snap("#game");

	this.left = false;
	this.right = false;

	this.jumping = false;
	this.falling = false;
	this.flying = false;
	
	this.who = character;
	this.speed = 10;
	this.velocity = 0;
	this.gravity = 0.4;
	this.ground = ground;
	this.jetpackPower = 0.1;

	this.bodyMatrix = new Snap.Matrix();
	this.leftJetMatrix = new Snap.Matrix();
	this.rightJetMatrix = new Snap.Matrix();

	this.changeFace = false;
	this.faceToNormal = false;
	
	this.havingControl = true;
	this.jetpackMode = false;
	this.jetpackChange = false;
    
	Snap.load('assets/svg/characters.svg', loaded.bind(this));
}
function nameTagMaker(name,left,top){
        var tagHTML = "<li class='nameTag' name='"+name+"' style='left:"+left+"px; top:"+top+"px;'><p>"+name+"</p></li>";
        return tagHTML;
}
function loaded(data){
		this.nameTag = $(nameTagMaker(this.nameTagString, 0, 0));
        $("#nameTags ul").append(this.nameTag);
        this.nameTag = $(".nameTag[name='"+this.nameTagString+"']");
		this.ventje = data.select("#" + this.who);
		this.ventje.select(".bodyColor").attr({fill:this.characterColor});

		this.jetpack = data.select("#jet");
		this.jetpack.selectAll(".fire").attr({opacity: 0});
		this.leftJet = this.jetpack.select("#leftJet");
		this.rightJet = this.jetpack.select("#rightJet");

		this.rightJetMatrix.translate(-80,0);
		this.leftJetMatrix.translate(80,0);
		this.rightJet.attr({transform: this.rightJetMatrix});
		this.leftJet.attr({transform: this.leftJetMatrix});

		this.ventje = this.s.group(this.jetpack,this.ventje);
		this.bodyMatrix.scale(0.4,0.4);
		this.bodyMatrix.f = 0;
		this.bodyMatrix.e = (window.outerWidth / 2) - (this.ventje.getBBox().width);
		this.ventje.attr({transform: this.bodyMatrix});
		//this.ventje.drag(dragmoving, dragstart, dragstop);
		window.addEventListener('keydown', function(event) {
		  switch (event.keyCode) {
		    case 37: // Left
		    	left = true;
		    	console.log(ventje.getBBox());
		    break;
		    case 38: // up
		    	jumping = true;
		    break;
		    case 32: // space
		    	if(falling){
		    		console.log("I believe I can fly!!!");
		    		jetpackMode = true;
					flying = true;
					jetpack.selectAll(".fire").attr({opacity: 1});
					jetpackChange = true;
		    	}
		    break;
		    case 39: // Right
		    	right = true;
		    break;
		  }
		}, false);
		window.addEventListener('keyup', function(event) {
			console.log(event.keyCode);
		  switch (event.keyCode) {
		    case 37: // Left
		    	left = false;
		    break;
		    case 32: // space
		    	this.jetpackMode = false;
		    	this.jetpack.selectAll(".fire").attr({opacity: 0});
		    break;
		    case 39: // Right
		    	right = false;
		    break;
		  }
		}, false);

		window.requestAnimationFrame(step.bind(this));
		console.log("event dispatched");
		document.dispatchEvent(this.event);
	}

Circle.prototype.setControl = function(value){
	console.log("control changed to " + value);
		switch (value) {
		    case "left": // Left
		    	this.left = true;
		    	this.right = false;
		    break;
		    case "right": // right
		    	this.right = true;
		    	this.left = false;
		    break;
		    case "":
		    	this.left = false;
		    	this.right = false;
		    break;
		}
};
Circle.prototype.setGround = function(value){
	console.log("ground changed to " + value);
	if(this.ground !== value){
		this.ground = value;
	}
};

Circle.prototype.setJumping = function(value){
	if(this.jumping !== value){
		this.jumping = true;
	}
};
Circle.prototype.setJet = function(value){
	if (value){
		if(falling){
			console.log("I believe I can fly!!!");
			this.jetpackMode = true;
			this.flying = true;
			this.jetpack.selectAll(".fire").attr({opacity: 1});
			this.jetpackChange = true;
		}
	}else{
		jetpackMode = false;
		this.jetpack.selectAll(".fire").attr({opacity: 0});
	}
	
};

Circle.prototype.getSocketBallId = function(){
	return this.socketBallId;
};
function jetpackChangeHandler(){
	if(this.flying){
		if (this.rightJetMatrix.e < 0){
			this.rightJetMatrix.translate(80,0);
			this.leftJetMatrix.translate(-80,0);
		}
		this.leftJet.animate({transform: this.leftJetMatrix}, 1000, mina.bounce);
		this.rightJet.animate({transform: this.rightJetMatrix}, 1000, mina.bounce);
	}else{
		this.rightJetMatrix.translate(-80,0);
		this.leftJetMatrix.translate(80,0);
		this.leftJet.animate({transform: this.leftJetMatrix}, 1000, mina.bounce);
		this.rightJet.animate({transform: this.rightJetMatrix}, 1000, mina.bounce);
	}
}
function step() {
	this.nameTag.css({left:Math.floor(this.bodyMatrix.e + (this.ventje.getBBox().w /2) + 20) ,top:Math.floor(this.bodyMatrix.f - (this.ventje.getBBox().h / 2))});

	if(this.jetpackChange){
		jetpackChangeHandler().bind(this);
		this.jetpackChange = false;
	}
	if(this.jetpackMode){
		this.bodyMatrix.translate(0,this.jetpackPower* (-40));
		this.velocity = 0;
		console.log(this.bodyMatrix);
	}
	if(this.left){
		this.bodyMatrix.translate(this.speed * (-1),0);
		if (this.flying) {
			this.bodyMatrix.rotate(-1 , this.bodyMatrix.f - (this.ventje.getBBox().w / 2),this.bodyMatrix.e - (this.ventje.getBBox().h / 2));
		}else{
			this.bodyMatrix.c = ((this.speed)/500) * (-1);
		}
	}
	if(this.right){
		this.bodyMatrix.translate(this.speed,0);
		if (this.flying) {
			this.bodyMatrix.rotate(1,  this.bodyMatrix.f - (this.ventje.getBBox().w / 2),this.bodyMatrix.e - (this.ventje.getBBox().h / 2));
		}else{
			this.bodyMatrix.c = ((this.speed)/500);
		}
	}
	if(this.flying){
		this.velocity -= 0.01;
		this.jumping = false;
	}else if(this.jumping){
		this.velocity -= 10;
		this.jumping = false;
	}
	if(!this.right && !this.left){
		this.speed = 10;
		this.changeFace = true;
		if(this.bodyMatrix.b !== 0 && this.flying) {
			if(this.bodyMatrix.b >= 0){
				this.bodyMatrix.rotate(-1);
			}else{
				this.bodyMatrix.rotate(1);
			}
		}
		if(this.faceToNormal) {
			if(this.bodyMatrix.c !== 0 && !this.flying){
				this.bodyMatrix.c = 0;
			}
			this.faceMatrix.e = 0;
			this.ventje.select("#face").animate({transform: this.faceMatrix}, 1000, mina.elastic);
			this.faceToNormal = false;
		}
	}else{
		this.speed += 0.1;
		this.faceToNormal = true;
		if(this.changeFace) {
			if(this.left){
				this.faceMatrix.e = 15;
			}
			if(this.right){
				this.faceMatrix.e = -15;
			}
			this.ventje.select("#face").animate({transform: this.faceMatrix}, 1000);
			this.changeFace = false;
		}
	}
	if ((this.bodyMatrix.f + this.velocity >= this.ground)) {
		this.velocity = 0;
		this.bodyMatrix.f = this.ground;
		this.falling = false;
		if (this.flying) {
			this.bodyMatrix.b = 0;
			this.bodyMatrix.d = 0.4;
			this.bodyMatrix.a = 0.4;
			this.bodyMatrix.c = 0;
			this.jetpackChange = true;
		}
		this.flying = false;
		this.jetpackMode = false;
	} else {
		if(!this.jetpackMode && !this.flying){
			this.velocity += this.gravity;
			this.bodyMatrix.f += this.velocity;
			this.falling = true;
			//console.log("normal fall");
		}else if(!this.jetpackMode && this.flying){
			this.velocity += this.jetpackPower;
			this.bodyMatrix.f += this.velocity;
			this.falling = true;
			//console.log("jetpack fall");
		}
	}
	//console.log("jetpackMode = " + jetpackMode);
	//console.log("flying = " + flying);
	this.ventje.attr({transform: this.bodyMatrix});
	if(this.havingControl){
		//console.log("animating");
		window.requestAnimationFrame(step.bind(this));
	}
	}

module.exports = Circle;
},{}],"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/util/requestAnimationFrame.js":[function(require,module,exports){
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
