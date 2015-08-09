var pigsState = {

    MAX_PIGS_ON_MAP : 10,

    pigsOnMap : 0,

    totalPigs : 0,

    pigLineFree : [],

    remainingTime : 20, // seconds

    count : 0,

    getFreeLine : function() {
        var rand;
        do {
            rand = random(0, this.MAX_PIGS_ON_MAP - 1);
        } while (!this.pigLineFree[rand]);
        this.pigLineFree[rand] = false;
        return rand;
    },

    createPig : function() {
        var pigSpeed = (random(0, 1) == 0 ? -1 : 1) * random(100, 300);
        var pigAnim = Math.round(Math.abs(pigSpeed) / 15);
        var pigLine = this.getFreeLine();
        var pig = this.pigGroup.create(pigSpeed < 0 ? 640 : -64, pigLine * Math.round(300 / (this.MAX_PIGS_ON_MAP - 1)), 'c04_pig');
        pig.animations.add('moveRight', [0, 1, 2, 3, 4, 5], pigAnim, true);
        pig.animations.add('moveLeft', [6, 7, 8, 9, 10, 11], pigAnim, true);
        game.physics.arcade.enable(pig);
        pig.body.velocity.x = pigSpeed;
        pig.animations.play(pigSpeed < 0 ? 'moveLeft' : 'moveRight');
        pig.line = pigLine;
        this.pigGroup.sort('y', Phaser.Group.SORT_ASCENDING);
        this.pigsOnMap++;
        this.totalPigs++;
        this.pigId = (this.pigId + 1) % this.MAX_PIGS_ON_MAP;
        return pig;
    },

    popNewPigs : function() {
        if (this.pigsOnMap >= this.MAX_PIGS_ON_MAP || this.remainingTime == 0) {
            return;
        }
        var nbNewPigs = random(1, Math.min(3, this.MAX_PIGS_ON_MAP - this.pigsOnMap));
        for (var i = 0; i < nbNewPigs; i++) {
            this.createPig();
        }
    },

    // phaser API implementation

    create : function() {
        for (var i = 0; i < this.MAX_PIGS_ON_MAP; i++) {
            this.pigLineFree[i] = true;
        }
        
        // audio
        this.sound.success = game.add.audio('success');
        this.sound.failure = game.add.audio('failure');
        this.sound.groink = game.add.audio('c03_groink');

        game.add.image(0, 0, 'c04_background');

        game.physics.startSystem(Phaser.Physics.ARCADE);

        // cochons
        this.pigGroup = game.add.group();
        this.popNewPigs();

        var chrono = game.add.image(640, 480, 'c04_chrono');
        chrono.anchor = { x : 1, y : 1 };

        // killer pig
        this.pigKillers = game.add.group();
        var leftPigKiller = this.pigKillers.create(-68, 0, null);
        game.physics.arcade.enable(leftPigKiller);
        leftPigKiller.body.immovable = true;
        leftPigKiller.body.setSize(4, 480);
        var rightPigKiller = this.pigKillers.create(708, 0, null);
        game.physics.arcade.enable(rightPigKiller);
        rightPigKiller.body.immovable = true;
        rightPigKiller.body.setSize(4, 480);

        // chrono text
        this.chronoText = game.add.text(480, 315, this.remainingTime, { font : '40px Arial', fill : 'black', boundsAlignH : 'center' });
        this.chronoText.setTextBounds(0, 0, 48, 40);
        var secTrigger = function() {
            this.remainingTime--;
            this.chronoText.setText(this.remainingTime);
            if (this.remainingTime > 0) {
                game.time.events.add(Phaser.Timer.SECOND, secTrigger, this);
            }
        };
        game.time.events.add(Phaser.Timer.SECOND, secTrigger, this);

        // counter
        this.counterWindow = createWindow(game.add.graphics(0, 0), 8, 424, 200, 48);
        this.counterWindow.setText('Décompte : ' + this.count);

        var cursors = game.input.keyboard.createCursorKeys();
        cursors.up.onDown.add(function() {
            if (this.remainingTime > 0 || this.pigsOnMap > 0) {
                this.count++;
                if (this.count > 999) {
                    this.count = 999;
                }
                this.counterWindow.setText('Décompte : ' + this.count);
                this.sound.success.play();
            }
        }, this);
        cursors.down.onDown.add(function() {
            if (this.remainingTime > 0 || this.pigsOnMap > 0) {
                this.count--;
                if (this.count < 0) {
                    this.count = 0;
                }
                this.counterWindow.setText('Décompte : ' + this.count);
                this.sound.success.play();
            }
        }, this);
    },

    update : function() {
        game.physics.arcade.overlap(this.pigGroup, this.pigKillers, function(pig) {
            this.pigLineFree[pig.line] = true;
            pig.kill();
            this.pigsOnMap--;
            this.popNewPigs();
        }, null, this);
        if (this.remainingTime == 0 && this.pigsOnMap == 0) {
            if (this.count == this.totalPigs) {
                this.sound.groink.play();
                messageBubble(game.add.graphics(0, 0), 320, 480, 'Bravo, bien compté !', 'center');
            } else {
                this.sound.failure.play();
                messageBubble(game.add.graphics(0, 0), 320, 480, "T'en as compté " + this.count + " ?\nAh... ben c'est pas bon,\nil y en a " + this.totalPigs + " en fait !", "center");
            }
            game.time.events.add(Phaser.Timer.SECOND * 2, function() {
                nextState('photobomb', 'c01_transition');
            }, this);
            this.remainingTime = -1;
        }
    }

};
