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
