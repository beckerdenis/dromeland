var transitionState = {
    
    next : null,
    
    scenario : null,
    
    chapter : null,
    
    count : 0,
    
    pause : false,
    
    music : null,
    
    image : null,
    
    create : function() {
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    
    clearPrevious : function(killMusic) {
        if (this.music != null && killMusic) {
            this.music.loop = false;
            this.music.stop();
        }
        if (this.image != null) {
            this.image.kill();
        }
        if (this.text != null) {
            this.text.kill();
        }
    },
    
    update : function() {
        if (!this.pause) {
            if (this.count > this.scenario.length) {
                this.clearPrevious(true);
                game.state.start(this.next);
                return;
            } else if (this.count == this.scenario.length) {
                var scene = this.chapter;
                scene.music = 'transition';
                scene.musicLoop = false;
                scene.textStyle = { font: 'bold 60px PinyonScript', fill: 'black', stroke: 'white', strokeThickness: 16, align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle' };
            } else {
                var scene = this.scenario[this.count];
                scene.musicLoop = true;
                scene.textStyle = { font: 'bold 40px PinyonScript', fill: 'black', stroke: 'white', strokeThickness: 8, align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle' };
            }
            
            // music
            if (scene.music != undefined) {
                this.clearPrevious(true);
                this.music = game.add.audio(scene.music);
                this.music.loop = scene.musicLoop;
                game.sound.setDecodedCallback(this.music, function() {
                    this.music.play();
                }, this);
            } else {
                this.clearPrevious(false);
            }
            
            // background image
            this.image = game.add.image(0, 0, scene.img);
            
            // text
            if (scene.text != undefined) {
                var offsetX = 8;
                var offsetY = 8;
                this.text = game.add.text(offsetX, 64 + offsetY, scene.text, scene.textStyle);
                this.text.setTextBounds(offsetX, 64 + offsetY, GAME_WIDTH - 2 * offsetX, GAME_HEIGHT - 2 * offsetY - 64);
            }
            
            // triggers
            this.count++;
            this.pause = true;
            var evt = game.time.events.add(Phaser.Timer.SECOND * (scene.text != undefined ? 6 : 3), function() {
                if (this.window != null) {
                    this.window.bringToTop();
                } else {
                    this.window = createWindow(game.add.graphics(0, 0), (640 - 260) / 2, 8, 260, 48);
                    this.window.setText('*Espace* pour continuer');
                }
            }, this);
            this.spaceKey.onDown.addOnce(function() {
                this.pause = false;
                game.time.events.remove(evt);
            }, this);
        }
    }

};

function nextState(next, scenario, chapter) {
    transitionState.next = next;
    transitionState.scenario = scenario;
    transitionState.chapter = chapter;
    transitionState.count = 0;
    transitionState.pause = false;
    transitionState.music = null;
    transitionState.image = null;
    game.state.start('transition');
}
