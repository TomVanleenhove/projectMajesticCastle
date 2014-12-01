(function(){

this["tpl"] = this["tpl"] || {};
this["tpl"]["user"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<!-- 1 specifieke user in YO (li) -->\n<li data-socketid=\"";
  if (helper = helpers.socketid) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.socketid); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n		<span>";
  if (helper = helpers.nickname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.nickname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n</li>\n";
  return buffer;
  });
/* globals Modernizr:true */
/* globals circ:true */
/* globals initView:true */
//concat met templates en wrap met (function(){})() gebeurt automatisch via gulp
var socket,socketid,clients;

function shakeEventDidOccur () {
	console.log("SHAKE");
	$('span').text("SHAKEEEHH");
	socket.emit("shake");
}
function init() {
	//socket = io("http://localhost");
	initView();
	if ( Modernizr.touch ) {
	   window.addEventListener('shake', shakeEventDidOccur, false);
	} else {
	   console.log("no touch...");
	}

	socket = io("/");
	socket.on("socketid",function(data){
	  socketid = data;
	  console.log("changed socket id: "+socketid);
	});
	socket.on("connect_disconnect",function(data){
	  clients = data;
	  $(".clients").empty();
	  clients.forEach(function(client) {
	  	console.log("client: "+client.socketid+" / "+"your id: "+socketid);
	  	if (client.socketid === socketid){
	  		$(".clients").append(tpl.user(client));
	  		console.log(client.nickname+"-button : "+client.button);
	  	}else{
	  		$(".clients").append(tpl.user(client));
	  		console.log(client.nickname+"-button : "+client.button);
	  	}
		});
	});
	socket.on("shake",function(data){
	  console.log("shake");
	  $('span').text("SHAKEEEHH");
	  circ.translation.x -= 10;
	  /*var lis = document.getElementsByTagName("li");
	  lis.forEach(function(li){
	  	if(li.getAttribute("data-socketid") === data){
	  		console.log(li);
	  	}
	  	console.log(li);
	  });*/

	});
}
init();

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


})();