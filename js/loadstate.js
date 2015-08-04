var loadState = {

	preload : function() {
		game.add.text(80, 150, 'Chargement en cours...',
				{ font : '30px serif', fill : '#ffffff' });
		// Niveau 1 : la gare
		game.load.image('1-background', 'img/train-background.png');
		game.load.spritesheet('1-player', 'img/train-bonhomme.png', 48, 64);
	},

	create : function() {
		game.state.start('train');
	}

};
