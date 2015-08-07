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
        return Phaser.Timer.QUARTER * this.random(minQs, maxQs);
    },

    random : function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    drawWindow : function(g, x, y, w, h) {
        // g = graphics object
        g.lineStyle(4, 0x000000, 0.9);
        g.beginFill(0xddddff, 0.9);
        g.drawRoundedRect(x, y, w, h, 4);
        g.endFill();
        return {
            xCoord : x,
            yCoord : y,
            width : w,
            height : h,
            setText : function(text) {
                if (this.text != null) {
                    this.text.kill();
                }
                this.text = game.add.text(this.xCoord, this.yCoord, text, { font: "18px Arial", fill: "black", align: "center", boundsAlignH: "center", boundsAlignV: "middle" });
                this.text.setTextBounds(this.xCoord, this.yCoord, this.width, this.height);
            }
        };
    },

    createBubbleGraphics : function() {
        return {
            graphics : game.add.graphics(0, 0),
            text : null
        };
    },

    messageBubble : function(g, x, y, msg, position) {
        // x, y = position of the bubble's arrow bottom point (= top of the speaking character)
        // position = 'right' (default), 'left' or 'center'
        position = position || 'right'; // position of the bubble relatively to arrow

        var text = new Phaser.Text(game, 0, 0, msg, { font: "18px Arial" }); // only to have text size
        var arrow = null;
        y -= 28; // bubble is above the speaker
        if (position == 'right') {
            arrow = [x + 16, y - 3, x + 8, y + 18, x + 32, y - 2];
            x += text.width / 4;
        } else if (position == 'left') {
            arrow = [x - 16, y - 3, x - 8, y + 18, x - 32, y - 2];
            x -= text.width / 4;
        } else { // center
            arrow = [x - 8, y - 2, x, y + 18, x + 8, y - 1];
        }
        var ellipseOriginY = y - text.height;
        g.graphics.clear();
        g.graphics.lineStyle(2, 0x000000);
        g.graphics.beginFill(0xffffff);
        g.graphics.drawEllipse(x, ellipseOriginY, 2 * text.width / 3, text.height);
        g.graphics.endFill();
        g.graphics.lineStyle(null);
        g.graphics.beginFill(0xffffff);
        g.graphics.drawPolygon(arrow);
        g.graphics.endFill();
        g.graphics.lineStyle(2, 0x000000);
        g.graphics.drawPolygon(arrow);
        if (g.text != null) {
            g.text.kill();
        }
        g.text = game.add.text(x - text.width / 2, ellipseOriginY + 2 - text.height / 2, msg, { font: "18px Arial", fill: "black", align: "center" });
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
        train.body.immovable = true;
        train.body.setSize(370, 48);
    },

    fixSpriteFactory : function(x, y, imgId, wHitBox /* optional */, hHitBox /* optional */) {
        var decoration = this.mainGroup.create(x, y, imgId);
        decoration.anchor = {x : 0, y : 1};
        game.physics.arcade.enable(decoration);
        decoration.body.immovable = true;
        if (wHitBox != null && hHitBox != null) {
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
        this.post = this.fixSpriteFactory(24, 450, 'c01_post', 15, 17);

        // benches (for beautifulity)
        this.bench1 = this.fixSpriteFactory(120, 474, 'c01_bench', 65, 15);
        this.bench2 = this.fixSpriteFactory(440, 474, 'c01_bench', 65, 15);
        this.bench3 = this.fixSpriteFactory(568, 474, 'c01_bench', 65, 15);

        // chef de gare
        this.gareLeader = this.fixSpriteFactory(420, 188, 'c01_chef_de_gare');
        this.gareLeader.animations.add('move', [0, 1], 5, true);
        this.gareLeader.play('move');

        // moustachman
        this.moustachMan = this.fixSpriteFactory(520, 438, 'c01_moustachman');
        this.moustachMan.frame = 1;
        this.moustachMan.animations.add('moveBottom', [0, 1, 2, 3], 10, true);
        this.moustachMan.animations.add('moveLeft', [4, 5, 6, 7], 10, true);

        // player physics & sprite
        this.player = this.mainGroup.create((GAME_WIDTH - 48) / 2, GAME_HEIGHT, 'player');
        this.player.animations.add('move', [1, 0], 10, true);
        this.player.anchor = {x : 0, y : 1};
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(48, 32); // player hitbox

        // tickets physics & sprite
        this.tickets = this.fixSpriteFactory(514, 476, 'c01_tickets');
        this.tickets.animations.add('rotate', [0, 1, 2, 3, 2, 1], 10, true);
        this.tickets.play('rotate');

        // event boxes = contact triggers a scenario event
        this.trainZoneOK = this.fixSpriteFactory(0, 160, null, GAME_WIDTH, 160);
        this.trainZoneOK.callback = function() {
            this.messageBubble(this.bubbleGraphics, 434, 156, "Vous n'avez pas de tickets !", 'left');
        };

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
        
        // graphics (to draw things directly, e.g. message bubbles)
        this.windowGraphics = game.add.graphics(0, 0);
        this.missionWindow = this.drawWindow(this.windowGraphics, 0, 0, GAME_WIDTH, 64);
        this.missionWindow.setText("Allez rejoindre votre train ! (flèches pour se déplacer)");
        this.bubbleGraphics = this.createBubbleGraphics();
        this.messageBubble(this.bubbleGraphics, 434, 156, 'Bonjour à tous !');
    },

    update : function() {
        // make sure the objects are sorted by their 'y' position (for beautiful display)
        this.mainGroup.sort('y', Phaser.Group.SORT_ASCENDING);

        // standard collisions
        game.physics.arcade.collide(this.player, this.northBound);
        game.physics.arcade.collide(this.player, this.tickets);
        game.physics.arcade.collide(this.player, this.bench1);
        game.physics.arcade.collide(this.player, this.bench2);
        game.physics.arcade.collide(this.player, this.bench3);
        game.physics.arcade.collide(this.player, this.post);
        game.physics.arcade.collide(this.player, this.gareLeader);

        // collisions with special behaviours
        if (this.currentStep == this.GO_TRAIN_1 || this.currentStep == this.GO_TRAIN_2 || this.currentStep == this.GO_TRAIN_3) {
            game.physics.arcade.collide(this.player, this.trainZoneOK, this.trainZoneOK.callback, null, this);
        }
        for (var i = 0; i < this.trainArray.length; i++) {
            game.physics.arcade.collide(this.trainArray[i], this.player, function(train, player) {
                player.kill();
            }, null, this);
            game.physics.arcade.collide(this.trainArray[i], this.trainKillers, function(train) {
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
