(function(){

//concat met templates en wrap met (function(){})() gebeurt automatisch via gulp

// var socket, socketid, clients, nickname;

function init(){

	// socket = io("http://localhost");
	// socket.on("socketid",function(data){
	// 	console.log("data = " + data);
	// 	socketid = data;
	// });

	// socket.on("connect_disconnect",function(data){
	// 	clients = data;
	// 	console.log(clients);
	// 	$(".clients").empty();
	// 	for(var i = 0; i < clients.length; i++){
	// 		if(clients[i].socketid === socketid){
	// 			// console.log("client = " + clients[i]);
	// 			clients[i].button = false;
	// 		}
	// 		$(".clients").append(tpl.user(clients[i]));
	// 	}
	// });

}
console.log("TEST");


//function to call when shake occurs
function shakeEventDidOccur () {

	console.log("SHAKE");

	$('h1').text("SHAKEEEHH");

    //put your own code here etc.
    // if (confirm("Undo?")) {
    // }
}

window.addEventListener('shake', shakeEventDidOccur, false);

// $(".container").on("keypress", function(e){
// 	if(e.which === 13){
//  		console.log("enter pressed");
//  		nickname = $(".nickname").val();
//  		$(".nickname").parent().append("<span>"+nickname+"</span>");
//  		$(".nickname").remove();
//  		socket.emit("changed_nickname",nickname);
//  	}
// });



init();


})();