(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./_js/app.js":[function(require,module,exports){
(function(){

	window.requestAnimationFrame = require('./util/requestAnimationFrame');

	var SVGHelper = require('./svg/SVGHelper');

	var position = {x:100, y:500 - 36};
	var currentPos = { x: 100, y: 500 - 36 };
	var radius = 20;
	var fill = "black";

	var circle, bg, speed, keyPressed;

	var svg;

	var velocity = 0;
	var gravity = .4;

	function init(){

		svg = document.querySelector('svg');

		bg = SVGHelper.createElement('rect');
		bg.setAttribute('rx', 0);
		bg.setAttribute('ry', 0);
		bg.setAttribute('width', 1500);
		bg.setAttribute('height', 1000);
		bg.setAttribute('fill', fill);

		svg.appendChild(bg);


		circle = SVGHelper.createElement('circle');
			circle.setAttribute('cx', position.x); // cx = middelpunt v d cirkel in svg
			circle.setAttribute('cy', position.y);
			circle.setAttribute('r', radius);
			circle.setAttribute('fill', 'white');

			svg.appendChild(circle);


			speed = 10 + Math.round(Math.random() * (50 - 10));

			document.onkeydown = checkKey;

			_enterFrame.call(this);

		}



	function _enterFrame(){

		console.log('y = ' + position.y);

		position.x += (currentPos.x - position.x) / speed;
		position.y += (currentPos.y - position.y) / speed;

		circle.setAttribute('cx', position.x);
		circle.setAttribute('cy', position.y);

		if (keyPressed) {
        velocity = -20;
        keyPressed = false;
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

    function checkKey(e) {
    	switch (e.keyCode) {
    		case 37:
    		control = "left";
    		currentPos.x -= 50;
    		break;
    		case 39:
    		control = "right";
    		currentPos.x += 50;
    		break;
    		case 32:
    		control = "space";
    		keyPressed = true;
    		break;
    	}
    }

    init();

  })();

},{"./svg/SVGHelper":"/Users/quintendelahaye/Desktop/Devine/4.RMD/_RMD/projectMajesticCastle/rAF_svg_test/_js/svg/SVGHelper.js","./util/requestAnimationFrame":"/Users/quintendelahaye/Desktop/Devine/4.RMD/_RMD/projectMajesticCastle/rAF_svg_test/_js/util/requestAnimationFrame.js"}],"/Users/quintendelahaye/Desktop/Devine/4.RMD/_RMD/projectMajesticCastle/rAF_svg_test/_js/svg/SVGHelper.js":[function(require,module,exports){
var namespace = "http://www.w3.org/2000/svg";

function SVGHelper(){

}

SVGHelper.createElement = function(el){
	return document.createElementNS(namespace, el); // svg-elementen worden aangemaakt binnen namespace -> dit is een helper die dit doet -> minder code
};

module.exports = SVGHelper;

},{}],"/Users/quintendelahaye/Desktop/Devine/4.RMD/_RMD/projectMajesticCastle/rAF_svg_test/_js/util/requestAnimationFrame.js":[function(require,module,exports){
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
