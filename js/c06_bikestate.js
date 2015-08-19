var bikeState = {

    // graphics

    playerSpeed : 200,

    levelHeight : 20000,

    cameraOffset : 0,

    playerLife : 100,

    // utilities

    createCar : function(direction) {
        var x = 320 + direction * 128 + random(0, 20) - random(0, 20);
        var y = this.player.y - 40 + direction * 480;
        var car = this.carGroup.create(x, y, 'c06_car' + random(1, 2));
        car.anchor = { x : 0.5, y : 0.5 };
        car.scale.y *= -direction;
        game.physics.arcade.enable(car);
        car.body.velocity.y = -direction * (450 + random(0, 150));
        car.body.immovable = true;
        car.direction = direction;
        if (direction == -1) {
            game.time.events.add(Phaser.Timer.HALF * random(2, 4), this.createCar, this, direction);
        } else {
            game.time.events.add(Phaser.Timer.HALF * random(4, 8), this.createCar, this, direction);
        }
        return car;
    },

    // phaser API implementation

    create : function() {
        game.world.setBounds(0, 0, GAME_WIDTH, this.levelHeight);
        this.road = game.add.tileSprite(0, 0, GAME_WIDTH, this.levelHeight, 'c06_background');
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // car
        this.carGroup = game.add.group();

        // player
        this.player = game.add.sprite(GAME_WIDTH / 2, this.levelHeight, 'c06_player');
        this.player.animations.add('move', [0, 1, 2, 3], 10, true);
        this.player.animations.add('moveFast', [0, 1, 2, 3], 15, true);
        this.player.animations.add('moveSlow', [0, 1, 2, 3], 5, true);
        this.player.anchor = {x : 0.5, y : 1};
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(26, 28, 0, -4);

        // car killer
        this.killerGroup = game.add.group();
        this.downKill = this.killerGroup.create(0, this.player.y + 800, null);
        game.physics.arcade.enable(this.downKill);
        this.downKill.body.immovable = true;
        this.downKill.body.setSize(GAME_WIDTH, 4);
        this.topKill = this.killerGroup.create(0, this.player.y - 800, null);
        game.physics.arcade.enable(this.topKill);
        this.topKill.body.immovable = true;
        this.topKill.body.setSize(GAME_WIDTH, 4);

        // audio
        this.sound.boing = game.add.audio('c03_boing');
        this.sound.groink = game.add.audio('c03_groink');
        this.sound.success = game.add.audio('success');

        // life
        this.life = createJauge(game.add.graphics(0, 0), (GAME_WIDTH - 600) / 2, 440, 600, 32, this.playerLife, "Vie", 0xee5544);
        this.life.setFill(this.playerLife);
        
        this.createCar(-1);
        this.createCar(1);

        this.cursors = game.input.keyboard.createCursorKeys();
    },

    update : function() {
        this.road.tilePosition.x = -1;
        this.downKill.y = this.player.y + 700;
        this.topKill.y = this.player.y - 800;

        game.physics.arcade.collide(this.carGroup);
        game.physics.arcade.collide(this.carGroup, this.player, function(car, player) {
            if (this.playerLife > 0) {
                this.playerLife--;
            }
            this.life.setFill(this.playerLife);
        }, null, this);
        game.physics.arcade.collide(this.carGroup, this.killerGroup, function(car) {
            car.kill();
        }, null, this);

        // player movement
        this.player.body.velocity.y = -this.playerSpeed;
        if (this.cursors.up.isDown) {
            this.player.body.velocity.y -= this.playerSpeed / 2;
        }
        if (this.cursors.down.isDown) {
            this.player.body.velocity.y += this.playerSpeed / 2;
        }
        this.player.body.velocity.x = 0;
        if (this.cursors.right.isDown) {
            this.player.body.velocity.x += this.playerSpeed;
        }
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= this.playerSpeed;
        }

        // player animation & camera
        if (this.player.body.velocity.y < -this.playerSpeed) {
            this.player.animations.play('moveFast');
            if (this.cameraOffset < 80) {
                this.cameraOffset += 2;
            }
        } else if (this.player.body.velocity.y > -this.playerSpeed) {
            this.player.animations.play('moveSlow');
            if (this.cameraOffset > -80) {
                this.cameraOffset -= 2;
            }
        } else {
            this.player.animations.play('move');
            if (this.cameraOffset > 0) {
                this.cameraOffset -= 2;
            } else if (this.cameraOffset < 0) {
                this.cameraOffset += 2;
            }
        }
        
        game.camera.y = this.player.body.y - 300 + this.cameraOffset;
    }

};
