var terminatorState = {

    // scenario

    whouaouing : 0,

    castlePoints : 0,

    destroyPoints : 0,

    stress : 0,
    
    stateId : 0,

    pause : false,

    availableCastles : [1],

    castlePointRatio : [1, 2, 4, 10],

    childXvelocity : 50,

    childYvelocity : 40,

    maxWhouaouing : 1000,

    // utilities

    loadChildAngrySprite : function(stage) {
        var newchild = game.add.sprite(this.child.x, this.child.y, 'c11_stage' + stage);
        newchild.anchor = this.child.anchor;
        newchild.animations.add('stand', [0, 1], 4, true);
        newchild.animations.add('move', [2, 3], 4, true);
        newchild.animations.play('move');
        this.child.kill();
        this.child = newchild;
        this.child.sendToBack();
        this.child.destroyingPulse = 0;
        this.child.destroyingThreshold = 40 - stage * 10;
        this.background.sendToBack();
        game.physics.arcade.enable(this.child);
        this.child.body.velocity.x = this.childXvelocity * (2 * random(0, 1) - 1);
        this.child.body.setSize(94, 84);
    },

    updateCursorCastle : function(index) {
        var x = -200;
        var y = 0;
        if (this.cursor != null) {
            x = this.cursor.x;
            y = this.cursor.y;
            this.cursor.kill();
        }
        this.cursor = game.add.sprite(-200, 0, 'c11_castle' + this.availableCastles[index]);
        this.cursor.frame = 3;
        this.cursor.canBuild = false;
        this.cursor.indexType = index;
        this.cursor.anchor = { x : 0.5, y : 0.9 };
        this.cursor.setBuildEnabled = function(value) {
            this.canBuild = value;
            this.tint = value ? 0x88ff88 : 0xff0000;
        };
        game.physics.arcade.enable(this.cursor);
        this.cursor.body.setSize(4 * this.cursor.width / 5, 3 * this.cursor.height / 10);
        this.move(null, x, y);
    },

    rightClick : function(pointer) {
        if (!this.pause && this.availableCastles.length > 1) {
            this.updateCursorCastle((this.cursor.indexType + 1) % this.availableCastles.length);
        }
    },
    
    move : function(pointer, x, y) {
        if (!this.pause) {
            this.cursor.x = x;
            this.cursor.y = y;
            this.cursor.setBuildEnabled(y >= 412 && !game.physics.arcade.overlap(this.cursor, this.castles));
        }
    },
    
    destroyCastle : function(child, castle) {
        this.destroyPoints += this.castlePointRatio[castle.indexType];
        this.castlePoints -= this.castlePointRatio[castle.indexType];
        if (this.castlePoints < 0) {
            this.castlePoints = 0;
        }
        castle.animations.play('destroy');
        castle.body.setSize(0, 0);
        this.child.body.velocity.y = -this.childYvelocity;
    },

    click : function(pointer) {
        this.missionWindow.hide();
        clearMessageBubble(this.bubbleGraphics);
        if (this.stateId < 0) {
            this.stateId = -this.stateId;
            this.stateCallback.call(this);
        } else if (!this.pause) {
            if (this.cursor.canBuild) {
                this.castlePoints += this.castlePointRatio[this.cursor.indexType];
                this.destroyPoints -= this.castlePointRatio[this.cursor.indexType];
                if (this.destroyPoints < 0) {
                    this.destroyPoints = 0;
                }
                var newone = this.castles.create(this.cursor.x, this.cursor.y, 'c11_castle' + this.availableCastles[this.cursor.indexType]);
                newone.indexType = this.cursor.indexType;
                newone.anchor = { x : 0.5, y : 0.9 };
                game.physics.arcade.enable(newone);
                newone.body.setSize(4 * newone.width / 5, 3 * newone.height / 10);
                newone.animations.add('build', [0, 1, 2, 3], 2, false);
                var anim = newone.animations.add('destroy', [3, 2, 1, 0], 10, false);
                anim.killOnComplete = true;
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

    updateWhouaou : function() {
        if (!this.pause) {
            var nextVal = this.whouaouing + (this.castlePoints - this.destroyPoints - this.stress) / 2;
            if (nextVal < 0) {
                nextVal = 0;
            } else if (nextVal > this.maxWhouaouing) {
                nextVal = this.maxWhouaouing;
            }
            this.whouaouingJauge.setFill(nextVal);
            this.whouaouing = nextVal;
        }
        game.time.events.add(Phaser.Timer.QUARTER, this.updateWhouaou, this);
    },

    // IA of the child, called every 0.5 s

    childDecision : function() {
        if (this.pause) {
            return;
        }
        if (this.child.body.velocity.y == 0) {
            if (random(this.child.destroyingPulse, this.child.destroyingThreshold) == this.child.destroyingThreshold) {
                this.child.animations.play('stand');
                this.child.destroyingPulse = 0;
                this.child.body.velocity.x = 0;
                this.child.body.velocity.y = this.childYvelocity;
            } else {
                this.child.destroyingPulse++;
                if (random(0, 5) == 0) {
                    this.child.body.velocity.x *= -1;
                }
                game.time.events.add(Phaser.Timer.HALF, this.childDecision, this);
            }
        }
    },

    // phaser API implementation

    create : function() {
        this.background = game.add.image(0, 0, 'c11_background2');

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.child = game.add.sprite(0, 368, 'c11_walking');
        this.child.anchor = { x : 0.5, y : 1 };
        this.child.x -= this.child.width / 2;
        this.child.animations.add('move', [0, 1], 5, true);
        game.physics.arcade.enable(this.child);

        this.bounds = game.add.group();
        var left = this.bounds.create(-4, 0, null);
        game.physics.arcade.enable(left);
        left.body.immovable = true;
        left.body.setSize(4, GAME_HEIGHT);
        var right = this.bounds.create(GAME_WIDTH, 0, null);
        game.physics.arcade.enable(right);
        right.body.immovable = true;
        right.body.setSize(4, GAME_HEIGHT);

        this.castles = game.add.group();

        this.updateCursorCastle(0);

        this.missionWindow = createWindow(game.add.graphics(0, 0), 0, 32, GAME_WIDTH, 64);
        this.missionWindow.setText("Construisez un château de sable !\n(clic gauche pour construire)");

        this.bubbleGraphics = game.add.graphics(0, 0);

        game.input.mouse.capture = true;
        game.input.activePointer.leftButton.onUp.add(this.click, this);
        game.input.activePointer.rightButton.onUp.add(this.rightClick, this);
        game.input.addMoveCallback(this.move, this);
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        this.sound.ding = game.add.audio('c11_ding');
        this.sound.alarm = game.add.audio('c11_alarm');
        this.sound.bug = game.add.audio('c11_bug');
        this.sound.robot = game.add.audio('c11_robot');
        this.sound.music1 = game.add.audio('c11_music1');
        game.sound.setDecodedCallback(this.sound.music1, function() {
            this.sound.music1.loopFull();
        }, this);
        this.sound.music2 = game.add.audio('c11_music2');
        this.sound.music3 = game.add.audio('c11_music3');
        this.sound.music4 = game.add.audio('c11_music4');

        this.cursors = game.input.keyboard.createCursorKeys();
    },

    update : function() {
        var S_INTRO =           0;
        var S_INTRO_CHILD =     1;
        var S_CHILD_TALKING =   2;
        var S_GAME_1 =          3;
        var S_CHILD_ANGRY_1 =   4;
        var S_CHILD_ANGRY_2 =   6;
        var S_CHILD_ANGRY_3 =   8;
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
                        this.whouaouingJauge = createJauge(game.add.graphics(0, 0), (GAME_WIDTH - 600) / 2, 4, 600, 32, this.maxWhouaouing, "Jauge de \"whouaou\"");
                        this.sound.play('c11_ding');
                        this.stateId = this.waitClick(S_DIALOG, function() {

                            this.missionWindow.setText("Chaque château construit va émerveiller les enfants\nalentours et vous apportera des points de \"whouaou\"");
                            this.stateId = this.waitClick(S_DIALOG, function() {

                                this.missionWindow.setText("Vous pouvez construire des châteaux plus grands !\nUtilisez le clic droit pour changer de type de château.");
                                this.availableCastles.push(2);
                                this.stateId = this.waitClick(S_DIALOG, function() {

                                    this.missionWindow.setText("Et vous ne pouvez construire qu'un seul château à la fois.\nDonc attention. Voilà.");
                                    this.stateId = this.waitClick(S_DIALOG, function() {

                                        this.child.animations.stop();
                                        this.sound.music1.stop();
                                        messageBubble(this.bubbleGraphics, this.child.x, this.child.y - this.child.height, "Pourquoi les enfants\nils sont contents ?", "left");
                                        this.stateId = this.waitClick(S_CHILD_ANGRY_1, function() {

                                            this.sound.music2.loopFull();
                                            this.loadChildAngrySprite(1);
                                            this.cursor.visible = true;
                                            this.pause = false;
                                            this.stress = 3;
                                            game.time.events.add(Phaser.Timer.SECOND, this.updateWhouaou, this);
                                            game.time.events.add(Phaser.Timer.HALF, this.childDecision, this);
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
                break;
            case S_CHILD_ANGRY_1:
                game.physics.arcade.collide(this.child, this.bounds, function() {
                    this.child.body.velocity.x *= -1;
                }, null, this);
                game.physics.arcade.overlap(this.child, this.castles, this.destroyCastle, null, this);
                if (this.child.y > 460) {
                    this.child.body.velocity.y = -this.childYvelocity;
                }
                if (this.child.y < 368) {
                    this.child.y = 368;
                    this.child.body.velocity.y = 0;
                    this.child.body.velocity.x = this.childXvelocity * (2 * random(0, 1) - 1);
                    game.time.events.add(Phaser.Timer.HALF, this.childDecision, this);
                }
                if (this.whouaouing > this.maxWhouaouing / 3) {
                    this.cursor.visible = false;
                    this.pause = true;
                    this.child.body.velocity.y = 0;
                    this.child.body.velocity.x = 0;
                    this.missionWindow.setText("Un nouveau type de château a été débolqué !");
                    this.stateId = this.waitClick(S_DIALOG, function() {
                        this.availableCastles.push(3);
                        this.sound.music2.stop();
                        messageBubble(this.bubbleGraphics, this.child.x, this.child.y - this.child.height / 2, "Je suis un enfant, tu ne\npeux rien contre moi !", 'right');
                        this.stateId = this.waitClick(S_CHILD_ANGRY_2, function() {
                            this.loadChildAngrySprite(2);
                            this.sound.music3.loopFull();
                            this.cursor.visible = true;
                            this.pause = false;
                            this.stress = 7;
                            this.child.animations.play('move');
                            this.child.y = 368;
                            this.childXvelocity += this.childXvelocity / 2;
                            this.childYvelocity += this.childYvelocity / 2;
                            this.child.body.velocity.x = this.childXvelocity * (2 * random(0, 1) - 1);
                            game.time.events.add(Phaser.Timer.HALF, this.childDecision, this);
                        });
                    });
                }
                break;
            case S_CHILD_ANGRY_2:
                game.physics.arcade.collide(this.child, this.bounds, function() {
                    this.child.body.velocity.x *= -1;
                }, null, this);
                game.physics.arcade.overlap(this.child, this.castles, this.destroyCastle, null, this);
                if (this.child.y > 460) {
                    this.child.body.velocity.y = -this.childYvelocity;
                }
                if (this.child.y < 368) {
                    this.child.y = 368;
                    this.child.body.velocity.y = 0;
                    this.child.body.velocity.x = this.childXvelocity * (2 * random(0, 1) - 1);
                    game.time.events.add(Phaser.Timer.HALF, this.childDecision, this);
                }
                if (this.whouaouing > 2 * this.maxWhouaouing / 3) {
                    this.cursor.visible = false;
                    this.pause = true;
                    this.child.body.velocity.x = 0;
                    this.child.body.velocity.y = 0;
                    this.missionWindow.setText("Un nouveau type de château a été débloqué !");
                    this.stateId = this.waitClick(S_DIALOG, function() {
                        this.availableCastles.push(4);
                        this.sound.music3.stop();
                        messageBubble(this.bubbleGraphics, this.child.x, this.child.y - this.child.height / 2, "Il est fini le château ?", 'left');
                        this.stateId = this.waitClick(S_CHILD_ANGRY_3, function() {
                            this.sound.bug.play();
                            this.background.kill();
                            this.background = game.add.image(0, 0, 'c11_background');
                            this.loadChildAngrySprite(3);
                            this.cursor.visible = true;
                            this.pause = false;
                            this.stress = 15;
                            this.child.animations.play('move');
                            this.child.y = 368;
                            this.childXvelocity *= 2;
                            this.childYvelocity *= 2;
                            this.child.body.velocity.x = this.childXvelocity * (2 * random(0, 1) - 1);
                            game.time.events.add(Phaser.Timer.HALF, this.childDecision, this);
                            this.sound.robot.play();
                            this.sound.music4.loopFull();
                        });
                    });
                }
                break;
            case S_CHILD_ANGRY_3:
                game.physics.arcade.collide(this.child, this.bounds, function() {
                    this.child.body.velocity.x *= -1;
                }, null, this);
                game.physics.arcade.overlap(this.child, this.castles, this.destroyCastle, null, this);
                if (this.child.y > 460) {
                    this.child.body.velocity.y = -this.childYvelocity;
                }
                if (this.child.y < 368) {
                    this.child.y = 368;
                    this.child.body.velocity.y = 0;
                    this.child.body.velocity.x = this.childXvelocity * (2 * random(0, 1) - 1);
                    game.time.events.add(Phaser.Timer.HALF, this.childDecision, this);
                }
                if (random(0, 200) == 0) {
                    this.sound.alarm.play();
                }
                break;
        }
    }

};
