var loadState = {

    preload : function() {
        game.add.text(80, 150, 'Chargement en cours...',{ font : '30px serif', fill : '#ffffff' });
        game.load.spritesheet('player', 'img/bonhomme.png', 48, 64);
        // Niveau 1 : la gare
        game.load.image('c01_background_part1', 'img/c01_background_part1.png');
        game.load.image('c01_background_part2', 'img/c01_background_part2.png');
        game.load.image('c01_bench', 'img/c01_bench.png');
        game.load.image('c01_post', 'img/c01_post.png');
        game.load.spritesheet('c01_train', 'img/c01_train.png', 370, 124, 6);
        game.load.spritesheet('c01_tickets', 'img/c01_tickets.png', 30, 23);
        game.load.spritesheet('c01_chef_de_gare', 'img/c01_chef_de_gare.png', 27, 32);
        game.load.spritesheet('c01_moustachman', 'img/c01_moustachman.png', 32, 32, 8);
        game.load.spritesheet('c01_blondie', 'img/c01_blondie.png', 32, 32, 8);
        // Niveau 3 : larzac
        game.load.image('c03_level', 'img/c03_level.png');
        game.load.spritesheet('c03_larzac', 'img/c03_larzac.png', 32, 32);
    },

    create : function() {
        game.state.start('larzac');
    }

};
