// rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame) {

        super(scene, x, y, texture, frame);

        scene.add.existing(this); // add to existing, displayList, updateList
        this.isFiring = false;    // track rocket's firing status
        this.moveSpeed = 2;       // pixels per frame

    }

    update() {

        // left/right movement
        // check if the rocket is firing and if it is NOT  then...
        // the player is able to move left and right
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } 
            else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
        }

        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyF)) { // just down rather than isDown since the player will press the shoot button once and not hold it
            this.isFiring = true;
        }

        // if fired, move up
        // if player fired the rocket (by pressing F) then the rocket will move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }

        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.isFiring = false;
            this.y = game.config.height - borderUISize - borderPadding;
        }
    }

}