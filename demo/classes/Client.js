var Class = require('./core/Class');

module.exports = (function(){

  var Client = Class.extend({ // Deze class is een soort template voor clients, dan kunnen we hieruit extenden

    init: function(id,socketid){
      this.id = id;
      this.socketid = socketid;
      this.nickname = "user" + this.id;
      this.button = true;
    }

  });

  return Client;

})();
