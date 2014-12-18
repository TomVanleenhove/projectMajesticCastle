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
