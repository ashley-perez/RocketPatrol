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

        // initialize score
        this.p1Score = 0;

        // display score 
        // the config of how we want the score to look like
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        // actually adds the score and makes it visible
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false; // binding the game over property to the scene and setting it to false

        // adding the 60 second play clock 
        // delayedCall has 4 parameters passed to it here: time (milliseconds), callback function (here it is an => function / anonymous)
        //                                                 arguments we might want to pass to the callback function which is null in this case,
        //                                                 callback context which is this (the current Play scene)
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);

            this.gameOver = true; // timer runs out so set the game over status to true
        }, null, this);

    }

    update() {

        // check key input for restart 
        // makeing sure the game is over and checking if R has been pressed
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // texture of our tile sprite will move 4 horizontal pixels left every frame
        this.starfield.tilePositionX -= 4;

        this.p1Rocket.update(); // tells Phaser to also update our rocket object when it does its update stuff

        // update the spaceships to actually move
        if(!this.gameOver) {
            this.p1Rocket.update(); // update the rocket sprite
            this.ship01.update();   // update the spaceships
            this.ship02.update();
            this.ship03.update();
        }

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
        // adding the score and repaint
        this.p1Score += ship.points;        // updates the player score
        this.scoreLeft.text = this.p1Score; // actually updates the score's text box with the new score value
    
        this.sound.play('sfx_explosion'); // to play a quick one off sound
    }

}

