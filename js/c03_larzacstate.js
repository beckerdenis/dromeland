var larzacState = {

    // graphics constants

    playerSpeed : 200,

    larzacSpeed : 300,

    levelWidth : 2560,

    larzacUnchained : false,

    // scenario

    GO_TO_THE_FARM_1 : 0,
    PICK_THE_EGG : 1,
    GO_TO_THE_FARM_2 : 2,
    SAY_HI_TO_THE_PIGS : 3,
    GO_TO_THE_FARM_3 : 4,

    currentStep : null,

    pigCount : 0,

    // utilities

    createPlatform : function(group, x, y, w, h, spriteName /* optional */) {
        var platform = group.create(x, y, spriteName || null);
        game.physics.arcade.enable(platform);
        platform.body.setSize(w, h);
        platform.body.immovable = true;
        platform.body.allowGravity = false;
        return platform;
    },

    // phaser API implementation

    create : function() {
        this.currentStep = this.GO_TO_THE_FARM_1;

        game.world.setBounds(0, 0, this.levelWidth, GAME_HEIGHT);
        game.add.tileSprite(0, 0, this.levelWidth, GAME_HEIGHT, 'c03_level');
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 1500;
        
        // player
        this.player = loadPlayer(20, 200, game.physics.arcade);
        this.player.body.setSize(20, 42, 0, -4);
        game.camera.follow(this.player);

        // larzac
        this.larzac = game.add.sprite(1010, 200, 'c03_larzac');
        this.larzac.animations.add('jumpLeft', [0, 1], 10, true);
        this.larzac.animations.add('jumpRight', [2, 3], 10, true);
        game.physics.arcade.enable(this.larzac);
        this.larzac.body.collideWorldBounds = true;
        this.larzac.body.bounce.set(0.9);

        // floor & platforms
        this.platforms = game.add.group();
        this.createPlatform(this.platforms, 0, 329, this.levelWidth, 8);
        this.createPlatform(this.platforms, 512, 298, 63, 34);
        this.createPlatform(this.platforms, 1184, 298, 63, 34);
        this.createPlatform(this.platforms, 1411, 300, 27, 30);
        this.createPlatform(this.platforms, 1796, 314, 124, 15);
        this.createPlatform(this.platforms, 1796, 304, 85, 10);
        this.createPlatform(this.platforms, 600, 255, 61, 30, 'c03_platform');
        this.createPlatform(this.platforms, 1222, 270, 61, 30, 'c03_platform');
        this.createPlatform(this.platforms, 1246, 301, 61, 30, 'c03_platform');

        // event zones
        this.farmZone = game.add.sprite(2290, 0, null);
        game.physics.arcade.enable(this.farmZone);
        this.farmZone.body.setSize(40, GAME_HEIGHT);
        this.farmZone.body.immovable = true;
        this.farmZone.body.allowGravity = false;

        this.pigs = game.add.group();
        var pig1 = this.pigs.create(1314, 286, null);
        game.physics.arcade.enable(pig1);
        pig1.body.setSize(69, 43);
        pig1.body.allowGravity = false;
        pig1.body.immovable = true;
        var pig2 = this.pigs.create(1958, 286, null);
        game.physics.arcade.enable(pig2);
        pig2.body.setSize(69, 43);
        pig2.body.allowGravity = false;
        pig2.body.immovable = true;

        // messageWindow
        this.windowGraphics = game.add.graphics(0, 0);
        this.missionWindow = createWindow(this.windowGraphics, 0, 0, GAME_WIDTH, 64);
        this.missionWindow.setText("Allez à la ferme (gauche/droite et haut pour sauter)");
        this.bubbleGraphics = game.add.graphics(0, 0);

        // graphics (drawing dirtiness)
        this.dirtiness = createJauge(game.add.graphics(0, 0), (GAME_WIDTH - 600) / 2, 72, 600, 32, 100, "Niveau de salissure");

        // audio
        this.sound.boing = game.add.audio('c03_boing');
        this.sound.groink = game.add.audio('c03_groink');
        this.sound.success = game.add.audio('success');

        this.cursors = game.input.keyboard.createCursorKeys();
    },

    update : function() {
        // simple collisions
        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.larzac, this.platforms);
        if (this.oeuf != undefined) {
            game.physics.arcade.collide(this.oeuf, this.platforms);
        }
        
        // special collisions
        if (this.currentStep == this.PICK_THE_EGG && game.physics.arcade.collide(this.player, this.oeuf)) {
            this.sound.success.play();
            this.oeuf.kill();
            this.currentStep = this.GO_TO_THE_FARM_2;
        }
        if (this.currentStep == this.SAY_HI_TO_THE_PIGS) {
            game.physics.arcade.collide(this.player, this.pigs, function(player, pig) {
                this.sound.groink.play();
                messageBubble(this.bubbleGraphics, pig.body.x + 40, pig.body.y, "Groink !!");
                pig.kill();
                this.pigCount++;
                if (this.pigCount == 2) {
                    this.currentStep = this.GO_TO_THE_FARM_3;
                }
            }, null, this);
        }
        if (game.physics.arcade.intersects(this.player.body, this.larzac.body)) {
            this.dirtiness.setFill(this.dirtiness.fill + 2);
        }
        if (game.physics.arcade.intersects(this.player.body, this.farmZone.body)) {
            if (this.currentStep == this.GO_TO_THE_FARM_1) {
                messageBubble(this.bubbleGraphics, 2416, 264, "Vous pouvez aller chercher l'oeuf ?\nIl devrait y en avoir un maintenant,\nprès de la voiture !", 'left');
                this.currentStep = this.PICK_THE_EGG;
                this.oeuf = game.add.sprite(200, 200, 'c03_oeuf');
                this.oeuf.animations.add('move', [0, 1], 5, true);
                this.oeuf.animations.play('move');
                game.physics.arcade.enable(this.oeuf);
            } else if (this.currentStep == this.GO_TO_THE_FARM_2) {
                messageBubble(this.bubbleGraphics, 2416, 264, "Ah, vous voulez voir les cochons ?\nAllez leur rendre visite alors !", 'left');
                this.currentStep = this.SAY_HI_TO_THE_PIGS;
            } else if (this.currentStep == this.GO_TO_THE_FARM_3) {
                messageBubble(this.bubbleGraphics, 2416, 264, "Venez, entrez !", 'left');
                this.missionWindow.setText("Bravo, vous avez atteint la ferme !");
                this.currentStep = -1;
                game.time.events.add(Phaser.Timer.SECOND * 2, function() {
                    nextState('pigs', [
                        { img : '03t1', music : 'transition', text : "Après l'entrée dans la demeure\n      Suite à une exclamation,\nIls ressortirent dans l'heure\n     Pour compter les cochons..." },
                    ], { img : '03t2', text : '~ Chapitre 3 ~\n      Comptage de Cochons' });
                }, this);
            }
        }

        // player movement
        this.player.body.velocity.x = 0;
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -500;
        }
        if (this.cursors.right.isDown) {
            this.player.body.velocity.x += this.playerSpeed;
        }
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= this.playerSpeed;
        }

        // larzac movement
        if (this.larzacUnchained) {
            if (this.larzac.body.touching.down) {
                var diff = this.player.body.x - this.larzac.body.x;
                this.larzac.body.velocity.x = random(9 * diff / 4, 11 * diff / 4);
                this.larzac.body.velocity.y = -random(300, 600);
                this.sound.boing.play('', 0, 40 / Math.max(40, Math.abs(diff)));
            }
        } else if (this.player.body.x > 704) {
            this.larzacUnchained = true;
        }

        // player animation
        if (this.player.body.velocity.x > 0) {
            this.player.animations.play('moveRight');
            this.player.body.setSize(16, 42, 2, -4);
            this.player.lastDir = 8;
        } else if (this.player.body.velocity.x < 0) {
            this.player.animations.play('moveLeft');
            this.player.body.setSize(16, 42, -2, -4);
            this.player.lastDir = 4;
        } else {
            this.player.animations.stop();
            this.player.frame = this.player.lastDir || 8;
        }

        // larzac animation
        if (this.larzac.body.velocity.x > 0) {
            this.larzac.animations.play('jumpRight');
        } else if (this.larzac.body.velocity.x < 0) {
            this.larzac.animations.play('jumpLeft');
        }
    }

};
