//var SVGHelper = require('../svg/SVGHelper');
function Circle(socketBallId){
	console.log("[Circle] socketballId = " + socketBallId);
	this.height = 160;
	this.gravity = 0.4;
	this.position = {x:500 - this.height,y:500};
	this.currentPosition = {x:500,y:500};
	this.control = "";
	this.speed = 10 + Math.round(Math.random() * (50 - 10));
	this.jumping = true;
	this.velocity = 0;
	this.loaded = false;
	this.event = new Event('loaded');

	this.socketBallId = socketBallId;
	$.get('/players/boris.html', _create.bind(this));
}

function _create(player){
	console.log('creating...');
	this.element = $(player);
	console.log(this.element);
	this.element[0].setAttribute('transform', "translate(" + this.position.x + "," + this.position.y + ") scale(0.4,0.4)"); // cx = middelpunt v d cirkel in svg
	console.log(this.element[0]);
	_enterFrame.call(this, this.control);
	document.dispatchEvent(this.event);
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

function _enterFrame(){
	switch(this.control){
		case "left":
			console.log("links");
			this.currentPosition.x -= 10;
			////this.element.setAttribute("currentSkew",parseFloat(this.element.getAttribute("currentSkew")) - 10);
		break;
		case "right":
			console.log("rechts");
			this.currentPosition.x += 10;
			////this.element.setAttribute("currentSkew",parseFloat(this.element.getAttribute("currentSkew")) + 10);
		break;
		/*case "":
		console.log("feest?");
			if(this.element.getAttribute('cSkew') === 0){
				this.element.setAttribute('currentSkew', 0);
			}else if (this.element.getAttribute('cSkew') > 0) {
				this.element.setAttribute("currentSkew",parseFloat(this.element.getAttribute("currentSkew")) - 10);
			}else{
				this.element.setAttribute("currentSkew",parseFloat(this.element.getAttribute("currentSkew")) + 10);
			}
		break;*/
	}
	this.position.x += (this.currentPosition.x - this.position.x) / this.speed;
	this.position.y += (this.currentPosition.y - this.position.y) / this.speed;
	this.element[0].setAttribute('transform', "translate(" + this.position.x + "," + this.position.y + ")");
	//this.element.setAttribute("cSkew", ((parseFloat(this.element.getAttribute("currentSkew")) - parseFloat(this.element.getAttribute("cSkew"))) / this.speed)+parseFloat(this.element.getAttribute("cSkew")));
	//this.element.setAttribute('transform', 'skewX('+ this.element.getAttribute("cSkew") +')');

	if (this.jumping){
		// console.log("physical -> jumping");
		this.velocity -= 20;
		this.jumping = false;
		// console.log("physical -> jumping stopped");
	}
	_update.call(this);

	requestAnimationFrame(_enterFrame.bind(this));
}

function _update(){
	if (this.position.y + this.velocity + 36 > 500) {
		this.velocity = 0;
		this.position.y = 500 - 36;
	} else {
		this.velocity += this.gravity;
		this.position.y +=this.velocity;
	}
}

module.exports = Circle;
