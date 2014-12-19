function Player(context){
	this.context = context;
}

Player.prototype.play = function(soundboard){
		// console.log(soundboard);
	var source = this.context.createBufferSource();
	source.buffer = soundboard[0];
	source.start(0);

	var gain = this.context.createGain();
	// gain.gain.value = static.volume;

	source.connect(gain);
	gain.connect(this.context.destination);
};

module.exports = Player;
