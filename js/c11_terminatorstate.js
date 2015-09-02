var terminatorState = {

    // scenario

    whouaouing : 0,
    
    stateId : 0,

    pause : false,

    // utilities
    
    move : function(pointer, x, y) {
        if (!this.pause) {
            this.cursor.x = x;
            this.cursor.y = y;
            this.cursor.setBuildEnabled(y >= 394 && !game.physics.arcade.overlap(this.cursor, this.castles));
        }
    },

    click : function(pointer) {
        this.missionWindow.hide();
        clearMessageBubble(this.bubbleGraphics);
        if (this.stateId < 0) {
            this.stateId = -this.stateId;
            this.stateCallback.call(this);
        } else if (!this.pause) {
            if (this.cursor.canBuild) {
                var newone = this.castles.create(this.cursor.x, this.cursor.y, 'c11_castle' + this.cursor.castleType);
                newone.anchor = { x : 0.5, y : 0.9 };
                game.physics.arcade.enable(newone);
                newone.body.setSize(9 * newone.width / 10, 2 * newone.height / 5);
                newone.animations.add('build', [0, 1, 2, 3], 4, false);
                newone.animations.play('build');
                this.castles.sort('y', Phaser.Group.SORT_ASCENDING);
                this.cursor.setBuildEnabled(false);
            }
        }
    },

    waitClick : function(stateAfterClick, callback) {
        this.stateCallback = callback;
        return -stateAfterClick;
    },

    // phaser API implementation

    create : function() {
        this.background = game.add.image(0, 0, 'c11_background2');

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.child = game.add.sprite(0, 378, 'c11_walking');
        this.child.anchor = { x : 0.5, y : 1 };
        this.child.x -= this.child.width / 2;
        this.child.animations.add('move', [0, 1], 5, true);
        game.physics.arcade.enable(this.child);

        this.castles = game.add.group();

        this.cursor = game.add.sprite(-200, 0, 'c11_castle1');
        this.cursor.frame = 3;
        this.cursor.canBuild = false;
        this.cursor.castleType = 1;
        this.cursor.anchor = { x : 0.5, y : 0.9 };
        this.cursor.setBuildEnabled = function(value) {
            this.canBuild = value;
            this.tint = value ? 0x88ff88 : 0xff0000;
        };
        game.physics.arcade.enable(this.cursor);
        this.cursor.body.setSize(9 * this.cursor.width / 10, 2 * this.cursor.height / 5);

        this.missionWindow = createWindow(game.add.graphics(0, 0), 0, 0, GAME_WIDTH, 64);
        this.missionWindow.setText("Construisez un château de sable !\n(clic gauche pour construire)");

        this.bubbleGraphics = game.add.graphics(0, 0);

        game.input.onUp.add(this.click, this);
        game.input.addMoveCallback(this.move, this);

        this.sound.ding = game.add.audio('c11_ding');

        this.cursors = game.input.keyboard.createCursorKeys();
    },

    update : function() {
        var S_INTRO =           0;
        var S_INTRO_CHILD =     1;
        var S_CHILD_TALKING =   2;
        var S_GAME_1 =          3;
        var S_CHILD_ANGRY_1 =   4;
        var S_GAME_2 =          5;
        var S_CHILD_ANGRY_2 =   6;
        var S_GAME_3 =          7;
        var S_CHILD_ANGRY_3 =   8;
        var S_GAME_4 =          9;
        var S_CONCLUSION =      10;
        var S_DIALOG =          11;

        switch (this.stateId) {
            case S_INTRO:
                if (this.castles.total > 0) {
                    this.pause = true;
                    this.cursor.visible = false;

                    this.stateId = S_INTRO_CHILD;
                }
                break;
            case S_INTRO_CHILD:
                if (this.child.x >= GAME_WIDTH / 2) {
                    var newchild = game.add.sprite(this.child.x, this.child.y, 'c11_sit_talking');
                    newchild.anchor = this.child.anchor;
                    newchild.animations.add('talk', [0, 1], 10, true);
                    newchild.animations.play('talk');
                    this.child.kill();
                    this.child = newchild;
                    this.child.sendToBack();
                    this.background.sendToBack();

                    this.stateId = S_CHILD_TALKING;
                } else if (this.child.body.velocity.x == 0) {
                    this.child.body.velocity.x = 80;
                    this.child.animations.play('move');
                }
                break;
            case S_CHILD_TALKING:
                messageBubble(this.bubbleGraphics, this.child.x, this.child.y - this.child.height, "Je peux jouer avec toi ?");
                this.missionWindow.setText("Clic gauche pour autoriser cet innocent\npetit chérubin à jouer avec vous.");
                this.stateId = this.waitClick(S_GAME_1, function() {
                    var newchild = game.add.sprite(this.child.x, this.child.y, 'c11_sit_playing');
                    newchild.anchor = this.child.anchor;
                    newchild.animations.add('play', [0, 1, 2, 1], 4, true);
                    newchild.animations.play('play');
                    this.child.kill();
                    this.child = newchild;
                    this.child.sendToBack();
                    this.background.sendToBack();
                    this.cursor.visible = true;
                    this.pause = false;
                });
                break;
            case S_GAME_1:
                if (this.castles.total > 2) {
                    this.pause = true;
                    this.cursor.visible = false;
                    this.missionWindow.setText("Euh... attendez une minute... c'est trop facile, il manque la jauge là !\n(clic gauche... comme d'hab)");
                    this.stateId = this.waitClick(S_DIALOG, function() {
                        this.missionWindow.setText("La voilà ! C'est ce petit chenapan qui l'avait !\nQu'il est mignon !");
                        messageBubble(this.bubbleGraphics, this.child.x, this.child.y - this.child.height, "Oups, hihi !", 'right');
                        this.whouaouingJauge = createJauge(game.add.graphics(0, 0), (GAME_WIDTH - 600) / 2, 72, 600, 32, 100, "Jauge de \"whouaou\"");
                        this.sound.play('c11_ding');
                        this.stateId = this.waitClick(S_DIALOG, function() {
                            this.missionWindow.setText("Chaque château construit va émerveiller les enfants\nalentours et vous apportera des points de \"whouaou\"");
                            this.stateId = this.waitClick(S_DIALOG, function() {
                                this.child.animations.stop();
                                this.whouaouingJauge.setY(8);
                                messageBubble(this.bubbleGraphics, this.child.x, this.child.y - this.child.height, "Pourquoi les enfants\nils sont contents ?", "left");
                                this.stateId = this.waitClick(S_CHILD_ANGRY_1, function() {});
                            });
                        });
                    });
                }
                break;
            case S_CHILD_ANGRY_1:
                alert('graou');
                break;
        }
    }

};
