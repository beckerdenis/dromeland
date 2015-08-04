var loadState = {

	preload : function() {
		game.add.text(80, 150, 'Chargement en cours...',
				{ font : '30px serif', fill : '#ffffff' });
		game.load.spritesheet('player', 'img/bonhomme.png', 48, 64);
		// Niveau 1 : la gare
		game.load.image('c01_background', 'img/c01_background.png');
		game.load.spritesheet('c01_train_left', 'img/c01_animated_train_go_left.png', 400, 125);
		game.load.spritesheet('c01_train_right', 'img/c01_animated_train_go_right.png', 400, 125);
		game.load.spritesheet('c01_tickets', 'img/c01_tickets.png', 45, 35);
	},

	create : function() {
		game.state.start('train');
	}

};
