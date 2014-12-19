var Class = require('./core/Class');

module.exports = (function(){

  var Client = Class.extend({ // Deze class is een soort template voor clients, dan kunnen we hieruit extenden

    init: function(id,socketid,name,character,color){
      this.id = id;
      this.socketid = socketid;
      this.name = name;
      this.character = character;
      this.color = color;
      this.button = true;
    }

  });

  return Client;

})();
