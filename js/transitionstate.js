var transitionState = {
    
    next : null,
    
    scenario : null,
    
    count : 0,
    
    pause : false,
    
    end : false,
    
    music : null,
    
    image : null,
    
    create : function() {
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    
    update : function() {
        if (this.end) {
            return;
        }
        if (!this.pause) {
            if (this.count * 2 >= this.scenario.length) {
                this.music.loop = false;
                this.music.stop();
                this.end = true;
                game.state.start(this.next);
                return;
            }
            if (this.image != null) {
                this.image.kill();
            }
            this.image = game.add.image(0, 0, this.scenario[2 * this.count]);
            if (this.scenario[2 * this.count + 1] != '') {
                if (this.music != null) {
                    this.music.loop = false;
                    this.music.stop();
                }
                this.music = game.add.audio(this.scenario[2 * this.count + 1]);
                this.music.loop = true;
                game.sound.setDecodedCallback(this.music, function() {
                    this.music.play();
                }, this);
            }
            this.count++;
            this.pause = true;
            var evt = game.time.events.add(Phaser.Timer.SECOND * 3, function() {
                if (this.window != null) {
                    this.window.bringToTop();
                } else {
                    this.window = createWindow(game.add.graphics(0, 0), (640 - 260) / 2, (480 - 48) / 2, 260, 48);
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

function nextState(next, scenario) {
    transitionState.next = next;
    transitionState.scenario = scenario;
    transitionState.count = 0;
    transitionState.pause = false;
    transitionState.end = false;
    transitionState.music = null;
    transitionState.image = null;
    game.state.start('transition');
}
