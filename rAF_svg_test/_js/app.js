(function(){

	window.requestAnimationFrame = require('./util/requestAnimationFrame');

	var SVGHelper = require('./svg/SVGHelper');

	var position = {x:100, y:500 - 36};
	var currentPos = { x: 100, y: 500 - 36 };
	var radius = 30;
	var fill = "black";

	var circle, bg, speed, jumping, control;

	var svg;

	var velocity = 0;
	var gravity = 0.4;

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

			document.onkeydown = checkKeyDown;
			document.onkeyup = checkKeyUp;

			_enterFrame.call(this);

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
		console.log('y = ' + position.y);

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
