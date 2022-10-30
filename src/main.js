let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, RocketPatrol, Pong]
}

//reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyUP, keyDOWN, keyY, keyN;

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;