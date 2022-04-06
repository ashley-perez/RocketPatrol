class Play extends Phaser.Scene {

    constructor() {
        super("playScene");
    }

    preload() {

        // loads images/tiles sprites
        // load.image() has 2 parameters: string that will be used to reference this image
        //                                URL for where the image is located
        // used Nathan Altice's previously made assets, thanks Nathan :)
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');

        // load spritesheet
        // 3 parameters for spritesheet: key string to identify the asset, URL of its location, frame configuration
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});

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

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add spaceships (three of them)
        // 6 parameters: current scene (this), x pos, y pos, key name of graphic, frame number, custom parameter (pointValue)
        // setOrigin makes sure that the origin of the spaceship sprites are on the upper left of the sprite so the screen wrapping works
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);


        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

    }

    update() {

        // texture of our tile sprite will move 4 horizontal pixels left every frame
        this.starfield.tilePositionX -= 4;

        this.p1Rocket.update(); // tells Phaser to also update our rocket object when it does its update stuff

        // update the spaceships to actually move
        this.ship01.update();
        this.ship02.update();
        this.ship03.update();

        // check for collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();         // reset the rocket upon collision
            this.shipExplode(this.ship03); // handles ship exploding animation and resetting the ship location
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02); 
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01); 
        }
    }

    checkCollision(rocket, ship) {
        // AAB (Axis-Aligned Bounding Boxes)
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
            return true;
        }
        else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
    
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');            // play exploding animation
        boom.on('animationcomplete', () => {   // callback after anim completes
            ship.reset();                      // reset ship position
            ship.alpha = 1;                    // make ship visible again
            boom.destroy();                    // remove explosion sprite
        });
    }

}

