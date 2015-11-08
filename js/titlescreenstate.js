var titleScreenState = {

    level : 1,

    currentOption : 0,

    // phaser API implementation
    
    ct : function(text, color) {
        text.addColor(color, 0);
    },

    move : function(pointer, x, y) {
        this.currentOption = 0;
        if (this.start.input.pointerOver()) {
            this.currentOption = 1;
            this.ct(this.start, 'yellow');
        } else {
            this.ct(this.start, 'white');
        }
        if (this.leftTab.input.pointerOver() && this.level > 1) {
            this.currentOption = 2;
            this.ct(this.leftTab, 'yellow');
        } else {
            this.ct(this.leftTab, 'white');
        }
        if (this.rightTab.input.pointerOver() && this.level < 10) {
            this.currentOption = 3;
            this.ct(this.rightTab, 'yellow');
        } else {
            this.ct(this.rightTab, 'white');
        }
    },

    click : function() {
        switch (this.currentOption) {
            case 1:
                // start level
                break;
            case 2:
                this.level--;
                if (this.level == 1) {
                    this.leftTab.alpha = 0;
                }
                this.rightTab.alpha = 1;
                break;
            case 3:
                this.level++;
                if (this.level == 10) {
                    this.rightTab.alpha = 0;
                }
                this.leftTab.alpha = 1;
                break;
        }
        if (this.currentOption > 1) {
            this.tableau.setText('Tableau n°' + this.level);
        }
    },

    create : function() {
        game.add.text(140, 40, 'Dromeland', { font : '60px Arial', fill : 'white', boundsAlignH : 'center' });
        
        this.start = game.add.text(180, 200, 'Commencer', { font : '40px Arial', fill : 'white', boundsAlignH : 'center' });
        this.start.inputEnabled = true;
        
        this.tableau = game.add.text(180, 300, 'Tableau n°1', { font : '40px Arial', fill : 'white', boundsAlignH : 'center' });
        this.leftTab = game.add.text(120, 300, '<', { font : '40px Arial', fill : 'white', boundsAlignH : 'center' });
        this.leftTab.inputEnabled = true;
        this.leftTab.alpha = 0;
        this.rightTab = game.add.text(430, 300, '>', { font : '40px Arial', fill : 'white', boundsAlignH : 'center' });
        this.rightTab.inputEnabled = true;

        game.input.mouse.capture = true;
        game.input.activePointer.leftButton.onUp.add(this.click, this);
        game.input.addMoveCallback(this.move, this);
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
    }

};
