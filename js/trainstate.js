var trainState = {

    playerSpeed : 400,

	create : function() {
		game.add.image(0, 0, 'c01_background');

        game.physics.startSystem(Phaser.Physics.BOX2D);

    	this.player = game.add.sprite((GAME_WIDTH - 48) / 2, GAME_HEIGHT - 64, 'player');
        this.player.animations.add('move', [1, 0], 20, true);
        game.physics.box2d.enable(this.player);

        this.tickets = game.add.sprite(514, 440, 'c01_tickets');
        this.tickets.animations.add('rotate', [0, 1, 2, 3, 2, 1], 10, true);
        game.physics.box2d.enable(this.tickets);
        
        this.cursors = game.input.keyboard.createCursorKeys();
	},

	update : function() {
        var moving = false;
        this.tickets.animations.play('rotate');
		
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
            this.player.body.setZeroVelocity();
            this.player.animations.stop();
            this.player.frame = 0;
        }
	}

};
