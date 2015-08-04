var trainState = {

	create : function() {
		game.add.image(0, 0, '1-background');
		game.add.sprite(376, 536, '1-player');
	},

	update : function() {
		player.body.velocity.x = 0;
		if (cursors.up.isDown)
		{
			//  Move to the left
			player.body.velocity.x = -150;

			player.animations.play('left');
		}
		else if (cursors.down.isDown)
		{
			//  Move to the right
			player.body.velocity.x = 150;

			player.animations.play('right');
		}
		else
		{
			//  Stand still
			player.animations.stop();

			player.frame = 4;
		}
	}

};
