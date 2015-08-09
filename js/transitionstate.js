var transitionState = {

    create : function() {
        game.add.image(0, 0, this.backgroundImage);
        var music = game.add.audio('transition');
        game.time.events.add(Phaser.Timer.SECOND * 5, function() {
            game.state.start(this.nextState);
        }, this);
        game.sound.setDecodedCallback(music, function() {
            music.play();
        }, this);
    }

};

function nextState(name, image) {
    transitionState.backgroundImage = image;
    transitionState.nextState = name;
    game.state.start('transition');
}
