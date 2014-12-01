(function(){

/* globals Modernizr:true */
//concat met templates en wrap met (function(){})() gebeurt automatisch via gulp
var socket,socketid,clients;
function shakeEventDidOccur () {

	console.log("SHAKE");
	$('span').text("SHAKEEEHH");
	socket.emit("shake");

    //put your own code here etc.
    // if (confirm("Undo?")) {
    // }
}
function init() {
	//socket = io("http://localhost");

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

})();