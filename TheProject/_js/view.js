/* globals Two:true */
var two, circ, speedH, speedV, acceleretion, jumping, falling;
var control = new String();
function initView() {
	two = new Two({
    	fullscreen: true,
    	autostart: true
    }).appendTo(document.body);
    circ = two.makeCircle(two.width / 2, two.height - 50, 50);
    circ.fill = '#FF8000';
	circ.stroke = 'orangered'; // Accepts all valid css color
	circ.linewidth = 5;

	speedH = 0;
	speedV = 0;
	acceleretion = 0.3;
	jumping = false;
	falling = false;
    two.bind('update', function(frames) {
    	if(speedV < 0){
    		falling = true;
    	}
    	if(jumping){
    		if(falling){
				if(circ.translation.y + 50 > two.height){
	    			jumping = false;
	    			falling = false;
	    			speedV = 0;
    			}
    		}
    		speedV -= acceleretion;
    			circ.translation.y -= speedV;
    		
    	}
		switch (control) {
		 	case "left":
	            circ.translation.x -= speedH;
	            break;
	        case "right":
	            circ.translation.x += speedH;
	            break;
	        case "space":
	        	jumping = true;
	        	speedV = 5;
	            break;
	        case null:
	            speed = 0;
	            break;
		 }
		if(control != null){
	    	if(speedH <= 10){
	    		speedH += acceleretion;
	    	}
    	}
	}).play();
    document.onkeydown = checkKey;
    document.onkeyup = function(){control = null;};
}

function checkKey(e) {
	    switch (e.keyCode) {
	        case 37:
	            control = "left";
	            break;
	        case 39:
	            control = "right";
	            break;
	        case 32:
	            control = "space";
	            break;
	    }
}
