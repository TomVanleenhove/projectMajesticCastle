var self;

function Character (id, color, svg) {

	this.svg = svg;
	this.id = id;

	this.color = color;

	self = this;

	this.currentCharacter;
	this.characterSpriteSheet;

	console.log("id = "+this.id+" and color = "+this.color);

	$.get('../characters/characters2.svg', _createCharacter.bind(this));

}


function _createCharacter (characterSpriteSheet) {
	// console.log("current char = " + this.id);
	this.characterSpriteSheet = characterSpriteSheet.documentElement;
	this.currentCharacter = this.characterSpriteSheet.querySelector('#'+this.id);
	this.svg.appendChild(this.currentCharacter);
	// this.currentCharacter.setAttributeNS(null, 'transform', 'scale(0.5,0.5) translate(' + (((this.svg.width.baseVal.value/2)-(bbox.width/2))*3) + ',' + (((this.svg.height.baseVal.value/2)-(bbox.height/2))*3)  + ')');
	this.currentCharacter.setAttributeNS(null, 'transform', 'scale(0.5,0.5) translate(200,10)');
}

Character.prototype.setCurrentCharacter = function (id) {
	self.id = id;
	// console.log('setter ' + self.id);
	$(self.currentCharacter).first().remove();
	$.get('../characters/characters2.svg', _createCharacter.bind(self));
};

Character.prototype.setColor = function (color) {
	self.color = color;
	var body = self.currentCharacter.querySelector('.body > path');
	body.setAttributeNS(null, 'fill', color);
};

module.exports = Character;
