var trainState = {

    rightDir : 0,

    leftDir : 1,

	playerSpeed : 200,

    trainOriginFrame : [0, 3],

    trainOriginX : [-370, 640],

	trainOriginY : [256, 322, 388],

	trainArray : [null, null, null],

	// utilities

    randomDirection : function() {
        if (Math.random() < 0.5) {
            return this.leftDir;
        }
        return this.rightDir;
    },

	randomTime : function(minQs, maxQs) {
		return Phaser.Timer.QUARTER * this.random(minQs, maxQs);
	},

	random : function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	// collision callbacks

	ticketCollect : function() {
		this.tickets.kill();
	},

	argh : function() {
		this.player.kill();
	},

	// create a new train

	popTrain : function(trainLine, direction, speed) {
        var originFrame = this.trainOriginFrame[direction];
		var train = this.mainGroup.create(this.trainOriginX[direction], this.trainOriginY[trainLine], 'c01_train', originFrame);
        train.animations.add('move', [originFrame, originFrame + 2, originFrame + 1], 10, true);
		train.animations.play('move');
		train.lineId = trainLine;
        train.anchor = {x : 0, y : 1};
        this.trainArray[trainLine] = train;
		
        game.physics.arcade.enable(train);
        train.body.velocity.x = (direction == this.leftDir) ? -speed : speed;
        train.body.setSize(370, 48);
	},

	// phaser API implementation

	create : function() {
		game.add.image(0, 140, 'c01_background_part2');

		game.physics.startSystem(Phaser.Physics.ARCADE);

		// north bound
		this.northBound = game.add.sprite(0, 0, 'c01_background_part1');
		game.physics.arcade.enable(this.northBound);
        this.northBound.body.immovable = true;

		// main group (contains all objects that are 'z'-ordered)
		this.mainGroup = game.add.group();
		
		// player physics & sprite
		this.player = this.mainGroup.create((GAME_WIDTH - 48) / 2, GAME_HEIGHT, 'player');
		this.player.animations.add('move', [1, 0], 10, true);
        this.player.anchor = {x : 0, y : 1};
		game.physics.arcade.enable(this.player);
		this.player.body.collideWorldBounds = true;
        this.player.body.setSize(48, 32); // player hitbox

		// tickets physics & sprite
		this.tickets = this.mainGroup.create(514, 476, 'c01_tickets');
		this.tickets.animations.add('rotate', [0, 1, 2, 3, 2, 1], 10, true);
		this.tickets.play('rotate');
        this.tickets.anchor = {x : 0, y : 1};
		game.physics.arcade.enable(this.tickets);
        this.tickets.body.immovable = true;

		// train killer sprite (offscreen)
		// when a train hits this sprite, it is killed (= it is out of the screen)
		this.trainKillers = game.add.group();
		var leftTrainKiller = this.trainKillers.create(this.trainOriginX[this.rightDir] - 8, 0, null);
		var rightTrainKiller = this.trainKillers.create(this.trainOriginX[this.leftDir] - this.trainOriginX[this.rightDir] + 8, 0, null);
		game.physics.arcade.enable(leftTrainKiller);
		game.physics.arcade.enable(rightTrainKiller);
		leftTrainKiller.body.setSize(4, GAME_HEIGHT);
		rightTrainKiller.body.setSize(4, GAME_HEIGHT);

		game.time.events.add(this.randomTime(0, 2), this.popTrain, this, 0, this.randomDirection(), this.random(200, 400));
		game.time.events.add(this.randomTime(0, 2), this.popTrain, this, 1, this.randomDirection(), this.random(200, 400));
		game.time.events.add(this.randomTime(0, 2), this.popTrain, this, 2, this.randomDirection(), this.random(200, 400));

		this.cursors = game.input.keyboard.createCursorKeys();
	},

	update : function() {
		// make sure the objects are sorted by their 'y' position (for beautiful display)
		this.mainGroup.sort('y', Phaser.Group.SORT_ASCENDING);
        
		// standard collisions
        game.physics.arcade.collide(this.player, this.northBound);
        game.physics.arcade.collide(this.player, this.tickets);
        // collisions with special behaviours
		for (var i = 0; i < this.trainArray.length; i++) {
            game.physics.arcade.overlap(this.trainArray[i], this.player, function(train, player) {
                player.kill();
            }, null, this);
			game.physics.arcade.overlap(this.trainArray[i], this.trainKillers, function(train) {
			    game.time.events.add(this.randomTime(2, 6), this.popTrain, this, train.lineId, this.randomDirection(), this.random(200, 400));
                train.kill();
            }, null, this);
		}

        // player movement
        var moving = false;
		this.player.body.velocity = { x : 0, y : 0 };

		if (this.cursors.down.isDown) {
			this.player.body.velocity.y = this.playerSpeed;
			moving = true;
		} else if (this.cursors.up.isDown) {
			this.player.body.velocity.y = -this.playerSpeed;
			moving = true;
		}

		if (this.cursors.left.isDown) {
			this.player.body.velocity.x = -this.playerSpeed;
			moving = true;
		} else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = this.playerSpeed;
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
