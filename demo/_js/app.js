/* globals io:true */
/* globals Modernizr:true */
/* globals Snap:true */

(function(){

	window.requestAnimationFrame = require('./util/requestAnimationFrame');

	var SVGHelper = require('./svg/SVGHelper');
	var Circle = require('./util/Circle');
	var Mobile = require('./mobile/Mobile');
	var characters = require('./data/characters').characters;
	var BufferLoader = require('./sound/BufferLoader');
	var Player = require('./sound/Player');
	var initialized = false;
	var ground;

	var bg;
	// var buttons;
	var circles;

	var socket, socketid, clients;

	function init(){
		socket = io("http://192.168.123.164:3000");

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


	//
}
// function soundsLoaded(arr){
// 	console.log("HOORAY");
// 	console.log(arr);
// }
function makeNewChar(client){
	console.log("making new ball with:");
	console.log("socket: " + client.socketid);
	console.log("character: " + client.character);
	console.log("color: " + client.color);
	console.log("name: " + client.name);
	var circle = new Circle(client.socketid, client.character, client.color, client.name, ground);
	document.addEventListener('loaded',function(e){
		var svg = new Snap("#game");
		svg.append(circle.ventje);
		circles.push(circle);
	});
}
function _desktop(htmlCode){
	$('h1').text('Mobile = false / id = '+ socketid);
	circles = [];
	$("body").append($(htmlCode));
	makeBackground();
	$(window).resize(function(){
		makeBackground();
	});
	socket.on("makeNewBall",function(client){
		makeNewChar(client);
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
		for(var i = 0; i < clients.length; i++){
			if(clients[i].button){
				makeNewChar(clients[i]);
			}
		};
	}
	function makeBackground(){
		var widthB = window.innerWidth || document.body.clientWidth;
		var heightB = window.innerHeight || document.body.clientHeight;
		var s = new Snap("#game");
		var imageHeight = (607 / 1500)*widthB;
        //cloudMaking();
        var groundImg = s.select("#ground");
        cloudMaking();
        s.attr({width: widthB,height: heightB});
        groundImg.attr({width:widthB,height:imageHeight,x:0,y: heightB - imageHeight});
        ground = heightB - (((imageHeight/100)*13) + 109);
        console.log("ground is made and is = " + ground);
        circles.forEach(function(circle){
        	circle.setBoundries(ground);
        });
      }
      function cloudMaking(){
      	var delay = 0;
      	Snap("#game").selectAll(".cloud").forEach(function(cloud){
      		setTimeout(function() {makeCloudMove(cloud);}.bind(cloud), delay);
      		delay += 2000;
      	});
      }
      function makeCloudMove(cloud){
      	cloud.attr({width: 100,height: 100});
      	var cloudMatrix = new Snap.Matrix();
      	cloudMatrix.scale(0.1);
     		cloudMatrix.e = Math.floor(Math.random() * (window.innerWidth || document.body.clientWidth)); //x
     		cloudMatrix.f = (window.innerHeight || document.body.clientHeight)/2;//y

     		cloud.attr({transform:cloudMatrix});

     		cloudMatrix.a = 2;
     		cloudMatrix.d = 2;
     		cloudMatrix.f = -200;
     		if(cloudMatrix.e > (window.innerWidth || document.body.clientWidth) / 2) {
     			cloudMatrix.e += 200;
     		} else{
     			cloudMatrix.e -= 200;
     		}

     		cloud.animate({transform:cloudMatrix}, Math.floor(Math.random() * 7000) + 6000,function(){
     			makeCloudMove(cloud);
     		}.bind(cloud));
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
