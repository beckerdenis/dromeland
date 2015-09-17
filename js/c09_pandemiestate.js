var pandemieState = {

    // "scenario"

    step : 0,

    // phaser API implementation

    create : function() {
        game.add.image(0, 0, 'c09_background');
        this.blink = game.add.sprite(373, 331, 'c09_blink_card');
        this.blink.animations.add('blink', [0, 1], 2, true);
        this.blink.animations.play('blink');
        this.blink.inputEnabled = true;
        this.blink.events.onInputDown.add(function() {
            if (this.step == 0) {
                this.takenCard = game.add.image(320, 120, 'c09_city_card');
                this.takenCard.anchor = { x : 0.5, y : 0 };
                this.step = 1;
                this.blink.inputEnabled = false;
                this.blink.animations.stop();
                this.messageWindow.setText("Montréal, une bien belle ville. Cliquez pour continuer.");
            } else if (this.step == 2) {
                this.takenCard = game.add.image(320, 120, 'c09_pandemic_card');
                this.takenCard.anchor = { x : 0.5, y : 0 };
                this.step = 3;
                this.blink.inputEnabled = false;
                this.blink.animations.stop();
                this.messageWindow.setText("Oh non, c'est une épidémie, vous avez perdu !!!\nL'humanité a été détruite, et c'est de votre faute en plus !!!");
            }
        }, this);

        this.messageWindow = createWindow(game.add.graphics(0, 0), 4, 4, (GAME_WIDTH - 8), 64);
        this.messageWindow.setText("C'est à vous de jouer. Piochez une carte.");

        game.input.onDown.add(function() {
            if (this.step == 1) {
                this.takenCard.destroy();
                this.step = 2;
                this.blink.inputEnabled = true;
                this.blink.animations.play('blink');
                this.messageWindow.setText("Piochez une deuxième carte.");
            } else if (this.step == 3) {
                this.messageWindow.setText("Bon, ben y'a plus qu'a aller se coucher...");
                this.step = 4;
            } else if (this.step == 4) {
                nextState('lake', [
                    { img : '10t1', music : 'transition', text : "Fatigués par cette longue journée\n      Nos héros allèrent se coucher,\nSur le confort de leurs oreillers\n   Ils se consolaient d'avoir détruit l'humanité." },
                    { img : '10t2', text : "Une fois le soleil levé\n      Ils prirent leur petit-déjeuner\nEn sachant qu'ils repartiraient au lac\n   Où ils avaient une revanche à prendre, tac."},
                    { img : '10t3' }
                ], { img : '10t4', text : '~ Chapitre 9 ~\n     Sauvetage(s)' });
            }
        }, this);
    }

};
