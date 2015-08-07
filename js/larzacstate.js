var larzacState = {

    // graphics constants

    playerSpeed : 200,

    larzacSpeed : 300,

    levelWidth : 2560,

    larzacUnchained : false,

    // utilities

    createPlatform : function(group, x, y, w, h) {
        var platform = group.create(x, y, null);
        game.physics.arcade.enable(platform);
        platform.body.setSize(w, h);
        platform.body.immovable = true;
        platform.body.allowGravity = false;
        return platform;
    },

    // phaser API implementation

    create : function() {
        game.world.setBounds(0, 0, this.levelWidth, 480);
        game.add.tileSprite(0, 0, this.levelWidth, 480, 'c03_level');
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 1500;
        
        // player
        this.player = game.add.sprite(20, 200, 'player');
        this.player.animations.add('moveRight', [0, 1], 10, true);
        this.player.animations.add('moveLeft', [0, 1], 10, true);
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        game.camera.follow(this.player);

        // larzac
        this.larzac = game.add.sprite(1010, 200, 'c03_larzac');
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

        // graphics (drawing dirtiness)
        this.graphics = game.add.graphics(0, 0);
        var wDirty = 600;
        this.dirtiness = createJauge(this.graphics, (GAME_WIDTH - wDirty) / 2, 8, wDirty, 32, 100);

        this.cursors = game.input.keyboard.createCursorKeys();
    },

    update : function() {
        // simple collisions
        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.larzac, this.platforms);
        
        // special collisions
        if (game.physics.arcade.intersects(this.player, this.larzac)) {
            this.dirtiness.setFill(this.dirtiness.fill + 2);
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
                this.larzac.body.velocity.x = random(diff + diff / 2, diff * 2);
                this.larzac.body.velocity.y = -random(250, 550);
            }
        } else if (this.player.body.x > 704) {
            this.larzacUnchained = true;
        }

        // player animation
        if (this.player.body.velocity.x > 0) {
            this.player.animations.play('moveRight');
        } else if (this.player.body.velocity.x < 0) {
            this.player.animations.play('moveLeft');
        } else {
            this.player.animations.stop();
            this.player.frame = 0;
        }

        // larzac animation
        if (this.larzac.body.velocity.x > 0) {
            this.larzac.frame = 1;
        } else if (this.larzac.body.velocity.x < 0) {
            this.larzac.frame = 0;
        }
    }

};
