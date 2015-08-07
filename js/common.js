// common utilities (= globals) for all scripts & levels

var GAME_WIDTH = 640;
var GAME_HEIGHT = 480;
var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, 'game', Phaser.AUTO);

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createWindow(g, x, y, w, h, backgroundColor /* optional */) {
    // g = graphics object
    g.fixedToCamera = true;
    g.lineStyle(4, 0x000000, 0.9);
    if (backgroundColor != null) {
        g.beginFill(backgroundColor, 0.9);
    } else {
        g.beginFill(0xddddff, 0.9);
    }
    g.drawRoundedRect(x, y, w, h, 4);
    g.endFill();
    return {
        xCoord : x,
        yCoord : y,
        width : w,
        height : h,
        setText : function(text) {
            if (this.text != null) {
                this.text.kill();
            }
            this.text = game.add.text(this.xCoord, this.yCoord, text, { font: "18px Arial", fill: "black", align: "center", boundsAlignH: "center", boundsAlignV: "middle" });
            this.text.setTextBounds(this.xCoord, this.yCoord, this.width, this.height);
        }
    };
}

function createJauge(g, x, y, w, h, maxFill) {
    var localWindow = createWindow(g, x, y, w, h, 0xffffff);
    var localGraphics = game.add.graphics(0, 0);
    localGraphics.fixedToCamera = true;
    return {
        graphics : localGraphics,
        xCoord : x + 4,
        yCoord : y + 4,
        width : w - 8,
        height : h - 8,
        max : maxFill,
        fill : 0,
        setFill : function(fill) {
            if (fill > this.max) {
                fill = this.max;
            }
            this.graphics.clear();
            this.graphics.lineStyle(null);
            this.graphics.beginFill(0xaa6611, 0.9);
            var bw = Math.round(fill * this.width / this.max);
            bw = (bw < 12 ? 12 : bw); // solve phaser bug
            this.graphics.drawRoundedRect(this.xCoord, this.yCoord, bw, this.height, 4);
            this.graphics.endFill();
            this.fill = fill;
        }
    };
}

function messageBubble(g, x, y, msg, position) {
    // g = graphics object
    // x, y = position of the bubble's arrow bottom point (= top of the speaking character)
    // position = 'right' (default), 'left' or 'center'
    position = position || 'right'; // position of the bubble relatively to arrow

    var text = new Phaser.Text(game, 0, 0, msg, { font: "18px Arial" }); // only to have text size
    var arrow = null;
    y -= 28; // bubble is above the speaker
    if (position == 'right') {
        arrow = [x + 16, y - 3, x + 8, y + 18, x + 32, y - 2];
        x += text.width / 4;
    } else if (position == 'left') {
        arrow = [x - 16, y - 3, x - 8, y + 18, x - 32, y - 2];
        x -= text.width / 4;
    } else { // center
        arrow = [x - 8, y - 2, x, y + 18, x + 8, y - 1];
    }
    var ellipseOriginY = y - text.height;
    g.clear();
    g.lineStyle(2, 0x000000);
    g.beginFill(0xffffff);
    g.drawEllipse(x, ellipseOriginY, 2 * text.width / 3, text.height);
    g.endFill();
    g.lineStyle(null);
    g.beginFill(0xffffff);
    g.drawPolygon(arrow);
    g.endFill();
    g.lineStyle(2, 0x000000);
    g.drawPolygon(arrow);
    if (g.text != null) {
        g.text.kill();
    }
    g.text = game.add.text(x - text.width / 2, ellipseOriginY + 2 - text.height / 2, msg, { font: "18px Arial", fill: "black", align: "center" });
}
