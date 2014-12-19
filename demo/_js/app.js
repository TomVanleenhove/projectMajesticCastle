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
		socket = io("192.168.1.5:3000");

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
				var svg = new Snap("#game");
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
		socket.on('jetpackActivate', function(buttonElement){
			if (circles !== []) {
				for (var i = 0; i < circles.length; i++) {
					var currentCircle = circles[i];
					if (currentCircle.getSocketBallId() === buttonElement.socketid){
						var jetting;
						switch (buttonElement.pressed) {
							case "jet" :
							console.log("jet pressed");
							jetting = true;
							currentCircle.setJet(jetting);
							break;
							case "":
							jetting = false;
							currentCircle.setJet(jetting);
							break;
						}
					}
				}
			}
		});
		socket.on('removeCharacter', function(socketBallId){
			console.log("removing: " + socketBallId);
			if (circles !== []) {
				circles.forEach(function(circle) {
    				if (circle.getSocketBallId() === socketBallId){
				    	console.log("removed: " + socketBallId);
				    	console.log(circle);
				    	circles.splice(circles.indexOf(circle),1);
				    	circle.nameTag.remove();
				    	circle.ventje.remove();
				    	circle.remove();
				    }
				});
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
		circles.forEach(function(circle){
    		circle.setBoundries(ground);
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
