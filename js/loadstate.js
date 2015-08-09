var loadState = {

    preload : function() {
        game.add.text(80, 150, 'Chargement en cours...',{ font : '30px serif', fill : '#ffffff' });
        game.load.spritesheet('player', 'img/player.png', 64, 64, 16);
        game.load.audio('success', 'audio/success.ogg');
        game.load.audio('failure', 'audio/failure.ogg');
        game.load.audio('transition', 'audio/transition.ogg');
        // Niveau 1 : la gare
        game.load.image('c01_background_part1', 'img/c01_background_part1.png');
        game.load.image('c01_background_part2', 'img/c01_background_part2.png');
        game.load.image('c01_bench', 'img/c01_bench.png');
        game.load.image('c01_post', 'img/c01_post.png');
        game.load.image('c01_transition', 'img/c01_transition.png');
        game.load.spritesheet('c01_train', 'img/c01_train.png', 370, 124, 6);
        game.load.spritesheet('c01_tickets', 'img/c01_tickets.png', 30, 23);
        game.load.spritesheet('c01_chef_de_gare', 'img/c01_chef_de_gare.png', 27, 32);
        game.load.spritesheet('c01_moustachman', 'img/c01_moustachman.png', 32, 32, 8);
        game.load.spritesheet('c01_blondie', 'img/c01_blondie.png', 32, 32, 8);
        game.load.audio('c01_music', 'audio/c01_music.ogg');
        game.load.audio('c01_shock', 'audio/c01_shock.ogg');
        // Niveau 3 : larzac
        game.load.image('c03_level', 'img/c03_level.png');
        game.load.spritesheet('c03_platform', 'img/c03_platform.png');
        game.load.spritesheet('c03_larzac', 'img/c03_larzac.png', 19, 36);
        game.load.spritesheet('c03_oeuf', 'img/c03_oeuf.png', 32, 32);
        game.load.audio('c03_boing', 'audio/c03_boing.ogg');
        game.load.audio('c03_groink', 'audio/c03_groink.ogg');
        // Niveau 4 : cochons
        game.load.image('c04_background', 'img/c04_background.png');
        game.load.image('c04_chrono', 'img/c04_chrono.png');
        game.load.spritesheet('c04_pig', 'img/c04_pig.png', 64, 64, 12);
        // Niveau 8 : photobomb
        game.load.image('c08_background', 'img/c08_background.png');
        game.load.image('c08_maries', 'img/c08_maries.png');
        game.load.image('c08_mask', 'img/c08_mask.png');
        game.load.image('c08_a', 'img/c08_a.png');
        game.load.image('c08_b', 'img/c08_b.png');
        game.load.image('c08_c', 'img/c08_c.png');
        game.load.image('c08_d', 'img/c08_d.png');
        game.load.image('c08_e', 'img/c08_e.png');
        game.load.image('c08_f', 'img/c08_f.png');
        game.load.image('c08_g', 'img/c08_g.png');
        game.load.spritesheet('c08_bubble', 'img/c08_bubble.png', 64, 64, 12);
        game.load.audio('c08_photo', 'audio/c08_photo.ogg');
    },

    create : function() {
        game.state.start('train');
    }

};
