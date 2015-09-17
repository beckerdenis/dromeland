game.state.add('load', loadState);
game.state.add('train', trainState);
//game.state.add('bonusCar', bonusCarState);
game.state.add('larzac', larzacState);
game.state.add('pigs', pigsState);
game.state.add('music', musicState);
game.state.add('bike', bikeState);
game.state.add('pirate', pirateState);
game.state.add('photobomb', photobombState);
game.state.add('pandemie', pandemieState);
//game.state.add('lake', lakeState);
game.state.add('terminator', terminatorState);
//game.state.add('credits', creditsState);

// transition between states
game.state.add('transition', transitionState);

game.state.start('load');
