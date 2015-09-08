var pirateState = {

    // graphics constants

    playerSpeed : 200,

    levelWidth : 3840,

    deadAnim : false,

    // utilities
    
    startDeadAnim : function() {
        this.deadAnim = true;
        this.player.animations.stop();
        this.player.frame = 16;
        this.player.body.immovable = true;
        this.player.body.allowGravity = false;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.sound.gameover.play();
        game.time.events.add(Phaser.Timer.HALF * 3, function() {
            this.player.body.immovable = false;
            this.player.body.allowGravity = true;
            this.player.body.velocity.y = -400;
        }, this);
    },

    createPlatform : function(group, x, y, w, h, spriteName, fix) {
        var platform = group.create(x, y, spriteName);
        platform.crop(new Phaser.Rectangle(0, 0, w, h));
        game.physics.arcade.enable(platform);
        platform.body.setSize(w, h);
        platform.body.immovable = true;
        if (!fix) {
            platform.originY = y;
        }
        platform.body.allowGravity = false;
        return platform;
    },

    movingPlatform : function(platform, vertical) {
        if (vertical) {
            platform.body.velocity.y = -100;
        } else {
            platform.body.velocity.x = 100;
        }
        platform.ascending = true;
        return platform;
    },

    // phaser API implementation

    create : function() {
        game.world.setBounds(0, 0, this.levelWidth, GAME_HEIGHT);
        game.add.tileSprite(0, 0, this.levelWidth, GAME_HEIGHT, 'c07_background');
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 1000;
        
        // player
        this.player = loadPlayer(20, 200, game.physics.arcade);
        this.player.body.collideWorldBounds = false;
        this.player.body.setSize(20, 42, 0, -4);
        game.camera.follow(this.player);

        // floor & platforms
        this.platforms = game.add.group();
        this.fallingPlatforms = game.add.group();
        this.createPlatform(this.platforms, 0, 380, 120, 100, 'c07_floor', true);
        this.createPlatform(this.platforms, 200, 380, 160, 100, 'c07_floor', true);
        this.createPlatform(this.platforms, 460, 380, 180, 100, 'c07_floor', true);
        this.createPlatform(this.platforms, 810, 380, 70, 100, 'c07_floor', true);
        this.createPlatform(this.platforms, 1050, 380, 150, 100, 'c07_floor', true);
        this.createPlatform(this.platforms, 1320, 380, 80, 100, 'c07_floor', true);
        this.createPlatform(this.fallingPlatforms, 1480, 356, 80, 24, 'c07_platform', false);
        this.createPlatform(this.fallingPlatforms, 1640, 356, 80, 24, 'c07_platform', false);
        this.createPlatform(this.fallingPlatforms, 1800, 356, 80, 24, 'c07_platform', false);
        this.createPlatform(this.platforms, 2020, 380, 160, 100, 'c07_floor', true);
        this.createPlatform(this.fallingPlatforms, 2340, 356, 80, 24, 'c07_platform', false);
        this.vp1 = this.movingPlatform(this.createPlatform(this.platforms, 2580, 356, 80, 24, 'c07_platform', true), true);
        this.hp = this.movingPlatform(this.createPlatform(this.platforms, 2740, 356, 80, 24, 'c07_platform', true), false);
        this.vp2 = this.movingPlatform(this.createPlatform(this.platforms, 3060, 356, 80, 24, 'c07_platform', true), true);
        this.createPlatform(this.platforms, 3280, 380, 80, 100, 'c07_floor', true);
        this.createPlatform(this.fallingPlatforms, 3360, 356, 80, 24, 'c07_platform', false);
        this.createPlatform(this.fallingPlatforms, 3440, 256, 80, 24, 'c07_platform', false);
        this.createPlatform(this.fallingPlatforms, 3520, 156, 80, 24, 'c07_platform', false);
        this.createPlatform(this.fallingPlatforms, 3600, 256, 80, 24, 'c07_platform', false);
        this.createPlatform(this.fallingPlatforms, 3680, 356, 80, 24, 'c07_platform', false);
        this.createPlatform(this.platforms, 3760, 380, 80, 100, 'c07_floor', true);

        // enemies
        this.enemies = game.add.group();

        // fallingPlatformKiller
        this.fpk = game.add.sprite(0, GAME_HEIGHT + 200, null);
        game.physics.arcade.enable(this.fpk);
        this.fpk.body.setSize(this.levelWidth, 400);
        this.fpk.body.allowGravity = false;
        this.fpk.body.immovable = true;

        // messageWindow
        this.windowGraphics = game.add.graphics(0, 0);
        this.missionWindow = createWindow(this.windowGraphics, 0, 0, GAME_WIDTH, 64);
        this.missionWindow.setText("Rejoignez l'île des pirates (gauche, droite, haut pour sauter)");
        this.bubbleGraphics = game.add.graphics(0, 0);

        // graphics (drawing dirtiness)
        this.dirtiness = createJauge(game.add.graphics(0, 0), (GAME_WIDTH - 600) / 2, 72, 600, 32, 100, "Niveau de salissure");

        // audio
        this.sound.gameover = game.add.audio('c07_gameover');

        this.cursors = game.input.keyboard.createCursorKeys();
    },

    update : function() {
        // simple collisions
        if (!this.deadAnim) {
            game.physics.arcade.collide(this.player, this.platforms);
            game.physics.arcade.collide(this.player, this.fallingPlatforms, function(p, fp) {
                fp.body.velocity.y = 160;
            }, null, this);
        }
        game.physics.arcade.collide(this.fpk, this.fallingPlatforms, function(fpk, fp) {
            fp.body.velocity.y = 0;
            fp.y = fp.originY;
        }, null, this);

        // special collisions

        // platform movement
        if (this.vp1.ascending && this.vp1.y < 256 || !this.vp1.ascending && this.vp1.y > 356) {
            this.vp1.body.velocity.y *= -1;
            this.vp1.ascending = !this.vp1.ascending;
        }
        if (this.vp2.ascending && this.vp2.y < 256 || !this.vp2.ascending && this.vp2.y > 356) {
            this.vp2.body.velocity.y *= -1;
            this.vp2.ascending = !this.vp2.ascending;
        }
        if (!this.hp.ascending && this.hp.x < 2740 || this.hp.ascending && this.hp.x > 2900) {
            this.hp.body.velocity.x *= -1;
            this.hp.ascending = !this.hp.ascending;
        }

        // player movement
        this.player.body.velocity.x = 0;
        if (!this.deadAnim) {
            if (this.cursors.up.isDown && this.player.body.touching.down) {
                this.player.body.velocity.y = -500;
            }
            if (this.cursors.right.isDown) {
                this.player.body.velocity.x += this.playerSpeed;
            }
            if (this.cursors.left.isDown) {
                this.player.body.velocity.x -= this.playerSpeed;
            }
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
        } else if (!this.deadAnim) {
            this.player.animations.stop();
            this.player.frame = this.player.lastDir || 8;
        }

        if (this.deadAnim) {
            if (this.player.y - 2 * this.player.height > GAME_HEIGHT) {
                this.player.x = 20;
                this.player.y = 200;
                this.deadAnim = false;
                this.player.body.velocity.y = 0;
            }
        } else if (this.player.y > GAME_HEIGHT) {
            this.startDeadAnim();
        }
    }

};
