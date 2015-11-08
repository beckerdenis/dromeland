var lakeState = {

    // constants

    playerSpeed : 140,

    // scenario

    childrenSaved : 0,

    firstSink : false,

    freeze : false,

    // utilities

    popKid : function(index, group) {
        var x = index % 4;
        var y = index / 4 >> 0;
        var c = (random(0, 1) == 0) ? 'a' : 'b';
        var kid = group.create(x * 160 + 80, y * 120 + 60, 'c10_' + c);
        kid.anchor = { x : 0.5, y : 0.5 };
        kid.animations.add('down', [0, 1, 2, 3], 4, true);
        kid.animations.add('left', [4, 5, 6, 7], 4, true);
        kid.animations.add('right', [8, 9, 10, 11], 4, true);
        kid.animations.add('up', [12, 13, 14, 15], 4, true);
        kid.animations.add('alert', [16, 17], 4, true);
        var danim = kid.animations.add('drowning', [18, 19], 4, false);
        danim.onComplete.add(function() {
            if (!this.firstSink) {
                this.freeze = true;
                this.alibiImage = game.add.image(0, 0, 'c10_alibi');
                this.messageWindow = createWindow(game.add.graphics(0, 0), 4, 4, GAME_WIDTH - 8, 128);
                this.messageWindow.setText("Oh non, un enfant s'est noyé ! Mais ne vous inquiétez pas, il est redirigé\nvers une salle secrète sous le lac qui donne sur un ascenseur lui\npermettant de remonter à la surface en toute sécurité ! (ouf...)");
                this.firstSink = true;
            }
        }, this);
        game.physics.arcade.enable(kid);
        kid.body.collideWorldBounds = true;
        kid.body.setSize(40, 32);
        kid.lastAnim = 0;
        kid.maxAnimTime = 100;
        kid.drowning = 0;
    },

    randomDrowning : function(item) {
        if (item.drowning == 0) {
            if (random(0, 1000) == 0) {
                item.drowning = 1;
                item.body.velocity.x = 0;
                item.body.velocity.y = 0;
                item.animations.play('alert');
            }
        } else if (item.drowning > 0) {
            item.drowning++;
            if (item.drowning > 400) {
                item.animations.play('drowning', null, false, true);
            }
        }
        return item.drowning > 0;
    },

    save : function(kid) {
        kid.drowning = 0;
        kid.animations.stop();
        kid.frame = 0;
        kid.lastAnim = 0;
    },

    randomMove : function(item) {
        if (this.randomDrowning(item)) {
            return;
        }

        item.body.velocity.x += 10 - random(0, 20);
        item.body.velocity.y += 10 - random(0, 20);
        var absX = Math.abs(item.body.velocity.x);
        var absY = Math.abs(item.body.velocity.y);
        if (item.body.velocity.x > 0 && item.body.velocity.x > absY) {
            if (item.lastAnim == 0 || (item.lastAnim != 1 && item.lastAnimTime == 0)) {
                item.animations.play('right');
                item.lastAnim = 1;
                item.lastAnimTime = item.maxAnimTime;
            }
        } else if (item.body.velocity.x < 0 && item.body.velocity.x < -absY) {
            if (item.lastAnim == 0 || (item.lastAnim != 2 && item.lastAnimTime == 0)) {
                item.animations.play('left');
                item.lastAnim = 2;
                item.lastAnimTime = item.maxAnimTime;
            }
        } else if (item.body.velocity.y > 0 && item.body.velocity.y > absX) {
            if (item.lastAnim == 0 || (item.lastAnim != 3 && item.lastAnimTime == 0)) {
                item.animations.play('down');
                item.lastAnim = 3;
                item.lastAnimTime = item.maxAnimTime;
            }
        } else if (item.body.velocity.y < 0 && item.body.velocity.y < -absX) {
            if (item.lastAnim == 0 || (item.lastAnim != 4 && item.lastAnimTime == 0)) {
                item.animations.play('up');
                item.lastAnim = 4;
                item.lastAnimTime = item.maxAnimTime;
            }
        } else {
            item.animations.stop();
            item.lastAnim = 0;
        }
        item.lastAnimTime = Math.max(0, item.lastAnimTime - 1);
    },

    // phaser API implementation

    create : function() {
        game.stage.backgroundColor = '#70876c';
        var scum = [
            game.add.sprite(0, 0, 'c10_animated_water'),
            game.add.sprite(0, 512, 'c10_animated_water'),
            game.add.sprite(256, 0, 'c10_animated_water'),
            game.add.sprite(256, 512, 'c10_animated_water'),
            game.add.sprite(512, 0, 'c10_animated_water'),
            game.add.sprite(512, 512, 'c10_animated_water')
        ];
        for (var i = 0; i < scum.length; i++) {
            scum[i].animations.add('anim', [3, 1, 2, 0], 2, true);
            scum[i].animations.play('anim');
        }

        game.physics.startSystem(Phaser.Physics.ARCADE);

        // main group (contains all objects that are 'z'-ordered)
        this.mainGroup = game.add.group();

        // player physics & sprite
        this.player = this.mainGroup.create(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'c10_player');
        this.player.animations.add('down', [0, 1, 2, 3], 4, true);
        this.player.animations.add('left', [4, 5, 6, 7], 4, true);
        this.player.animations.add('right', [8, 9, 10, 11], 4, true);
        this.player.animations.add('up', [12, 13, 14, 15], 4, true);
        this.player.anchor = { x : 0.5, y : 0.5 };
        game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(40, 32);

        for (var i = 0; i < 16; i++) {
            this.popKid(i, this.mainGroup);
        }

        this.missionWindow = createWindow(game.add.graphics(0, 0), 4, 4, GAME_WIDTH - 8, 64);
        this.missionWindow.setText("Sauvez les enfants quand ils se noient.\nUtilisez les flèches pour vous déplacer.");

        this.cursors = game.input.keyboard.createCursorKeys();
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    update : function() {
        if (this.freeze) {
            if (this.spaceKey.isDown) {
                this.alibiImage.kill();
                this.freeze = false;
                this.messageWindow.hide();
            }
            return;
        }

        // make sure the objects are sorted by their 'y' position (for beautiful display)
        this.mainGroup.sort('y', Phaser.Group.SORT_ASCENDING);

        game.physics.arcade.collide(this.mainGroup, this.mainGroup, function(k1, k2) {
            var other = null;
            if (k1 == this.player) {
                other = k2;
            } else if (k2 == this.player) {
                other = k1;
            }
            if (other != null && other.drowning > 0) {
                this.save(other);
            }
        }, null, this);

        this.mainGroup.forEach(function(item) {
            if (item != this.player) {
                this.randomMove(item);
            }
        }, this);

        // player movement
        var moving = false;
        this.player.body.velocity = { x : 0, y : 0 };

        if (this.cursors.down.isDown) {
            this.missionWindow.hide();
            this.player.body.velocity.y = this.playerSpeed;
            this.player.animations.play('down');
            this.player.lastDir = 0;
            moving = true;
        } else if (this.cursors.up.isDown) {
            this.missionWindow.hide();
            this.player.body.velocity.y = -this.playerSpeed;
            this.player.animations.play('up');
            this.player.lastDir = 12;
            moving = true;
        }

        if (this.cursors.left.isDown) {
            this.missionWindow.hide();
            this.player.body.velocity.x = -this.playerSpeed;
            if (this.player.body.velocity.y == 0) {
                this.player.animations.play('left');
                this.player.lastDir = 4;
            }
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.missionWindow.hide();
            this.player.body.velocity.x = this.playerSpeed;
            if (this.player.body.velocity.y == 0) {
                this.player.animations.play('right');
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
