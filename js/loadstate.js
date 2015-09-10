var loadState = {

    preload : function() {
        game.add.text(80, 150, 'Chargement en cours...',{ font : '30px serif', fill : '#ffffff' });
        game.load.spritesheet('player', 'img/player.png', 64, 64, 20);
        game.load.audio('success', 'audio/success.ogg');
        game.load.audio('failure', 'audio/failure.ogg');
        game.load.audio('transition', 'audio/transition.ogg');
        // Transitions
        game.load.image('01t1', 'img/transitions/c00_t_01.png');
        game.load.image('01t2', 'img/transitions/c00_t_02.png');
        game.load.image('01t3', 'img/transitions/c00_t_03.png');
        game.load.image('01t4', 'img/transitions/c00_t_04.png');
        game.load.image('01t5', 'img/transitions/c00_t_05.png');
        game.load.audio('intro1', 'audio/intro1.ogg');
        game.load.audio('intro2', 'audio/intro2.ogg');
        game.load.audio('intro3', 'audio/intro3.ogg');
        
        game.load.image('02t1', 'img/transitions/c01_t_01.png');
        game.load.image('02t2', 'img/transitions/c01_t_02.png');
        game.load.image('02t3', 'img/transitions/c01_t_03.png');
        game.load.image('02t4', 'img/transitions/c01_t_04.png');
        game.load.image('02t5', 'img/transitions/c01_t_05.png');
        
        game.load.image('03t1', 'img/transitions/c02_t_01.png');
        game.load.image('03t2', 'img/transitions/c02_t_02.png');
        
        game.load.image('04t1', 'img/transitions/c05_t_01.png');
        
        game.load.image('05t1', 'img/transitions/c06_t_01.png');
        
        game.load.image('08t1', 'img/transitions/c08_t_01.png');
        game.load.image('08t2', 'img/transitions/c08_t_02.png');
        game.load.image('08t3', 'img/transitions/c08_t_03.png');
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
        game.load.audio('c01_music', 'audio/c01_music.ogg');
        game.load.audio('c01_shock', 'audio/c01_shock.ogg');
        // Niveau 3 : larzac
        game.load.image('c03_level', 'img/c03_level.png');
        game.load.image('c03_platform', 'img/c03_platform.png');
        game.load.spritesheet('c03_larzac', 'img/c03_larzac.png', 19, 36);
        game.load.spritesheet('c03_oeuf', 'img/c03_oeuf.png', 32, 32);
        game.load.audio('c03_boing', 'audio/c03_boing.ogg');
        game.load.audio('c03_groink', 'audio/c03_groink.ogg');
        // Niveau 4 : cochons
        game.load.image('c04_background', 'img/c04_background.png');
        game.load.image('c04_chrono', 'img/c04_chrono.png');
        game.load.spritesheet('c04_pig', 'img/c04_pig.png', 64, 64, 12);
        // Niveau 5 : musique
        game.load.image('c05_background', 'img/c05_background.png');
        game.load.image('c05_gkey', 'img/c05_gkey.png');
        game.load.image('c05_ok', 'img/c05_ok.png');
        game.load.json('tetris', 'js/tetris.json');
        // Niveau 6 : route
        game.load.image('c06_background', 'img/c06_background.png');
        game.load.image('c06_car1', 'img/c06_car1.png');
        game.load.image('c06_car2', 'img/c06_car2.png');
        game.load.image('c06_meme', 'img/c06_meme.png');
        game.load.spritesheet('c06_goat', 'img/c06_goat.png', 101, 96);
        game.load.spritesheet('c06_player', 'img/c06_player.png', 64, 64);
        // Niveau 7 : ile aux pirates
        game.load.image('c07_background', 'img/c07_background.png');
        game.load.image('c07_floor', 'img/c07_floor.png');
        game.load.image('c07_platform', 'img/c07_platform.png');
        game.load.spritesheet('c07_croco', 'img/c07_croco.png', 48, 88);
        game.load.spritesheet('c07_sealion', 'img/c07_sealion.png', 135, 95);
        game.load.audio('c07_gameover', 'audio/c07_gameover.ogg');
        game.load.audio('c07_clear', 'audio/c07_clear.ogg');
        game.load.audio('c07_music', 'audio/c07_music.ogg');
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
        // Niveau 11 : terminator
        game.load.image('c11_background', 'img/c11_background.png');
        game.load.image('c11_background2', 'img/c11_background2.png');
        game.load.spritesheet('c11_castle1', 'img/c11_castle_01.png', 104, 77);
        game.load.spritesheet('c11_castle2', 'img/c11_castle_02.png', 133, 137);
        game.load.spritesheet('c11_castle3', 'img/c11_castle_03.png', 160, 212);
        game.load.spritesheet('c11_castle4', 'img/c11_castle_04.png', 287, 262);
        game.load.spritesheet('c11_walking', 'img/c11_intro_walking.png', 150, 300);
        game.load.spritesheet('c11_sit_talking', 'img/c11_sit_talking.png', 108, 175);
        game.load.spritesheet('c11_sit_playing', 'img/c11_sit_playing.png', 141, 175);
        game.load.spritesheet('c11_stage1', 'img/c11_stage_01.png', 363, 350);
        game.load.spritesheet('c11_stage2', 'img/c11_stage_02.png', 363, 350);
        game.load.spritesheet('c11_stage3', 'img/c11_stage_03.png', 363, 350);
        game.load.audio('c11_ding', 'audio/c11_ding.ogg');
        game.load.audio('c11_alarm', 'audio/c11_alarm.ogg');
        game.load.audio('c11_bug', 'audio/c11_bug.ogg');
        game.load.audio('c11_robot', 'audio/c11_robot.ogg');
        
        for (var i = 40; i < 80; i++) {
            T.soundfont.play(i, false);
        }
    },

    create : function() {
        game.state.start('pirate');
        //nextState('train', [
        //    { img : '01t1', music : 'intro1', text : "Au fin fond d'une bourgade\n      Perdue dans les montagnes,\nSe prévoyait une escapade\n      Vers la profonde campagne." },
        //    { img : '01t2', music : 'intro2', text : "Les gourgandins endormis\n      Furent alors soudain réveillés,\nPar un fort et vilain bruit\n      Emis d'un objet enchanté." },
        //    { img : '01t3', music : 'intro3' },
        //    { img : '01t4' },
        //], { img : '01t5', text : '~ Chapitre 1 ~\n      La Gare' });
    }

};
