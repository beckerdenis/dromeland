var trainState = {

    playerSpeed : 200,

    trainSpeed : 1000,

    // utilities

    randomTime : function() {
        var min = 2; // min 1/2 sec
        var max = 8; // max 2 sec
        return Phaser.Timer.QUARTER * Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // collision callbacks

    ticketCollect : function() {
        this.tickets.kill();
    },

    argh : function() {
        this.player.kill();
    },

    // pop the trains regularly

    popTrain : function(trainLine, direction, speed) {
        if (direction == 'left') {
            this.trains[trainLine].body.moveLeft(speed);
        } else {
            this.trains[trainLine].body.moveRight(speed);
        }
    },

    // phaser API implementation

	create : function() {
		game.add.image(0, 0, 'c01_background');

        game.physics.startSystem(Phaser.Physics.P2JS);

        // player physics & sprite
    	this.player = game.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT - 32, 'player');
        this.player.animations.add('move', [1, 0], 10, true);
        game.physics.p2.enable(this.player);
        this.player.body.fixedRotation = true;
        this.player.body.collideWorldBounds = true;

        // tickets physics & sprite
        this.tickets = game.add.sprite(536, 450, 'c01_tickets');
        this.tickets.animations.add('rotate', [0, 1, 2, 3, 2, 1], 10, true);
        this.tickets.play('rotate');
        game.physics.p2.enable(this.tickets);
        this.tickets.body.onBeginContact.add(this.ticketCollect, this);
        
        // trains physics & sprite & planification
        this.trains = [
            game.add.sprite(-200, 200, 'c01_train_right'),
            game.add.sprite(840, 260, 'c01_train_left'),
            game.add.sprite(-200, 320, 'c01_train_right')
        ];
        for (var i = 0; i < this.trains.length; i++) {
            game.physics.p2.enable(this.trains[i]);
            this.trains[i].fixedRotation = true;
            this.trains[i].body.collideWorldBounds = false;
            this.trains[i].body.onBeginContact.add(this.argh, this);
        }
        game.time.events.add(this.randomTime(), this.popTrain, this, 0, 'right', this.trainSpeed);
        game.time.events.add(this.randomTime(), this.popTrain, this, 1, 'left', this.trainSpeed);
        game.time.events.add(this.randomTime(), this.popTrain, this, 2, 'right', this.trainSpeed);

        this.cursors = game.input.keyboard.createCursorKeys();
	},

	update : function() {
        var moving = false;
		
        this.player.body.setZeroVelocity();
        
        if (this.cursors.down.isDown) {
            this.player.body.moveDown(this.playerSpeed);
            moving = true;
        } else if (this.cursors.up.isDown) {
            this.player.body.moveUp(this.playerSpeed);
            moving = true;
        }

        if (this.cursors.left.isDown) {
            this.player.body.moveLeft(this.playerSpeed);
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.player.body.moveRight(this.playerSpeed);
            moving = true;
        }

        if (moving) {
            this.player.animations.play('move');
        } else {
            this.player.animations.stop();
            this.player.frame = 0;
        }
	}

};
