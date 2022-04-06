// this creates the canvas for the game (screen size)
let config = {
    type: Phaser.CANVAS, 
    width: 640,
    height: 480,
    scene: [Menu, Play] // the scenes that we will be using
}

let game = new Phaser.Game(config);

// setting the UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
