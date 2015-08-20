var photobombState = {

    // scores

    currentLevel : 0,

    score : 0,

    finishedKeys : 0,

    levelModel : [
        {
            targetScore : 1, nbKeys : 1, timer : Phaser.Timer.SECOND * 20,
            bombX : 553, bombY : 219, bombName : 'c08_f', message : "Oh non, c'est raté !\nBon, on recommence !"
        },
        {
            targetScore : 3, nbKeys : 4, timer : Phaser.Timer.SECOND * 2,
            bombX : 134, bombY : 243, bombName : 'c08_g', message : "Zut... Encore raté...\nSortez du cadre, merci !"
        },
        {
            targetScore : 7, nbKeys : 10, timer : Phaser.Timer.QUARTER * 7,
            bombX : 511, bombY : 161, bombName : 'c08_a', message : "Ils commencent à m'énerver ceux-là..."
        },
        {
            targetScore : 10, nbKeys : 14, timer : Phaser.Timer.HALF * 3,
            bombX : 496, bombY : 159, bombName : 'c08_c', message : "Et pourtant, je prendrai cette photo !"
        },
        {
            targetScore : 15, nbKeys : 20, timer : Phaser.Timer.HALF * 3,
            bombX : 118, bombY : 213, bombName : 'c08_d', message : "   ...   "
        },
        {
            targetScore : 25, nbKeys : 30, timer : Phaser.Timer.SECOND,
            bombX : -24, bombY : 73, bombName : 'c08_b', message : "MAIS VOUS ALLEZ VOUS BARRER\nBANDE DE CONS !!!"
        },
        {
            targetScore : 50, nbKeys : 70, timer : Phaser.Timer.QUARTER * 3,
            bombX : 228, bombY : 353, bombName : 'c08_e', message : "Je... je... AAAAAAAAAAARGH !!!\n\nAdieu... je démissionne..."
        }
    ],

    // pop a random-key bubble

    popKey : function(duration, x, y) {
        var x = x || random(32, 608);
        var y = y || random(64, 448);
        var bubble = game.add.sprite(x, y, 'c08_bubble');
        bubble.anchor = { x : 0.5, y : 0.5 };
        bubble.animations.add('appear', [0, 1, 2, 3], 30, false);
        bubble.animations.add('disappear', [3, 2, 1, 0], 30, false);
        bubble.animations.add('disappearOK', [7, 6, 5, 4], 30, false);
        bubble.animations.add('disappearKO', [11, 10, 9, 8], 30, false);
        bubble.animations.play('appear');
        var randomCharCode = random(0, 25);
        var randomChar = String.fromCharCode('A'.charCodeAt(0) + randomCharCode);
        var key = game.add.text(x, y + 4, randomChar, { font : "24px Arial", fill : "black", align : "center" });
        key.anchor = { x : 0.5, y : 0.5 };
        var fail = game.time.events.add(duration, function() {
            bubble.animations.play('disappearKO', null, false, true);
            key.kill();
            this.sound.failure.play();
            this.keys[randomCharCode].onDown.remove(callback, this);
            this.finishedKeys++;
            if (!this.isLevelOver()) {
                this.popKey(this.levelModel[this.currentLevel].timer);
            }
        }, this);
        var callback = function() {
            bubble.animations.play('disappearOK', null, false, true);
            key.kill();
            this.sound.success.play('', 0, 0.5);
            game.time.events.remove(fail);
            this.jauge.setFill(this.jauge.fill + 1);
            this.finishedKeys++;
            this.score++;
            if (!this.isLevelOver()) {
                this.popKey(this.levelModel[this.currentLevel].timer);
            }
        };
        this.keys[randomCharCode].onDown.addOnce(callback, this);
        return randomCharCode;
    },

    // phaser API implementation

    create : function() {
        this.background = game.add.image(0, 0, 'c08_background');
        this.maries = game.add.image(200, 200, 'c08_maries');
        this.mask = game.add.image(0, 0, 'c08_mask');
        this.foreground = game.add.graphics(0, 0);

        // introduction dialog programmation
        this.bubbleGraphics = game.add.graphics(0, 0);
        messageBubble(this.bubbleGraphics, 320, 480, 'Vous êtes prêts pour la photo ?', 'center');
        game.time.events.add(Phaser.Timer.SECOND * 2, function() {
            messageBubble(this.bubbleGraphics, 320, 480, 'Alors attention...', 'center');
        }, this);
        game.time.events.add(Phaser.Timer.SECOND * 3, function() {
            this.startLevel();
        }, this);

        this.keys = [
            game.input.keyboard.addKey(Phaser.Keyboard.A),
            game.input.keyboard.addKey(Phaser.Keyboard.B),
            game.input.keyboard.addKey(Phaser.Keyboard.C),
            game.input.keyboard.addKey(Phaser.Keyboard.D),
            game.input.keyboard.addKey(Phaser.Keyboard.E),
            game.input.keyboard.addKey(Phaser.Keyboard.F),
            game.input.keyboard.addKey(Phaser.Keyboard.G),
            game.input.keyboard.addKey(Phaser.Keyboard.H),
            game.input.keyboard.addKey(Phaser.Keyboard.I),
            game.input.keyboard.addKey(Phaser.Keyboard.J),
            game.input.keyboard.addKey(Phaser.Keyboard.K),
            game.input.keyboard.addKey(Phaser.Keyboard.L),
            game.input.keyboard.addKey(Phaser.Keyboard.M),
            game.input.keyboard.addKey(Phaser.Keyboard.N),
            game.input.keyboard.addKey(Phaser.Keyboard.O),
            game.input.keyboard.addKey(Phaser.Keyboard.P),
            game.input.keyboard.addKey(Phaser.Keyboard.Q),
            game.input.keyboard.addKey(Phaser.Keyboard.R),
            game.input.keyboard.addKey(Phaser.Keyboard.S),
            game.input.keyboard.addKey(Phaser.Keyboard.T),
            game.input.keyboard.addKey(Phaser.Keyboard.U),
            game.input.keyboard.addKey(Phaser.Keyboard.V),
            game.input.keyboard.addKey(Phaser.Keyboard.W),
            game.input.keyboard.addKey(Phaser.Keyboard.X),
            game.input.keyboard.addKey(Phaser.Keyboard.Y),
            game.input.keyboard.addKey(Phaser.Keyboard.Z)
        ];

        // jauge de score
        this.jauge = createJauge(game.add.graphics(0, 0), 4, 4, 632, 24, 1, 'Photobomb', 0x44dd44);

        // audio
        this.sound.photo = game.add.audio('c08_photo');
        this.sound.success = game.add.audio('success');
        this.sound.failure = game.add.audio('failure');
    },

    endLevel : function() {
        this.mask.alpha = 0;
        this.foreground.clear();
        var bomberSprite = null;
        if (this.score >= this.levelModel[this.currentLevel].targetScore) {
            bomberSprite = game.add.sprite(this.levelModel[this.currentLevel].bombX, this.levelModel[this.currentLevel].bombY, this.levelModel[this.currentLevel].bombName);
            game.world.bringToTop(this.bubbleGraphics);
            if (this.currentLevel == this.levelModel.length - 1) {
                game.time.events.add(Phaser.Timer.SECOND * 3, function() {
                    messageBubble(this.bubbleGraphics, 320, 480, this.levelModel[this.levelModel.length - 1].message, 'center');
                    game.time.events.add(Phaser.Timer.SECOND * 3, function() {
                        game.state.start('train');
                    }, this);
                }, this);
            } else {
                messageBubble(this.bubbleGraphics, 320, 480, this.levelModel[this.currentLevel].message, 'center');
            }
        } else {
            messageBubble(this.bubbleGraphics, 320, 480, 'Quelle belle photo !', 'center');
        }
        this.currentLevel++;
        this.finishedKeys = 0;
        this.score = 0;
        game.time.events.add(Phaser.Timer.SECOND * 4, function() {
            clearMessageBubble(this.bubbleGraphics);
            if (bomberSprite != null) {
                bomberSprite.kill();
            }
            if (this.currentLevel < this.levelModel.length) {
                this.startLevel();
            }
        }, this);
    },

    startLevel : function() {
        this.mask.alpha = 1;
        this.jauge.setFill(0);
        this.jauge.max = this.levelModel[this.currentLevel].targetScore;
        messageBubble(this.bubbleGraphics, 320, 480, 'Souriez !!!', 'center');
        game.time.events.add(Phaser.Timer.SECOND * 1, function() {
            clearMessageBubble(this.bubbleGraphics);
            this.sound.photo.play();
            this.foreground.beginFill(0x000000);
            this.foreground.drawRect(0, 0, 640, 480);
            this.foreground.endFill();
            this.popKey(this.levelModel[this.currentLevel].timer);
        }, this);
    },

    isLevelOver : function() {
        return this.finishedKeys == this.levelModel[this.currentLevel].nbKeys || this.score >= this.levelModel[this.currentLevel].targetScore;
    },

    update : function() {
        if (this.currentLevel < this.levelModel.length && this.isLevelOver()) {
            this.endLevel();
        }
    }

};
