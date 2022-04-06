class Play extends Phaser.Scene {

    constructor() {
        super("playScene");
    }

    preload() {

        // loads images/tiles sprites
        // load.image() has 2 parameters: string that will be used to reference this image
        //                                URL for where the image is located
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');

    }
    
    // method
    create() {
        
        // place tile sprite (starfield background)
        // add.tileSprite() has 5 parameters: x pos, y pos, width, height, key string for which image to use
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        
        // greeen UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0);

        // white borders
        // add.rectangle() has 5 parameters: x coord, y coord, width, height and color (hex)
        // setOrigin() adjusts the rectangles origins according to the given coord
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF0).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

    }

    update() {

        // texture of our tile sprite will move 4 horizontal pixels left every frame
        this.starfield.tilePositionX -= 4;
    }

}

