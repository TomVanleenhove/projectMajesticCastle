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
