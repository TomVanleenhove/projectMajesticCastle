var Class = require('./core/Class');

module.exports = (function(){

  var Client = Class.extend({

    init: function(id,socketid){
      this.id = id;
      this.socketid = socketid;
      this.nickname = "user" + this.id;
      this.button = true;
    }

  });

  return Client;

})();
