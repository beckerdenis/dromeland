var loadState = {

	preload : function() {
		game.add.text(80, 150, 'Chargement en cours...',
				{ font : '30px serif', fill : '#ffffff' });
		game.load.spritesheet('player', 'img/bonhomme.png', 48, 64);
		// Niveau 1 : la gare
		game.load.image('c01_background_part1', 'img/c01_background_part1.png');
		game.load.image('c01_background_part2', 'img/c01_background_part2.png');
        game.load.image('c01_bench', 'img/c01_bench.png');
        game.load.image('c01_post', 'img/c01_post.png');
		game.load.spritesheet('c01_train', 'img/c01_train.png', 370, 124, 6);
		game.load.spritesheet('c01_tickets', 'img/c01_tickets.png', 45, 35);
	},

	create : function() {
		game.state.start('train');
	}

};
