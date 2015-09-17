var musicState = {

    // constants
    
    VOICE_DISTANCE_PX : 180,
    
    VOICE_HEIGHT_PX : 120,
    
    VOICE_INIT_Y : 140,
    
    KEYS : [
        [Phaser.Keyboard.I, Phaser.Keyboard.O, Phaser.Keyboard.P, Phaser.Keyboard.K, Phaser.Keyboard.L, Phaser.Keyboard.M],
        [Phaser.Keyboard.G, Phaser.Keyboard.B, Phaser.Keyboard.D, Phaser.Keyboard.B]
    ],
    
    // scenario
    
    timeCount : 0,
    
    voice : [],
    
    voiceNotes : [],
    
    noteOkZone : [],
    
    noteKillZone : [],
    
    notes : [],
    
    leftHandCount : 0,
    
    noteCount : 0,

    // utilities
    
    createPortees : function(nb) {
        for (var i = 0; i < nb; i++) {
            gfx = game.add.graphics(0, this.VOICE_INIT_Y + i * this.VOICE_DISTANCE_PX);
            gfx.beginFill(0xffffff, 0.8);
            gfx.drawRect(0, 0, GAME_WIDTH, this.VOICE_HEIGHT_PX)
            gfx.endFill();
            this.notes[i] = game.add.group();
            this.noteKillZone[i] = game.add.sprite(20, this.VOICE_INIT_Y + 1 + i * this.VOICE_DISTANCE_PX, 'c05_gkey');
            this.noteOkZone[i] = game.add.sprite(160, this.VOICE_INIT_Y + this.VOICE_HEIGHT_PX / 2 + i * this.VOICE_DISTANCE_PX, 'c05_ok');
            this.noteOkZone[i].anchor = { x : 0.5, y : 0.5 };
            game.physics.arcade.enable(this.noteKillZone[i]);
            game.physics.arcade.enable(this.noteOkZone[i]);
            this.noteKillZone[i].body.immovable = true;
            this.noteOkZone[i].body.immovable = true;
        }
    },
    
    popNote : function(voiceIndex, note) {
        var x = GAME_WIDTH;
        var y = this.VOICE_INIT_Y + this.VOICE_HEIGHT_PX / 2 + voiceIndex * this.VOICE_DISTANCE_PX;
        
        this.noteCount++;
        if (voiceIndex == 1) {
            var keyCode = this.KEYS[1][this.leftHandCount];
            this.leftHandCount = (this.leftHandCount + 1) % this.KEYS[1].length;
        } else {
            var keyCode = this.KEYS[0][note.note % this.KEYS[0].length];
        }
        var key = game.add.text(x, y + 4, String.fromCharCode(keyCode).toUpperCase(), { font : "24px Arial", fill : "black", align : "center" }, this.notes[voiceIndex]);
        key.anchor = { x : 0.5, y : 0.5 };
        game.physics.arcade.enable(key);
        key.body.velocity.x = -80;
        
        key.noteValue = note.high * 12 + note.note;
        key.phaserKey = keyCode;
    },
    
    // phaser API implementation

    create : function() {
        var music = game.cache.getJSON('tetris');
        for (var i = 0; i < music.voices.length; i++) {
            this.voice[i] = {
                index : 0,
                nextTimeTrigger : 0,
                over : false
            };
        }
        
        game.add.image(0, 0, 'c05_background');
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.createPortees(2);
        
        this.missionWindow = createWindow(game.add.graphics(0, 0), 0, 0, GAME_WIDTH, 64);
        this.missionWindow.setText("Appuyez sur les bonnes touches quand elles sont\ndans le rectangle !");
        
        var starRank = music.voices[0].length + music.voices[1].length;
        this.star = createJauge(game.add.graphics(0, 0), (GAME_WIDTH - 600) / 2, 72, 600, 32, starRank, "Jauge de Star", 0xdddd00);
        
        var musicTick = function() {
            var allOver = true;
            for (var i = 0; i < music.voices.length; i++) {
                if (this.timeCount == this.voice[i].nextTimeTrigger && !this.voice[i].over) {
                    var note = music.voices[i][this.voice[i].index];
                    if (note == undefined) {
                        this.voice[i].over = true;
                        continue;
                    }
                    if (note.note != -1) {
                        this.popNote(i, note);
                    }
                    this.voice[i].nextTimeTrigger += note.duration;
                    this.voice[i].index++;
                }
                allOver = allOver && this.voice[i].over;
            }
            this.timeCount++;
            if (!allOver) {
                game.time.events.add(Phaser.Timer.QUARTER, musicTick, this);
            }
        };
        game.time.events.add(Phaser.Timer.QUARTER, musicTick, this);
    },

    update : function() {
        for (var i = 0; i < this.notes.length; i++) {
            game.physics.arcade.collide(this.noteKillZone[i], this.notes[i], function(kz, note) {
                note.kill();
                this.noteCount--;
                if (this.noteCount == 0) {
                    nextState('bike', [], { img : '05t1', text : '~ Chapitre 5 ~\n      A bicyclette' });
                }
            }, null, this);
            this.noteOkZone[i].scale.setTo(1);
            game.physics.arcade.overlap(this.noteOkZone[i], this.notes[i], function(oz, note) {
                oz.scale.setTo(1.2);
                if (game.input.keyboard.upDuration(note.phaserKey)) {
                    T.soundfont.play(note.noteValue);
                    this.star.setFill(this.star.fill + 1);
                    note.kill();
                    this.noteCount--;
                    if (this.noteCount == 0) {
                        nextState('bike', [], { img : '05t1', text : '~ Chapitre 5 ~\n      A bicyclette' });
                    }
                }
            }, null, this);
        }
    }

};
