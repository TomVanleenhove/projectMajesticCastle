(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./_js/app.js":[function(require,module,exports){
/* globals io:true */
/* globals Modernizr:true */

(function(){

	window.requestAnimationFrame = require('./util/requestAnimationFrame');

	var SVGHelper = require('./svg/SVGHelper');
	var Circle = require('./util/Circle');
	//var Mobile = require('./mobile/Mobile');
	var characters = require('./data/characters').characters;
	var fill = "black";
	var initialized = false;

	var bg;
	// var buttons;
	var circles;

	var socket, socketid, clients;

	var svg;

	function init(){
		socket = io("192.168.1.39:3000");

		socket.on("socketid",function(data){
			console.log("data = " + data);
			if(initialized === false){
				socketid = data;
				if(Modernizr.touch) {
					$.get('/components/mobile.html', _mobile.bind(this));
				} else {
					 $.get('/components/desktop.html', _desktop.bind(this));
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
		console.log(htmlCode);
		$("body").append($(htmlCode));
		makeBackground();
		$(window).resize(function(){
			makeBackground();
   		});
		socket.on("makeNewBall",function(data){
			console.log("making new ball");
			var circle = new Circle(data);
			document.addEventListener('loaded',function(e){
				svg.appendChild(circle.element);
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
  		var s = Snap("#game");
  		var imageHeight = (607 / 1500)*widthB;
        //cloudMaking();
  		var groundImg = s.select("#ground");
		s.attr({width: widthB,height: heightB});
		groundImg.attr({width:widthB,height:imageHeight,x:0,y: heightB - imageHeight});
		ground = heightB - (((imageHeight/100)*13) + 109);
	}
	function loadedFaces(data){
		socket.on("makeNewBall",function(data){
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
		$('h1').text('Mobile = true / id = '+ socketid);
		$("body").append($(htmlCode));
		var mobile = new Mobile(socket, socketid, characters, svg);
	}

	init();

})();

},{"./data/characters":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/data/characters.json","./svg/SVGHelper":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/svg/SVGHelper.js","./util/Circle":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/util/Circle.js","./util/requestAnimationFrame":"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/util/requestAnimationFrame.js"}],"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/data/characters.json":[function(require,module,exports){
module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports={
	"characters": [
		{
			"name": "dirk",
			"file": "../characters/dirk.svg"
		}
	]
}

},{}],"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/svg/SVGHelper.js":[function(require,module,exports){
var namespace = "http://www.w3.org/2000/svg";

function SVGHelper(){

}

SVGHelper.createElement = function(el){
	return document.createElementNS(namespace, el); // svg-elementen worden aangemaakt binnen namespace -> dit is een helper die dit doet -> minder code
};


module.exports = SVGHelper;

},{}],"/Users/TomVanleenhove/Desktop/devine/devine3/RMD III/opdrachten/projectMajesticCastle/demo/_js/util/Circle.js":[function(require,module,exports){
/* globals Snap:true */

function Circle(socketBallId, who){
	console.log("[Circle] socketballId = " + socketBallId);
	this.socketBallId = socketBallId;

	this.ventje;
	this.jetpack;
	this.leftJet;
	this.rightJet;
	this.nameTag;
	this.s = new Snap("#game");

	this.left = false;
	this.right = false;

	this.jumping = false;
	this.falling = false;
	this.flying = false;
	
	this.who = "megan";
	this.speed = 10;
	this.velocity = 0;
	this.gravity = 0.4;
	this.ground = 450;
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
		this.nameTag = $(nameTagMaker(this.who, 0, 0));
        $("#nameTags ul").append(this.nameTag);
        this.nameTag = $(".nameTag[name='"+this.who+"']");
		this.ventje = data.select("#" + this.who);
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
		/*window.addEventListener('keydown', function(event) {
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
		    	jetpackMode = false;
		    	jetpack.selectAll(".fire").attr({opacity: 0});
		    break;
		    case 39: // Right
		    	right = false;
		    break;
		  }
		}, false);*/

		window.requestAnimationFrame(step.bind(this));
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
