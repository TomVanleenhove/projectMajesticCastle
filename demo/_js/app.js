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
		socket = io("192.168.123.164:3000");

		socket.on("socketid",function(data){
			console.log("data = " + data);
			if(initialized === false){
				socketid = data;
				if(Modernizr.touch) {
					_mobile.call(this);
					console.log('modernizr mobile');
				} else {
					 // $.get('/components/desktop.html', _desktop.call(this));
					 _mobile.call(this);
					 console.log('modernizr dasktop');
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
	function _mobile () {
		$('body').append('<input type="text" id="txtName" name="txtName" placeholder="Naam"/> <svg xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="320" height="570"viewport="0 0 100% 100%"> <title></title> <desc></desc> </svg>');

		svg = document.querySelector('svg');
		svg.width = 320;
		svg.height = 570;

		var mobile = new Mobile(socket, socketid, svg);
	}

	init();

})();
