var trainState = {

    // graphic variables

    rightDir : 0,

    leftDir : 1,

    playerSpeed : 200,

    trainOriginFrame : [0, 3],

    trainOriginX : [-370, 640],

    trainOriginY : [256, 322, 388],

    trainArray : [null, null, null],

    // game scenario

    GO_TRAIN_1 : 0,
    PICK_TICKETS : 1,
    GO_TRAIN_2 : 2,
    COMPOST : 3,
    GO_TRAIN_3 : 4,

    currentStep : null,

    // utilities

    randomDirection : function() {
        if (Math.random() < 0.5) {
            return this.leftDir;
        }
        return this.rightDir;
    },

    randomTime : function(minQs, maxQs) {
        return Phaser.Timer.QUARTER * random(minQs, maxQs);
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
        train.body.immovable = true;
        train.body.setSize(370, 48);
    },

    // shortcut for similar sprite behaviours

    fixSpriteFactory : function(x, y, imgId, wHitBox /* optional */, hHitBox /* optional */, anchor /* optional */) {
        var decoration = this.mainGroup.create(x, y, imgId);
        decoration.anchor = anchor || { x : 0, y : 1 };
        game.physics.arcade.enable(decoration);
        decoration.body.immovable = true;
        if (wHitBox != undefined && hHitBox != undefined) {
            decoration.body.setSize(wHitBox, hHitBox);
        }
        return decoration;
    },

    // phaser API implementation

    create : function() {
        this.currentStep = this.GO_TRAIN_1;

        game.add.image(0, 140, 'c01_background_part2');

        game.physics.startSystem(Phaser.Physics.ARCADE);

        // north bound
        this.northBound = game.add.sprite(0, 0, 'c01_background_part1');
        game.physics.arcade.enable(this.northBound);
        this.northBound.body.immovable = true;

        // main group (contains all objects that are 'z'-ordered)
        this.mainGroup = game.add.group();

        // post (for the tickets)
        this.post = this.fixSpriteFactory(16, 470, 'c01_post', 15, 17);
        this.post.callback = function() {
            if (this.currentStep == this.COMPOST) {
                this.currentStep = this.GO_TRAIN_3;
            }
        };

        // benches (for beautifulity)
        this.bench1 = this.fixSpriteFactory(40, 474, 'c01_bench', 65, 15);
        this.bench2 = this.fixSpriteFactory(538, 474, 'c01_bench', 65, 15, { x : 1, y : 1});
        this.bench3 = this.fixSpriteFactory(568, 474, 'c01_bench', 65, 15);

        // chef de gare
        this.gareLeader = this.fixSpriteFactory(420, 188, 'c01_chef_de_gare');
        this.gareLeader.animations.add('move', [0, 1], 5, true);
        this.gareLeader.play('move');

        // moustachman
        this.moustachMan = this.fixSpriteFactory(538, 450, 'c01_moustachman');
        this.moustachMan.frame = 1;
        this.moustachMan.animations.add('moveBottom', [0, 1, 2, 3], 10, true);
        this.moustachMan.animations.add('moveLeft', [4, 5, 6, 7], 10, true);

        // blondie
        this.blondie = this.fixSpriteFactory(10, 440, 'c01_blondie');
        this.blondie.frame = 1;
        this.blondie.animations.add('moveBottom', [0, 1, 2, 3], 10, true);
        this.blondie.animations.add('moveRight', [4, 5, 6, 7], 10, true);

        // player physics & sprite
        this.player = loadPlayer(GAME_WIDTH / 2, GAME_HEIGHT, game.physics.arcade, this.mainGroup);

        // tickets physics & sprite
        this.tickets = this.fixSpriteFactory(539, 476, 'c01_tickets');
        this.tickets.animations.add('rotate', [0, 1, 2, 3, 2, 1], 10, true);
        this.tickets.play('rotate');
        this.tickets.callback = function() {
            this.tickets.kill();
            this.currentStep = this.GO_TRAIN_2;
        };

        // event boxes = contact triggers a scenario event
        this.trainZoneOK = this.fixSpriteFactory(0, 160, null, GAME_WIDTH, 160);
        this.trainZoneOK.callback = function() {
            if (this.currentStep == this.GO_TRAIN_1) {
                messageBubble(this.bubbleGraphics, 434, 156, "Vous n'avez pas de tickets !", 'right');
                this.moustachMan.animations.play('moveLeft');
                this.moustachMan.body.velocity.x = -30;
                this.currentStep = this.PICK_TICKETS;
            } else if (this.currentStep == this.GO_TRAIN_2) {
                messageBubble(this.bubbleGraphics, 434, 156, "Voyons, il faut composter vos billets !", 'left');
                this.blondie.animations.play('moveRight');
                this.blondie.body.velocity.x = 30;
                this.currentStep = this.COMPOST;
            } else if (this.currentStep == this.GO_TRAIN_3) {
                messageBubble(this.bubbleGraphics, 434, 156, "Embarquement !", 'center');
                this.missionWindow.setText('Bravo vous êtes montés dans le train à temps !');
                game.time.events.add(Phaser.Timer.SECOND * 2, function() {
                    game.state.start('larzac');
                });
            }
        };

        // train killer sprite (offscreen)
        // when a train hits this sprite, it is killed (= it is out of the screen)
        this.trainKillers = game.add.group();
        var leftTrainKiller = this.trainKillers.create(this.trainOriginX[this.rightDir] - 8, 0, null);
        var rightTrainKiller = this.trainKillers.create(this.trainOriginX[this.leftDir] - this.trainOriginX[this.rightDir] + 8, 0, null);
        game.physics.arcade.enable(leftTrainKiller);
        game.physics.arcade.enable(rightTrainKiller);
        leftTrainKiller.body.immovable = true;
        leftTrainKiller.body.setSize(4, GAME_HEIGHT);
        rightTrainKiller.body.immovable = true;
        rightTrainKiller.body.setSize(4, GAME_HEIGHT);

        game.time.events.add(this.randomTime(0, 2), this.popTrain, this, 0, this.randomDirection(), random(200, 400));
        game.time.events.add(this.randomTime(0, 2), this.popTrain, this, 1, this.randomDirection(), random(200, 400));
        game.time.events.add(this.randomTime(0, 2), this.popTrain, this, 2, this.randomDirection(), random(200, 400));

        this.cursors = game.input.keyboard.createCursorKeys();
        
        // graphics (to draw things directly, e.g. message bubbles)
        this.windowGraphics = game.add.graphics(0, 0);
        this.missionWindow = createWindow(this.windowGraphics, 0, 0, GAME_WIDTH, 64);
        this.missionWindow.setText("Allez rejoindre votre train ! (flèches pour se déplacer)");
        this.bubbleGraphics = game.add.graphics(0, 0);
        messageBubble(this.bubbleGraphics, 434, 156, 'Bonjour à tous !');
    },

    update : function() {
        // make sure the objects are sorted by their 'y' position (for beautiful display)
        this.mainGroup.sort('y', Phaser.Group.SORT_ASCENDING);

        // standard collisions
        game.physics.arcade.collide(this.player, this.northBound);
        game.physics.arcade.collide(this.player, this.bench1);
        game.physics.arcade.collide(this.player, this.bench2);
        game.physics.arcade.collide(this.player, this.bench3);
        game.physics.arcade.collide(this.player, this.gareLeader);
        game.physics.arcade.collide(this.player, this.moustachMan);
        game.physics.arcade.collide(this.player, this.blondie);

        // collisions with special behaviours
        game.physics.arcade.collide(this.player, this.tickets, this.tickets.callback, null, this);
        game.physics.arcade.collide(this.player, this.post, this.post.callback, null, this);
        if (this.currentStep == this.GO_TRAIN_1 || this.currentStep == this.GO_TRAIN_2 || this.currentStep == this.GO_TRAIN_3) {
            game.physics.arcade.collide(this.player, this.trainZoneOK, this.trainZoneOK.callback, null, this);
        }
        for (var i = 0; i < this.trainArray.length; i++) {
            game.physics.arcade.collide(this.trainArray[i], this.player, function(train, player) {
                player.kill();
            }, null, this);
            game.physics.arcade.overlap(this.trainArray[i], this.trainKillers, function(train) {
                game.time.events.add(this.randomTime(2, 6), this.popTrain, this, train.lineId, this.randomDirection(), random(200, 400));
                train.kill();
            }, null, this);
        }

        // animations check
        if (this.moustachMan.body.x < GAME_WIDTH / 2) {
            this.moustachMan.body.velocity.x = 0;
            this.moustachMan.body.velocity.y = 30;
            this.moustachMan.animations.play('moveBottom');
            this.moustachMan.body.x = GAME_WIDTH / 2;
        } else if (this.moustachMan.body.y > GAME_HEIGHT) {
            this.moustachMan.kill();
        }
        if (this.blondie.body.x > GAME_WIDTH / 2) {
            this.blondie.body.velocity.x = 0;
            this.blondie.body.velocity.y = 30;
            this.blondie.animations.play('moveBottom');
            this.blondie.body.x = GAME_WIDTH / 2;
        } else if (this.blondie.body.y > GAME_HEIGHT) {
            this.blondie.kill();
        }

        // player movement
        var moving = false;
        this.player.body.velocity = { x : 0, y : 0 };

        if (this.cursors.down.isDown) {
            this.player.body.velocity.y = this.playerSpeed;
            this.player.animations.play('moveDown');
            this.player.lastDir = 0;
            moving = true;
        } else if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -this.playerSpeed;
            this.player.animations.play('moveUp');
            this.player.lastDir = 12;
            moving = true;
        }

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -this.playerSpeed;
            if (this.player.body.velocity.y == 0) {
                this.player.animations.play('moveLeft');
                this.player.lastDir = 4;
            }
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = this.playerSpeed;
            if (this.player.body.velocity.y == 0) {
                this.player.animations.play('moveRight');
                this.player.lastDir = 8;
            }
            moving = true;
        }

        if (!moving) {
            this.player.animations.stop();
            this.player.frame = this.player.lastDir || 0;
        }
    }

};
